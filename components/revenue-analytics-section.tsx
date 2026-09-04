"use client";

import { useId, useMemo, useState } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** Realistic B2B SaaS MRR trajectory (~$180k → ~$312k ARR growth year) */
const mrrSeries = [14800, 15620, 16240, 17180, 18350, 19420, 20840, 22110, 23680, 25140, 26890, 28460];

const nrrValue = 118;
const nrrTarget = 120;

const productLines = [
  {
    name: "Core Platform",
    color: "#4f46e5",
    values: [9200, 9480, 9720, 10140, 10680, 11120, 11680, 12140, 12780, 13320, 13940, 14580],
  },
  {
    name: "Automation Add-on",
    color: "#0ea5e9",
    values: [2800, 3120, 3340, 3620, 3980, 4260, 4680, 5020, 5460, 5820, 6280, 6740],
  },
  {
    name: "API & Usage",
    color: "#8b5cf6",
    values: [1800, 1940, 2080, 2260, 2480, 2720, 2980, 3240, 3520, 3860, 4180, 4520],
  },
  {
    name: "Premium Support",
    color: "#22d3ee",
    values: [1000, 1080, 1100, 1160, 1210, 1320, 1500, 1710, 1920, 2140, 2490, 2620],
  },
] as const;

const width = 640;
const height = 220;
const padding = { top: 16, right: 16, bottom: 28, left: 48 };

function formatUsd(value: number, compact = false) {
  if (compact && value >= 1000) {
    return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildLine(values: number[], xFor: (i: number) => number, yFor: (v: number) => number) {
  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${xFor(index).toFixed(2)} ${yFor(value).toFixed(2)}`)
    .join(" ");
}

function MrrLineChart() {
  const gradientId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { yTicks, xFor, yFor, path, growth } = useMemo(() => {
    const min = Math.min(...mrrSeries) * 0.92;
    const max = Math.max(...mrrSeries) * 1.05;
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const x = (index: number) => padding.left + (index / (months.length - 1)) * plotWidth;
    const y = (value: number) => padding.top + plotHeight - ((value - min) / (max - min)) * plotHeight;
    const ticks = [0, 0.33, 0.66, 1].map((ratio) => Math.round(min + (max - min) * ratio));
    const first = mrrSeries[0];
    const last = mrrSeries[mrrSeries.length - 1];

    return {
      yTicks: ticks,
      xFor: x,
      yFor: y,
      path: buildLine(mrrSeries, x, y),
      growth: ((last - first) / first) * 100,
    };
  }, []);

  const latest = mrrSeries[mrrSeries.length - 1];
  const active = activeIndex === null ? null : { index: activeIndex, month: months[activeIndex], value: mrrSeries[activeIndex] };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400">Monthly recurring revenue</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
              {formatUsd(latest)}
            </p>
            <span className="mb-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +{growth.toFixed(1)}% YTD
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 dark:text-gray-400">B2B SaaS · trailing 12 months</p>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          className="h-auto min-w-[480px] w-full"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <title>Monthly recurring revenue line chart</title>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
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
                <text className="fill-slate-400 text-[10px] dark:fill-gray-400" textAnchor="end" x={padding.left - 8} y={y + 3}>
                  {formatUsd(tick, true)}
                </text>
              </g>
            );
          })}

          {months.map((month, index) => (
            <text
              className="fill-slate-400 text-[10px] dark:fill-gray-400"
              key={month}
              textAnchor="middle"
              x={xFor(index)}
              y={height - 6}
            >
              {month}
            </text>
          ))}

          <path
            d={`${path} L ${xFor(months.length - 1)} ${yFor(Math.min(...mrrSeries) * 0.92)} L ${xFor(0)} ${yFor(Math.min(...mrrSeries) * 0.92)} Z`}
            fill={`url(#${gradientId})`}
          />
          <path className="stroke-indigo-600" d={path} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />

          {months.map((month, index) => {
            const x = xFor(index);
            const hit = Math.max((width - padding.left - padding.right) / months.length, 24);
            return (
              <g key={month} onMouseEnter={() => setActiveIndex(index)}>
                <rect fill="transparent" height={height - padding.top - padding.bottom} width={hit} x={x - hit / 2} y={padding.top} />
                {activeIndex === index ? (
                  <>
                    <line
                      className="stroke-slate-200 dark:stroke-gray-600"
                      strokeDasharray="3 3"
                      x1={x}
                      x2={x}
                      y1={padding.top}
                      y2={height - padding.bottom}
                    />
                    <circle className="fill-white stroke-indigo-600 dark:fill-gray-800" cx={x} cy={yFor(mrrSeries[index])} r="4" strokeWidth="2" />
                  </>
                ) : null}
              </g>
            );
          })}
        </svg>

        {active ? (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{
              left: `clamp(0.5rem, ${(active.index / (months.length - 1)) * 100}% - 60px, calc(100% - 130px))`,
            }}
          >
            <p className="font-semibold text-slate-800 dark:text-gray-100">{active.month}</p>
            <p className="mt-1 text-slate-600 dark:text-gray-400">{formatUsd(active.value)} MRR</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function NrrGauge() {
  const size = 200;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const center = size / 2;
  /** Gauge spans 90% → 140% mapped across 240° arc */
  const min = 90;
  const max = 140;
  const startAngle = 150;
  const sweep = 240;

  function valueToAngle(value: number) {
    const clamped = Math.min(max, Math.max(min, value));
    return startAngle + ((clamped - min) / (max - min)) * sweep;
  }

  function polar(angle: number, r = radius) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  }

  function arcPath(from: number, to: number) {
    const start = polar(from);
    const end = polar(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  }

  const valueAngle = valueToAngle(nrrValue);
  const targetAngle = valueToAngle(nrrTarget);
  const vsTarget = nrrValue - nrrTarget;
  const onTrack = nrrValue >= nrrTarget;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <div>
        <p className="text-sm text-slate-500 dark:text-gray-400">Net revenue retention</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-400">Target {nrrTarget}%</p>
      </div>

      <div className="relative mx-auto mt-4 grid place-items-center">
        <svg aria-hidden="true" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
          <path
            className="stroke-slate-100 dark:stroke-gray-700"
            d={arcPath(startAngle, startAngle + sweep)}
            fill="none"
            strokeLinecap="round"
            strokeWidth={stroke}
          />
          <path
            className={onTrack ? "stroke-emerald-500" : "stroke-indigo-500"}
            d={arcPath(startAngle, valueAngle)}
            fill="none"
            strokeLinecap="round"
            strokeWidth={stroke}
          />
          {/* Target marker */}
          <line
            className="stroke-slate-700 dark:stroke-gray-100"
            strokeLinecap="round"
            strokeWidth="2.5"
            x1={polar(targetAngle, radius - 10).x}
            x2={polar(targetAngle, radius + 10).x}
            y1={polar(targetAngle, radius - 10).y}
            y2={polar(targetAngle, radius + 10).y}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 text-center">
          <p className="text-[32px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">{nrrValue}%</p>
          <p className={`mt-1 text-xs font-semibold ${onTrack ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {vsTarget >= 0 ? "+" : ""}
            {vsTarget.toFixed(0)} pts vs target
          </p>
        </div>
      </div>

      <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-gray-700">
        <div>
          <dt className="text-xs text-slate-400 dark:text-gray-400">Expansion</dt>
          <dd className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">+24%</dd>
        </div>
        <div className="text-right">
          <dt className="text-xs text-slate-400 dark:text-gray-400">Churn & contraction</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-700 dark:text-gray-100">−6%</dd>
        </div>
      </dl>
    </article>
  );
}

function ProductLineSmallMultiples() {
  const chartW = 160;
  const chartH = 56;
  const pad = 2;

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800 sm:p-6 xl:col-span-3">
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
          Revenue by product line
        </h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">Small multiples · monthly contribution</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {productLines.map((line) => {
          const latest = line.values[line.values.length - 1];
          const first = line.values[0];
          const growth = ((latest - first) / first) * 100;
          const min = Math.min(...line.values);
          const max = Math.max(...line.values);
          const range = max - min || 1;
          const points = line.values
            .map((value, index) => {
              const x = pad + (index / (line.values.length - 1)) * (chartW - pad * 2);
              const y = chartH - pad - ((value - min) / range) * (chartH - pad * 2);
              return `${x},${y}`;
            })
            .join(" ");
          const share = (latest / mrrSeries[mrrSeries.length - 1]) * 100;

          return (
            <div
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-gray-700 dark:bg-gray-900/50"
              key={line.name}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{line.name}</p>
                  <p className="mt-1 text-lg font-bold tracking-[-0.03em] text-slate-900 dark:text-gray-100">
                    {formatUsd(latest)}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  +{growth.toFixed(0)}%
                </span>
              </div>

              <svg aria-hidden="true" className="mt-3 w-full" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
                <polyline
                  fill="none"
                  points={points}
                  stroke={line.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>

              <p className="mt-2 text-xs text-slate-400 dark:text-gray-400">{share.toFixed(0)}% of MRR</p>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export function RevenueAnalyticsSection() {
  return (
    <section aria-label="Revenue analytics" className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
          Revenue analytics
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
          MRR trend, net retention, and product-line mix for a mid-market B2B SaaS book
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-5">
        <div className="xl:col-span-2">
          <MrrLineChart />
        </div>
        <NrrGauge />
        <ProductLineSmallMultiples />
      </div>
    </section>
  );
}
