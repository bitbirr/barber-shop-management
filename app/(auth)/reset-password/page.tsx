"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthField, AuthScreen, authButtonClass, authInputClass } from "@/components/landing/auth-screen";

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
    router.push("/#signin");
  }

  return (
    <AuthScreen asideTitle="Pick a new password." asideBody="Make it long, then get back to your canvas.">
      <h1 className="mb-6 text-3xl font-900 tracking-tight text-ink-900">Choose a new password</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <AuthField label="New password" icon="ph:lock-simple-bold">
          <input name="password" type="password" autoComplete="new-password" minLength={12} required className={authInputClass} />
        </AuthField>
        <AuthField label="Confirm password" icon="ph:lock-simple-bold">
          <input name="confirm" type="password" autoComplete="new-password" minLength={12} required className={authInputClass} />
        </AuthField>
        {error ? <p className="text-sm font-700 text-coral-600">{error}</p> : null}
        <button type="submit" disabled={pending} className={authButtonClass}>
          {pending ? "Saving" : "Update password"}
        </button>
      </form>
      <p className="mt-6 text-sm font-700 text-ink-500">
        <Link href="/#signin" className="text-sky-700 hover:underline">Back to sign in</Link>
      </p>
    </AuthScreen>
  );
}
