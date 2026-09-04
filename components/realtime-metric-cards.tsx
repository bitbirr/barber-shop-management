"use client";

import { useEffect, useState } from "react";

type LiveMetric = {
  id: string;
  label: string;
  format: (value: number) => string;
  live?: boolean;
};

const metrics: LiveMetric[] = [
  {
    id: "sessions",
    label: "Active Sessions",
    live: true,
    format: (value) => new Intl.NumberFormat("en-US").format(Math.round(value)),
  },
  {
    id: "response",
    label: "Server Response Time",
    format: (value) => `${Math.round(value)}ms`,
  },
  {
    id: "errors",
    label: "Error Rate",
    format: (value) => `${value.toFixed(1)}%`,
  },
  {
    id: "uptime",
    label: "Uptime",
    format: (value) => `${value.toFixed(2)}%`,
  },
];

const initialValues: Record<string, number> = {
  sessions: 1247,
  response: 142,
  errors: 0.3,
  uptime: 99.97,
};

function jitter(value: number, id: string) {
  switch (id) {
    case "sessions":
      return Math.max(1100, value + Math.round((Math.random() - 0.45) * 28));
    case "response":
      return Math.max(95, Math.min(210, value + (Math.random() - 0.5) * 18));
    case "errors":
      return Math.max(0.1, Math.min(0.9, value + (Math.random() - 0.5) * 0.12));
    case "uptime":
      return Math.min(100, Math.max(99.9, value + (Math.random() - 0.5) * 0.02));
    default:
      return value;
  }
}

export function RealtimeMetricCards() {
  const [values, setValues] = useState(initialValues);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setValues((current) => {
        const next = { ...current };
        for (const metric of metrics) {
          next[metric.id] = jitter(current[metric.id], metric.id);
        }
        return next;
      });
      setFlash(true);
      window.setTimeout(() => setFlash(false), 480);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section aria-label="Real-time system metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800"
          key={metric.id}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-gray-400">{metric.label}</p>
            {metric.live ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            ) : null}
          </div>

          <p
            className={`mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900 transition duration-500 ease-out dark:text-gray-100 ${
              flash ? "translate-y-0.5 opacity-55" : "translate-y-0 opacity-100"
            }`}
          >
            {metric.format(values[metric.id])}
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-gray-400">Updates every 5 seconds</p>
        </article>
      ))}
    </section>
  );
}
