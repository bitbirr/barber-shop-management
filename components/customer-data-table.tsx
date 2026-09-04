"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Plan = "Starter" | "Professional" | "Enterprise";
type Status = "active" | "churned";
type SortKey = "name" | "email" | "plan" | "status" | "mrr" | "lastActive";

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  status: Status;
  mrr: number;
  lastActive: string;
  initials: string;
  tone: string;
};

const planOrder: Record<Plan, number> = { Starter: 0, Professional: 1, Enterprise: 2 };
const planStyles: Record<Plan, string> = {
  Starter: "bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-white/70",
  Professional: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  Enterprise: "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300",
};

const customers: CustomerRow[] = [
  { id: "1", name: "Bole Fade House", email: "ops@bolefade.et", plan: "Enterprise", status: "active", mrr: 18400, lastActive: "2026-09-04", initials: "BF", tone: "bg-sky-100 text-sky-700" },
  { id: "2", name: "Piassa Lineup", email: "hello@piassalineup.et", plan: "Professional", status: "active", mrr: 12600, lastActive: "2026-09-03", initials: "PL", tone: "bg-violet-100 text-violet-700" },
  { id: "3", name: "Merkato Kings", email: "team@merkatokings.et", plan: "Professional", status: "active", mrr: 9800, lastActive: "2026-09-02", initials: "MK", tone: "bg-amber-100 text-amber-700" },
  { id: "4", name: "Kazanchis Cuts", email: "desk@kazanchiscuts.et", plan: "Starter", status: "active", mrr: 4200, lastActive: "2026-08-30", initials: "KC", tone: "bg-rose-100 text-rose-700" },
  { id: "5", name: "CMC Groom Lab", email: "book@cmcgroom.et", plan: "Starter", status: "churned", mrr: 0, lastActive: "2026-07-18", initials: "CG", tone: "bg-emerald-100 text-emerald-700" },
  { id: "6", name: "Sarbet Studio", email: "front@sarbetstudio.et", plan: "Professional", status: "active", mrr: 7600, lastActive: "2026-09-01", initials: "SS", tone: "bg-blue-100 text-blue-700" },
  { id: "7", name: "Bole Atlas Barbers", email: "owner@atlasbarbers.et", plan: "Enterprise", status: "active", mrr: 22100, lastActive: "2026-09-04", initials: "AB", tone: "bg-indigo-100 text-indigo-700" },
  { id: "8", name: "Mexico Square Shop", email: "contact@mexicofades.et", plan: "Starter", status: "active", mrr: 3100, lastActive: "2026-08-28", initials: "MS", tone: "bg-orange-100 text-orange-700" },
  { id: "9", name: "Gerji Edge", email: "hello@gerjiedge.et", plan: "Professional", status: "churned", mrr: 0, lastActive: "2026-06-22", initials: "GE", tone: "bg-teal-100 text-teal-700" },
  { id: "10", name: "Lideta Line", email: "shop@lidetaline.et", plan: "Starter", status: "active", mrr: 2800, lastActive: "2026-08-25", initials: "LL", tone: "bg-cyan-100 text-cyan-700" },
  { id: "11", name: "Summit Cuts", email: "ops@summitcuts.et", plan: "Enterprise", status: "active", mrr: 19800, lastActive: "2026-09-03", initials: "SC", tone: "bg-fuchsia-100 text-fuchsia-700" },
  { id: "12", name: "Ayat Clippers", email: "desk@ayatclippers.et", plan: "Starter", status: "active", mrr: 2450, lastActive: "2026-08-19", initials: "AC", tone: "bg-lime-100 text-lime-700" },
  { id: "13", name: "Megenagna House", email: "team@megenagnahouse.et", plan: "Professional", status: "active", mrr: 8900, lastActive: "2026-09-02", initials: "MH", tone: "bg-sky-100 text-sky-800" },
  { id: "14", name: "Old Airport Fades", email: "book@oldairportfades.et", plan: "Starter", status: "churned", mrr: 0, lastActive: "2026-05-30", initials: "OA", tone: "bg-stone-200 text-stone-700" },
  { id: "15", name: "Lebu Luxe", email: "concierge@lebuluxe.et", plan: "Enterprise", status: "active", mrr: 25600, lastActive: "2026-09-04", initials: "LX", tone: "bg-violet-100 text-violet-800" },
  { id: "16", name: "Tor Hailoch Shop", email: "hello@torhailoch.et", plan: "Professional", status: "active", mrr: 6400, lastActive: "2026-08-31", initials: "TH", tone: "bg-amber-100 text-amber-800" },
  { id: "17", name: "Saris Street Cuts", email: "front@sariscuts.et", plan: "Starter", status: "active", mrr: 1900, lastActive: "2026-08-14", initials: "SR", tone: "bg-rose-100 text-rose-800" },
  { id: "18", name: "Jacros Barbers", email: "ops@jacrosbarbers.et", plan: "Professional", status: "active", mrr: 11200, lastActive: "2026-09-01", initials: "JB", tone: "bg-blue-100 text-blue-800" },
  { id: "19", name: "Kality Crew", email: "shop@kalitycrew.et", plan: "Starter", status: "churned", mrr: 0, lastActive: "2026-07-02", initials: "KL", tone: "bg-emerald-100 text-emerald-800" },
  { id: "20", name: "Gullele Grooming", email: "desk@gullegroom.et", plan: "Professional", status: "active", mrr: 7300, lastActive: "2026-08-29", initials: "GG", tone: "bg-indigo-100 text-indigo-800" },
  { id: "21", name: "Kirkos Classic", email: "hello@kirkosclassic.et", plan: "Starter", status: "active", mrr: 3600, lastActive: "2026-08-27", initials: "KK", tone: "bg-orange-100 text-orange-800" },
  { id: "22", name: "Nifas Silk Studio", email: "book@nifasstudio.et", plan: "Enterprise", status: "active", mrr: 17300, lastActive: "2026-09-03", initials: "NS", tone: "bg-teal-100 text-teal-800" },
  { id: "23", name: "Addisu Gebeya Cuts", email: "team@addisucuts.et", plan: "Starter", status: "active", mrr: 2100, lastActive: "2026-08-11", initials: "AG", tone: "bg-cyan-100 text-cyan-800" },
  { id: "24", name: "Yeka Yard Barbers", email: "ops@yekayard.et", plan: "Professional", status: "churned", mrr: 0, lastActive: "2026-06-08", initials: "YY", tone: "bg-fuchsia-100 text-fuchsia-800" },
];

const pageSize = 10;

const columns: Array<{ key: SortKey; label: string; className?: string }> = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "mrr", label: "MRR", className: "text-right" },
  { key: "lastActive", label: "Last Active", className: "text-right" },
];

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
  }).format(new Date(`${value}T00:00:00`));
}

function compareRows(a: CustomerRow, b: CustomerRow, key: SortKey) {
  switch (key) {
    case "name":
    case "email":
      return a[key].localeCompare(b[key]);
    case "plan":
      return planOrder[a.plan] - planOrder[b.plan];
    case "status":
      return a.status.localeCompare(b.status);
    case "mrr":
      return a.mrr - b.mrr;
    case "lastActive":
      return a.lastActive.localeCompare(b.lastActive);
    default:
      return 0;
  }
}

export function CustomerDataTable() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const rows = normalized
      ? customers.filter((row) =>
          `${row.name} ${row.email} ${row.plan} ${row.status}`.toLowerCase().includes(normalized),
        )
      : customers;

    return [...rows].sort((a, b) => {
      const result = compareRows(a, b, sortKey);
      return sortDir === "asc" ? result : -result;
    });
  }, [query, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <section
      aria-label="Customer data table"
      className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-white/[0.08] dark:bg-ink-900"
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/[0.07] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Customers</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-white/45">
            {filtered.length} account{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Search customers</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:placeholder:text-white/30"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, plan..."
            type="search"
            value={query}
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/[0.07]">
              {columns.map((column) => {
                const active = sortKey === column.key;
                const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
                return (
                  <th className={`px-5 py-3 sm:px-6 ${column.className ?? ""}`} key={column.key} scope="col">
                    <button
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                        active ? "text-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-700 dark:text-white/35 dark:hover:text-white/70"
                      } ${column.className?.includes("text-right") ? "ml-auto" : ""}`}
                      onClick={() => toggleSort(column.key)}
                      type="button"
                    >
                      {column.label}
                      <Icon aria-hidden="true" className="size-3.5" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, index) => (
              <tr
                className={`border-b border-slate-100 last:border-b-0 dark:border-white/[0.06] ${
                  index % 2 === 1 ? "bg-slate-50/70 dark:bg-white/[0.025]" : "bg-white dark:bg-transparent"
                }`}
                key={row.id}
              >
                <td className="px-5 py-3.5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold ${row.tone}`}>
                      {row.initials}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white/85">{row.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-white/55 sm:px-6">{row.email}</td>
                <td className="px-5 py-3.5 sm:px-6">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${planStyles[row.plan]}`}>
                    {row.plan}
                  </span>
                </td>
                <td className="px-5 py-3.5 sm:px-6">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white/75">
                    <span
                      className={`size-2 rounded-full ${
                        row.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {row.status === "active" ? "Active" : "Churned"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-800 dark:text-white/85 sm:px-6">
                  {formatMrr(row.mrr)}
                </td>
                <td className="px-5 py-3.5 text-right text-sm text-slate-600 dark:text-white/55 sm:px-6">
                  {formatDate(row.lastActive)}
                </td>
              </tr>
            ))}
            {pageRows.length === 0 ? (
              <tr>
                <td className="px-5 py-12 text-center text-sm text-slate-400 dark:text-white/35 sm:px-6" colSpan={6}>
                  No customers match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 dark:border-white/[0.07] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-slate-400 dark:text-white/35">
          Showing {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, filtered.length)} of{" "}
          {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous page"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.06]"
            disabled={currentPage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-3.5" />
            Prev
          </button>
          <span className="min-w-[4.5rem] text-center text-xs font-semibold text-slate-600 dark:text-white/60">
            Page {currentPage} / {totalPages}
          </span>
          <button
            aria-label="Next page"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.06]"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            type="button"
          >
            Next
            <ChevronRight aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
