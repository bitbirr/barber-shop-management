"use client";

const totalCustomers = 8429;

const segments = [
  { label: "Starter", percent: 34, color: "#38bdf8", text: "#0f172a" },
  { label: "Professional", percent: 41, color: "#6366f1", text: "#f8fafc" },
  { label: "Enterprise", percent: 25, color: "#a855f7", text: "#f8fafc" },
] as const;

const size = 240;
const center = size / 2;
const outerRadius = 98;
const innerRadius = 62;
const labelRadius = (outerRadius + innerRadius) / 2;

function toRadians(degrees: number) {
  return ((degrees - 90) * Math.PI) / 180;
}

function polarToCartesian(radius: number, angleDegrees: number) {
  const angle = toRadians(angleDegrees);
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
}

function describeArc(startAngle: number, endAngle: number, radiusOuter: number, radiusInner: number) {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const startOuter = polarToCartesian(radiusOuter, startAngle);
  const endOuter = polarToCartesian(radiusOuter, endAngle);
  const startInner = polarToCartesian(radiusInner, endAngle);
  const endInner = polarToCartesian(radiusInner, startAngle);

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${radiusOuter} ${radiusOuter} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${radiusInner} ${radiusInner} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function PlanDistributionDonut() {
  let cursor = 0;
  const arcs = segments.map((segment) => {
    const startAngle = cursor;
    const endAngle = cursor + segment.percent * 3.6;
    const midAngle = (startAngle + endAngle) / 2;
    const labelPoint = polarToCartesian(labelRadius, midAngle);
    cursor = endAngle;

    return {
      ...segment,
      path: describeArc(startAngle, endAngle, outerRadius, innerRadius),
      labelPoint,
    };
  });

  return (
    <section
      aria-label="Plan distribution"
      className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800 sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
          Plan distribution
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">Share of customers by subscription tier</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative shrink-0">
          <svg
            aria-hidden="true"
            className="size-[240px]"
            role="img"
            viewBox={`0 0 ${size} ${size}`}
          >
            <title>Donut chart of plan distribution</title>
            {arcs.map((arc) => (
              <g key={arc.label}>
                <path className="stroke-white dark:stroke-gray-800" d={arc.path} fill={arc.color} strokeWidth="2" />
                <text
                  fill={arc.text}
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  x={arc.labelPoint.x}
                  y={arc.labelPoint.y + 4}
                >
                  {arc.percent}%
                </text>
              </g>
            ))}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-gray-400">
              Total
            </p>
            <p className="mt-0.5 text-2xl font-bold tracking-[-0.04em] text-slate-900 dark:text-gray-100">
              {formatCount(totalCustomers)}
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-400">customers</p>
          </div>
        </div>

        <ul className="w-full max-w-[220px] space-y-3">
          {segments.map((segment) => {
            const count = Math.round((totalCustomers * segment.percent) / 100);
            return (
              <li className="flex items-center justify-between gap-3" key={segment.label}>
                <span className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                  <span className="size-2.5 rounded-sm" style={{ backgroundColor: segment.color }} />
                  {segment.label}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-gray-100">
                  {segment.percent}%
                  <span className="ml-2 font-medium text-slate-400 dark:text-gray-400">
                    {formatCount(count)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="sr-only">
        Plan distribution: Starter 34%, Professional 41%, Enterprise 25%. Total customers {formatCount(totalCustomers)}.
      </p>
    </section>
  );
}
