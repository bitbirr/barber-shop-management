"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ActivityDto, ActivityType } from "@/lib/activity";

type TabKey = "all" | ActivityType;

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "comment", label: "Comments" },
  { key: "update", label: "Updates" },
  { key: "alert", label: "Alerts" },
];

const typeMeta: Record<
  ActivityType,
  { label: string; className: string; icon: typeof MessageSquareText }
> = {
  comment: {
    label: "Comment",
    className: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
    icon: MessageSquareText,
  },
  update: {
    label: "Update",
    className: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
    icon: Sparkles,
  },
  alert: {
    label: "Alert",
    className: "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300",
    icon: AlertTriangle,
  },
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatExact(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt=""
        className="size-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
        height={32}
        src={image}
        width={32}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="grid size-8 place-items-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-800 ring-2 ring-white dark:bg-sky-400/15 dark:text-sky-300 dark:ring-gray-800"
    >
      {initials(name) || "?"}
    </span>
  );
}

function ActivityRow({
  activity,
  expanded,
  onToggle,
}: {
  activity: ActivityDto;
  expanded: boolean;
  onToggle: () => void;
}) {
  const meta = typeMeta[activity.type];
  const Icon = meta.icon;
  const detailsId = `activity-details-${activity.id}`;

  return (
    <li className="border-b border-slate-100 last:border-b-0 dark:border-gray-700">
      <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
        <Avatar image={activity.actor.image} name={activity.actor.name} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.className}`}>
              <Icon aria-hidden="true" className="size-3" />
              {meta.label}
            </span>
            <time
              className="text-xs text-slate-400 dark:text-gray-400"
              dateTime={activity.timestamp}
              title={formatExact(activity.timestamp)}
            >
              {formatTimestamp(activity.timestamp)}
            </time>
          </div>

          <p className="mt-1.5 text-sm font-medium text-slate-800 dark:text-gray-100">
            {activity.action}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            {activity.resource.href && activity.resource.label ? (
              <Link
                className="text-sm font-semibold text-sky-700 underline-offset-2 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-300"
                href={activity.resource.href}
              >
                {activity.resource.label}
              </Link>
            ) : activity.resource.label ? (
              <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
                {activity.resource.label}
              </span>
            ) : null}

            <button
              aria-controls={detailsId}
              aria-expanded={expanded}
              className="inline-flex items-center gap-1 rounded-md text-xs font-semibold text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={onToggle}
              type="button"
            >
              {expanded ? "Hide details" : "Show details"}
              <ChevronDown
                aria-hidden="true"
                className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {expanded ? (
            <div
              className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm dark:border-gray-700 dark:bg-gray-900/50"
              id={detailsId}
            >
              {activity.details?.summary ? (
                <p className="text-slate-600 dark:text-gray-400">{activity.details.summary}</p>
              ) : null}
              {activity.details?.note ? (
                <p className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  “{activity.details.note}”
                </p>
              ) : null}
              {activity.details?.changes && activity.details.changes.length > 0 ? (
                <dl className="mt-3 space-y-2">
                  {activity.details.changes.map((change) => (
                    <div className="flex flex-wrap items-baseline gap-x-2" key={`${change.field}-${change.to}`}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-400">
                        {change.field}
                      </dt>
                      <dd className="text-slate-700 dark:text-gray-100">
                        {change.from ? (
                          <>
                            <span className="text-slate-400 line-through dark:text-gray-500">{change.from}</span>
                            <span className="mx-1.5 text-slate-300 dark:text-gray-600">→</span>
                          </>
                        ) : null}
                        <span className="font-medium">{change.to ?? "—"}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {(activity.details?.ipAddress || activity.details?.userAgent) && (
                <div className="mt-3 grid gap-1 text-xs text-slate-500 dark:text-gray-400">
                  {activity.details.ipAddress ? <p>IP · {activity.details.ipAddress}</p> : null}
                  {activity.details.userAgent ? <p>Client · {activity.details.userAgent}</p> : null}
                </div>
              )}
              {activity.details?.metadata ? (
                <dl className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {Object.entries(activity.details.metadata).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-400">
                        {key}
                      </dt>
                      <dd className="text-xs font-medium text-slate-700 dark:text-gray-100">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {!activity.details ? (
                <p className="text-slate-500 dark:text-gray-400">No additional details for this event.</p>
              ) : null}
              <p className="mt-3 text-[11px] text-slate-400 dark:text-gray-400">
                Logged {formatExact(activity.timestamp)}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function ActivityFeed({
  title = "Recent activity",
  description = "Comments, updates, and alerts across your workspace",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  const [tab, setTab] = useState<TabKey>("all");
  const [activities, setActivities] = useState<ActivityDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const fetchPage = useCallback(
    async (options: { cursor?: string | null; append?: boolean }) => {
      const params = new URLSearchParams({
        limit: compact ? "6" : "8",
        type: tab,
      });
      if (options.cursor) params.set("cursor", options.cursor);

      const response = await fetch(`/api/activity?${params.toString()}`, {
        credentials: "include",
      });
      const data = (await response.json()) as {
        activities?: ActivityDto[];
        nextCursor?: string | null;
        hasMore?: boolean;
        total?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to load activity");
      }

      setActivities((current) =>
        options.append ? [...current, ...(data.activities ?? [])] : (data.activities ?? []),
      );
      setNextCursor(data.nextCursor ?? null);
      setHasMore(Boolean(data.hasMore));
      setTotal(data.total ?? 0);
    },
    [compact, tab],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setExpanded(new Set());

    fetchPage({ append: false })
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load activity");
          setActivities([]);
          setHasMore(false);
          setNextCursor(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchPage]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      await fetchPage({ cursor: nextCursor, append: true });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }

  function toggleExpanded(id: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section
      aria-label={title}
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800"
    >
      <header className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 dark:border-gray-700 sm:flex-row sm:items-end sm:justify-between sm:px-5">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">{description}</p>
        </div>
        <p className="text-xs font-medium text-slate-400 dark:text-gray-400">
          {total} event{total === 1 ? "" : "s"}
        </p>
      </header>

      <div
        aria-label="Filter activity"
        className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 py-2 dark:border-gray-700 sm:px-4"
        role="tablist"
      >
        {tabs.map((item) => {
          const active = tab === item.key;
          return (
            <button
              aria-selected={active}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                active
                  ? "bg-sky-50 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              }`}
              key={item.key}
              onClick={() => setTab(item.key)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-slate-500 dark:text-gray-400">
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-sky-600" />
          Loading activity…
        </div>
      ) : error && activities.length === 0 ? (
        <div className="space-y-3 px-5 py-12 text-center">
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setLoading(true);
              fetchPage({ append: false })
                .catch((loadError) => {
                  setError(loadError instanceof Error ? loadError.message : "Failed to load activity");
                })
                .finally(() => setLoading(false));
            }}
            type="button"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            Retry
          </button>
        </div>
      ) : activities.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-gray-100">No activity yet</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-gray-400">
            Comments, updates, and alerts will show up here.
          </p>
        </div>
      ) : (
        <ul className="divide-y-0">{activities.map((activity) => (
          <ActivityRow
            activity={activity}
            expanded={expanded.has(activity.id)}
            key={activity.id}
            onToggle={() => toggleExpanded(activity.id)}
          />
        ))}
        </ul>
      )}

      {hasMore ? (
        <div className="border-t border-slate-100 px-4 py-3 dark:border-gray-700 sm:px-5">
          <button
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-wait disabled:opacity-70 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
            disabled={loadingMore}
            onClick={loadMore}
            type="button"
          >
            {loadingMore ? (
              <>
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-sky-600" />
                <span className="text-slate-500 dark:text-gray-400">Loading more…</span>
              </>
            ) : (
              "Load more"
            )}
          </button>
          {error && activities.length > 0 ? (
            <p className="mt-2 text-center text-xs text-rose-600 dark:text-rose-400">{error}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
