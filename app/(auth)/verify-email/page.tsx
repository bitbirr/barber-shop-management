import Link from "next/link";
import { AuthScreen, authButtonClass } from "@/components/landing/auth-screen";

export default function VerifyEmailPage() {
  return (
    <AuthScreen asideTitle="Almost there." asideBody="Open the email we just sent, then you are in.">
      <h1 className="text-3xl font-900 tracking-tight text-ink-900">Check your email</h1>
      <p className="mt-3 font-700 leading-relaxed text-ink-500">
        We sent a verification link. Open it to activate your shop, then sign in and open the floor.
      </p>
      <Link href="/#signin" className={`${authButtonClass} mt-8`}>
        Back to sign in
      </Link>
    </AuthScreen>
  );
}
