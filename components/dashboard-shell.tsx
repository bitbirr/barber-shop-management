"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { CommandPalette } from "@/components/command-palette";
import { CrmSidebar, mobileNavigation, navigation } from "@/components/crm-sidebar";

const pageTabs: Record<string, string[]> = {
  dashboard: ["Overview", "Activity", "Reports"],
  activity: ["All", "Comments", "Updates", "Alerts"],
  pipeline: ["Board", "Forecast", "Activity"],
  deals: ["All deals", "Open", "Won", "Lost"],
  analytics: ["Overview", "Features", "Revenue", "Services", "Team performance"],
  customers: ["All customers", "Segments", "Retention"],
  settings: ["Profile", "Team", "Billing", "API Keys"],
  users: ["All users", "Invitations", "Roles"],
  invoices: ["All invoices", "Overdue", "Paid"],
  subscriptions: ["All plans", "Starter", "Pro", "Enterprise"],
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

function MetricCard({ label, value, change, direction, icon: Icon }: { label: string; value: string; change: string; direction: "up" | "down"; icon: typeof CalendarDays }) {
  return (
    <article className="col-span-12 rounded-4xl border border-sky-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors dark:border-gray-700 dark:bg-gray-800 sm:col-span-6 xl:col-span-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-slate-900 dark:text-gray-100">{value}</p>
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
        <span className="text-slate-400 dark:text-gray-400">from last week</span>
      </div>
    </article>
  );
}

function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/95 lg:hidden">
      <ul className="grid h-16 grid-cols-5">
        {mobileNavigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.label}>
              <Link aria-current={active ? "page" : undefined} className={`flex h-full flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${active ? "text-sky-700 dark:text-sky-300" : "text-slate-400 dark:text-gray-400"}`} href={item.href}>
                <span className={`relative grid size-8 place-items-center rounded-xl ${active ? "bg-sky-50 dark:bg-sky-400/10" : ""}`}>
                  <Icon aria-hidden="true" className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                  {"badge" in item && item.badge && <span className="absolute right-0 top-0 inline-flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold leading-4 text-white ring-2 ring-white dark:ring-gray-900">{item.badge}</span>}
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
  const segments = pathname.split("/").filter(Boolean);
  const pageKey = segments[0] ?? "dashboard";
  const isFeatureAnalytics = pageKey === "analytics" && segments[1] === "features";
  const pageTitle = navigation.find((item) => item.href === `/${pageKey}`)?.label ?? "Dashboard";
  const tabs = pageTabs[pageKey] ?? ["Overview"];

  return (
    <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/75 backdrop-blur-xl transition-colors dark:border-gray-700 dark:bg-gray-900/90">
      <div className="flex h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-xs xl:flex">
        <Link className="font-medium text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-gray-400 dark:hover:text-gray-100" href="/dashboard">Workspace</Link>
        <ChevronRight aria-hidden="true" className="size-3.5 text-slate-300 dark:text-gray-500" />
        <span aria-current="page" className="font-semibold text-slate-700 dark:text-gray-100">{pageTitle}</span>
      </nav>
      <div className="hidden h-6 w-px bg-slate-200 dark:bg-white/10 xl:block" />
      <button
        aria-label="Open search command bar"
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 sm:hidden"
        onClick={openCommand}
        type="button"
      >
        <Search aria-hidden="true" className="size-[18px]" />
      </button>

      <button className="relative hidden h-11 w-full max-w-[460px] items-center rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-16 text-left text-sm text-slate-400 transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.07] sm:flex" onClick={openCommand} type="button">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-slate-400" />
        Search customers, bookings...
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100/40 sm:block">⌘ K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100" type="button" aria-label="View notifications">
          <Bell aria-hidden="true" className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900" />
        </button>
        <div className="hidden h-8 w-px bg-slate-200 dark:bg-white/10 sm:block" />
        <button className="flex items-center gap-2.5 rounded-xl p-1 pr-2 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:hover:bg-gray-700" type="button" aria-label="Open user menu">
          <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-xs font-semibold text-white dark:bg-sky-400 dark:text-ink-900">DB</span>
          <span className="hidden sm:block">
            <span className="flex items-center gap-1.5 text-sm font-semibold leading-4 text-slate-800 dark:text-gray-100">Dawit Bekele <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">Owner</span></span>
            <span className="block text-[11px] leading-4 text-slate-400 dark:text-gray-400">Bole Fade House</span>
          </span>
          <ChevronDown aria-hidden="true" className="hidden size-4 text-slate-400 sm:block" />
        </button>
      </div>
      </div>

      <div className="flex min-w-0 items-end gap-5 border-t border-slate-100 px-4 dark:border-gray-700 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="hidden h-11 shrink-0 items-center gap-1.5 text-xs md:flex xl:hidden">
          <Link className="font-medium text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-100" href="/dashboard">Workspace</Link>
          <ChevronRight aria-hidden="true" className="size-3.5 text-slate-300 dark:text-gray-500" />
          <span aria-current="page" className="font-semibold text-slate-700 dark:text-gray-100">{pageTitle}</span>
        </nav>
        <div className="hidden h-5 w-px shrink-0 bg-slate-200 dark:bg-white/10 md:block xl:hidden" />
        <nav aria-label={`${pageTitle} sections`} className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex h-11 min-w-max items-end gap-5">
            {tabs.map((tab, index) => {
              const href =
                pageKey === "analytics" && tab === "Features"
                  ? "/analytics/features"
                  : `/${pageKey}${index === 0 ? "" : `#${tab.toLowerCase().replaceAll(" ", "-")}`}`;
              const active =
                tab === "Features"
                  ? isFeatureAnalytics
                  : index === 0 && !isFeatureAnalytics;

              return (
                <li className="h-full" key={tab}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`relative flex h-full items-center whitespace-nowrap text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${active ? "text-sky-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-sky-500 dark:text-sky-300" : "text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-100"}`}
                    href={href}
                  >
                    {tab}
                  </Link>
                </li>
              );
            })}
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
    const stored = window.localStorage.getItem("bit-barber-theme");
    if (stored === "dark") setDarkMode(true);
  }, []);

  function toggleDarkMode() {
    setDarkMode((current) => {
      const next = !current;
      window.localStorage.setItem("bit-barber-theme", next ? "dark" : "light");
      return next;
    });
  }

  return (
    <div className={darkMode ? "plume dark" : "plume"}>
    <div className="min-h-screen bg-cloud text-ink-900 transition-colors dark:bg-gray-900 dark:text-gray-100">
      <a className="sr-only z-[60] rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4" href="#main-content">Skip to main content</a>
      <CrmSidebar
        collapsed={sidebarCollapsed}
        darkMode={darkMode}
        toggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        toggleDarkMode={toggleDarkMode}
      />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
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
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-gray-100 sm:text-[30px]">Good morning, Dawit</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Here is how Bole Fade House is looking today.</p>
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

            <section className="col-span-12 overflow-hidden rounded-4xl border border-sky-100 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors dark:border-gray-700 dark:bg-gray-800 xl:col-span-8" aria-labelledby="appointments-title">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-gray-700 sm:px-6">
                <div>
                  <h2 className="font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100" id="appointments-title">Today&apos;s appointments</h2>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-400">12 bookings · 3 completed</p>
                </div>
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600" type="button">View calendar <ChevronRight aria-hidden="true" className="size-4" /></button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:border-gray-700 dark:text-gray-400">
                      <th className="px-6 py-3.5">Time</th>
                      <th className="px-4 py-3.5">Customer</th>
                      <th className="px-4 py-3.5">Service</th>
                      <th className="px-4 py-3.5">Barber</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-6 py-3.5"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                    {appointments.map((appointment) => (
                      <tr className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.035]" key={`${appointment.time}-${appointment.name}`}>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800 dark:text-gray-100">{appointment.time}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-bold ${appointment.tone}`}>{appointment.initials}</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-gray-100">{appointment.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-700 dark:text-gray-100">{appointment.service}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-gray-400">{appointment.duration}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-500 dark:text-gray-400">{appointment.barber}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${appointment.status === "Checked in" ? "bg-sky-50 text-sky-700" : appointment.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}>{appointment.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button aria-label={`More actions for ${appointment.name}`} className="grid size-8 place-items-center rounded-lg text-slate-400 opacity-70 hover:bg-white hover:text-slate-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 group-hover:opacity-100" type="button"><MoreHorizontal aria-hidden="true" className="size-4" /></button>
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

            <section className="col-span-12 rounded-4xl border border-sky-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors dark:border-gray-700 dark:bg-gray-800 lg:col-span-7" aria-labelledby="revenue-title">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100" id="revenue-title">Weekly revenue</h2>
                  <p className="mt-1 text-xs text-slate-400 dark:text-gray-400">Sep 1–7, 2026</p>
                </div>
                <span className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 dark:border-gray-700 dark:text-gray-400">This week</span>
              </div>
              <div className="mt-6 flex h-44 items-end gap-3 sm:gap-5" aria-label="Bar chart showing weekly revenue">
                {[42, 63, 54, 82, 68, 91, 48].map((height, index) => (
                  <div className="flex h-full flex-1 flex-col justify-end gap-2" key={height + index}>
                    <div className={`w-full rounded-t-md ${index === 5 ? "bg-sky-500" : "bg-sky-100"}`} style={{ height: `${height}%` }} />
                    <span className="text-center text-[10px] font-medium text-slate-400 dark:text-gray-400">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="col-span-12 rounded-4xl border border-sky-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors dark:border-gray-700 dark:bg-gray-800 lg:col-span-5" aria-labelledby="team-title">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100" id="team-title">Team schedule</h2>
                  <p className="mt-1 text-xs text-slate-400 dark:text-gray-400">3 barbers working today</p>
                </div>
                <button aria-label="Team schedule options" className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100" type="button"><MoreHorizontal aria-hidden="true" className="size-4" /></button>
              </div>
              <div className="mt-4 divide-y divide-slate-100 dark:divide-gray-700">
                {team.map((member) => (
                  <div className="flex items-center gap-3 py-3" key={member.name}>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-bold ${member.tone}`}>{member.initials}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700 dark:text-gray-100">{member.name}</p>
                      <p className="text-[11px] text-slate-400 dark:text-gray-400">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700 dark:text-gray-100">{member.bookings}</p>
                      <p className="text-[10px] text-slate-400 dark:text-gray-400">bookings</p>
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
