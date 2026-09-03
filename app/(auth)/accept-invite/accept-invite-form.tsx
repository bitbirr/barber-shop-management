"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthScreen, authButtonClass } from "@/components/landing/auth-screen";

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
    <AuthScreen asideTitle="You are invited in." asideBody="Join the workspace and start shipping UI together.">
      <h1 className="text-3xl font-900 tracking-tight text-ink-900">Join a workspace</h1>
      <p className="mt-3 mb-6 font-700 text-ink-500">Sign in with the invited email, then accept this invitation.</p>
      {error ? <p className="mb-4 text-sm font-700 text-coral-600">{error}</p> : null}
      <button type="button" onClick={accept} disabled={pending || !invitationId} className={authButtonClass}>
        {pending ? "Joining" : "Accept invitation"}
      </button>
      <p className="mt-6 text-sm font-700 text-ink-500">
        <Link href="/#signin" className="text-sky-700 hover:underline">Sign in first</Link>
      </p>
    </AuthScreen>
  );
}
