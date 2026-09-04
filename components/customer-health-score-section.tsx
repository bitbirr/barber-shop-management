"use client";

type HealthTone = "healthy" | "watch" | "risk";

type CustomerHealth = {
  name: string;
  score: number;
  lastActivity: string;
  mrr: number;
};

const customers: CustomerHealth[] = [
  { name: "Bole Fade House", score: 92, lastActivity: "Sep 4, 2026", mrr: 18400 },
  { name: "Piassa Lineup", score: 78, lastActivity: "Sep 3, 2026", mrr: 12600 },
  { name: "Merkato Kings", score: 64, lastActivity: "Sep 2, 2026", mrr: 9800 },
  { name: "Kazanchis Cuts", score: 51, lastActivity: "Aug 29, 2026", mrr: 7200 },
  { name: "CMC Groom Lab", score: 33, lastActivity: "Aug 21, 2026", mrr: 5400 },
  { name: "Sarbet Studio", score: 18, lastActivity: "Aug 12, 2026", mrr: 3100 },
];

function toneFor(score: number): HealthTone {
  if (score > 70) return "healthy";
  if (score >= 40) return "watch";
  return "risk";
}

const toneStyles: Record<
  HealthTone,
  { ring: string; track: string; label: string; badge: string }
> = {
  healthy: {
    ring: "stroke-emerald-500",
    track: "stroke-emerald-100 dark:stroke-emerald-500/20",
    label: "Healthy",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  watch: {
    ring: "stroke-amber-500",
    track: "stroke-amber-100 dark:stroke-amber-500/20",
    label: "Watch",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  },
  risk: {
    ring: "stroke-rose-500",
    track: "stroke-rose-100 dark:stroke-rose-500/20",
    label: "At risk",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300",
  },
};

function formatMrr(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function HealthRing({ score }: { score: number }) {
  const size = 72;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const tone = toneStyles[toneFor(score)];

  return (
    <div className="relative grid size-[72px] place-items-center">
      <svg aria-hidden="true" className="-rotate-90" height={size} width={size}>
        <circle
          className={tone.track}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className={`${tone.ring} transition-[stroke-dashoffset] duration-500`}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
      </svg>
      <span className="absolute text-sm font-bold tracking-[-0.03em] text-slate-900 dark:text-gray-100">
        {score}
      </span>
    </div>
  );
}

export function CustomerHealthScoreSection() {
  const averageScore = Math.round(
    customers.reduce((sum, customer) => sum + customer.score, 0) / customers.length,
  );
  const atRiskCount = customers.filter((customer) => customer.score < 40).length;
  const averageTone = toneStyles[toneFor(averageScore)];

  return (
    <section aria-label="Customer health scores" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
            Customer health
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
            Score, recent activity, and MRR by account
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-slate-500 dark:text-gray-400">Average health score</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
              {averageScore}
            </p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${averageTone.badge}`}>
              {averageTone.label}
            </span>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-slate-500 dark:text-gray-400">At-risk customers</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
              {atRiskCount}
            </p>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">
              Score below 40
            </span>
          </div>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => {
          const tone = toneStyles[toneFor(customer.score)];

          return (
            <article
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800"
              key={customer.name}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-gray-100">
                    {customer.name}
                  </p>
                  <span className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone.badge}`}>
                    {tone.label}
                  </span>
                </div>
                <HealthRing score={customer.score} />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-gray-700">
                <div>
                  <dt className="text-xs text-slate-400 dark:text-gray-400">Last activity</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-700 dark:text-gray-100">
                    {customer.lastActivity}
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="text-xs text-slate-400 dark:text-gray-400">MRR</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-gray-100">
                    {formatMrr(customer.mrr)}
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}
