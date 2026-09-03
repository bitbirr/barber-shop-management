"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthField, AuthScreen, authButtonClass, authInputClass } from "@/components/landing/auth-screen";

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
    <AuthScreen asideTitle="Forgot it? We have you." asideBody="We will send a reset link if that email is in Plume.">
      <h1 className="text-3xl font-900 tracking-tight text-ink-900">Reset password</h1>
      {sent ? (
        <p className="mt-4 font-700 leading-relaxed text-ink-500">If that email exists, a reset link is on its way. Check your inbox, then come back to sign in.</p>
      ) : (
        <>
          <p className="mt-2 mb-6 font-700 text-ink-500">Enter your work email and we will send a reset link.</p>
          <form onSubmit={onSubmit} className="grid gap-4">
            <AuthField label="Work email" icon="ph:envelope-simple-bold">
              <input name="email" type="email" autoComplete="email" required placeholder="you@studio.com" className={authInputClass} />
            </AuthField>
            {error ? <p className="text-sm font-700 text-coral-600">{error}</p> : null}
            <button type="submit" disabled={pending} className={authButtonClass}>
              {pending ? "Sending" : "Send reset link"}
            </button>
          </form>
        </>
      )}
      <p className="mt-6 text-sm font-700 text-ink-500">
        <Link href="/#signin" className="text-sky-700 hover:underline">Back to sign in</Link>
      </p>
    </AuthScreen>
  );
}
