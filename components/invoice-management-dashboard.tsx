"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";

type Invoice = {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string;
};

const customers = [
  "Bole Fade House",
  "Piassa Lineup",
  "Merkato Kings",
  "Summit Cuts",
  "Lebu Luxe",
  "Jacros Barbers",
  "Nifas Silk Studio",
  "Sarbet Studio",
] as const;

const invoices: Invoice[] = [
  { id: "1", number: "INV-2048", customer: "Bole Fade House", amount: 18400, status: "overdue", issuedAt: "2026-08-01", dueDate: "2026-08-15" },
  { id: "2", number: "INV-2049", customer: "Piassa Lineup", amount: 12600, status: "sent", issuedAt: "2026-08-20", dueDate: "2026-09-10" },
  { id: "3", number: "INV-2050", customer: "Merkato Kings", amount: 9800, status: "paid", issuedAt: "2026-08-05", dueDate: "2026-08-20" },
  { id: "4", number: "INV-2051", customer: "Summit Cuts", amount: 22100, status: "paid", issuedAt: "2026-09-01", dueDate: "2026-09-15" },
  { id: "5", number: "INV-2052", customer: "Lebu Luxe", amount: 25600, status: "sent", issuedAt: "2026-09-02", dueDate: "2026-09-20" },
  { id: "6", number: "INV-2053", customer: "Jacros Barbers", amount: 11200, status: "overdue", issuedAt: "2026-07-28", dueDate: "2026-08-12" },
  { id: "7", number: "INV-2054", customer: "Nifas Silk Studio", amount: 17300, status: "paid", issuedAt: "2026-09-03", dueDate: "2026-09-18" },
  { id: "8", number: "INV-2055", customer: "Sarbet Studio", amount: 7600, status: "draft", issuedAt: "2026-09-04", dueDate: "2026-09-25" },
  { id: "9", number: "INV-2056", customer: "Bole Fade House", amount: 9200, status: "paid", issuedAt: "2026-09-01", dueDate: "2026-09-12" },
  { id: "10", number: "INV-2057", customer: "Piassa Lineup", amount: 5400, status: "void", issuedAt: "2026-08-10", dueDate: "2026-08-25" },
  { id: "11", number: "INV-2058", customer: "Merkato Kings", amount: 14400, status: "sent", issuedAt: "2026-09-04", dueDate: "2026-09-28" },
  { id: "12", number: "INV-2059", customer: "Summit Cuts", amount: 8300, status: "overdue", issuedAt: "2026-08-08", dueDate: "2026-08-22" },
  { id: "13", number: "INV-2060", customer: "Lebu Luxe", amount: 19800, status: "paid", issuedAt: "2026-09-02", dueDate: "2026-09-16" },
  { id: "14", number: "INV-2061", customer: "Jacros Barbers", amount: 6700, status: "draft", issuedAt: "2026-09-04", dueDate: "2026-09-30" },
  { id: "15", number: "INV-2062", customer: "Nifas Silk Studio", amount: 12100, status: "sent", issuedAt: "2026-08-29", dueDate: "2026-09-12" },
];

const statusStyles: Record<InvoiceStatus, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-white/70",
  sent: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  overdue: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
  void: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
};

const pageSize = 8;
const controlClass =
  "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/75 dark:hover:border-white/20";

function formatUsd(value: number) {
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

function inRange(date: string, from: string, to: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

export function InvoiceManagementDashboard() {
  const [status, setStatus] = useState<"all" | InvoiceStatus>("all");
  const [customer, setCustomer] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices.filter((invoice) => {
      if (status !== "all" && invoice.status !== status) return false;
      if (customer !== "all" && invoice.customer !== customer) return false;
      if (!inRange(invoice.dueDate, dateFrom, dateTo)) return false;
      if (q && !`${invoice.number} ${invoice.customer}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [customer, dateFrom, dateTo, search, status]);

  const metrics = useMemo(() => {
    const outstanding = invoices
      .filter((invoice) => invoice.status === "sent" || invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const overdue = invoices
      .filter((invoice) => invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const paidThisMonth = invoices
      .filter((invoice) => invoice.status === "paid" && invoice.issuedAt.startsWith("2026-09"))
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    return { outstanding, overdue, paidThisMonth };
  }, []);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function resetFilters() {
    setStatus("all");
    setCustomer("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
            <span className="size-1.5 rounded-full bg-sky-500" /> Billing
          </p>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[30px]">
            Invoices
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-white/45">
            Track outstanding balances, overdue accounts, and collections for your SaaS book.
          </p>
        </div>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-coral-600 px-4 text-sm font-900 text-white shadow-soft transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
          New invoice
        </button>
      </div>

      <section aria-label="Invoice summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 focus-within:ring-2 focus-within:ring-sky-500/20 dark:border-white/[0.08] dark:bg-ink-900 dark:hover:border-white/15">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-white/45">Total Outstanding</p>
              <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-white">
                {formatUsd(metrics.outstanding)}
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300">
              <Wallet aria-hidden="true" className="size-[18px]" />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 dark:text-white/30">Open + overdue invoices</p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 focus-within:ring-2 focus-within:ring-sky-500/20 dark:border-white/[0.08] dark:bg-ink-900 dark:hover:border-white/15">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-white/45">Overdue</p>
              <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-white">
                {formatUsd(metrics.overdue)}
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
              <AlertTriangle aria-hidden="true" className="size-[18px]" />
            </span>
          </div>
          <p className="mt-2 text-xs text-rose-600/80 dark:text-rose-300/80">Needs collection follow-up</p>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 focus-within:ring-2 focus-within:ring-sky-500/20 dark:border-white/[0.08] dark:bg-ink-900 dark:hover:border-white/15">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-white/45">Paid This Month</p>
              <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-white">
                {formatUsd(metrics.paidThisMonth)}
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
              <CheckCircle2 aria-hidden="true" className="size-[18px]" />
            </span>
          </div>
          <p className="mt-2 text-xs text-emerald-700/80 dark:text-emerald-300/80">Collected in September 2026</p>
        </article>
      </section>

      <section
        aria-label="Invoice filters and table"
        className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-white/[0.08] dark:bg-ink-900"
      >
        <div className="border-b border-slate-100 px-5 py-4 dark:border-white/[0.07] sm:px-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white/80">
            <Filter aria-hidden="true" className="size-4 text-slate-400" />
            Filters
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <label className="grid gap-1.5 text-xs font-medium text-slate-500 dark:text-white/45 xl:col-span-2">
              Search
              <span className="relative block">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  className={`${controlClass} w-full pl-9`}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Invoice # or customer"
                  type="search"
                  value={search}
                />
              </span>
            </label>

            <label className="grid gap-1.5 text-xs font-medium text-slate-500 dark:text-white/45">
              From
              <input
                className={controlClass}
                onChange={(event) => {
                  setDateFrom(event.target.value);
                  setPage(1);
                }}
                type="date"
                value={dateFrom}
              />
            </label>

            <label className="grid gap-1.5 text-xs font-medium text-slate-500 dark:text-white/45">
              To
              <input
                className={controlClass}
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setPage(1);
                }}
                type="date"
                value={dateTo}
              />
            </label>

            <label className="grid gap-1.5 text-xs font-medium text-slate-500 dark:text-white/45">
              Status
              <select
                className={controlClass}
                onChange={(event) => {
                  setStatus(event.target.value as "all" | InvoiceStatus);
                  setPage(1);
                }}
                value={status}
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="void">Void</option>
              </select>
            </label>

            <label className="grid gap-1.5 text-xs font-medium text-slate-500 dark:text-white/45">
              Customer
              <select
                className={controlClass}
                onChange={(event) => {
                  setCustomer(event.target.value);
                  setPage(1);
                }}
                value={customer}
              >
                <option value="all">All customers</option>
                {customers.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.06]"
              onClick={resetFilters}
              type="button"
            >
              Clear filters
            </button>
            <p className="text-xs text-slate-400 dark:text-white/35">
              {filtered.length} invoice{filtered.length === 1 ? "" : "s"} match
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/[0.07]">
                {["Invoice #", "Customer", "Amount", "Status", "Due Date", "Actions"].map((heading) => (
                  <th
                    className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-white/35 sm:px-6 ${
                      heading === "Amount" || heading === "Due Date" || heading === "Actions" ? "text-right" : ""
                    }`}
                    key={heading}
                    scope="col"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td className="px-5 py-12 text-center text-sm text-slate-400 sm:px-6" colSpan={6}>
                    No invoices match these filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((invoice, index) => (
                  <tr
                    className={`group border-b border-slate-100 last:border-b-0 transition hover:bg-sky-50/50 dark:border-white/[0.06] dark:hover:bg-white/[0.035] ${
                      index % 2 === 1 ? "bg-slate-50/60 dark:bg-white/[0.02]" : ""
                    }`}
                    key={invoice.id}
                  >
                    <td className="px-5 py-3.5 sm:px-6">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white/85">
                        <FileText aria-hidden="true" className="size-4 text-slate-400" />
                        {invoice.number}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-white/70 sm:px-6">{invoice.customer}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-900 dark:text-white sm:px-6">
                      {formatUsd(invoice.amount)}
                    </td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-slate-600 dark:text-white/55 sm:px-6">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="relative px-5 py-3.5 text-right sm:px-6">
                      <div className="inline-flex items-center gap-1">
                        <button
                          aria-label={`View ${invoice.number}`}
                          className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/[0.08] dark:hover:text-white"
                          type="button"
                        >
                          <Eye aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          aria-label={`Download ${invoice.number}`}
                          className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/[0.08] dark:hover:text-white"
                          type="button"
                        >
                          <Download aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          aria-expanded={openMenuId === invoice.id}
                          aria-haspopup="menu"
                          aria-label={`More actions for ${invoice.number}`}
                          className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/[0.08] dark:hover:text-white"
                          onClick={() => setOpenMenuId((current) => (current === invoice.id ? null : invoice.id))}
                          type="button"
                        >
                          <MoreHorizontal aria-hidden="true" className="size-4" />
                        </button>
                      </div>

                      {openMenuId === invoice.id ? (
                        <div
                          className="absolute right-5 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-ink-800 sm:right-6"
                          role="menu"
                        >
                          {["Mark as paid", "Send reminder", "Duplicate", "Void"].map((action) => (
                            <button
                              className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 dark:text-white/70 dark:hover:bg-white/[0.06]"
                              key={action}
                              onClick={() => setOpenMenuId(null)}
                              role="menuitem"
                              type="button"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 dark:border-white/[0.07] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-slate-400 dark:text-white/35">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.06]"
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
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.06]"
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
    </div>
  );
}
