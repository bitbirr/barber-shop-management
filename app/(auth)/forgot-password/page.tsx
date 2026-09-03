"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const { error: resetError } = await authClient.requestPasswordReset({
      email: String(form.get("email") || ""),
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setPending(false);
    if (resetError) {
      setError(resetError.message || "Could not send reset email.");
      return;
    }
    setSent(true);
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="auth-brand">Faded</p>
        <h1>Reset password</h1>
        {sent ? (
          <p className="auth-copy">If that email exists, a reset link is on its way.</p>
        ) : (
          <>
            <p className="auth-copy">Enter your email and we’ll send a reset link.</p>
            <form onSubmit={onSubmit}>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required />
              </label>
              {error ? <p className="auth-error">{error}</p> : null}
              <button type="submit" disabled={pending}>
                {pending ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
        <p>
          <Link href="/login">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}
