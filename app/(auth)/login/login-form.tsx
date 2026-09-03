"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="auth-brand">Faded</p>
        <h1>Sign in</h1>
        <p className="auth-copy">Staff access for your shop workspace.</p>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p>
          <Link href="/forgot-password">Forgot password?</Link>
        </p>
        <p>
          New shop? <Link href="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
