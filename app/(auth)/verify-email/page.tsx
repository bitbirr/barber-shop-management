import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <p className="auth-brand">Faded</p>
        <h1>Check your email</h1>
        <p className="auth-copy">
          We sent a verification link. Open it to activate your account, then sign in.
        </p>
        <p>
          <Link href="/login">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}
