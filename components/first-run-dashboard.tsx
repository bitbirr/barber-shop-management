import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  CloudUpload,
  Database,
  FileSpreadsheet,
  PlugZap,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from "lucide-react";

const onboardingSteps = [
  { title: "Create your workspace", description: "Name your workspace and choose a timezone.", complete: true },
  { title: "Connect your first data source", description: "Sync revenue, customers, or booking data.", complete: false },
  { title: "Invite your team", description: "Bring collaborators into the workspace.", complete: false },
  { title: "Build your first report", description: "Turn connected data into a live dashboard.", complete: false },
];

const sampleMetrics = [
  { label: "Monthly revenue", value: "$28,420", detail: "+12.8% vs last month", icon: CircleDollarSign },
  { label: "Active customers", value: "846", detail: "+72 this month", icon: UsersRound },
  { label: "Conversion rate", value: "8.4%", detail: "+1.2 percentage points", icon: BarChart3 },
];

const connectors = [
  { name: "Stripe", description: "Revenue and subscriptions", icon: CircleDollarSign, tone: "bg-violet-50 text-violet-700" },
  { name: "Google Sheets", description: "Import operational data", icon: FileSpreadsheet, tone: "bg-emerald-50 text-emerald-700" },
  { name: "PostgreSQL", description: "Sync your product database", icon: Database, tone: "bg-sky-50 text-sky-700" },
];

export function FirstRunDashboard() {
  return (
    <div className="-m-4 min-h-[calc(100vh-116px)] bg-white p-4 dark:bg-[#0e1412] sm:-m-6 sm:p-6 lg:-m-8 lg:p-8">
      <div className="mx-auto max-w-[1320px] space-y-8">
        <header className="flex flex-col gap-5 border-b border-slate-100 pb-7 dark:border-white/[0.07] sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Sparkles aria-hidden="true" className="size-3.5" /> New workspace
            </div>
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-[32px]">Welcome to Faded Analytics</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-white/45">Connect a source to replace the sample preview with live insights from your business.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]" type="button">
              <CloudUpload aria-hidden="true" className="size-4" /> Import CSV
            </button>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:bg-emerald-400 dark:text-[#101815] dark:hover:bg-emerald-300" type="button">
              <PlugZap aria-hidden="true" className="size-4" /> Connect data source
            </button>
          </div>
        </header>

        <section aria-labelledby="setup-title" className="grid grid-cols-12 gap-5">
          <div className="col-span-12 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#18211e] sm:p-6 lg:col-span-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/35">Getting started</p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-slate-900 dark:text-white" id="setup-title">Set up your workspace</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-white/40">Complete these steps to unlock your live dashboard.</p>
              </div>
              <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-white/55">1 of 4 complete</span>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[11px] font-medium"><span className="text-slate-500 dark:text-white/40">Setup progress</span><span className="text-emerald-700 dark:text-emerald-300">25%</span></div>
              <div aria-label="Onboarding progress: 25 percent" aria-valuemax={100} aria-valuemin={0} aria-valuenow={25} className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.07]" role="progressbar"><div className="h-full w-1/4 rounded-full bg-emerald-500" /></div>
            </div>

            <ol className="mt-5 divide-y divide-slate-100 dark:divide-white/[0.07]">
              {onboardingSteps.map((step, index) => (
                <li className="flex items-center gap-3 py-3.5 first:pt-1 last:pb-0" key={step.title}>
                  <span className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold ${step.complete ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-transparent dark:text-white/35"}`}>{step.complete ? <Check aria-hidden="true" className="size-4" strokeWidth={2.5} /> : index + 1}</span>
                  <div className="min-w-0 flex-1"><p className={`text-sm font-semibold ${step.complete ? "text-slate-400 line-through decoration-slate-300 dark:text-white/30" : "text-slate-800 dark:text-white/75"}`}>{step.title}</p><p className="mt-0.5 text-xs text-slate-400 dark:text-white/30">{step.description}</p></div>
                  {!step.complete && <button aria-label={`Start: ${step.title}`} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:hover:bg-white/[0.06] dark:hover:text-white" type="button"><ChevronRight aria-hidden="true" className="size-4" /></button>}
                </li>
              ))}
            </ol>
          </div>

          <aside className="col-span-12 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-white/[0.08] dark:bg-white/[0.025] sm:p-6 lg:col-span-4">
            <span className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-emerald-700 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-emerald-300"><PlugZap aria-hidden="true" className="size-[18px]" /></span>
            <h2 className="mt-5 text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">Connect your first source</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-white/40">Start with a guided connector. You can add or remove sources at any time.</p>
            <div className="mt-5 space-y-2">
              {connectors.map((connector) => {
                const Icon = connector.icon;
                return (
                  <button className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-emerald-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-white/[0.08] dark:bg-white/[0.035] dark:hover:border-emerald-400/40" key={connector.name} type="button">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${connector.tone}`}><Icon aria-hidden="true" className="size-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-slate-800 dark:text-white/75">{connector.name}</span><span className="block truncate text-[10px] text-slate-400 dark:text-white/30">{connector.description}</span></span>
                    <ArrowRight aria-hidden="true" className="size-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:text-white/20" />
                  </button>
                );
              })}
            </div>
            <button className="mt-3 inline-flex h-9 w-full items-center justify-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-emerald-300" type="button">Browse all integrations</button>
          </aside>
        </section>

        <section aria-labelledby="sample-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div><div className="flex items-center gap-2"><h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-white" id="sample-title">Your dashboard preview</h2><span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/35">Sample data</span></div><p className="mt-1 text-xs text-slate-400 dark:text-white/30">This preview updates automatically once a source is connected.</p></div>
            <button className="hidden text-xs font-semibold text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-white/40 dark:hover:text-white sm:block" type="button">Hide sample data</button>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {sampleMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <article className="col-span-12 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#18211e] sm:col-span-6 lg:col-span-4" key={metric.label}>
                  <div className="flex items-start justify-between"><p className="text-xs font-medium text-slate-500 dark:text-white/40">{metric.label}</p><Icon aria-hidden="true" className="size-4 text-slate-300 dark:text-white/20" /></div>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900 dark:text-white">{metric.value}</p><p className="mt-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">{metric.detail}</p>
                </article>
              );
            })}

            <article className="col-span-12 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#18211e] lg:col-span-8">
              <div className="flex items-start justify-between"><div><h3 className="text-sm font-semibold text-slate-800 dark:text-white/75">Revenue trend</h3><p className="mt-1 text-[11px] text-slate-400 dark:text-white/30">Last seven days · sample</p></div><CalendarDays aria-hidden="true" className="size-4 text-slate-300 dark:text-white/20" /></div>
              <div className="mt-7 flex h-36 items-end gap-3 sm:gap-5" aria-label="Sample revenue bar chart">
                {[38, 56, 48, 72, 63, 88, 66].map((height, index) => <div className="flex h-full flex-1 flex-col justify-end gap-2" key={`${height}-${index}`}><div className={`w-full rounded-t-md ${index === 5 ? "bg-emerald-500" : "bg-slate-100 dark:bg-white/[0.07]"}`} style={{ height: `${height}%` }} /><span className="text-center text-[9px] text-slate-400 dark:text-white/30">{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>)}
              </div>
            </article>

            <article className="col-span-12 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/40 p-6 text-center dark:border-white/10 dark:bg-white/[0.02] lg:col-span-4">
              <span className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/35"><ShoppingBag aria-hidden="true" className="size-5" /></span>
              <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-white/75">Your live data appears here</h3><p className="mt-1 max-w-[240px] text-xs leading-5 text-slate-400 dark:text-white/30">Connect a source to monitor revenue and customer activity in real time.</p>
              <button className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/65" type="button"><PlugZap aria-hidden="true" className="size-3.5" />Connect source</button>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
