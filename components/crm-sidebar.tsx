"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ContactRound,
  CreditCard,
  FileText,
  Handshake,
  Kanban,
  LayoutDashboard,
  Moon,
  Plus,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const navigationSections = [
  {
    label: "Overview",
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Activity", icon: Activity, href: "/activity" },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Pipeline", icon: Kanban, href: "/pipeline", badge: 8 },
      { label: "Contacts", icon: ContactRound, href: "/customers", badge: 3 },
      { label: "Deals", icon: Handshake, href: "/deals" },
      { label: "Invoices", icon: FileText, href: "/invoices" },
      { label: "Subscriptions", icon: CreditCard, href: "/subscriptions" },
    ],
  },
  {
    label: "Reports",
    items: [{ label: "Reports", icon: ChartNoAxesCombined, href: "/analytics" }],
  },
  {
    label: "Settings",
    items: [
      { label: "Users", icon: Users, href: "/users" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ],
  },
];

export const navigation = navigationSections.flatMap((section) => section.items);
export const mobileNavigation = navigation.filter((item) =>
  ["Overview", "Activity", "Contacts", "Invoices", "Reports"].includes(item.label),
);

const workspaces = [
  { name: "Bole Fade House", initials: "BF", plan: "Growth" },
  { name: "Piassa Lineup", initials: "PL", plan: "Starter" },
  { name: "Merkato Kings", initials: "MK", plan: "Growth" },
];

type CrmSidebarProps = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

function CompanyLogoPlaceholder({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-7 text-[10px]" : "size-8 text-[11px]";
  return (
    <span
      aria-hidden="true"
      className={`grid ${box} shrink-0 place-items-center rounded-lg border border-dashed border-white/25 bg-white/[0.06] font-bold tracking-wide text-white/70`}
      title="Company logo placeholder"
    >
      {initials}
    </span>
  );
}

export function CrmSidebar({ collapsed, toggleCollapsed, darkMode, toggleDarkMode }: CrmSidebarProps) {
  const pathname = usePathname();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navigationSections.map((section) => [section.label, true])),
  );

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!workspaceRef.current?.contains(event.target as Node)) setWorkspaceMenuOpen(false);
    }
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setWorkspaceMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <aside
      className={`plume-sidebar fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-sky-100 bg-ink-900 text-white shadow-card transition-[width] duration-200 motion-reduce:transition-none lg:flex ${
        collapsed ? "w-[76px]" : "w-[240px]"
      }`}
    >
      <div className={`flex h-20 items-center px-5 ${collapsed ? "justify-center px-0" : "justify-between"}`}>
        <Link
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          href="/dashboard"
          title="Bit-Barber System"
        >
          <CompanyLogoPlaceholder initials="BB" />
          <span className={collapsed ? "hidden" : ""}>
            <span className="block text-[17px] font-semibold tracking-[-0.02em]">Bit-Barber</span>
            <span className="block text-[10px] font-800 uppercase tracking-[0.16em] text-ethiopia-yellow/90">CRM workspace</span>
          </span>
        </Link>
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

      <div className="relative px-3" ref={workspaceRef}>
        <button
          aria-expanded={workspaceMenuOpen}
          aria-haspopup="menu"
          className={`flex h-12 w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-left transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
            collapsed ? "justify-center px-0" : ""
          }`}
          onClick={() => setWorkspaceMenuOpen((current) => !current)}
          title={collapsed ? activeWorkspace.name : undefined}
          type="button"
        >
          <CompanyLogoPlaceholder initials={activeWorkspace.initials} />
          <span className={`min-w-0 flex-1 ${collapsed ? "hidden" : ""}`}>
            <span className="block truncate text-xs font-semibold text-white">{activeWorkspace.name}</span>
            <span className="block truncate text-[10px] text-white/35">{activeWorkspace.plan} · Company workspace</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`size-4 text-white/35 transition-transform ${workspaceMenuOpen ? "rotate-180" : ""} ${collapsed ? "hidden" : ""}`}
          />
        </button>

        {workspaceMenuOpen ? (
          <div
            aria-label="Switch workspace"
            className={`absolute z-50 mt-2 w-56 rounded-xl border border-white/10 bg-ink-800 p-1.5 shadow-2xl ${
              collapsed ? "left-[68px] top-0 mt-0" : "left-3"
            }`}
            role="menu"
          >
            <p className="px-2.5 pb-1.5 pt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">Your workspaces</p>
            {workspaces.map((workspace) => (
              <button
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-xs text-white/65 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                key={workspace.name}
                onClick={() => {
                  setActiveWorkspace(workspace);
                  setWorkspaceMenuOpen(false);
                }}
                role="menuitem"
                type="button"
              >
                <CompanyLogoPlaceholder initials={workspace.initials} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{workspace.name}</span>
                  <span className="block text-[10px] text-white/30">{workspace.plan}</span>
                </span>
                {activeWorkspace.name === workspace.name ? (
                  <span aria-label="Selected" className="size-1.5 rounded-full bg-sky-400" />
                ) : null}
              </button>
            ))}
            <div className="my-1 h-px bg-white/[0.07]" />
            <button
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-sky-300 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              role="menuitem"
              type="button"
            >
              <Plus aria-hidden="true" className="size-3.5" /> Create workspace
            </button>
          </div>
        ) : null}
      </div>

      <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 pb-4 pt-5">
        <div className="space-y-4">
          {navigationSections.map((section) => {
            const sectionOpen = openSections[section.label];
            const sectionUnread = section.items.reduce((sum, item) => sum + ("badge" in item && item.badge ? item.badge : 0), 0);

            return (
              <section key={section.label}>
                {collapsed ? (
                  <div className="mx-3 mb-2 h-px bg-white/[0.07]" />
                ) : (
                  <button
                    aria-expanded={sectionOpen}
                    className="mb-1.5 flex h-7 w-full items-center gap-2 rounded-lg px-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/30 transition hover:bg-white/[0.04] hover:text-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    onClick={() =>
                      setOpenSections((current) => ({
                        ...current,
                        [section.label]: !current[section.label],
                      }))
                    }
                    type="button"
                  >
                    <span className="truncate">{section.label}</span>
                    {sectionUnread > 0 ? (
                      <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-white/10 px-1 text-[9px] font-bold text-white/55">
                        {sectionUnread}
                      </span>
                    ) : null}
                    <ChevronDown
                      aria-hidden="true"
                      className={`ml-auto size-3.5 shrink-0 transition-transform ${sectionOpen ? "" : "-rotate-90"}`}
                    />
                  </button>
                )}

                {(collapsed || sectionOpen) && (
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      const badge = "badge" in item ? item.badge : undefined;

                      return (
                        <li key={item.label}>
                          <Link
                            aria-current={active ? "page" : undefined}
                            className={`group relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                              collapsed ? "justify-center px-0" : ""
                            } ${
                              active
                                ? "bg-white/[0.09] text-white shadow-sm"
                                : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                            }`}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                          >
                            <Icon
                              aria-hidden="true"
                              className={`size-[18px] shrink-0 ${
                                active ? "text-sky-400" : "text-white/40 group-hover:text-white/80"
                              }`}
                              strokeWidth={1.8}
                            />
                            <span className={collapsed ? "sr-only" : ""}>{item.label}</span>
                            {badge ? (
                              <span
                                className={`${
                                  collapsed
                                    ? "absolute -mt-6 ml-5 min-w-4 px-1 text-[8px]"
                                    : "ml-auto min-w-5 px-1.5 text-[10px]"
                                } inline-flex h-5 items-center justify-center rounded-full bg-sky-400 font-bold text-ink-900`}
                              >
                                {badge}
                              </span>
                            ) : null}
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
          className={`mb-2 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
            collapsed ? "justify-center px-0" : ""
          }`}
          onClick={toggleDarkMode}
          title={collapsed ? (darkMode ? "Light mode" : "Dark mode") : undefined}
          type="button"
        >
          {darkMode ? (
            <Sun aria-hidden="true" className="size-[18px] shrink-0 text-amber-300" />
          ) : (
            <Moon aria-hidden="true" className="size-[18px] shrink-0 text-white/45" />
          )}
          <span className={collapsed ? "sr-only" : ""}>{darkMode ? "Light mode" : "Dark mode"}</span>
          <span
            aria-hidden="true"
            className={`ml-auto h-5 w-9 rounded-full p-0.5 transition-colors ${
              darkMode ? "bg-sky-400" : "bg-white/15"
            } ${collapsed ? "hidden" : ""}`}
          >
            <span className={`block size-4 rounded-full bg-white shadow-sm transition-transform ${darkMode ? "translate-x-4" : "translate-x-0"}`} />
          </span>
        </button>

        <button
          aria-label="Open account menu for Dawit Bekele, Owner"
          className={`flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2 text-left transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
            collapsed ? "justify-center border-transparent bg-transparent p-1" : ""
          }`}
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
