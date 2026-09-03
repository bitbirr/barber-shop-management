"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { GoogleLogo } from "@/components/landing/google-logo";

export function SignInCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const { error: signInError } = await authClient.signIn.email({
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      callbackURL: next,
    });
    setPending(false);
    if (signInError) {
      setError(signInError.message || "Could not sign in.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function social(provider: "google" | "github") {
    setError(null);
    const { error: socialError } = await authClient.signIn.social({
      provider,
      callbackURL: next,
    });
    if (socialError) {
      setError(socialError.message || "Social sign-in is not configured yet.");
    }
  }

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[3rem] bg-gradient-to-br from-sky-200 to-coral-200 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative grid overflow-hidden rounded-5xl bg-white shadow-card ring-1 ring-sky-100 sm:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="relative hidden min-h-[28rem] overflow-hidden bg-gradient-to-b from-sky-700 via-sky-700 to-coral-600 p-6 text-white sm:flex sm:flex-col">
          <div className="absolute -right-10 -top-10 size-36 rounded-full bg-white/15" />
          <div className="absolute right-8 top-24 size-1.5 rounded-full bg-white/80" />
          <div className="absolute right-14 top-32 size-1 rounded-full bg-white/70" />
          <div className="absolute bottom-24 left-6 size-16 rounded-full border border-white/20" />
          <iconify-icon
            icon="ph:cloud-fill"
            width="88"
            className="absolute bottom-16 right-4 text-white/25"
          />
          <iconify-icon
            icon="ph:sun-horizon-fill"
            width="42"
            className="absolute bottom-28 right-16 text-white/35"
          />
          <div className="relative flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-white text-sky-600">
              <iconify-icon icon="ph:scissors-fill" width="20" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-800 uppercase tracking-[0.14em]">
              <iconify-icon icon="ph:lightning-fill" width="12" />
              Addis
            </span>
          </div>
          <div className="relative mt-auto space-y-2 pb-2">
            <p className="text-xl font-900 leading-snug">Fill every chair this Saturday.</p>
            <p className="text-sm font-700 text-white/80">Bit-Barber System for Ethiopian shops.</p>
          </div>
        </aside>

        <div className="p-7 sm:p-9">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <h2 className="text-3xl font-900 tracking-tight text-ink-900">Sign in</h2>
            <p className="flex items-center gap-1 text-sm font-700 text-ink-500">
              welcome back
              <iconify-icon icon="ph:smiley-fill" width="16" className="text-coral-500" />
            </p>
          </div>
          <p className="mb-6 text-sm font-700 text-ink-500">
            New here?{" "}
            <Link href="/signup" className="text-sky-700 hover:underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={onSubmit} className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-800 text-ink-700">
              Work email
              <span className="relative">
                <iconify-icon
                  icon="ph:envelope-simple-bold"
                  width="18"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
                />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@shop.et"
                  className="h-12 w-full rounded-2xl border-2 border-sky-100 bg-sky-50/60 pl-11 pr-4 font-700 text-ink-900 outline-none placeholder:text-ink-500/50 focus:border-sky-400 focus:ring-4 focus:ring-[rgba(56,189,248,0.18)]"
                />
              </span>
            </label>

            <label className="grid gap-1.5 text-sm font-800 text-ink-700">
              <span className="flex items-center justify-between">
                Password
                <Link href="/forgot-password" className="text-xs font-800 text-sky-700 hover:underline">
                  Forgot?
                </Link>
              </span>
              <span className="relative">
                <iconify-icon
                  icon="ph:lock-simple-bold"
                  width="18"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border-2 border-sky-100 bg-sky-50/60 pl-11 pr-12 font-700 text-ink-900 outline-none placeholder:text-ink-500/50 focus:border-sky-400 focus:ring-4 focus:ring-[rgba(56,189,248,0.18)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <iconify-icon icon={showPassword ? "ph:eye-slash-bold" : "ph:eye-bold"} width="18" />
                </button>
              </span>
            </label>

            {error ? <p className="text-sm font-700 text-coral-600">{error}</p> : null}

            <button
              type="submit"
              disabled={pending}
              className="group mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-coral-600 font-900 text-white shadow-soft transition active:scale-[0.98] disabled:opacity-70"
            >
              {pending ? "Continuing" : "Continue"}
              <iconify-icon
                icon="ph:arrow-right-bold"
                width="16"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-sky-100" />
            <span className="text-[11px] font-800 uppercase tracking-[0.22em] text-ink-500">or</span>
            <span className="h-px flex-1 bg-sky-100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => void social("google")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border-2 border-sky-100 bg-white font-800 text-ink-700 hover:border-sky-300 hover:bg-sky-50"
            >
              <GoogleLogo />
              Google
            </button>
            <button
              type="button"
              onClick={() => void social("github")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border-2 border-sky-100 bg-white font-800 text-ink-700 hover:border-sky-300 hover:bg-sky-50"
            >
              <iconify-icon icon="ph:github-logo-fill" width="18" />
              GitHub
            </button>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 left-4 inline-flex animate-[plume-float_7s_ease-in-out_infinite] items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-800 text-ink-700 shadow-card ring-1 ring-sky-100">
        <iconify-icon icon="ph:shield-check-fill" width="16" className="text-sky-500" />
        Telebirr + CBE Birr ready
      </div>
    </div>
  );
}
