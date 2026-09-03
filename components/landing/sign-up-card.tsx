"use client";

import "iconify-icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthField, AuthScreen, authButtonClass, authInputClass } from "@/components/landing/auth-screen";
import { GoogleLogo } from "@/components/landing/google-logo";

export function SignUpCard() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const { error: signUpError } = await authClient.signUp.email({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      callbackURL: `${window.location.origin}/dashboard`,
    });
    setPending(false);
    if (signUpError) {
      setError(signUpError.message || "Could not create account.");
      return;
    }
    router.push("/verify-email");
  }

  async function social(provider: "google" | "github") {
    setError(null);
    const { error: socialError } = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
    if (socialError) {
      setError(socialError.message || "Social sign-in is not configured yet.");
    }
  }

  return (
    <AuthScreen
      asideTitle="Open the floor in minutes."
      asideBody="Name the shop, add chairs, start taking ETB."
    >
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h1 className="text-3xl font-900 tracking-tight text-ink-900">Create account</h1>
        <p className="flex items-center gap-1 text-sm font-700 text-ink-500">
          welcome in
          <iconify-icon icon="ph:sparkle-fill" width="16" className="text-coral-500" />
        </p>
      </div>
      <p className="mb-6 text-sm font-700 text-ink-500">
        Already here?{" "}
        <Link href="/#signin" className="text-sky-700 hover:underline">
          Sign in
        </Link>
      </p>

      <form onSubmit={onSubmit} className="grid gap-4">
        <AuthField label="Name" icon="ph:user-bold">
          <input name="name" type="text" autoComplete="name" required placeholder="Dawit Bekele" className={authInputClass} />
        </AuthField>
        <AuthField label="Work email" icon="ph:envelope-simple-bold">
          <input name="email" type="email" autoComplete="email" required placeholder="you@shop.et" className={authInputClass} />
        </AuthField>
        <AuthField
          label="Password"
          icon="ph:lock-simple-bold"
          extra={<span className="text-xs font-700 text-ink-500">12+ characters</span>}
        >
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={12}
            required
            placeholder="••••••••••••"
            className={`${authInputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <iconify-icon icon={showPassword ? "ph:eye-slash-bold" : "ph:eye-bold"} width="18" />
          </button>
        </AuthField>
        {error ? <p className="text-sm font-700 text-coral-600">{error}</p> : null}
        <button type="submit" disabled={pending} className={authButtonClass}>
          {pending ? "Creating" : "Open my shop"}
          <iconify-icon icon="ph:arrow-right-bold" width="16" className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-sky-100" />
        <span className="text-[11px] font-800 uppercase tracking-[0.22em] text-ink-500">or</span>
        <span className="h-px flex-1 bg-sky-100" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => void social("google")} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border-2 border-sky-100 bg-white font-800 text-ink-700 hover:border-sky-300 hover:bg-sky-50">
          <GoogleLogo />
          Google
        </button>
        <button type="button" onClick={() => void social("github")} className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border-2 border-sky-100 bg-white font-800 text-ink-700 hover:border-sky-300 hover:bg-sky-50">
          <iconify-icon icon="ph:github-logo-fill" width="18" />
          GitHub
        </button>
      </div>
    </AuthScreen>
  );
}
