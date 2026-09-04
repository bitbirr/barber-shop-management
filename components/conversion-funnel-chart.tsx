"use client";

const stages = [
  { label: "Visitors", value: 45000, color: "#a5b4fc" },
  { label: "Signups", value: 8200, color: "#818cf8" },
  { label: "Activated", value: 4100, color: "#6366f1" },
  { label: "Paid", value: 1850, color: "#4f46e5" },
  { label: "Enterprise Upgrade", value: 310, color: "#c084fc" },
] as const;

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function dropOffPercent(from: number, to: number) {
  return ((from - to) / from) * 100;
}

function conversionPercent(from: number, to: number) {
  return (to / from) * 100;
}

export function ConversionFunnelChart() {
  const maxValue = stages[0].value;
  const overallConversion = conversionPercent(stages[0].value, stages[stages.length - 1].value);

  return (
    <section
      aria-label="Conversion funnel"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
            Conversion funnel
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
            Visitor-to-enterprise journey
          </p>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-right dark:border-indigo-400/20 dark:bg-indigo-400/10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-500 dark:text-indigo-300">
            Overall conversion
          </p>
          <p className="text-lg font-bold tracking-[-0.03em] text-indigo-700 dark:text-indigo-200">
            {overallConversion.toFixed(1)}%
          </p>
        </div>
      </div>

      <ol className="space-y-3">
        {stages.map((stage, index) => {
          const widthPercent = Math.max((stage.value / maxValue) * 100, 18);
          const previous = index > 0 ? stages[index - 1] : null;
          const dropOff = previous ? dropOffPercent(previous.value, stage.value) : null;
          const retained = previous ? conversionPercent(previous.value, stage.value) : null;
          const textColor = index >= 2 ? "text-white" : "text-indigo-950";

          return (
            <li key={stage.label}>
              {dropOff !== null && retained !== null ? (
                <div className="mb-1.5 flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-gray-400">
                  <span className="h-3 w-px bg-slate-200 dark:bg-gray-700" />
                  <span>
                    <span className="font-semibold text-rose-500 dark:text-rose-400">−{dropOff.toFixed(1)}%</span>
                    {" drop-off · "}
                    <span className="font-medium text-slate-500 dark:text-gray-400">{retained.toFixed(1)}% retained</span>
                  </span>
                  <span className="h-3 w-px bg-slate-200 dark:bg-gray-700" />
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <div className="w-28 shrink-0 sm:w-36">
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-100">{stage.label}</p>
                  <p className="text-xs text-slate-400 dark:text-gray-400">
                    Stage {index + 1} of {stages.length}
                  </p>
                </div>

                <div className="relative min-w-0 flex-1">
                  <div
                    className={`flex h-12 items-center justify-between rounded-xl px-4 shadow-sm transition-[width] duration-500 ${textColor}`}
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: stage.color,
                      marginLeft: `${(100 - widthPercent) / 2}%`,
                    }}
                  >
                    <span className="truncate text-xs font-semibold sm:text-sm">{stage.label}</span>
                    <span className="shrink-0 text-sm font-bold tracking-[-0.02em]">
                      {formatCount(stage.value)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 text-xs text-slate-400 dark:text-gray-400">
        {formatCount(stages[0].value)} visitors → {formatCount(stages[stages.length - 1].value)} enterprise upgrades
      </p>
    </section>
  );
}
