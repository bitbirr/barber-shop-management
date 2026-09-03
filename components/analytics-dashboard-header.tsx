"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown, Copy, Download, Link2, Mail } from "lucide-react";

const dateRanges = ["Last 7 days", "Last 30 days", "Last 90 days", "Year to date"];

export function AnalyticsDashboardHeader() {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [comparisonEnabled, setComparisonEnabled] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeShareMenu(event: MouseEvent) {
      if (!shareMenuRef.current?.contains(event.target as Node)) setShareOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setShareOpen(false);
    }

    document.addEventListener("mousedown", closeShareMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeShareMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function exportCsv() {
    const csv = [
      ["Metric", "Value", "Change"],
      ["Monthly till", "428,000 ETB", "+12.8%"],
      ["Chair utilization", "78%", "+4.2%"],
      ["Repeat rate", "64%", "+7.1%"],
      ["Average ticket", "850 ETB", "+3.8%"],
    ]
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "bit-barber-analytics.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyShareLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <header className="flex flex-col gap-6 border-b border-slate-200/80 pb-6 dark:border-white/[0.08] 2xl:flex-row 2xl:items-end 2xl:justify-between">
      <div>
        <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
          <span className="size-1.5 rounded-full bg-sky-500" /> Analytics
        </p>
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[30px]">Performance analytics</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-white/45">Understand revenue, utilization, service mix, and customer behavior.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end 2xl:justify-end">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block min-w-[176px]">
            <span className="mb-1.5 block text-sm font-medium text-slate-500 dark:text-white/45">Date range</span>
            <span className="relative block">
              <CalendarDays aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <select
                className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/75"
                onChange={(event) => setDateRange(event.target.value)}
                value={dateRange}
              >
                {dateRanges.map((range) => <option key={range}>{range}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </span>
          </label>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-500 dark:text-white/45">Comparison</span>
            <button
              aria-checked={comparisonEnabled}
              className="flex h-10 items-center gap-3 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/75"
              onClick={() => setComparisonEnabled((current) => !current)}
              role="switch"
              type="button"
            >
              <span className={`relative h-5 w-9 rounded-full transition ${comparisonEnabled ? "bg-sky-500" : "bg-slate-200 dark:bg-white/15"}`}>
                <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${comparisonEnabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </span>
              Previous period
            </button>
          </div>
        </div>

        <div className="hidden h-10 w-px bg-slate-200 dark:bg-white/10 sm:block" />

        <div className="flex items-center gap-2">
          <button className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08] sm:flex-none" onClick={exportCsv} type="button">
            <Download aria-hidden="true" className="size-4" /> Export CSV
          </button>

          <div className="relative flex-1 sm:flex-none" ref={shareMenuRef}>
            <button
              aria-expanded={shareOpen}
              aria-haspopup="menu"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-coral-600 px-3.5 text-sm font-900 text-white shadow-soft"
              onClick={() => setShareOpen((current) => !current)}
              type="button"
            >
              <Link2 aria-hidden="true" className="size-4" /> Share <ChevronDown aria-hidden="true" className="size-3.5 opacity-60" />
            </button>

            {shareOpen && (
              <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-ink-900" role="menu">
                <div className="px-2 py-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white/80">Share this report</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-400 dark:text-white/35">Anyone with the link can view this analytics snapshot.</p>
                </div>
                <button className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-white/70 dark:hover:bg-white/[0.06]" onClick={copyShareLink} role="menuitem" type="button">
                  <span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/[0.07] dark:text-white/50">{copied ? <Check aria-hidden="true" className="size-4 text-sky-600" /> : <Copy aria-hidden="true" className="size-4" />}</span>
                  <span>{copied ? "Link copied" : "Copy share link"}</span>
                </button>
                <a className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-white/70 dark:hover:bg-white/[0.06]" href="mailto:?subject=Bit-Barber analytics report" role="menuitem">
                  <span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/[0.07] dark:text-white/50"><Mail aria-hidden="true" className="size-4" /></span>
                  Send by email
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
