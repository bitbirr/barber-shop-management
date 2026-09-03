"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleDollarSign,
  Clock3,
  ContactRound,
  FileText,
  Handshake,
  History,
  Kanban,
  LayoutDashboard,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  UsersRound,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const navigationSections = [
  { label: "Workspace", items: [{ label: "Overview", icon: LayoutDashboard, href: "/dashboard" }] },
  {
    label: "Sales",
    items: [
      { label: "Pipeline", icon: Kanban, href: "/pipeline", badge: 8 },
      { label: "Contacts", icon: ContactRound, href: "/customers", badge: 3 },
      { label: "Deals", icon: Handshake, href: "/deals" },
    ],
  },
  { label: "Insights", items: [{ label: "Reports", icon: ChartNoAxesCombined, href: "/analytics" }] },
  { label: "Manage", items: [{ label: "Settings", icon: Settings, href: "/settings" }] },
];

const navigation = navigationSections.flatMap((section) => section.items);
const mobileNavigation = navigation.filter((item) => item.label !== "Settings");

type CommandItem = {
  id: string;
  label: string;
  detail: string;
  category: "Page" | "Customer" | "Report" | "Recent action";
  href: string;
  icon: typeof Search;
  keywords: string;
};

const commandItems: CommandItem[] = [
  ...navigation.map((item) => ({ id: `page-${item.label}`, label: item.label, detail: "Open workspace page", category: "Page" as const, href: item.href, icon: item.icon, keywords: `page navigation ${item.label}` })),
  { id: "customer-aperture", label: "Bole Fade House", detail: "Flagship shop · 4 open walk-ins", category: "Customer", href: "/customers#bole-fade-house", icon: ContactRound, keywords: "customer shop bole fade house addis" },
  { id: "customer-northstar", label: "Piassa Lineup", detail: "Growth shop · last active today", category: "Customer", href: "/customers#piassa-lineup", icon: ContactRound, keywords: "customer shop piassa lineup addis" },
  { id: "customer-lumen", label: "Merkato Kings", detail: "Busy floor · 2 memberships", category: "Customer", href: "/customers#merkato-kings", icon: ContactRound, keywords: "customer shop merkato kings" },
  { id: "report-revenue", label: "Monthly revenue report", detail: "Revenue, growth, and average ticket", category: "Report", href: "/analytics#revenue", icon: FileText, keywords: "report analytics monthly revenue growth" },
  { id: "report-pipeline", label: "Pipeline forecast", detail: "Weighted forecast by deal stage", category: "Report", href: "/pipeline#forecast", icon: FileText, keywords: "report pipeline forecast weighted sales" },
  { id: "report-retention", label: "Customer retention", detail: "Repeat rate and at-risk accounts", category: "Report", href: "/customers#retention", icon: FileText, keywords: "report customer retention repeat at risk" },
  { id: "action-deal", label: "Opened Bole membership pack", detail: "Today at 10:42 · 28,400 ETB", category: "Recent action", href: "/deals", icon: History, keywords: "recent action membership bole" },
  { id: "action-contact", label: "Updated Piassa walk-in", detail: "Yesterday at 16:18 · Hana Tesfaye", category: "Recent action", href: "/customers#piassa-lineup", icon: History, keywords: "recent action walk in piassa" },
  { id: "action-report", label: "Exported revenue report", detail: "Sep 1 at 09:12 · CSV", category: "Recent action", href: "/analytics#revenue", icon: History, keywords: "recent action exported revenue report csv" },
];

const defaultRecentIds = ["report-pipeline", "customer-aperture", "report-revenue"];
const recentSearchesKey = "bit-barber-command-palette-recents";

const pageTabs: Record<string, string[]> = {
  dashboard: ["Overview", "Activity", "Reports"],
  pipeline: ["Board", "Forecast", "Activity"],
  deals: ["All deals", "Open", "Won", "Lost"],
  analytics: ["Overview", "Revenue", "Services", "Team performance"],
  customers: ["All customers", "Segments", "Retention"],
  settings: ["General", "Team", "Notifications", "Security"],
  billing: ["Subscription", "Usage", "Invoices", "Payment methods"],
};

const appointments = [
  { time: "09:00", name: "Dawit Mekonnen", service: "Skin fade + beard", barber: "Yonas", duration: "55 min", status: "Checked in", initials: "DM", tone: "bg-sky-100 text-sky-700" },
  { time: "10:15", name: "Hana Tesfaye", service: "Classic haircut", barber: "Kidus", duration: "35 min", status: "Confirmed", initials: "HT", tone: "bg-violet-100 text-violet-700" },
  { time: "11:00", name: "Abel Tadesse", service: "Buzz cut", barber: "Yonas", duration: "25 min", status: "Confirmed", initials: "AT", tone: "bg-amber-100 text-amber-700" },
  { time: "12:30", name: "Nahom Wolde", service: "Full grooming", barber: "Meklit", duration: "75 min", status: "Pending", initials: "NW", tone: "bg-rose-100 text-rose-700" },
];

const team = [
  { name: "Yonas Haile", role: "Senior barber", bookings: 6, initials: "YH", tone: "bg-sky-100 text-sky-700" },
  { name: "Kidus Bekele", role: "Barber", bookings: 4, initials: "KB", tone: "bg-blue-100 text-blue-700" },
  { name: "Meklit Assefa", role: "Barber", bookings: 2, initials: "MA", tone: "bg-orange-100 text-orange-700" },
];

function Sidebar({
  collapsed,
  toggleCollapsed,
  darkMode,
  toggleDarkMode,
}: {
  collapsed: boolean;
  toggleCollapsed: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const pathname = usePathname();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState("Bole Fade House");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ Workspace: true, Sales: true, Insights: true, Manage: true });

  return (
      <aside
        className={`plume-sidebar fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-sky-100 bg-ink-900 text-white shadow-card transition-[width] duration-200 motion-reduce:transition-none lg:flex ${collapsed ? "w-[76px]" : "w-[240px]"}`}
      >
        <div className={`flex h-20 items-center px-5 ${collapsed ? "justify-center px-0" : "justify-between"}`}>
          <a className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" href="/dashboard" title="Bit-Barber System">
            <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-coral-400 text-white shadow-soft">
              <Sparkles aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
            </span>
            <span className={collapsed ? "hidden" : ""}>
              <span className="block text-[17px] font-semibold tracking-[-0.02em]">Bit-Barber</span>
              <span className="block text-[10px] font-800 uppercase tracking-[0.16em] text-sky-200/70">Shop system</span>
            </span>
          </a>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className="absolute -right-3 top-[68px] grid size-7 place-items-center rounded-full border border-white/10 bg-ink-800 text-white/55 shadow-md transition hover:bg-sky-400 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            onClick={toggleCollapsed}
            type="button"
          >
            {collapsed ? <ChevronsRight aria-hidden="true" className="size-3.5" /> : <ChevronsLeft aria-hidden="true" className="size-3.5" />}
          </button>
        </div>

        <div className="relative px-3">
          <button
            aria-expanded={workspaceMenuOpen}
            aria-haspopup="menu"
            className={`flex h-12 w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-left transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${collapsed ? "justify-center px-0" : ""}`}
            onClick={() => setWorkspaceMenuOpen((current) => !current)}
            title={collapsed ? activeWorkspace : undefined}
            type="button"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.07] text-white/70"><Building2 aria-hidden="true" className="size-4" /></span>
            <span className={`min-w-0 flex-1 ${collapsed ? "hidden" : ""}`}>
              <span className="block truncate text-xs font-semibold text-white">{activeWorkspace}</span>
              <span className="block truncate text-[10px] text-white/35">Company workspace</span>
            </span>
            <ChevronDown aria-hidden="true" className={`size-4 text-white/35 transition-transform ${workspaceMenuOpen ? "rotate-180" : ""} ${collapsed ? "hidden" : ""}`} />
          </button>

          {workspaceMenuOpen && (
            <div
              aria-label="Switch workspace"
              className={`absolute z-50 mt-2 w-52 rounded-xl border border-white/10 bg-ink-800 p-1.5 shadow-2xl ${collapsed ? "left-[68px] top-0 mt-0" : "left-3"}`}
              onKeyDown={(event) => event.key === "Escape" && setWorkspaceMenuOpen(false)}
              role="menu"
            >
              <p className="px-2.5 pb-1.5 pt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">Your workspaces</p>
              {["Bole Fade House", "Piassa Lineup", "Merkato Kings"].map((workspaceName) => (
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-xs text-white/65 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  key={workspaceName}
                  onClick={() => {
                    setActiveWorkspace(workspaceName);
                    setWorkspaceMenuOpen(false);
                  }}
                  role="menuitem"
                  type="button"
                >
                  <span className="grid size-7 place-items-center rounded-md bg-white/[0.07] text-white/55"><Building2 aria-hidden="true" className="size-3.5" /></span>
                  <span className="flex-1">{workspaceName}</span>
                  {activeWorkspace === workspaceName && <span aria-label="Selected" className="size-1.5 rounded-full bg-sky-400" />}
                </button>
              ))}
              <div className="my-1 h-px bg-white/[0.07]" />
              <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-sky-300 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" role="menuitem" type="button">
                <Plus aria-hidden="true" className="size-3.5" /> Create workspace
              </button>
            </div>
          )}
        </div>

        <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 pb-4 pt-5">
          <div className="space-y-4">
            {navigationSections.map((section) => {
              const sectionOpen = openSections[section.label];
              return (
                <section key={section.label}>
                  {collapsed ? <div className="mx-3 mb-2 h-px bg-white/[0.07]" /> : (
                    <button
                      aria-expanded={sectionOpen}
                      className="mb-1.5 flex h-7 w-full items-center justify-between rounded-lg px-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/30 transition hover:bg-white/[0.04] hover:text-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                      onClick={() => setOpenSections((current) => ({ ...current, [section.label]: !current[section.label] }))}
                      type="button"
                    >
                      {section.label}
                      <ChevronDown aria-hidden="true" className={`size-3.5 transition-transform ${sectionOpen ? "" : "-rotate-90"}`} />
                    </button>
                  )}
                  {(collapsed || sectionOpen) && (
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                          <li key={item.label}>
                            <Link
                              aria-current={active ? "page" : undefined}
                              className={`group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${collapsed ? "justify-center px-0" : ""} ${active ? "bg-white/[0.09] text-white shadow-sm" : "text-white/55 hover:bg-white/[0.06] hover:text-white"}`}
                              href={item.href}
                              title={collapsed ? item.label : undefined}
                            >
                              <Icon aria-hidden="true" className={`size-[18px] shrink-0 ${active ? "text-sky-400" : "text-white/40 group-hover:text-white/80"}`} strokeWidth={1.8} />
                              <span className={collapsed ? "sr-only" : ""}>{item.label}</span>
                              {"badge" in item && item.badge && <span className={`${collapsed ? "absolute ml-5 -mt-6 min-w-4 px-1 text-[8px]" : "ml-auto min-w-5 px-1.5 text-[10px]"} inline-flex h-5 items-center justify-center rounded-full bg-sky-400 font-bold text-ink-900`}>{item.badge}</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/[0.07] p-3">
          <button
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={darkMode}
            className={`mb-2 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${collapsed ? "justify-center px-0" : ""}`}
            onClick={toggleDarkMode}
            title={collapsed ? (darkMode ? "Light mode" : "Dark mode") : undefined}
            type="button"
          >
            {darkMode ? <Sun aria-hidden="true" className="size-[18px] shrink-0 text-amber-300" /> : <Moon aria-hidden="true" className="size-[18px] shrink-0 text-white/45" />}
            <span className={collapsed ? "sr-only" : ""}>{darkMode ? "Light mode" : "Dark mode"}</span>
            <span className={`ml-auto h-5 w-9 rounded-full p-0.5 transition-colors ${darkMode ? "bg-sky-400" : "bg-white/15"} ${collapsed ? "hidden" : ""}`} aria-hidden="true">
              <span className={`block size-4 rounded-full bg-white shadow-sm transition-transform ${darkMode ? "translate-x-4" : "translate-x-0"}`} />
            </span>
          </button>

          <button
            aria-label="Open account menu for Dawit Bekele, Owner"
            className={`flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-left transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${collapsed ? "justify-center border-transparent bg-transparent p-1" : ""}`}
            title={collapsed ? "Dawit Bekele · Owner" : undefined}
            type="button"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-400/15 text-xs font-bold text-sky-300">DB</span>
            <span className={`min-w-0 flex-1 ${collapsed ? "hidden" : ""}`}>
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-white">Dawit Bekele</span>
                <span className="rounded-md bg-sky-400/12 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-300">Owner</span>
              </span>
              <span className="block truncate text-[11px] text-white/40">dawit@bolefade.et</span>
            </span>
            <ChevronDown aria-hidden="true" className={`size-4 shrink-0 text-white/35 ${collapsed ? "hidden" : ""}`} />
          </button>
        </div>
      </aside>
  );
}

function MetricCard({ label, value, change, direction, icon: Icon }: { label: string; value: string; change: string; direction: "up" | "down"; icon: typeof CalendarDays }) {
  return (
    <article className="col-span-12 rounded-4xl border border-sky-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors dark:border-white/[0.08] dark:bg-ink-900 sm:col-span-6 xl:col-span-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-500 dark:text-white/50">{label}</p>
          <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-900 dark:text-white">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700">
          <Icon aria-hidden="true" className="size-[18px]" strokeWidth={2} />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <span className={`inline-flex items-center gap-0.5 font-semibold ${direction === "up" ? "text-sky-700" : "text-rose-600"}`}>
          {direction === "up" ? <ArrowUpRight aria-hidden="true" className="size-3.5" /> : <ArrowDownRight aria-hidden="true" className="size-3.5" />}
          {change}
        </span>
        <span className="text-slate-400 dark:text-white/35">from last week</span>
      </div>
    </article>
  );
}

function CommandPalette({ open, close }: { open: boolean; close: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>(defaultRecentIds);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? commandItems.filter((item) => `${item.label} ${item.detail} ${item.category} ${item.keywords}`.toLowerCase().includes(normalizedQuery))
    : commandItems.slice(0, 8);
  const recentItems = recentIds.map((id) => commandItems.find((item) => item.id === id)).filter((item): item is CommandItem => Boolean(item));

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();

      const savedRecents = window.localStorage.getItem(recentSearchesKey);
      if (savedRecents) {
        try {
          const parsed = JSON.parse(savedRecents) as string[];
          setRecentIds(parsed.filter((id) => commandItems.some((item) => item.id === id)).slice(0, 4));
        } catch {
          window.localStorage.removeItem(recentSearchesKey);
        }
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  function openItem(item: CommandItem) {
    const nextRecentIds = [item.id, ...recentIds.filter((id) => id !== item.id)].slice(0, 4);
    setRecentIds(nextRecentIds);
    window.localStorage.setItem(recentSearchesKey, JSON.stringify(nextRecentIds));
    router.push(item.href);
    close();
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => filteredItems.length ? (current + 1) % filteredItems.length : 0);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => filteredItems.length ? (current - 1 + filteredItems.length) % filteredItems.length : 0);
    }
    if (event.key === "Enter" && filteredItems[activeIndex]) {
      event.preventDefault();
      openItem(filteredItems[activeIndex]);
    }
    if (event.key === "Escape") close();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]">
      <button aria-label="Close search" className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={close} type="button" />
      <section aria-label="Search command palette" aria-modal="true" className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-ink-900" role="dialog">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-white/[0.08]">
          <Search aria-hidden="true" className="size-5 shrink-0 text-slate-400 dark:text-white/35" />
          <label className="sr-only" htmlFor="command-search">Search pages, customers, reports, and recent actions</label>
          <input
            aria-activedescendant={filteredItems[activeIndex] ? `command-result-${filteredItems[activeIndex].id}` : undefined}
            aria-controls="command-results"
            aria-expanded="true"
            aria-label="Search pages, customers, reports, and recent actions"
            aria-autocomplete="list"
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
          <button aria-label="Close command bar" className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-white/[0.07] dark:hover:text-white" onClick={close} type="button">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        {!normalizedQuery && recentItems.length > 0 && (
          <div className="border-b border-slate-100 px-4 py-3 dark:border-white/[0.08]">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/30"><History aria-hidden="true" className="size-3.5" /> Recent searches</div>
            <div className="flex flex-wrap gap-2">
              {recentItems.map((item) => (
                <button className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/50 dark:hover:bg-white/[0.08] dark:hover:text-white" key={item.id} onClick={() => openItem(item)} type="button">
                  <History aria-hidden="true" className="size-3 text-slate-400" /> {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-h-[360px] overflow-y-auto p-2" id="command-results" role="listbox">
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-white/30">{normalizedQuery ? "Search results" : "Suggested"}</p>
            <span className="text-[10px] text-slate-400 dark:text-white/25">{filteredItems.length} results</span>
          </div>
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                aria-selected={index === activeIndex}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${index === activeIndex ? "bg-sky-50 text-sky-900 dark:bg-sky-400/10 dark:text-white" : "text-slate-600 hover:bg-slate-50 dark:text-white/60 dark:hover:bg-white/[0.06]"}`}
                id={`command-result-${item.id}`}
                key={item.id}
                onClick={() => openItem(item)}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
                type="button"
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${index === activeIndex ? "bg-white text-sky-700 shadow-sm dark:bg-white/[0.08] dark:text-sky-300" : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-white/45"}`}><Icon aria-hidden="true" className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{item.label}</span><span className="mt-0.5 block truncate text-[11px] text-slate-400 dark:text-white/30">{item.detail}</span></span>
                <span className="rounded-md bg-white/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:bg-white/[0.05] dark:text-white/30">{item.category}</span>
              </button>
            );
          })}
          {filteredItems.length === 0 && (
            <div className="px-4 py-10 text-center"><Search aria-hidden="true" className="mx-auto size-5 text-slate-300 dark:text-white/20" /><p className="mt-3 text-sm font-semibold text-slate-700 dark:text-white/70">No matches found</p><p className="mt-1 text-xs text-slate-400 dark:text-white/30">Try a customer name, report, page, or activity.</p></div>
          )}
        </div>
        <footer className="flex items-center gap-4 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[10px] text-slate-400 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-white/30">
          <span><kbd className="mr-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold dark:border-white/10 dark:bg-white/[0.05]">↑↓</kbd> navigate</span>
          <span><kbd className="mr-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold dark:border-white/10 dark:bg-white/[0.05]">↵</kbd> open</span>
          <span className="ml-auto"><kbd className="mr-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold dark:border-white/10 dark:bg-white/[0.05]">esc</kbd> close</span>
        </footer>
      </section>
    </div>
  );
}

function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#121916]/95 lg:hidden">
      <ul className="grid h-16 grid-cols-5">
        {mobileNavigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.label}>
              <Link aria-current={active ? "page" : undefined} className={`flex h-full flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${active ? "text-sky-700 dark:text-sky-300" : "text-slate-400 dark:text-white/35"}`} href={item.href}>
                <span className={`relative grid size-8 place-items-center rounded-xl ${active ? "bg-sky-50 dark:bg-sky-400/10" : ""}`}>
                  <Icon aria-hidden="true" className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                  {"badge" in item && item.badge && <span className="absolute right-0 top-0 inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold leading-4 text-white ring-2 ring-white dark:ring-[#121916]">{item.badge}</span>}
                </span>
                <span className="max-[360px]:sr-only">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function DashboardHeader({ openCommand }: { openCommand: () => void }) {
  const pathname = usePathname();
  const pageKey = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const pageTitle = navigation.find((item) => item.href === `/${pageKey}`)?.label ?? "Dashboard";
  const tabs = pageTabs[pageKey] ?? ["Overview"];

  return (
    <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/75 backdrop-blur-xl transition-colors dark:border-white/[0.08] dark:bg-ink-900/90">
      <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-xs xl:flex">
        <Link className="font-medium text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-white/35 dark:hover:text-white" href="/dashboard">Workspace</Link>
        <ChevronRight aria-hidden="true" className="size-3.5 text-slate-300 dark:text-white/20" />
        <span aria-current="page" className="font-semibold text-slate-700 dark:text-white/70">{pageTitle}</span>
      </nav>
      <div className="hidden h-6 w-px bg-slate-200 dark:bg-white/10 xl:block" />
      <button
        aria-label="Open search command bar"
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/[0.06] sm:hidden"
        onClick={openCommand}
        type="button"
      >
        <Search aria-hidden="true" className="size-[18px]" />
      </button>

      <button className="relative hidden h-11 w-full max-w-[460px] items-center rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-16 text-left text-sm text-slate-400 transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/30 dark:hover:bg-white/[0.07] sm:flex" onClick={openCommand} type="button">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-slate-400" />
        Search customers, bookings...
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/40 sm:block">⌘ K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/[0.06] dark:hover:text-white" type="button" aria-label="View notifications">
          <Bell aria-hidden="true" className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#121916]" />
        </button>
        <div className="hidden h-8 w-px bg-slate-200 dark:bg-white/10 sm:block" />
        <button className="flex items-center gap-2.5 rounded-xl p-1 pr-2 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:hover:bg-white/[0.06]" type="button" aria-label="Open user menu">
          <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-xs font-semibold text-white dark:bg-sky-400 dark:text-ink-900">DB</span>
          <span className="hidden sm:block">
            <span className="flex items-center gap-1.5 text-sm font-semibold leading-4 text-slate-800 dark:text-white">Dawit Bekele <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">Owner</span></span>
            <span className="block text-[11px] leading-4 text-slate-400 dark:text-white/35">Bole Fade House</span>
          </span>
          <ChevronDown aria-hidden="true" className="hidden size-4 text-slate-400 sm:block" />
        </button>
      </div>
      </div>

      <div className="flex min-w-0 items-end gap-5 border-t border-slate-100 px-4 dark:border-white/[0.06] sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="hidden h-11 shrink-0 items-center gap-1.5 text-xs md:flex xl:hidden">
          <Link className="font-medium text-slate-400 hover:text-slate-700 dark:text-white/35 dark:hover:text-white" href="/dashboard">Workspace</Link>
          <ChevronRight aria-hidden="true" className="size-3.5 text-slate-300 dark:text-white/20" />
          <span aria-current="page" className="font-semibold text-slate-700 dark:text-white/70">{pageTitle}</span>
        </nav>
        <div className="hidden h-5 w-px shrink-0 bg-slate-200 dark:bg-white/10 md:block xl:hidden" />
        <nav aria-label={`${pageTitle} sections`} className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex h-11 min-w-max items-end gap-5">
            {tabs.map((tab, index) => (
              <li className="h-full" key={tab}>
                <Link
                  aria-current={index === 0 ? "page" : undefined}
                  className={`relative flex h-full items-center whitespace-nowrap text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${index === 0 ? "text-sky-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-sky-500 dark:text-sky-300" : "text-slate-400 hover:text-slate-700 dark:text-white/35 dark:hover:text-white/70"}`}
                  href={`/${pageKey}${index === 0 ? "" : `#${tab.toLowerCase().replaceAll(" ", "-")}`}`}
                >
                  {tab}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children?: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }

      if (event.key === "Escape") setCommandOpen(false);
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function toggleDarkMode() {
    setDarkMode((current) => !current);
  }

  return (
    <div className={darkMode ? "plume dark" : "plume"}>
    <div className="min-h-screen bg-cloud text-ink-900 transition-colors dark:bg-ink-900 dark:text-sky-50">
      <a className="sr-only z-[60] rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4" href="#main-content">Skip to main content</a>
      <Sidebar
        collapsed={sidebarCollapsed}
        darkMode={darkMode}
        toggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        toggleDarkMode={toggleDarkMode}
      />
      <CommandPalette close={() => setCommandOpen(false)} open={commandOpen} />
      <MobileTabBar />

      <div className={`min-h-screen transition-[margin] duration-200 motion-reduce:transition-none ${sidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[240px]"}`}>
        <DashboardHeader openCommand={() => setCommandOpen(true)} />

        <main className="mx-auto w-full max-w-[1600px] p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8" id="main-content">
          {children ?? (
          <>
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
                <span className="size-1.5 rounded-full bg-sky-500" /> Thursday, September 3
              </p>
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[30px]">Good morning, Dawit</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/45">Here is how Bole Fade House is looking today.</p>
            </div>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-coral-600 px-4 text-sm font-900 text-white shadow-soft transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" type="button">
              <Plus aria-hidden="true" className="size-[17px]" strokeWidth={2.2} /> New appointment
            </button>
          </div>

          <section aria-label="Business overview" className="grid grid-cols-12 gap-4 lg:gap-5">
            <MetricCard label="Today's appointments" value="12" change="18.2%" direction="up" icon={CalendarDays} />
            <MetricCard label="Expected till" value="18,400 ETB" change="9.4%" direction="up" icon={CircleDollarSign} />
            <MetricCard label="Active customers" value="846" change="6.1%" direction="up" icon={UsersRound} />
            <MetricCard label="Average service time" value="42m" change="3.5%" direction="down" icon={Clock3} />

            <section className="col-span-12 overflow-hidden rounded-4xl border border-sky-100 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors dark:border-white/[0.08] dark:bg-ink-900 xl:col-span-8" aria-labelledby="appointments-title">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-white/[0.07] sm:px-6">
                <div>
                  <h2 className="font-semibold tracking-[-0.02em] text-slate-900 dark:text-white" id="appointments-title">Today&apos;s appointments</h2>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-white/35">12 bookings · 3 completed</p>
                </div>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600" type="button">View calendar <ChevronRight aria-hidden="true" className="size-4" /></button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:border-white/[0.07] dark:text-white/35">
                      <th className="px-6 py-3.5">Time</th>
                      <th className="px-4 py-3.5">Customer</th>
                      <th className="px-4 py-3.5">Service</th>
                      <th className="px-4 py-3.5">Barber</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-6 py-3.5"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.07]">
                    {appointments.map((appointment) => (
                      <tr className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.035]" key={`${appointment.time}-${appointment.name}`}>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-white/85">{appointment.time}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-bold ${appointment.tone}`}>{appointment.initials}</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-white/75">{appointment.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-700 dark:text-white/70">{appointment.service}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-white/30">{appointment.duration}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-500 dark:text-white/45">{appointment.barber}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${appointment.status === "Checked in" ? "bg-sky-50 text-sky-700" : appointment.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}>{appointment.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button aria-label={`More actions for ${appointment.name}`} className="grid size-8 place-items-center rounded-lg text-slate-400 opacity-70 hover:bg-white hover:text-slate-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:text-white/35 dark:hover:bg-white/[0.08] dark:hover:text-white group-hover:opacity-100" type="button"><MoreHorizontal aria-hidden="true" className="size-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="col-span-12 rounded-4xl bg-gradient-to-br from-sky-700 via-sky-700 to-coral-600 p-5 text-white shadow-card xl:col-span-4" aria-labelledby="next-up-title">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">Next up</p>
                  <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]" id="next-up-title">Dawit Mekonnen</h2>
                </div>
                <span className="rounded-lg bg-white/[0.07] px-2.5 py-1 text-xs font-medium text-white/65">in 12 min</span>
              </div>
              <div className="my-5 h-px bg-white/[0.08]" />
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-sky-400 text-sm font-bold text-ink-900">DM</span>
                <div>
                  <p className="text-sm font-medium">Skin fade + beard</p>
                  <p className="mt-0.5 text-xs text-white/45">09:00–09:55 · with Yonas</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="h-10 rounded-full bg-gradient-to-r from-sky-700 to-coral-600 text-xs font-900 text-white transition hover:bg-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" type="button">Check in</button>
                <button className="h-10 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-white/75 transition hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" type="button">View details</button>
              </div>
              <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
                <div className="flex items-center gap-2 text-xs font-medium text-white/75"><Sparkles aria-hidden="true" className="size-4 text-sky-300" />Today&apos;s pace</div>
                <p className="mt-2 text-xs leading-5 text-white/45">You&apos;re on track for a 78% chair utilization rate.</p>
              </div>
            </aside>

            <section className="col-span-12 rounded-4xl border border-sky-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors dark:border-white/[0.08] dark:bg-ink-900 lg:col-span-7" aria-labelledby="revenue-title">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold tracking-[-0.02em] text-slate-900 dark:text-white" id="revenue-title">Weekly revenue</h2>
                  <p className="mt-1 text-xs text-slate-400 dark:text-white/35">Sep 1–7, 2026</p>
                </div>
                <span className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:border-white/10 dark:text-white/45">This week</span>
              </div>
              <div className="mt-6 flex h-44 items-end gap-3 sm:gap-5" aria-label="Bar chart showing weekly revenue">
                {[42, 63, 54, 82, 68, 91, 48].map((height, index) => (
                  <div className="flex h-full flex-1 flex-col justify-end gap-2" key={height + index}>
                    <div className={`w-full rounded-t-md ${index === 5 ? "bg-sky-500" : "bg-sky-100"}`} style={{ height: `${height}%` }} />
                    <span className="text-center text-[10px] font-medium text-slate-400 dark:text-white/30">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="col-span-12 rounded-4xl border border-sky-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors dark:border-white/[0.08] dark:bg-ink-900 lg:col-span-5" aria-labelledby="team-title">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold tracking-[-0.02em] text-slate-900 dark:text-white" id="team-title">Team schedule</h2>
                  <p className="mt-1 text-xs text-slate-400 dark:text-white/35">3 barbers working today</p>
                </div>
                <button aria-label="Team schedule options" className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:text-white/35 dark:hover:bg-white/[0.06] dark:hover:text-white" type="button"><MoreHorizontal aria-hidden="true" className="size-4" /></button>
              </div>
              <div className="mt-4 divide-y divide-slate-100 dark:divide-white/[0.07]">
                {team.map((member) => (
                  <div className="flex items-center gap-3 py-3" key={member.name}>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-bold ${member.tone}`}>{member.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700 dark:text-white/75">{member.name}</p>
                      <p className="text-[11px] text-slate-400 dark:text-white/35">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700 dark:text-white/75">{member.bookings}</p>
                      <p className="text-[10px] text-slate-400 dark:text-white/30">bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>
          </>
          )}
        </main>
      </div>
    </div>
    </div>
  );
}
