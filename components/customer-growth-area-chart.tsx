"use client";

import { ArrowUpRight, Users } from "lucide-react";
import { useId, useMemo, useState } from "react";

type Period = "7d" | "30d" | "90d" | "1y";

type SeriesPoint = {
  label: string;
  free: number;
  pro: number;
  enterprise: number;
};

const periods: Period[] = ["7d", "30d", "90d", "1y"];

const seriesByPeriod: Record<Period, SeriesPoint[]> = {
  "7d": [
    { label: "Mon", free: 4200, pro: 2100, enterprise: 380 },
    { label: "Tue", free: 4280, pro: 2140, enterprise: 390 },
    { label: "Wed", free: 4350, pro: 2180, enterprise: 400 },
    { label: "Thu", free: 4410, pro: 2230, enterprise: 410 },
    { label: "Fri", free: 4480, pro: 2290, enterprise: 420 },
    { label: "Sat", free: 4520, pro: 2320, enterprise: 430 },
    { label: "Sun", free: 4580, pro: 2380, enterprise: 440 },
  ],
  "30d": [
    { label: "W1", free: 3800, pro: 1800, enterprise: 300 },
    { label: "W2", free: 4000, pro: 1950, enterprise: 330 },
    { label: "W3", free: 4200, pro: 2100, enterprise: 360 },
    { label: "W4", free: 4450, pro: 2280, enterprise: 400 },
    { label: "W5", free: 4580, pro: 2380, enterprise: 440 },
  ],
  "90d": [
    { label: "Jan", free: 3200, pro: 1400, enterprise: 220 },
    { label: "Feb", free: 3450, pro: 1550, enterprise: 250 },
    { label: "Mar", free: 3700, pro: 1720, enterprise: 280 },
    { label: "Apr", free: 3950, pro: 1900, enterprise: 320 },
    { label: "May", free: 4250, pro: 2150, enterprise: 370 },
    { label: "Jun", free: 4580, pro: 2380, enterprise: 440 },
  ],
  "1y": [
    { label: "Jan", free: 2100, pro: 820, enterprise: 110 },
    { label: "Feb", free: 2300, pro: 900, enterprise: 130 },
    { label: "Mar", free: 2550, pro: 1020, enterprise: 150 },
    { label: "Apr", free: 2780, pro: 1150, enterprise: 170 },
    { label: "May", free: 3020, pro: 1280, enterprise: 195 },
    { label: "Jun", free: 3280, pro: 1420, enterprise: 220 },
    { label: "Jul", free: 3500, pro: 1580, enterprise: 250 },
    { label: "Aug", free: 3750, pro: 1750, enterprise: 285 },
    { label: "Sep", free: 3980, pro: 1920, enterprise: 320 },
    { label: "Oct", free: 4220, pro: 2100, enterprise: 360 },
    { label: "Nov", free: 4400, pro: 2250, enterprise: 400 },
    { label: "Dec", free: 4580, pro: 2380, enterprise: 440 },
  ],
};

const layers = [
  { key: "free" as const, label: "Free users", color: "#38bdf8" },
  { key: "pro" as const, label: "Pro users", color: "#818cf8" },
  { key: "enterprise" as const, label: "Enterprise", color: "#c084fc" },
];

const width = 720;
const height = 260;
const padding = { top: 16, right: 16, bottom: 32, left: 48 };

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatAxis(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return String(value);
}

function buildAreaPath(
  topValues: number[],
  bottomValues: number[],
  xFor: (i: number) => number,
  yFor: (v: number) => number,
) {
  const top = topValues
    .map((value, index) => `${index === 0 ? "M" : "L"} ${xFor(index).toFixed(2)} ${yFor(value).toFixed(2)}`)
    .join(" ");
  const bottom = [...bottomValues]
    .reverse()
    .map((value, index) => {
      const pointIndex = bottomValues.length - 1 - index;
      return `L ${xFor(pointIndex).toFixed(2)} ${yFor(value).toFixed(2)}`;
    })
    .join(" ");
  return `${top} ${bottom} Z`;
}

export function CustomerGrowthAreaChart() {
  const clipId = useId();
  const [period, setPeriod] = useState<Period>("30d");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = seriesByPeriod[period];

  const { totals, yTicks, xFor, yFor, areas, lastTotal, growth } = useMemo(() => {
    const stacked = data.map((point) => ({
      label: point.label,
      free: point.free,
      pro: point.free + point.pro,
      enterprise: point.free + point.pro + point.enterprise,
      total: point.free + point.pro + point.enterprise,
      segments: point,
    }));

    const max = Math.max(...stacked.map((point) => point.total));
    const niceMax = Math.ceil(max / 1000) * 1000;
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const x = (index: number) =>
      padding.left + (stacked.length === 1 ? plotWidth / 2 : (index / (stacked.length - 1)) * plotWidth);
    const y = (value: number) => padding.top + plotHeight - (value / niceMax) * plotHeight;
    const zeros = stacked.map(() => 0);

    const freeTop = stacked.map((point) => point.free);
    const proTop = stacked.map((point) => point.pro);
    const enterpriseTop = stacked.map((point) => point.enterprise);

    const first = stacked[0]?.total ?? 0;
    const last = stacked[stacked.length - 1]?.total ?? 0;

    return {
      totals: stacked,
      yTicks: [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(niceMax * ratio)),
      xFor: x,
      yFor: y,
      areas: {
        free: buildAreaPath(freeTop, zeros, x, y),
        pro: buildAreaPath(proTop, freeTop, x, y),
        enterprise: buildAreaPath(enterpriseTop, proTop, x, y),
      },
      lastTotal: last,
      growth: first === 0 ? 0 : ((last - first) / first) * 100,
    };
  }, [data]);

  const active = activeIndex === null ? null : totals[activeIndex];

  return (
    <section
      aria-label="Customer growth"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <article className="min-w-[200px] rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
            <Users aria-hidden="true" className="size-4" />
            Total customers
          </div>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
              {formatCount(lastTotal)}
            </p>
            <span className="mb-1 inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              {growth.toFixed(1)}%
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-400">Across free, pro, and enterprise</p>
        </article>

        <div className="flex flex-col gap-3 sm:items-end">
          <div
            aria-label="Time period"
            className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-gray-700 dark:bg-gray-900/40"
            role="group"
          >
            {periods.map((option) => {
              const selected = period === option;
              return (
                <button
                  aria-pressed={selected}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    selected
                      ? "bg-white text-slate-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                      : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-gray-100"
                  }`}
                  key={option}
                  onClick={() => {
                    setPeriod(option);
                    setActiveIndex(null);
                  }}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-gray-400">
            {layers.map((layer) => (
              <span className="inline-flex items-center gap-2" key={layer.key}>
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: layer.color }} />
                {layer.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          className="h-auto min-w-[560px] w-full"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <title>Stacked customer growth by plan</title>
          <defs>
            <clipPath id={clipId}>
              <rect
                height={height - padding.top - padding.bottom}
                width={width - padding.left - padding.right}
                x={padding.left}
                y={padding.top}
              />
            </clipPath>
          </defs>

          {yTicks.map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  className="stroke-slate-100 dark:stroke-gray-700"
                  strokeWidth="1"
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={y}
                  y2={y}
                />
                <text
                  className="fill-slate-400 text-[10px] dark:fill-gray-400"
                  textAnchor="end"
                  x={padding.left - 10}
                  y={y + 3}
                >
                  {formatAxis(tick)}
                </text>
              </g>
            );
          })}

          {totals.map((point, index) => (
            <text
              className="fill-slate-400 text-[10px] dark:fill-gray-400"
              key={point.label}
              textAnchor="middle"
              x={xFor(index)}
              y={height - 8}
            >
              {point.label}
            </text>
          ))}

          <g clipPath={`url(#${clipId})`}>
            <path d={areas.free} fill={layers[0].color} opacity="0.95" />
            <path d={areas.pro} fill={layers[1].color} opacity="0.95" />
            <path d={areas.enterprise} fill={layers[2].color} opacity="0.95" />
          </g>

          {totals.map((point, index) => {
            const x = xFor(index);
            const isActive = activeIndex === index;
            const hitWidth = Math.max((width - padding.left - padding.right) / totals.length, 28);

            return (
              <g key={point.label} onMouseEnter={() => setActiveIndex(index)}>
                <rect
                  fill="transparent"
                  height={height - padding.top - padding.bottom}
                  width={hitWidth}
                  x={x - hitWidth / 2}
                  y={padding.top}
                />
                {isActive ? (
                  <line
                    className="stroke-slate-300 dark:stroke-gray-500"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                    x1={x}
                    x2={x}
                    y1={padding.top}
                    y2={height - padding.bottom}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        {active ? (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{
              left: `clamp(0.5rem, ${(activeIndex! / Math.max(totals.length - 1, 1)) * 100}% - 90px, calc(100% - 188px))`,
            }}
          >
            <p className="font-semibold text-slate-800 dark:text-gray-100">{active.label}</p>
            <div className="mt-2 space-y-1.5">
              {layers.map((layer) => (
                <p
                  className="flex items-center justify-between gap-4 text-slate-600 dark:text-gray-400"
                  key={layer.key}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-1.5 rounded-sm" style={{ backgroundColor: layer.color }} />
                    {layer.label}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-gray-100">
                    {formatCount(active.segments[layer.key])}
                  </span>
                </p>
              ))}
            </div>
            <p className="mt-2 border-t border-slate-100 pt-2 font-semibold text-slate-800 dark:border-gray-700 dark:text-gray-100">
              Total {formatCount(active.total)}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
