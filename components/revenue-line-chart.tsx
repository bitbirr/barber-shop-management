"use client";

import { useId, useMemo, useState } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

const currentYear = [8200, 9100, 8800, 10400, 11200, 12100, 11800, 13200, 14100, 13800, 15200, 16400];
const previousYear = [7100, 7600, 7900, 8200, 8900, 9400, 9800, 10200, 10900, 11400, 12100, 12800];

const width = 720;
const height = 280;
const padding = { top: 20, right: 20, bottom: 36, left: 52 };

function formatDollars(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return `$${value}`;
}

function formatExact(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildPath(values: number[], xFor: (i: number) => number, yFor: (v: number) => number) {
  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${xFor(index).toFixed(2)} ${yFor(value).toFixed(2)}`)
    .join(" ");
}

export function RevenueLineChart() {
  const gradientId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { yTicks, xFor, yFor, currentPath, previousPath } = useMemo(() => {
    const max = Math.max(...currentYear, ...previousYear);
    const niceMax = Math.ceil(max / 2000) * 2000;
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const x = (index: number) => padding.left + (index / (months.length - 1)) * plotWidth;
    const y = (value: number) => padding.top + plotHeight - (value / niceMax) * plotHeight;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(niceMax * ratio));

    return {
      yTicks: ticks,
      xFor: x,
      yFor: y,
      currentPath: buildPath(currentYear, x, y),
      previousPath: buildPath(previousYear, x, y),
    };
  }, []);

  const active = activeIndex === null ? null : {
    index: activeIndex,
    month: months[activeIndex],
    current: currentYear[activeIndex],
    previous: previousYear[activeIndex],
    change: ((currentYear[activeIndex] - previousYear[activeIndex]) / previousYear[activeIndex]) * 100,
  };

  return (
    <section
      aria-label="Revenue by month"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">Revenue</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">Monthly recurring revenue, Jan–Dec</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-0.5 w-4 rounded-full bg-indigo-500" />
            2026
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-4 border-t border-dashed border-slate-400" />
            2025
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          className="h-auto min-w-[560px] w-full"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <title>Revenue line chart comparing 2026 and 2025</title>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
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
                <text
                  className="fill-slate-400 text-[10px] dark:fill-gray-400"
                  textAnchor="end"
                  x={padding.left - 10}
                  y={y + 3}
                >
                  {formatDollars(tick)}
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
              y={height - 10}
            >
              {month}
            </text>
          ))}

          <path
            d={`${currentPath} L ${xFor(months.length - 1)} ${yFor(0)} L ${xFor(0)} ${yFor(0)} Z`}
            fill={`url(#${gradientId})`}
          />

          <path
            className="stroke-slate-400 dark:stroke-gray-500"
            d={previousPath}
            fill="none"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />

          <path
            className="stroke-indigo-500 dark:stroke-indigo-400"
            d={currentPath}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />

          {months.map((month, index) => {
            const x = xFor(index);
            const isActive = activeIndex === index;
            return (
              <g key={month} onMouseEnter={() => setActiveIndex(index)}>
                <rect
                  fill="transparent"
                  height={height - padding.top - padding.bottom}
                  width={Math.max((width - padding.left - padding.right) / months.length, 24)}
                  x={x - Math.max((width - padding.left - padding.right) / months.length, 24) / 2}
                  y={padding.top}
                />
                {isActive ? (
                  <>
                    <line
                      className="stroke-slate-200 dark:stroke-gray-600"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                      x1={x}
                      x2={x}
                      y1={padding.top}
                      y2={height - padding.bottom}
                    />
                    <circle
                      className="fill-white stroke-slate-400 dark:fill-gray-800 dark:stroke-gray-500"
                      cx={x}
                      cy={yFor(previousYear[index])}
                      r="3.5"
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                    />
                    <circle
                      className="fill-white stroke-indigo-500 dark:fill-gray-800"
                      cx={x}
                      cy={yFor(currentYear[index])}
                      r="4.5"
                      strokeWidth="2"
                    />
                  </>
                ) : null}
              </g>
            );
          })}
        </svg>

        {active ? (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[168px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800"
            style={{
              left: `clamp(0.5rem, ${(active.index / (months.length - 1)) * 100}% - 84px, calc(100% - 176px))`,
            }}
          >
            <p className="font-semibold text-slate-800 dark:text-gray-100">{active.month} 2026</p>
            <div className="mt-2 space-y-1.5">
              <p className="flex items-center justify-between gap-4 text-slate-600 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-indigo-500" />
                  Current
                </span>
                <span className="font-semibold text-slate-900 dark:text-gray-100">{formatExact(active.current)}</span>
              </p>
              <p className="flex items-center justify-between gap-4 text-slate-600 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-px w-2.5 border-t border-dashed border-slate-400" />
                  Previous
                </span>
                <span className="font-semibold text-slate-900 dark:text-gray-100">{formatExact(active.previous)}</span>
              </p>
            </div>
            <p
              className={`mt-2 border-t border-slate-100 pt-2 font-semibold dark:border-gray-700 ${
                active.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {active.change >= 0 ? "+" : ""}
              {active.change.toFixed(1)}% vs prior year
            </p>
          </div>
        ) : null}
      </div>

      <p className="sr-only">
        Line chart of monthly revenue for 2026 versus 2025. Peak current-year revenue is {formatExact(Math.max(...currentYear))} in December.
      </p>
    </section>
  );
}
