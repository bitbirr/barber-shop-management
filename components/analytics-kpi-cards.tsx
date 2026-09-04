import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type KpiTone = "up" | "down";

type KpiMetric = {
  label: string;
  value: string;
  change: string;
  tone: KpiTone;
  sparkline: number[];
};

const kpiMetrics: KpiMetric[] = [
  {
    label: "Total Revenue",
    value: "$127,400",
    change: "12.4%",
    tone: "up",
    sparkline: [42, 48, 45, 58, 62, 55, 68, 74, 71, 82, 88, 94],
  },
  {
    label: "Active Users",
    value: "12,847",
    change: "8.2%",
    tone: "up",
    sparkline: [58, 55, 62, 60, 68, 72, 70, 78, 81, 85, 90, 96],
  },
  {
    label: "Churn Rate",
    value: "3.2%",
    change: "0.4%",
    tone: "down",
    sparkline: [72, 68, 70, 64, 61, 58, 55, 52, 48, 45, 42, 38],
  },
  {
    label: "MRR Growth",
    value: "+18%",
    change: "2.1%",
    tone: "up",
    sparkline: [30, 34, 38, 42, 48, 52, 58, 64, 70, 78, 86, 95],
  },
];

function Sparkline({ values, tone }: { values: number[]; tone: KpiTone }) {
  const width = 96;
  const height = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  const stroke = tone === "up" ? "#34d399" : "#fb7185";
  const fill = tone === "up" ? "rgba(52,211,153,0.22)" : "rgba(251,113,133,0.18)";
  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      aria-hidden="true"
      className="mt-4 w-full max-w-[120px]"
      fill="none"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <polygon fill={fill} points={area} />
      <polyline
        points={points}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function KpiCard({ metric }: { metric: KpiMetric }) {
  const isUp = metric.tone === "up";
  const Arrow = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-gray-400">{metric.label}</p>
          <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
            {metric.value}
          </p>
          <p
            className={`mt-2 inline-flex items-center gap-0.5 text-xs font-semibold ${
              isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            <Arrow aria-hidden="true" className="size-3.5" />
            <span>
              {isUp ? "+" : "−"}
              {metric.change}
            </span>
            <span className="ml-1 font-medium text-slate-400 dark:text-gray-400">vs last month</span>
          </p>
        </div>
        <Sparkline tone={metric.tone} values={metric.sparkline} />
      </div>
    </article>
  );
}

export function AnalyticsKpiCards() {
  return (
    <section aria-label="Key performance indicators" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiMetrics.map((metric) => (
        <KpiCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}
