"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  MailPlus,
  Search,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PLATFORM_ROLE_OPTIONS, type PlatformRole } from "@/lib/auth-permissions";
import type { ManagedUser } from "@/app/api/users/route";

const pageSize = 10;

const roleBadge: Record<PlatformRole, string> = {
  admin: "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300",
  editor: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  viewer: "bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-white/70",
};

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserManagementTable() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | PlatformRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "viewer" as PlatformRole });
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "200", offset: "0" });
      if (query.trim()) params.set("search", query.trim());
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/users?${params.toString()}`, { credentials: "include" });
      const data = (await response.json()) as { users?: ManagedUser[]; total?: number; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load users");
      setUsers(data.users ?? []);
      setTotal(data.total ?? data.users?.length ?? 0);
      setSelected(new Set());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [query, roleFilter, statusFilter]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void loadUsers();
    }, 200);
    return () => window.clearTimeout(handle);
  }, [loadUsers]);

  useEffect(() => {
    setPage(1);
  }, [query, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [currentPage, users]);

  const allPageSelected = pageRows.length > 0 && pageRows.every((row) => selected.has(row.id));

  function toggleAllPage() {
    setSelected((current) => {
      const next = new Set(current);
      if (allPageSelected) {
        pageRows.forEach((row) => next.delete(row.id));
      } else {
        pageRows.forEach((row) => next.add(row.id));
      }
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runBulk(action: "activate" | "deactivate" | "set-role" | "remove", role?: PlatformRole) {
    if (selected.size === 0) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/users/bulk", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [...selected], action, role }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Bulk action failed");
      await loadUsers();
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : "Bulk action failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggleStatus(user: ManagedUser) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned: !user.banned }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to update status");
      await loadUsers();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Failed to update status");
    } finally {
      setBusy(false);
    }
  }

  async function submitInvite(event: React.FormEvent) {
    event.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    setBusy(true);
    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Invite failed");
      setInviteSuccess(`Invitation sent to ${inviteForm.email}`);
      setInviteForm({ name: "", email: "", role: "viewer" });
      await loadUsers();
      window.setTimeout(() => {
        setInviteOpen(false);
        setInviteSuccess(null);
      }, 1200);
    } catch (inviteErr) {
      setInviteError(inviteErr instanceof Error ? inviteErr.message : "Invite failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-label="User management"
      className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-white/[0.08] dark:bg-ink-900"
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 dark:border-white/[0.07] sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-white">
              User management
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-white/45">
              Better Auth admin + organization invites · {total} users
            </p>
          </div>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-coral-600 px-4 text-sm font-900 text-white shadow-soft"
            onClick={() => {
              setInviteOpen(true);
              setInviteError(null);
              setInviteSuccess(null);
            }}
            type="button"
          >
            <MailPlus aria-hidden="true" className="size-4" />
            Invite User
          </button>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block w-full lg:max-w-sm">
            <span className="sr-only">Search users</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or email..."
              type="search"
              value={query}
            />
          </label>

          <label className="grid gap-1 text-xs font-medium text-slate-500 dark:text-white/45">
            Role
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/75"
              onChange={(event) => setRoleFilter(event.target.value as "all" | PlatformRole)}
              value={roleFilter}
            >
              <option value="all">All roles</option>
              {PLATFORM_ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-xs font-medium text-slate-500 dark:text-white/45">
            Status
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/75"
              onChange={(event) => setStatusFilter(event.target.value as "all" | "active" | "inactive")}
              value={statusFilter}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        {selected.size > 0 ? (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2.5 dark:border-sky-400/20 dark:bg-sky-400/10">
            <Users aria-hidden="true" className="size-4 text-sky-700 dark:text-sky-300" />
            <span className="text-sm font-semibold text-sky-800 dark:text-sky-200">{selected.size} selected</span>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70"
                disabled={busy}
                onClick={() => void runBulk("activate")}
                type="button"
              >
                <UserCheck aria-hidden="true" className="size-3.5" /> Activate
              </button>
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70"
                disabled={busy}
                onClick={() => void runBulk("deactivate")}
                type="button"
              >
                <UserX aria-hidden="true" className="size-3.5" /> Deactivate
              </button>
              <select
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70"
                defaultValue=""
                disabled={busy}
                onChange={(event) => {
                  const role = event.target.value as PlatformRole;
                  if (!role) return;
                  void runBulk("set-role", role);
                  event.currentTarget.value = "";
                }}
              >
                <option value="">Set role…</option>
                {PLATFORM_ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-semibold text-rose-700 disabled:opacity-50 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300"
                disabled={busy}
                onClick={() => {
                  if (window.confirm(`Remove ${selected.size} user(s)? This cannot be undone.`)) {
                    void runBulk("remove");
                  }
                }}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-3.5" /> Remove
              </button>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/[0.07]">
              <th className="px-5 py-3 sm:px-6" scope="col">
                <input
                  aria-label="Select all on page"
                  checked={allPageSelected}
                  className="size-4 rounded border-slate-300"
                  onChange={toggleAllPage}
                  type="checkbox"
                />
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400" scope="col">
                User
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400" scope="col">
                Email
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400" scope="col">
                Role
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400" scope="col">
                Last login
              </th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:px-6" scope="col">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-5 py-10 text-center text-sm text-slate-400 sm:px-6" colSpan={6}>
                  Loading users…
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td className="px-5 py-10 text-center text-sm text-slate-400 sm:px-6" colSpan={6}>
                  No users match these filters.
                </td>
              </tr>
            ) : (
              pageRows.map((user, index) => (
                <tr
                  className={`border-b border-slate-100 last:border-b-0 dark:border-white/[0.06] ${
                    index % 2 === 1 ? "bg-slate-50/70 dark:bg-white/[0.025]" : ""
                  }`}
                  key={user.id}
                >
                  <td className="px-5 py-3.5 sm:px-6">
                    <input
                      aria-label={`Select ${user.name}`}
                      checked={selected.has(user.id)}
                      className="size-4 rounded border-slate-300"
                      onChange={() => toggleOne(user.id)}
                      type="checkbox"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white dark:bg-sky-400 dark:text-ink-900">
                        {initials(user.name || user.email)}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-white/85">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-white/55">{user.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${roleBadge[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-white/55">{formatDate(user.lastLogin)}</td>
                  <td className="px-5 py-3.5 text-right sm:px-6">
                    <button
                      aria-checked={!user.banned}
                      aria-label={`Toggle status for ${user.name}`}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                        user.banned ? "bg-slate-200 dark:bg-white/15" : "bg-emerald-500"
                      }`}
                      disabled={busy}
                      onClick={() => void toggleStatus(user)}
                      role="switch"
                      type="button"
                    >
                      <span
                        className={`inline-block size-4 rounded-full bg-white shadow transition ${
                          user.banned ? "translate-x-1" : "translate-x-6"
                        }`}
                      />
                    </button>
                    <span className="ml-2 text-xs font-medium text-slate-500 dark:text-white/45">
                      {user.banned ? "Inactive" : "Active"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 dark:border-white/[0.07] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-slate-400 dark:text-white/35">
          Showing {users.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, users.length)} of {users.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 disabled:opacity-40 dark:border-white/10 dark:text-white/60"
            disabled={currentPage <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-3.5" /> Prev
          </button>
          <span className="min-w-[4.5rem] text-center text-xs font-semibold text-slate-600 dark:text-white/60">
            Page {currentPage} / {totalPages}
          </span>
          <button
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 disabled:opacity-40 dark:border-white/10 dark:text-white/60"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            type="button"
          >
            Next <ChevronRight aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>

      {inviteOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <button
            aria-label="Close invite modal"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setInviteOpen(false)}
            type="button"
          />
          <div
            aria-labelledby="invite-user-title"
            aria-modal="true"
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-ink-900"
            role="dialog"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white" id="invite-user-title">
                  Invite user
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-white/45">
                  Creates a Better Auth user and sends an invitation email.
                </p>
              </div>
              <button
                aria-label="Close"
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                onClick={() => setInviteOpen(false)}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={submitInvite}>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-white/75">
                Name
                <input
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:border-white/10 dark:bg-white/[0.04]"
                  onChange={(event) => setInviteForm((current) => ({ ...current, name: event.target.value }))}
                  required
                  value={inviteForm.name}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-white/75">
                Email
                <input
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:border-white/10 dark:bg-white/[0.04]"
                  onChange={(event) => setInviteForm((current) => ({ ...current, email: event.target.value }))}
                  required
                  type="email"
                  value={inviteForm.email}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-white/75">
                Role
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:border-white/10 dark:bg-white/[0.04]"
                  onChange={(event) =>
                    setInviteForm((current) => ({ ...current, role: event.target.value as PlatformRole }))
                  }
                  value={inviteForm.role}
                >
                  {PLATFORM_ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {inviteError ? <p className="text-sm font-medium text-rose-600">{inviteError}</p> : null}
              {inviteSuccess ? (
                <p className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <Check aria-hidden="true" className="size-4" />
                  {inviteSuccess}
                </p>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 dark:border-white/10 dark:text-white/60"
                  onClick={() => setInviteOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="h-10 rounded-full bg-gradient-to-r from-sky-700 to-coral-600 px-4 text-sm font-900 text-white disabled:opacity-60"
                  disabled={busy}
                  type="submit"
                >
                  {busy ? "Sending…" : "Send invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
