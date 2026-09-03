"use client";

import "iconify-icon";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { BrandMark, brandAssets } from "@/components/landing/brand-mark";

type AuthScreenProps = {
  asideTitle: string;
  asideBody: string;
  children: ReactNode;
};

export function AuthScreen({ asideTitle, asideBody, children }: AuthScreenProps) {
  return (
    <div className="plume relative min-h-screen overflow-hidden bg-cloud text-ink-900">
      <div className="pointer-events-none absolute inset-0 dotgrid opacity-40" aria-hidden="true" />
      <div className="ghost-blob pointer-events-none absolute -left-16 top-16 size-64 rounded-full bg-sky-200/70" />
      <div className="ghost-blob-slow pointer-events-none absolute right-[-5rem] top-32 size-72 rounded-full bg-coral-300/50" />

      <header className="relative z-10 border-b border-sky-100 bg-white/75 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <Link href="/#signin" className="text-sm font-800 text-ink-700 hover:text-sky-500">
            Log in
          </Link>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-6xl items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="relative w-full max-w-3xl">
          <div
            className="pointer-events-none absolute -inset-3 rounded-[3rem] bg-gradient-to-br from-sky-200 to-coral-200 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative grid overflow-hidden rounded-5xl bg-white shadow-card ring-1 ring-sky-100 sm:grid-cols-[200px_minmax(0,1fr)]">
            <aside className="relative hidden min-h-[26rem] overflow-hidden bg-gradient-to-b from-sky-700 via-sky-700 to-coral-600 p-6 text-white sm:flex sm:flex-col">
              <div className="absolute -right-10 -top-10 size-36 rounded-full bg-white/15" />
              <iconify-icon icon="ph:cloud-fill" width="88" className="absolute bottom-16 right-4 text-white/25" />
              <div className="relative flex items-center gap-2">
                <Image src={brandAssets.mark} alt="" width={72} height={72} className="size-10 rounded-2xl object-cover shadow-soft ring-1 ring-white/30" />
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-800 uppercase tracking-[0.14em]">
                  <iconify-icon icon="ph:sparkle-fill" width="12" />
                  Addis
                </span>
              </div>
              <div className="relative mt-auto space-y-2 pb-2">
                <p className="text-xl font-900 leading-snug">{asideTitle}</p>
                <p className="text-sm font-700 text-white/80">{asideBody}</p>
              </div>
            </aside>
            <div className="p-7 sm:p-9">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function AuthField({
  label,
  extra,
  icon,
  children,
}: {
  label: string;
  extra?: ReactNode;
  icon: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-800 text-ink-700">
      <span className="flex items-center justify-between">
        {label}
        {extra}
      </span>
      <span className="relative">
        <iconify-icon
          icon={icon}
          width="18"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
        />
        {children}
      </span>
    </label>
  );
}

export const authInputClass =
  "h-12 w-full rounded-2xl border-2 border-sky-100 bg-sky-50/60 pl-11 pr-4 font-700 text-ink-900 outline-none placeholder:text-ink-500/50 focus:border-sky-400 focus:ring-4 focus:ring-[rgba(56,189,248,0.18)]";

export const authButtonClass =
  "group mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-700 to-coral-600 font-900 text-white shadow-soft transition active:scale-[0.98] disabled:opacity-70";
