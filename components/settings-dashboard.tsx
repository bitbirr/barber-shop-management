"use client";

import Link from "next/link";
import {
  Check,
  Copy,
  CreditCard,
  KeyRound,
  LoaderCircle,
  RefreshCw,
  Upload,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { ApiKeyPublic } from "@/lib/api-keys";
import type { BillingSnapshot } from "@/app/api/settings/billing/route";
import type { SettingsTeamMember } from "@/app/api/settings/team/route";
import { authClient, useSession } from "@/lib/auth-client";

const ORG_ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "member", label: "Member" },
] as const;

type OrgRole = (typeof ORG_ROLE_OPTIONS)[number]["value"];

const defaultBilling: BillingSnapshot = {
  plan: {
    name: "Growth",
    price: "4,900 ETB",
    interval: "month",
    seats: 12,
    status: "active",
    features: ["Unlimited bookings", "Telebirr + CBE checkout", "Analytics exports", "Priority SMS"],
  },
  usage: [
    { label: "Active seats", value: 8, limit: 12, unit: "" },
    { label: "API requests", value: 18420, limit: 50000, unit: "" },
    { label: "SMS credits", value: 620, limit: 1000, unit: "" },
    { label: "API keys", value: 1, limit: 10, unit: "" },
  ],
  organization: { id: null, name: null },
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function SectionCard({
  id,
  icon: Icon,
  title,
  description,
  children,
  action,
}: {
  id: string;
  icon: typeof Users;
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] dark:border-gray-700 dark:bg-gray-800"
      id={id}
    >
      <header className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-gray-700 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
            <Icon aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-gray-100" id={`${id}-title`}>
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        {action}
      </header>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

function fieldClassName() {
  return "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-sm outline-none transition hover:border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100 dark:hover:border-gray-600";
}

function UsageBar({ value, limit, unit }: { value: number; limit: number; unit: string }) {
  const pct = Math.min(100, Math.round((value / limit) * 100));
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-slate-800 dark:text-gray-100">
          {unit ? `${value}${unit}` : value.toLocaleString()}
          <span className="ml-1 font-medium text-slate-400 dark:text-gray-400">
            / {unit ? `${limit}${unit}` : limit.toLocaleString()}
          </span>
        </span>
        <span className="text-xs font-medium text-slate-400 dark:text-gray-400">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-amber-500" : "bg-sky-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SettingsDashboard() {
  const { data: session, isPending: sessionPending, refetch } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [members, setMembers] = useState<SettingsTeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [teamMessage, setTeamMessage] = useState<string | null>(null);
  const [roleBusyId, setRoleBusyId] = useState<string | null>(null);

  const [billing, setBilling] = useState<BillingSnapshot>(defaultBilling);
  const [billingLoading, setBillingLoading] = useState(true);

  const [apiKeys, setApiKeys] = useState<ApiKeyPublic[]>([]);
  const [keysLoading, setKeysLoading] = useState(true);
  const [keysError, setKeysError] = useState<string | null>(null);
  const [revealedPlaintext, setRevealedPlaintext] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [keyBusy, setKeyBusy] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    setName(session.user.name ?? "");
    setEmail(session.user.email ?? "");
    setAvatarPreview(session.user.image ?? null);
  }, [session?.user]);

  const loadMembers = useCallback(async () => {
    setTeamLoading(true);
    setTeamError(null);
    try {
      const response = await fetch("/api/settings/team", { credentials: "include" });
      const data = (await response.json()) as {
        members?: SettingsTeamMember[];
        error?: string;
        message?: string;
      };
      if (!response.ok) throw new Error(data.error || "Failed to load team");
      setMembers(data.members ?? []);
      setTeamMessage(data.message ?? null);
    } catch (error) {
      setTeamError(error instanceof Error ? error.message : "Failed to load team");
      setMembers([]);
    } finally {
      setTeamLoading(false);
    }
  }, []);

  const loadBilling = useCallback(async () => {
    setBillingLoading(true);
    try {
      const response = await fetch("/api/settings/billing", { credentials: "include" });
      const data = (await response.json()) as BillingSnapshot & { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load billing");
      setBilling(data);
    } catch {
      setBilling(defaultBilling);
    } finally {
      setBillingLoading(false);
    }
  }, []);

  const loadApiKeys = useCallback(async () => {
    setKeysLoading(true);
    setKeysError(null);
    try {
      const response = await fetch("/api/settings/api-keys", { credentials: "include" });
      const data = (await response.json()) as { keys?: ApiKeyPublic[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to load API keys");
      setApiKeys(data.keys ?? []);
    } catch (error) {
      setKeysError(error instanceof Error ? error.message : "Failed to load API keys");
      setApiKeys([]);
    } finally {
      setKeysLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMembers();
    void loadBilling();
    void loadApiKeys();
  }, [loadMembers, loadBilling, loadApiKeys]);

  function onAvatarSelected(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError("Choose an image file for your avatar.");
      return;
    }
    if (file.size > 400_000) {
      setProfileError("Avatar must be under 400KB for now.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setAvatarDataUrl(result);
      setAvatarPreview(result);
      setProfileError(null);
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      const updatePayload: { name: string; image?: string } = { name: name.trim() };
      if (avatarDataUrl) updatePayload.image = avatarDataUrl;

      const updated = await authClient.updateUser(updatePayload);
      if (updated.error) throw new Error(updated.error.message || "Failed to update profile");

      if (email.trim() && email.trim() !== session?.user.email) {
        const changed = await authClient.changeEmail({
          newEmail: email.trim(),
          callbackURL: "/settings",
        });
        if (changed.error) throw new Error(changed.error.message || "Failed to change email");
        setProfileMessage("Profile saved. Check your inbox to confirm the new email.");
      } else {
        setProfileMessage("Profile saved.");
      }

      setAvatarDataUrl(null);
      await authClient.getSession({ query: { disableCookieCache: true } });
      await refetch();
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setProfileSaving(false);
    }
  }

  async function changeMemberRole(memberId: string, role: OrgRole) {
    setRoleBusyId(memberId);
    setTeamError(null);
    try {
      const response = await fetch("/api/settings/team", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, role }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to update role");
      setMembers((current) =>
        current.map((member) => (member.id === memberId ? { ...member, role } : member)),
      );
    } catch (error) {
      setTeamError(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setRoleBusyId(null);
    }
  }

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function regenerateKey(id: string) {
    setKeyBusy(true);
    setKeysError(null);
    setCopied(false);
    try {
      const response = await fetch(`/api/settings/api-keys/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await response.json()) as {
        key?: ApiKeyPublic;
        plaintext?: string;
        error?: string;
        message?: string;
      };
      if (!response.ok) throw new Error(data.error || "Failed to regenerate key");
      if (data.key) {
        setApiKeys((current) => current.map((item) => (item.id === data.key!.id ? data.key! : item)));
      }
      setRevealedPlaintext(data.plaintext ?? null);
    } catch (error) {
      setKeysError(error instanceof Error ? error.message : "Failed to regenerate key");
    } finally {
      setKeyBusy(false);
    }
  }

  const displayAvatar = avatarPreview;
  const primaryKey = apiKeys[0] ?? null;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
          <span className="size-1.5 rounded-full bg-sky-500" /> Settings
        </p>
        <h1 className="text-2xl font-semibold tracking-[-0.035em] text-slate-950 dark:text-gray-100 sm:text-[30px]">
          Workspace settings
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-gray-400">
          Manage your profile, team roles, billing, and API access.
        </p>
        <nav aria-label="Settings sections" className="mt-4 flex flex-wrap gap-2">
          {[
            { href: "#profile", label: "Profile" },
            { href: "#team", label: "Team" },
            { href: "#billing", label: "Billing" },
            { href: "#api-keys", label: "API Keys" },
          ].map((item) => (
            <a
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <SectionCard
        description="Avatar, display name, and account email"
        icon={Upload}
        id="profile"
        title="Profile"
      >
        <form className="space-y-5" onSubmit={saveProfile}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              {displayAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt=""
                  className="size-20 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-gray-700"
                  height={80}
                  src={displayAvatar}
                  width={80}
                />
              ) : (
                <span className="grid size-20 place-items-center rounded-2xl bg-sky-100 text-lg font-bold text-sky-800 dark:bg-sky-400/15 dark:text-sky-300">
                  {initials(name || session?.user.name || "U")}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <input
                accept="image/*"
                className="sr-only"
                onChange={(event) => onAvatarSelected(event.target.files?.[0] ?? null)}
                ref={fileInputRef}
                type="file"
              />
              <button
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <Upload aria-hidden="true" className="size-4" />
                Upload avatar
              </button>
              <p className="text-xs text-slate-400 dark:text-gray-400">PNG or JPG · max 400KB</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-gray-400">Name</span>
              <input
                className={fieldClassName()}
                disabled={sessionPending || profileSaving}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-gray-400">Email</span>
              <input
                className={fieldClassName()}
                disabled={sessionPending || profileSaving}
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-60"
              disabled={profileSaving || sessionPending}
              type="submit"
            >
              {profileSaving ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : null}
              Save profile
            </button>
            {profileMessage ? (
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{profileMessage}</p>
            ) : null}
            {profileError ? (
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{profileError}</p>
            ) : null}
          </div>
        </form>
      </SectionCard>

      <SectionCard
        action={
          <Link
            className="text-sm font-semibold text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-sky-300"
            href="/users"
          >
            Manage invites
          </Link>
        }
        description="Organization members and roles via Better Auth"
        icon={Users}
        id="team"
        title="Team"
      >
        {teamLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-500 dark:text-gray-400">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-sky-600" />
            Loading team…
          </div>
        ) : teamError && members.length === 0 ? (
          <div className="space-y-3 py-6">
            <p className="text-sm text-rose-600 dark:text-rose-400">{teamError}</p>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Set an active organization in Better Auth to manage team roles here.
            </p>
          </div>
        ) : members.length === 0 ? (
          <p className="py-6 text-sm text-slate-500 dark:text-gray-400">
            No organization members yet. Invite teammates from Users.
          </p>
        ) : (
          <>
            {teamMessage ? (
              <p className="mb-3 text-xs text-slate-400 dark:text-gray-400">{teamMessage}</p>
            ) : null}
          <ul className="divide-y divide-slate-100 dark:divide-gray-700">
            {members.map((member) => (
              <li className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between" key={member.id}>
                <div className="flex min-w-0 items-center gap-3">
                  {member.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="" className="size-9 rounded-full object-cover" height={36} src={member.user.image} width={36} />
                  ) : (
                    <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-gray-700 dark:text-gray-200">
                      {initials(member.user.name || member.user.email)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-gray-100">
                      {member.user.name || "Unnamed"}
                    </p>
                    <p className="truncate text-xs text-slate-400 dark:text-gray-400">{member.user.email}</p>
                  </div>
                </div>
                <label className="block sm:w-44">
                  <span className="sr-only">Role for {member.user.name}</span>
                  <select
                    className={fieldClassName()}
                    disabled={
                      roleBusyId === member.id ||
                      member.role === "owner" ||
                      member.id.startsWith("self_")
                    }
                    onChange={(event) => changeMemberRole(member.id, event.target.value as OrgRole)}
                    value={ORG_ROLE_OPTIONS.some((option) => option.value === member.role) ? member.role : "member"}
                  >
                    {ORG_ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
          </>
        )}
        {teamError && members.length > 0 ? (
          <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{teamError}</p>
        ) : null}
      </SectionCard>

      <SectionCard
        description={
          billing.organization.name
            ? `Plan and usage for ${billing.organization.name}`
            : "Current plan, usage, and upgrade options"
        }
        icon={CreditCard}
        id="billing"
        title="Billing"
      >
        {billingLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-500 dark:text-gray-400">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-sky-600" />
            Loading billing…
          </div>
        ) : (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
          <article className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-400/20 dark:from-sky-400/10 dark:to-gray-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
                  Current plan
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-gray-100">
                  {billing.plan.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                  <span className="font-semibold text-slate-800 dark:text-gray-100">{billing.plan.price}</span>
                  {" / "}
                  {billing.plan.interval} · {billing.plan.seats} seats
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                {billing.plan.status}
              </span>
            </div>
            <ul className="mt-5 space-y-2">
              {billing.plan.features.map((feature) => (
                <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300" key={feature}>
                  <Check aria-hidden="true" className="size-4 shrink-0 text-sky-600 dark:text-sky-300" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-700 to-coral-600 text-sm font-900 text-white shadow-soft transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              type="button"
            >
              Upgrade to Scale
            </button>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {billing.usage.map((metric) => (
              <article
                className="rounded-2xl border border-slate-200/80 p-4 dark:border-gray-700"
                key={metric.label}
              >
                <p className="mb-3 text-sm font-medium text-slate-500 dark:text-gray-400">{metric.label}</p>
                <UsageBar limit={metric.limit} unit={metric.unit} value={metric.value} />
              </article>
            ))}
          </div>
        </div>
        )}
      </SectionCard>

      <SectionCard
        description="Masked secrets for integrations — regenerate when compromised"
        icon={KeyRound}
        id="api-keys"
        title="API Keys"
      >
        {keysLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-500 dark:text-gray-400">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-sky-600" />
            Loading keys…
          </div>
        ) : keysError && !primaryKey ? (
          <p className="text-sm text-rose-600 dark:text-rose-400">{keysError}</p>
        ) : !primaryKey ? (
          <p className="text-sm text-slate-500 dark:text-gray-400">No API keys yet.</p>
        ) : (
          <div className="space-y-4">
            {revealedPlaintext ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-400/30 dark:bg-amber-400/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                  Copy this key now
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <code className="flex-1 overflow-x-auto rounded-lg bg-white px-3 py-2 text-sm text-slate-800 dark:bg-gray-900 dark:text-gray-100">
                    {revealedPlaintext}
                  </code>
                  <button
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-amber-400/40 dark:bg-gray-800 dark:text-amber-100"
                    onClick={() => copyText(revealedPlaintext)}
                    type="button"
                  >
                    {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{primaryKey.name}</p>
                <p className="mt-1 font-mono text-sm tracking-wide text-slate-500 dark:text-gray-400">
                  {primaryKey.maskedKey}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-gray-400">
                  Updated {new Date(primaryKey.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
                  onClick={() => copyText(primaryKey.maskedKey)}
                  type="button"
                >
                  {copied && !revealedPlaintext ? (
                    <Check aria-hidden="true" className="size-4 text-emerald-600" />
                  ) : (
                    <Copy aria-hidden="true" className="size-4" />
                  )}
                  Copy masked
                </button>
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-60 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700"
                  disabled={keyBusy}
                  onClick={() => regenerateKey(primaryKey.id)}
                  type="button"
                >
                  {keyBusy ? (
                    <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <RefreshCw aria-hidden="true" className="size-4" />
                  )}
                  Regenerate
                </button>
              </div>
            </div>
            {keysError ? <p className="text-sm text-rose-600 dark:text-rose-400">{keysError}</p> : null}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
