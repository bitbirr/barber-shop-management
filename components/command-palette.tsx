"use client";

import { useRouter } from "next/navigation";
import {
  ContactRound,
  FileText,
  History,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { navigation } from "@/components/crm-sidebar";

export type CommandCategory = "Page" | "Customer" | "Report" | "Recent action";

export type CommandItem = {
  id: string;
  label: string;
  detail: string;
  category: CommandCategory;
  href: string;
  icon: LucideIcon;
  keywords: string;
};

const commandItems: CommandItem[] = [
  ...navigation.map((item) => ({
    id: `page-${item.label}`,
    label: item.label,
    detail: "Open workspace page",
    category: "Page" as const,
    href: item.href,
    icon: item.icon,
    keywords: `page navigation ${item.label}`,
  })),
  {
    id: "customer-aperture",
    label: "Bole Fade House",
    detail: "Flagship shop · 4 open walk-ins",
    category: "Customer",
    href: "/customers#bole-fade-house",
    icon: ContactRound,
    keywords: "customer shop bole fade house addis",
  },
  {
    id: "customer-northstar",
    label: "Piassa Lineup",
    detail: "Growth shop · last active today",
    category: "Customer",
    href: "/customers#piassa-lineup",
    icon: ContactRound,
    keywords: "customer shop piassa lineup addis",
  },
  {
    id: "customer-lumen",
    label: "Merkato Kings",
    detail: "Busy floor · 2 memberships",
    category: "Customer",
    href: "/customers#merkato-kings",
    icon: ContactRound,
    keywords: "customer shop merkato kings",
  },
  {
    id: "report-revenue",
    label: "Monthly revenue report",
    detail: "Revenue, growth, and average ticket",
    category: "Report",
    href: "/analytics#revenue",
    icon: FileText,
    keywords: "report analytics monthly revenue growth",
  },
  {
    id: "report-pipeline",
    label: "Pipeline forecast",
    detail: "Weighted forecast by deal stage",
    category: "Report",
    href: "/pipeline#forecast",
    icon: FileText,
    keywords: "report pipeline forecast weighted sales",
  },
  {
    id: "report-retention",
    label: "Customer retention",
    detail: "Repeat rate and at-risk accounts",
    category: "Report",
    href: "/customers#retention",
    icon: FileText,
    keywords: "report customer retention repeat at risk",
  },
  {
    id: "action-deal",
    label: "Opened Bole membership pack",
    detail: "Today at 10:42 · 28,400 ETB",
    category: "Recent action",
    href: "/deals",
    icon: History,
    keywords: "recent action membership bole",
  },
  {
    id: "action-contact",
    label: "Updated Piassa walk-in",
    detail: "Yesterday at 16:18 · Hana Tesfaye",
    category: "Recent action",
    href: "/customers#piassa-lineup",
    icon: History,
    keywords: "recent action walk in piassa",
  },
  {
    id: "action-report",
    label: "Exported revenue report",
    detail: "Sep 1 at 09:12 · CSV",
    category: "Recent action",
    href: "/analytics#revenue",
    icon: History,
    keywords: "recent action exported revenue report csv",
  },
];

const defaultRecentIds = ["report-pipeline", "customer-aperture", "report-revenue"];
const recentSearchesKey = "bit-barber-command-palette-recents";
const categoryOrder: CommandCategory[] = ["Page", "Customer", "Report", "Recent action"];

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function matchesQuery(item: CommandItem, query: string) {
  return `${item.label} ${item.detail} ${item.category} ${item.keywords}`.toLowerCase().includes(query);
}

function groupByCategory(items: CommandItem[]) {
  return categoryOrder
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>(defaultRecentIds);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? commandItems.filter((item) => matchesQuery(item, normalizedQuery))
    : commandItems.slice(0, 8);
  const groupedItems = groupByCategory(filteredItems);
  const recentItems = recentIds
    .map((id) => commandItems.find((item) => item.id === id))
    .filter((item): item is CommandItem => Boolean(item));

  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    }

    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();

      const savedRecents = window.localStorage.getItem(recentSearchesKey);
      if (!savedRecents) return;

      try {
        const parsed = JSON.parse(savedRecents) as string[];
        setRecentIds(parsed.filter((id) => commandItems.some((item) => item.id === id)).slice(0, 4));
      } catch {
        window.localStorage.removeItem(recentSearchesKey);
      }
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  function close() {
    onOpenChange(false);
  }

  function openItem(item: CommandItem) {
    const nextRecentIds = [item.id, ...recentIds.filter((id) => id !== item.id)].slice(0, 4);
    setRecentIds(nextRecentIds);
    window.localStorage.setItem(recentSearchesKey, JSON.stringify(nextRecentIds));
    router.push(item.href);
    close();
  }

  function clearRecentSearches() {
    setRecentIds([]);
    window.localStorage.removeItem(recentSearchesKey);
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (filteredItems.length ? (current + 1) % filteredItems.length : 0));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        filteredItems.length ? (current - 1 + filteredItems.length) % filteredItems.length : 0,
      );
    }
    if (event.key === "Enter" && filteredItems[activeIndex]) {
      event.preventDefault();
      openItem(filteredItems[activeIndex]);
    }
    if (event.key === "Escape") close();
  }

  if (!open) return null;

  let optionIndex = -1;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]">
      <button
        aria-label="Close search"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={close}
        type="button"
      />

      <section
        aria-label="Search command palette"
        aria-modal="true"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-ink-900"
        role="dialog"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-white/[0.08]">
          <Search aria-hidden="true" className="size-5 shrink-0 text-slate-400 dark:text-white/35" />
          <label className="sr-only" htmlFor="command-search">
            Search pages, customers, reports, and recent actions
          </label>
          <input
            aria-activedescendant={
              filteredItems[activeIndex] ? `command-result-${filteredItems[activeIndex].id}` : undefined
            }
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded="true"
            aria-label="Search pages, customers, reports, and recent actions"
            autoComplete="off"
            className="h-14 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-white/30"
            id="command-search"
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search pages, customers, reports, actions..."
            ref={inputRef}
            role="combobox"
            type="search"
            value={query}
          />
          <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/35 sm:inline">
            esc
          </kbd>
          <button
            aria-label="Close command bar"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/[0.07] dark:hover:text-white"
            onClick={close}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        {!normalizedQuery && recentItems.length > 0 ? (
          <div className="border-b border-slate-100 px-4 py-3 dark:border-white/[0.08]">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/30">
                <History aria-hidden="true" className="size-3.5" />
                Recent searches
              </div>
              <button
                className="text-[10px] font-semibold text-slate-400 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-white/30 dark:hover:text-white/70"
                onClick={clearRecentSearches}
                type="button"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentItems.map((item) => (
                <button
                  className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/50 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  key={item.id}
                  onClick={() => openItem(item)}
                  type="button"
                >
                  <History aria-hidden="true" className="size-3 text-slate-400" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="max-h-[360px] overflow-y-auto p-2" id={listId} role="listbox">
          {normalizedQuery ? (
            groupedItems.map((group) => (
              <div key={group.category}>
                <div className="flex items-center justify-between px-3 pb-2 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/30">
                    {group.category === "Recent action" ? "Recent actions" : `${group.category}s`}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-white/25">{group.items.length}</span>
                </div>
                {group.items.map((item) => {
                  optionIndex += 1;
                  const index = optionIndex;
                  const Icon = item.icon;
                  const active = index === activeIndex;

                  return (
                    <button
                      aria-selected={active}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                        active
                          ? "bg-sky-50 text-sky-900 dark:bg-sky-400/10 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-white/60 dark:hover:bg-white/[0.06]"
                      }`}
                      id={`command-result-${item.id}`}
                      key={item.id}
                      onClick={() => openItem(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      role="option"
                      type="button"
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                          active
                            ? "bg-white text-sky-700 shadow-sm dark:bg-white/[0.08] dark:text-sky-300"
                            : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-white/45"
                        }`}
                      >
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{item.label}</span>
                        <span className="mt-0.5 block truncate text-[11px] text-slate-400 dark:text-white/30">
                          {item.detail}
                        </span>
                      </span>
                      <span className="rounded-md bg-white/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:bg-white/[0.05] dark:text-white/30">
                        {item.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center justify-between px-3 pb-2 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/30">
                  Suggested
                </p>
                <span className="text-[10px] text-slate-400 dark:text-white/25">{filteredItems.length} results</span>
              </div>
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const active = index === activeIndex;

                return (
                  <button
                    aria-selected={active}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                      active
                        ? "bg-sky-50 text-sky-900 dark:bg-sky-400/10 dark:text-white"
                        : "text-slate-600 hover:bg-slate-50 dark:text-white/60 dark:hover:bg-white/[0.06]"
                    }`}
                    id={`command-result-${item.id}`}
                    key={item.id}
                    onClick={() => openItem(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="option"
                    type="button"
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                        active
                          ? "bg-white text-sky-700 shadow-sm dark:bg-white/[0.08] dark:text-sky-300"
                          : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-white/45"
                      }`}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{item.label}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-slate-400 dark:text-white/30">
                        {item.detail}
                      </span>
                    </span>
                    <span className="rounded-md bg-white/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:bg-white/[0.05] dark:text-white/30">
                      {item.category}
                    </span>
                  </button>
                );
              })}
            </>
          )}

          {filteredItems.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Search aria-hidden="true" className="mx-auto size-5 text-slate-300 dark:text-white/20" />
              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-white/70">No matches found</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-white/30">
                Try a customer name, report, page, or activity.
              </p>
            </div>
          ) : null}
        </div>

        <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[10px] text-slate-400 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-white/30">
          <span>
            <kbd className="mr-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold dark:border-white/10 dark:bg-white/[0.05]">
              ↑↓
            </kbd>
            navigate
          </span>
          <span>
            <kbd className="mr-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold dark:border-white/10 dark:bg-white/[0.05]">
              ↵
            </kbd>
            open
          </span>
          <span>
            <kbd className="mr-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold dark:border-white/10 dark:bg-white/[0.05]">
              ⌘K
            </kbd>
            toggle
          </span>
          <span className="ml-auto">
            <kbd className="mr-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold dark:border-white/10 dark:bg-white/[0.05]">
              esc
            </kbd>
            close
          </span>
        </footer>
      </section>
    </div>
  );
}
