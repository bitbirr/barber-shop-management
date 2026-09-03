"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("invitationId") || "";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function accept() {
    setPending(true);
    setError(null);
    const { error: acceptError } = await authClient.organization.acceptInvitation({
      invitationId,
    });
    setPending(false);
    if (acceptError) {
      setError(acceptError.message || "Could not accept invitation.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="auth-brand">Faded</p>
        <h1>Join a shop</h1>
        <p className="auth-copy">Sign in with the invited email, then accept this invitation.</p>
        {error ? <p className="auth-error">{error}</p> : null}
        <button type="button" onClick={accept} disabled={pending || !invitationId}>
          {pending ? "Joining…" : "Accept invitation"}
        </button>
        <p>
          <Link href="/login">Sign in first</Link>
        </p>
      </section>
    </main>
  );
}
