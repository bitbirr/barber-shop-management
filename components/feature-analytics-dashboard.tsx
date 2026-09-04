"use client";

import { ArrowDownRight, ArrowUpRight, Download, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

type Trend = "up" | "down";

type FeatureRow = {
  id: string;
  name: string;
  category: string;
  adoptionRate: number;
  dauSeries: number[];
  revenueImpact: number;
  revenueTrend: Trend;
  revenueChangePct: number;
};

const features: FeatureRow[] = [
  {
    id: "bookings",
    name: "Online booking",
    category: "Core",
    adoptionRate: 92,
    dauSeries: [820, 860, 840, 910, 980, 1020, 990, 1080, 1120, 1180, 1210, 1260],
    revenueImpact: 48200,
    revenueTrend: "up",
    revenueChangePct: 12.4,
  },
  {
    id: "payments",
    name: "Telebirr checkout",
    category: "Payments",
    adoptionRate: 78,
    dauSeries: [410, 430, 420, 460, 490, 510, 505, 540, 560, 580, 610, 640],
    revenueImpact: 36100,
    revenueTrend: "up",
    revenueChangePct: 9.8,
  },
  {
    id: "sms",
    name: "SMS reminders",
    category: "Engagement",
    adoptionRate: 71,
    dauSeries: [520, 500, 540, 560, 550, 580, 600, 590, 620, 640, 630, 660],
    revenueImpact: 18400,
    revenueTrend: "up",
    revenueChangePct: 4.2,
  },
  {
    id: "analytics",
    name: "Floor analytics",
    category: "Insights",
    adoptionRate: 64,
    dauSeries: [180, 190, 210, 200, 230, 250, 240, 270, 290, 310, 300, 330],
    revenueImpact: 22100,
    revenueTrend: "up",
    revenueChangePct: 7.1,
  },
  {
    id: "loyalty",
    name: "Loyalty stamps",
    category: "Engagement",
    adoptionRate: 48,
    dauSeries: [260, 250, 240, 255, 245, 230, 220, 235, 210, 200, 190, 185],
    revenueImpact: 9600,
    revenueTrend: "down",
    revenueChangePct: 3.6,
  },
  {
    id: "inventory",
    name: "Product inventory",
    category: "Ops",
    adoptionRate: 39,
    dauSeries: [90, 95, 100, 98, 110, 120, 115, 130, 140, 135, 150, 160],
    revenueImpact: 12800,
    revenueTrend: "up",
    revenueChangePct: 5.5,
  },
  {
    id: "api",
    name: "Public API",
    category: "Platform",
    adoptionRate: 27,
    dauSeries: [40, 42, 45, 44, 48, 52, 50, 55, 58, 60, 62, 65],
    revenueImpact: 15400,
    revenueTrend: "up",
    revenueChangePct: 11.2,
  },
  {
    id: "automations",
    name: "Workflow automations",
    category: "Ops",
    adoptionRate: 55,
    dauSeries: [140, 150, 145, 160, 170, 165, 180, 190, 185, 200, 210, 220],
    revenueImpact: 17300,
    revenueTrend: "up",
    revenueChangePct: 6.4,
  },
  {
    id: "reviews",
    name: "Review requests",
    category: "Engagement",
    adoptionRate: 33,
    dauSeries: [120, 115, 118, 110, 105, 100, 98, 95, 90, 88, 85, 80],
    revenueImpact: 4200,
    revenueTrend: "down",
    revenueChangePct: 2.1,
  },
  {
    id: "staff",
    name: "Staff scheduling",
    category: "Core",
    adoptionRate: 86,
    dauSeries: [300, 310, 305, 320, 340, 350, 345, 360, 370, 380, 390, 400],
    revenueImpact: 29800,
    revenueTrend: "up",
    revenueChangePct: 8.0,
  },
];

type AdoptionFilter = "all" | "high" | "medium" | "low";
type TrendFilter = "all" | Trend;
type CategoryFilter = "all" | string;

function latestDau(series: number[]) {
  return series[series.length - 1] ?? 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function Sparkline({ values, trend }: { values: number[]; trend: Trend }) {
  const width = 108;
  const height = 28;
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
  const stroke = trend === "up" ? "#34d399" : "#fb7185";
  const fill = trend === "up" ? "rgba(52,211,153,0.18)" : "rgba(251,113,133,0.16)";
  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg aria-hidden="true" className="shrink-0" fill="none" height={height} viewBox={`0 0 ${width} ${height}`} width={width}>
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

function AdoptionBar({ value }: { value: number }) {
  return (
    <div className="min-w-[140px] max-w-[200px]">
      <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-800 dark:text-gray-100">{value}%</span>
        <span className="text-slate-400 dark:text-gray-400">adopted</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all ${
            value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-sky-500" : "bg-amber-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function matchesAdoption(value: number, filter: AdoptionFilter) {
  if (filter === "all") return true;
  if (filter === "high") return value >= 70;
  if (filter === "medium") return value >= 40 && value < 70;
  return value < 40;
}

function exportCsv(rows: FeatureRow[]) {
  const csv = [
    ["Feature Name", "Category", "Adoption Rate %", "Daily Active Users", "Revenue Impact", "Trend %"],
    ...rows.map((row) => [
      row.name,
      row.category,
      String(row.adoptionRate),
      String(latestDau(row.dauSeries)),
      String(row.revenueImpact),
      `${row.revenueTrend === "up" ? "+" : "-"}${row.revenueChangePct}`,
    ]),
  ]
    .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "feature-analytics.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

const filterControlClass =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100";

export function FeatureAnalyticsDashboard() {
  const [nameQuery, setNameQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [adoption, setAdoption] = useState<AdoptionFilter>("all");
  const [trend, setTrend] = useState<TrendFilter>("all");
  const [minDau, setMinDau] = useState("");
  const [minRevenue, setMinRevenue] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(features.map((row) => row.category))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const dauFloor = minDau.trim() === "" ? null : Number(minDau);
    const revenueFloor = minRevenue.trim() === "" ? null : Number(minRevenue);

    return features.filter((row) => {
      if (nameQuery.trim() && !row.name.toLowerCase().includes(nameQuery.trim().toLowerCase())) {
        return false;
      }
      if (category !== "all" && row.category !== category) return false;
      if (!matchesAdoption(row.adoptionRate, adoption)) return false;
      if (trend !== "all" && row.revenueTrend !== trend) return false;
      if (dauFloor != null && !Number.isNaN(dauFloor) && latestDau(row.dauSeries) < dauFloor) {
        return false;
      }
      if (revenueFloor != null && !Number.isNaN(revenueFloor) && row.revenueImpact < revenueFloor) {
        return false;
      }
      return true;
    });
  }, [nameQuery, category, adoption, trend, minDau, minRevenue]);

  const summary = useMemo(() => {
    if (filtered.length === 0) {
      return {
        features: 0,
        avgAdoption: 0,
        totalDau: 0,
        totalRevenue: 0,
      };
    }
    const totalAdoption = filtered.reduce((sum, row) => sum + row.adoptionRate, 0);
    const totalDau = filtered.reduce((sum, row) => sum + latestDau(row.dauSeries), 0);
    const totalRevenue = filtered.reduce((sum, row) => sum + row.revenueImpact, 0);
    return {
      features: filtered.length,
      avgAdoption: Math.round(totalAdoption / filtered.length),
      totalDau,
      totalRevenue,
    };
  }, [filtered]);

  const hasActiveFilters =
    nameQuery.trim() !== "" ||
    category !== "all" ||
    adoption !== "all" ||
    trend !== "all" ||
    minDau.trim() !== "" ||
    minRevenue.trim() !== "";

  function clearFilters() {
    setNameQuery("");
    setCategory("all");
    setAdoption("all");
    setTrend("all");
    setMinDau("");
    setMinRevenue("");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-slate-500 dark:text-gray-400">Features</p>
          <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
            {summary.features}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-gray-400">in current filter</p>
        </article>
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-slate-500 dark:text-gray-400">Avg adoption rate</p>
          <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
            {summary.avgAdoption}%
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-700">
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${summary.avgAdoption}%` }} />
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-slate-500 dark:text-gray-400">Daily active users</p>
          <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
            {formatNumber(summary.totalDau)}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-gray-400">sum of latest DAU</p>
        </article>
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-slate-500 dark:text-gray-400">Revenue impact</p>
          <p className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
            {formatCurrency(summary.totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-gray-400">total attributed MRR</p>
        </article>
      </div>

      <section
        aria-label="Feature analytics table"
        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800"
      >
        <header className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 dark:border-gray-700 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
              Feature performance
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
              Adoption, daily actives, and revenue impact with inline charts
            </p>
          </div>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            onClick={() => exportCsv(filtered)}
            type="button"
          >
            <Download aria-hidden="true" className="size-4" />
            Export CSV
          </button>
        </header>

        <div className="border-b border-slate-100 px-5 py-3 dark:border-gray-700 sm:px-6">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-gray-400">
              Column filters
            </p>
            {hasActiveFilters ? (
              <button
                className="inline-flex items-center gap-1 rounded-md text-xs font-semibold text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-gray-400 dark:hover:text-gray-100"
                onClick={clearFilters}
                type="button"
              >
                <X aria-hidden="true" className="size-3.5" />
                Clear
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
            <label className="block xl:col-span-2">
              <span className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-gray-400">
                Feature name
              </span>
              <span className="relative block">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400"
                />
                <input
                  className={`${filterControlClass} pl-8`}
                  onChange={(event) => setNameQuery(event.target.value)}
                  placeholder="Search features"
                  value={nameQuery}
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-gray-400">
                Category
              </span>
              <select
                className={filterControlClass}
                onChange={(event) => setCategory(event.target.value as CategoryFilter)}
                value={category}
              >
                <option value="all">All</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-gray-400">
                Adoption rate
              </span>
              <select
                className={filterControlClass}
                onChange={(event) => setAdoption(event.target.value as AdoptionFilter)}
                value={adoption}
              >
                <option value="all">All</option>
                <option value="high">High (≥70%)</option>
                <option value="medium">Medium (40–69%)</option>
                <option value="low">Low (&lt;40%)</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-gray-400">
                Min DAU
              </span>
              <input
                className={filterControlClass}
                inputMode="numeric"
                min={0}
                onChange={(event) => setMinDau(event.target.value)}
                placeholder="e.g. 200"
                type="number"
                value={minDau}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-gray-400">
                Revenue trend
              </span>
              <select
                className={filterControlClass}
                onChange={(event) => setTrend(event.target.value as TrendFilter)}
                value={trend}
              >
                <option value="all">All</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
              </select>
            </label>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:max-w-xs">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-gray-400">
                Min revenue impact
              </span>
              <input
                className={filterControlClass}
                inputMode="numeric"
                min={0}
                onChange={(event) => setMinRevenue(event.target.value)}
                placeholder="e.g. 10000"
                type="number"
                value={minRevenue}
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:border-gray-700 dark:text-gray-400">
                <th className="px-5 py-3 sm:px-6">Feature Name</th>
                <th className="px-4 py-3">Adoption Rate</th>
                <th className="px-4 py-3">Daily Active Users</th>
                <th className="px-5 py-3 text-right sm:px-6">Revenue Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-5 py-12 text-center text-sm text-slate-500 dark:text-gray-400 sm:px-6" colSpan={4}>
                    No features match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const dau = latestDau(row.dauSeries);
                  const TrendIcon = row.revenueTrend === "up" ? ArrowUpRight : ArrowDownRight;
                  return (
                    <tr
                      className="transition hover:bg-sky-50/40 dark:hover:bg-gray-700/40"
                      key={row.id}
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{row.name}</p>
                        <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-400">{row.category}</p>
                      </td>
                      <td className="px-4 py-4">
                        <AdoptionBar value={row.adoptionRate} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Sparkline
                            trend={
                              row.dauSeries[row.dauSeries.length - 1] >= row.dauSeries[0]
                                ? "up"
                                : "down"
                            }
                            values={row.dauSeries}
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">
                              {formatNumber(dau)}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-gray-400">12-day sparkline</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right sm:px-6">
                        <p className="text-sm font-semibold text-slate-900 dark:text-gray-100">
                          {formatCurrency(row.revenueImpact)}
                        </p>
                        <p
                          className={`mt-1 inline-flex items-center justify-end gap-0.5 text-xs font-semibold ${
                            row.revenueTrend === "up"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          <TrendIcon aria-hidden="true" className="size-3.5" />
                          {row.revenueTrend === "up" ? "+" : "−"}
                          {row.revenueChangePct}%
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
