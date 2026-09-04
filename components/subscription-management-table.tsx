"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  LoaderCircle,
  Pause,
  Play,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SubscriptionDto, SubscriptionPlan } from "@/lib/subscriptions";

const planFilters: Array<{ value: "all" | SubscriptionPlan; label: string }> = [
  { value: "all", label: "All plans" },
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise" },
];

const planBadge: Record<SubscriptionPlan, string> = {
  starter: "bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-gray-100",
  pro: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  enterprise: "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300",
};

const planLabel: Record<SubscriptionPlan, string> = {
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

const statusBadge: Record<SubscriptionDto["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  paused: "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300",
  canceled: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
};

function formatMrr(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SubscriptionManagementTable() {
  const [plan, setPlan] = useState<"all" | SubscriptionPlan>("all");
  const [rows, setRows] = useState<SubscriptionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canManage, setCanManage] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ plan });
      const response = await fetch(`/api/subscriptions?${params.toString()}`, {
        credentials: "include",
      });
      const data = (await response.json()) as {
        subscriptions?: SubscriptionDto[];
        canManage?: boolean;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || "Failed to load subscriptions");
      setRows(data.subscriptions ?? []);
      setCanManage(Boolean(data.canManage));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load subscriptions");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [plan]);

  useEffect(() => {
    void load();
  }, [load]);

  const totals = useMemo(() => {
    const active = rows.filter((row) => row.status === "active");
    return {
      count: rows.length,
      mrr: active.reduce((sum, row) => sum + row.mrr, 0),
      churnRisk: rows.filter((row) => row.churnRisk && row.status !== "canceled").length,
    };
  }, [rows]);

  async function runAction(id: string, action: "upgrade" | "pause" | "cancel" | "resume") {
    setBusyId(id);
    setActionError(null);
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await response.json()) as {
        subscription?: SubscriptionDto;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || `Failed to ${action}`);
      if (data.subscription) {
        setRows((current) =>
          current
            .map((row) => (row.id === id ? data.subscription! : row))
            .sort((a, b) => b.mrr - a.mrr || a.customerName.localeCompare(b.customerName)),
        );
      } else {
        await load();
      }
    } catch (runError) {
      setActionError(runError instanceof Error ? runError.message : `Failed to ${action}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section
      aria-label="Subscription management"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800"
    >
      <header className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 dark:border-gray-700 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
            Subscriptions
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
            Sorted by MRR descending · {totals.count} accounts · {formatMrr(totals.mrr)} active MRR
            {totals.churnRisk > 0 ? ` · ${totals.churnRisk} churn risk` : ""}
          </p>
        </div>

        <label className="block min-w-[180px]">
          <span className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-gray-400">
            Filter by plan
          </span>
          <select
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
            onChange={(event) => setPlan(event.target.value as "all" | SubscriptionPlan)}
            value={plan}
          >
            {planFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {actionError ? (
        <p className="border-b border-rose-100 bg-rose-50 px-5 py-2 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300 sm:px-6">
          {actionError}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-slate-500 dark:text-gray-400">
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-sky-600" />
          Loading subscriptions…
        </div>
      ) : error ? (
        <div className="space-y-3 px-5 py-12 text-center">
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          <button
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
            onClick={() => void load()}
            type="button"
          >
            Retry
          </button>
        </div>
      ) : rows.length === 0 ? (
        <p className="px-5 py-14 text-center text-sm text-slate-500 dark:text-gray-400">
          No subscriptions match this plan filter.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:border-gray-700 dark:text-gray-400">
                <th className="px-5 py-3 sm:px-6">Customer Name</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Billing Cycle</th>
                <th className="px-4 py-3">Next Invoice Date</th>
                <th className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1">
                    MRR
                    <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] font-bold normal-case tracking-normal text-slate-500 dark:bg-gray-700 dark:text-gray-300">
                      ↓
                    </span>
                  </span>
                </th>
                <th className="px-5 py-3 text-right sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
              {rows.map((row) => {
                const busy = busyId === row.id;
                const canUpgrade = row.plan !== "enterprise" && row.status !== "canceled";
                const canPause = row.status === "active";
                const canResume = row.status === "paused";
                const canCancel = row.status !== "canceled";

                return (
                  <tr
                    className="transition hover:bg-sky-50/40 dark:hover:bg-gray-700/40"
                    key={row.id}
                  >
                    <td className="px-5 py-3.5 sm:px-6">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-xl bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-gray-700 dark:text-gray-200">
                          {initials(row.customerName)}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-sm font-semibold text-slate-800 dark:text-gray-100">
                              {row.customerName}
                            </p>
                            {row.churnRisk && row.status !== "canceled" ? (
                              <span
                                className="inline-flex items-center text-amber-600 dark:text-amber-300"
                                title={
                                  row.daysSinceLogin == null
                                    ? "No recent login recorded — churn risk"
                                    : `Last login ${row.daysSinceLogin} days ago — churn risk`
                                }
                              >
                                <AlertTriangle aria-hidden="true" className="size-3.5" />
                                <span className="sr-only">Churn risk</span>
                              </span>
                            ) : null}
                          </div>
                          <p className="truncate text-xs text-slate-400 dark:text-gray-400">
                            {row.customerEmail ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold ${planBadge[row.plan]}`}
                      >
                        {planLabel[row.plan]}
                      </span>
                      <span
                        className={`ml-2 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold capitalize ${statusBadge[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm capitalize text-slate-600 dark:text-gray-300">
                      {row.billingCycle}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-gray-300">
                      {formatDate(row.nextInvoiceAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-900 dark:text-gray-100">
                      {formatMrr(row.mrr)}
                    </td>
                    <td className="px-5 py-3.5 text-right sm:px-6">
                      <div className="inline-flex flex-wrap justify-end gap-1.5">
                        <button
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
                          disabled={!canManage || busy || !canUpgrade}
                          onClick={() => void runAction(row.id, "upgrade")}
                          type="button"
                        >
                          {busy ? (
                            <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
                          ) : (
                            <ArrowUpRight aria-hidden="true" className="size-3.5" />
                          )}
                          Upgrade
                        </button>
                        {canResume ? (
                          <button
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
                            disabled={!canManage || busy}
                            onClick={() => void runAction(row.id, "resume")}
                            type="button"
                          >
                            <Play aria-hidden="true" className="size-3.5" />
                            Resume
                          </button>
                        ) : (
                          <button
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
                            disabled={!canManage || busy || !canPause}
                            onClick={() => void runAction(row.id, "pause")}
                            type="button"
                          >
                            <Pause aria-hidden="true" className="size-3.5" />
                            Pause
                          </button>
                        )}
                        <button
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-200 px-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-400/30 dark:text-rose-300 dark:hover:bg-rose-400/10"
                          disabled={!canManage || busy || !canCancel}
                          onClick={() => void runAction(row.id, "cancel")}
                          type="button"
                        >
                          <Ban aria-hidden="true" className="size-3.5" />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
