"use client";

const features = ["Reports", "Automation", "API", "Integrations"] as const;

const segments = [
  { key: "free", label: "Free", color: "#38bdf8" },
  { key: "pro", label: "Pro", color: "#3b82f6" },
  { key: "enterprise", label: "Enterprise", color: "#a855f7" },
] as const;

const usage: Record<(typeof features)[number], { free: number; pro: number; enterprise: number }> = {
  Reports: { free: 42, pro: 78, enterprise: 94 },
  Automation: { free: 18, pro: 65, enterprise: 88 },
  API: { free: 12, pro: 54, enterprise: 91 },
  Integrations: { free: 27, pro: 71, enterprise: 86 },
};

const width = 640;
const height = 280;
const padding = { top: 16, right: 56, bottom: 28, left: 108 };
const maxValue = 100;

function formatValue(value: number) {
  return `${value}%`;
}

export function FeatureUsageBarChart() {
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const groupHeight = plotHeight / features.length;
  const barHeight = Math.min(14, (groupHeight - 16) / segments.length);
  const groupGap = (groupHeight - barHeight * segments.length) / 2;

  const xTicks = [0, 25, 50, 75, 100];

  return (
    <section
      aria-label="Feature usage by segment"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
            Feature usage
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
            Adoption rate by customer segment
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-gray-400">
          {segments.map((segment) => (
            <span className="inline-flex items-center gap-2" key={segment.key}>
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg className="h-auto min-w-[520px] w-full" role="img" viewBox={`0 0 ${width} ${height}`}>
          <title>Grouped bar chart of feature usage across Free, Pro, and Enterprise</title>

          {xTicks.map((tick) => {
            const x = padding.left + (tick / maxValue) * plotWidth;
            return (
              <g key={tick}>
                <line
                  className="stroke-slate-100 dark:stroke-gray-700"
                  strokeWidth="1"
                  x1={x}
                  x2={x}
                  y1={padding.top}
                  y2={height - padding.bottom}
                />
                <text
                  className="fill-slate-400 text-[10px] dark:fill-gray-400"
                  textAnchor="middle"
                  x={x}
                  y={height - 8}
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {features.map((feature, featureIndex) => {
            const groupY = padding.top + featureIndex * groupHeight;
            const values = usage[feature];

            return (
              <g key={feature}>
                <text
                  className="fill-slate-600 text-[12px] font-medium dark:fill-gray-100"
                  dominantBaseline="middle"
                  textAnchor="end"
                  x={padding.left - 14}
                  y={groupY + groupHeight / 2}
                >
                  {feature}
                </text>

                {segments.map((segment, segmentIndex) => {
                  const value = values[segment.key];
                  const barWidth = (value / maxValue) * plotWidth;
                  const y = groupY + groupGap + segmentIndex * barHeight;
                  const x = padding.left;

                  return (
                    <g key={segment.key}>
                      <rect
                        fill={segment.color}
                        height={barHeight - 2}
                        rx="3"
                        width={Math.max(barWidth, 2)}
                        x={x}
                        y={y}
                      />
                      <text
                        className="fill-slate-600 text-[10px] font-semibold dark:fill-gray-100"
                        dominantBaseline="middle"
                        x={x + barWidth + 8}
                        y={y + (barHeight - 2) / 2}
                      >
                        {formatValue(value)}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="sr-only">
        Feature usage comparison. Reports: Free 42%, Pro 78%, Enterprise 94%. Automation: Free 18%, Pro 65%,
        Enterprise 88%. API: Free 12%, Pro 54%, Enterprise 91%. Integrations: Free 27%, Pro 71%, Enterprise 86%.
      </p>
    </section>
  );
}
