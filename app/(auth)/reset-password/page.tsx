"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");
    if (password !== confirm) {
      setPending(false);
      setError("Passwords do not match.");
      return;
    }
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
    });
    setPending(false);
    if (resetError) {
      setError(resetError.message || "Could not reset password.");
      return;
    }
    router.push("/login");
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="auth-brand">Faded</p>
        <h1>Choose a new password</h1>
        <form onSubmit={onSubmit}>
          <label>
            New password
            <input name="password" type="password" autoComplete="new-password" minLength={12} required />
          </label>
          <label>
            Confirm password
            <input name="confirm" type="password" autoComplete="new-password" minLength={12} required />
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Update password"}
          </button>
        </form>
        <p>
          <Link href="/login">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}
