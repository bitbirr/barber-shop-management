"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="auth-brand">Faded</p>
        <h1>Create your shop account</h1>
        <p className="auth-copy">We’ll send a verification email before you can sign in.</p>
        <form onSubmit={onSubmit}>
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
            />
          </label>
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit" disabled={pending}>
            {pending ? "Creating…" : "Create account"}
          </button>
        </form>
        <p>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
