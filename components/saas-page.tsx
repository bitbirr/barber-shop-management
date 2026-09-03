import type { ReactNode } from "react";
import { ArrowUpRight, MoreHorizontal, Plus } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  change: string;
};

type SaaSPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  metrics: Metric[];
  panelTitle: string;
  panelDescription: string;
  rows: Array<{ name: string; detail: string; value: string; status: string }>;
  header?: ReactNode;
};

export function SaaSPage({ eyebrow, title, description, action, metrics, panelTitle, panelDescription, rows, header }: SaaSPageProps) {
  return (
    <div className="space-y-7">
      {header ?? <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
            <span className="size-1.5 rounded-full bg-sky-500" /> {eyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[30px]">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-white/45">{description}</p>
        </div>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-coral-600 px-4 text-sm font-900 text-white shadow-soft transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" type="button">
          <Plus aria-hidden="true" className="size-4" /> {action}
        </button>
      </div>}

      <section aria-label={`${title} summary`} className="grid grid-cols-12 gap-4 lg:gap-5">
        {metrics.map((metric) => (
          <article className="col-span-12 rounded-4xl border border-sky-100 bg-white p-5 shadow-card dark:border-white/[0.08] dark:bg-ink-900 sm:col-span-6 xl:col-span-3" key={metric.label}>
            <p className="text-[13px] font-medium text-slate-500 dark:text-white/45">{metric.label}</p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-[27px] font-semibold tracking-[-0.04em] text-slate-900 dark:text-white">{metric.value}</p>
              <span className="mb-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300"><ArrowUpRight aria-hidden="true" className="size-3" />{metric.change}</span>
            </div>
          </article>
        ))}

        <section className="col-span-12 overflow-hidden rounded-4xl border border-sky-100 bg-white shadow-card dark:border-white/[0.08] dark:bg-ink-900 xl:col-span-8" aria-labelledby="primary-panel-title">
          <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/[0.07] sm:px-6">
            <div>
              <h2 className="font-semibold tracking-[-0.02em] text-slate-900 dark:text-white" id="primary-panel-title">{panelTitle}</h2>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-white/35">{panelDescription}</p>
            </div>
            <button aria-label={`${panelTitle} options`} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/[0.06] dark:hover:text-white" type="button"><MoreHorizontal aria-hidden="true" className="size-4" /></button>
          </header>
          <div className="divide-y divide-slate-100 dark:divide-white/[0.07]">
            {rows.map((row, index) => (
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 transition hover:bg-slate-50/70 dark:hover:bg-white/[0.025] sm:px-6" key={row.name}>
                <span className="grid size-9 place-items-center rounded-xl bg-slate-100 text-[11px] font-bold text-slate-500 dark:bg-white/[0.06] dark:text-white/45">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-white/75">{row.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-white/30">{row.detail}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700 dark:text-white/75">{row.value}</p>
                  <p className="text-[10px] font-medium text-sky-700 dark:text-sky-300">{row.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="col-span-12 rounded-4xl bg-gradient-to-br from-sky-700 via-sky-700 to-coral-600 p-5 text-white shadow-card xl:col-span-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">Performance pulse</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Healthy momentum</h2>
          <p className="mt-2 text-xs leading-5 text-white/45">Your workspace is performing above the previous 30-day baseline.</p>
          <div className="mt-7 space-y-5">
            {[{ label: "Goal progress", value: "78%", width: "78%" }, { label: "Team capacity", value: "64%", width: "64%" }, { label: "Data quality", value: "92%", width: "92%" }].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-xs"><span className="text-white/55">{item.label}</span><span className="font-semibold text-white/80">{item.value}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-coral-300" style={{ width: item.width }} /></div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
