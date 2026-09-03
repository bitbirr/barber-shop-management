"use client";

import "iconify-icon";
import Link from "next/link";
import { SignInCard } from "@/components/landing/sign-in-card";
import { HandDrawnUnderline } from "@/components/landing/hand-drawn-underline";
import { BrandMark } from "@/components/landing/brand-mark";

const logos = [
  { icon: "ph:planet-fill", name: "Orbit" },
  { icon: "ph:cube-fill", name: "Stackly" },
  { icon: "ph:lightning-fill", name: "Boltline" },
  { icon: "ph:leaf-fill", name: "Fernly" },
  { icon: "ph:diamond-fill", name: "Prism" },
];

const features = [
  {
    icon: "ph:magic-wand-fill",
    title: "Prompt to mockup",
    body: "Describe the screen in a sentence. Plume drafts layout, type, and color so you can react instead of starting from a blank canvas.",
    tint: "bg-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white",
  },
  {
    icon: "ph:infinity-fill",
    title: "Infinite canvas",
    body: "Keep every variation in one place. Zoom, branch, and remix without losing the thread of what you were trying to say.",
    tint: "bg-coral-300/40 text-coral-600 group-hover:bg-coral-500 group-hover:text-white",
  },
  {
    icon: "ph:code-fill",
    title: "Export to code",
    body: "Hand off clean, readable UI when you are ready. No mystery layers, no leftover placeholder boxes.",
    tint: "bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white",
  },
];

const prompts = [
  { icon: "ph:chart-line-up-fill", title: "Analytics dashboard", remixes: "214 remixes", tint: "bg-sky-100 text-sky-600" },
  { icon: "ph:smiley-fill", title: "Friendly login", remixes: "186 remixes", tint: "bg-coral-300/50 text-coral-600" },
  { icon: "ph:credit-card-fill", title: "Checkout flow", remixes: "142 remixes", tint: "bg-sky-100 text-sky-700" },
  { icon: "ph:chat-teardrop-dots-fill", title: "Onboarding chat", remixes: "98 remixes", tint: "bg-coral-300/40 text-coral-500" },
];

export function PlumeLanding() {
  return (
    <div className="plume relative min-h-screen overflow-x-hidden bg-cloud text-ink-900">
      <div className="pointer-events-none absolute inset-0 dotgrid opacity-40" aria-hidden="true" />
      <div className="ghost-blob pointer-events-none absolute -left-16 top-24 size-64 rounded-full bg-sky-200/70" />
      <div className="ghost-blob-slow pointer-events-none absolute right-[-4rem] top-40 size-72 rounded-full bg-coral-300/50" />
      <div className="ghost-blob-fast pointer-events-none absolute left-1/3 top-[28rem] size-48 rounded-full bg-sky-300/40" />

      <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/75 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <nav className="hidden items-center gap-7 text-sm font-700 text-ink-700 lg:flex">
            <a href="#features" className="hover:text-sky-500">Features</a>
            <a href="#library" className="hover:text-sky-500">Prompt library</a>
            <a href="#showcase" className="hover:text-sky-500">Showcase</a>
            <a href="#pricing" className="hover:text-sky-500">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#signin" className="hidden text-sm font-800 text-ink-700 hover:text-sky-500 sm:inline">
              Log in
            </a>
            <a
              href="#signin"
              className="group inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-900 text-white hover:bg-sky-500"
            >
              Start free
              <iconify-icon icon="ph:arrow-right-bold" width="14" className="group-hover:text-white" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-cloud to-cloud">
          <div className="absolute inset-0 dotgrid opacity-50" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
            <div className="text-center lg:text-left">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-800 text-ink-700 shadow-soft ring-1 ring-sky-100">
                <iconify-icon icon="ph:sparkle-fill" width="16" className="text-coral-500" />
                Now with one-prompt page generation
              </p>
              <h1 className="text-4xl font-900 tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
                Design what you&apos;re{" "}
                <span className="text-sky-500">imagining</span>, in plain{" "}
                <span className="relative inline-block">
                  words
                  <HandDrawnUnderline />
                </span>
                .
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg font-700 leading-relaxed text-ink-500 lg:mx-0">
                Plume is a friendly design agent that turns a sentence into a screen you can actually ship. Warm, fast, and a little bit playful on purpose.
              </p>
              <ul className="mt-6 flex flex-col items-center gap-2 text-sm font-800 text-ink-700 sm:flex-row sm:justify-center lg:justify-start">
                {["Free to start", "No card needed", "Export to code"].map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <iconify-icon icon="ph:check-circle-fill" width="18" className="text-sky-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <div className="flex -space-x-2">
                  {["from-sky-400 to-sky-600", "from-coral-400 to-coral-600", "from-sky-300 to-sky-500", "from-ink-900 to-sky-700"].map(
                    (tone, index) => (
                      <span
                        key={tone}
                        className={`grid size-10 place-items-center rounded-full bg-gradient-to-br ${tone} text-xs font-900 text-white ring-2 ring-white`}
                      >
                        {index === 3 ? "+9k" : ""}
                      </span>
                    )
                  )}
                </div>
                <p className="text-sm font-700 text-ink-500">Builders shipping UI with Plume every week.</p>
              </div>
            </div>
            <div id="signin" className="scroll-mt-24">
              <SignInCard />
            </div>
          </div>
        </section>

        <section className="border-y border-sky-100 bg-white py-10">
          <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <p className="text-xs font-800 uppercase tracking-[0.22em] text-ink-500">Loved by teams at</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {logos.map((logo) => (
                <span key={logo.name} className="inline-flex items-center gap-2 font-900 text-ink-500/70">
                  <iconify-icon icon={logo.icon} width="18" />
                  {logo.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-800 text-sky-700">Why builders pick Plume</p>
            <h2 className="mt-4 max-w-xl text-3xl font-900 tracking-tight text-ink-900 sm:text-4xl">
              A design partner that actually keeps up.
            </h2>
            <p className="mt-3 max-w-xl text-base font-700 leading-relaxed text-ink-500">
              Less fighting tools. More showing the idea. Plume stays in the conversation until the screen feels right.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group rounded-4xl bg-white p-6 shadow-card ring-1 ring-sky-100 transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className={`mb-5 grid size-14 place-items-center rounded-3xl transition ${feature.tint}`}>
                    <iconify-icon icon={feature.icon} width="26" />
                  </span>
                  <h3 className="text-xl font-900 text-ink-900">{feature.title}</h3>
                  <p className="mt-2 text-sm font-700 leading-relaxed text-ink-500">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="library" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-sky-700 via-sky-700 to-coral-600 py-20 text-white">
          <div className="absolute inset-0 dotgrid opacity-25" aria-hidden="true" />
          <div className="ghost-blob pointer-events-none absolute -right-10 top-8 size-56 rounded-full bg-white/20" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-800">Prompt library</p>
              <h2 className="mt-4 text-3xl font-900 tracking-tight sm:text-4xl">
                Start from something worth sharing.
              </h2>
              <p className="mt-4 max-w-md text-base font-700 leading-relaxed text-sky-50/85">
                Steal a starting point, then make it yours. Every card is a prompt you can remix without losing the original spark.
              </p>
              <a
                href="#showcase"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-900 text-sky-700"
              >
                Explore the library
                <iconify-icon icon="ph:arrow-up-right-bold" width="16" />
              </a>
            </div>
            <div id="showcase" className="grid grid-cols-2 gap-4">
              {prompts.map((prompt, index) => (
                <article
                  key={prompt.title}
                  className={`prompt-card ghost-blob rounded-3xl bg-white p-4 text-ink-900 shadow-card ${index % 2 === 1 ? "mt-6" : ""}`}
                >
                  <span className={`mb-3 grid size-11 place-items-center rounded-2xl ${prompt.tint}`}>
                    <iconify-icon icon={prompt.icon} width="20" />
                  </span>
                  <p className="font-900">{prompt.title}</p>
                  <p className="text-sm font-700 text-ink-500">{prompt.remixes}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="relative py-20">
          <div className="ghost-blob pointer-events-none absolute left-10 top-8 size-40 rounded-full bg-sky-200/80" />
          <div className="ghost-blob-slow pointer-events-none absolute right-16 bottom-6 size-44 rounded-full bg-coral-300/50" />
          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <div className="relative overflow-hidden rounded-5xl bg-white px-6 py-14 text-center shadow-card ring-1 ring-sky-100 sm:px-12">
              <div className="ghost-blob pointer-events-none absolute -left-8 -top-10 size-36 rounded-full bg-sky-200/80" />
              <div className="ghost-blob-fast pointer-events-none absolute -right-6 -bottom-12 size-40 rounded-full bg-coral-300/60" />
              <span className="relative mx-auto mb-5 grid size-14 place-items-center rounded-3xl bg-gradient-to-br from-sky-400 to-coral-400 text-white">
                <iconify-icon icon="ph:feather-fill" width="24" />
              </span>
              <h2 className="relative text-3xl font-900 tracking-tight text-ink-900 sm:text-4xl">
                Your next screen is one sentence away.
              </h2>
              <p className="relative mx-auto mt-3 max-w-md font-700 text-ink-500">
                Start free, no card. Open a canvas, say what you want, and keep going until it feels like you.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#signin"
                  className="inline-flex rounded-full bg-gradient-to-r from-sky-700 to-coral-600 px-6 py-3 font-900 text-white shadow-soft"
                >
                  Create your canvas
                </a>
                <a
                  href="#features"
                  className="inline-flex rounded-full bg-white px-6 py-3 font-900 text-ink-700 ring-2 ring-sky-100"
                >
                  See how it works
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink-900 text-sky-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
          <div>
            <BrandMark light />
            <p className="mt-4 text-sm font-700 leading-relaxed text-sky-100/70">
              A warm design agent for people who think in sentences and ship in screens.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { href: "https://x.com", icon: "ph:x-logo-fill", label: "X" },
                { href: "https://github.com", icon: "ph:github-logo-fill", label: "GitHub" },
                { href: "https://discord.com", icon: "ph:discord-logo-fill", label: "Discord" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="grid size-10 place-items-center rounded-2xl bg-white/10 text-sky-50 hover:bg-white/15 hover:text-sky-400"
                >
                  <iconify-icon icon={item.icon} width="18" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 font-900">Product</p>
            <ul className="space-y-2 text-sm font-700 text-sky-100/75">
              <li><a href="#features" className="hover:text-sky-400">Features</a></li>
              <li><a href="#library" className="hover:text-sky-400">Prompt library</a></li>
              <li><a href="#showcase" className="hover:text-sky-400">Showcase</a></li>
              <li><a href="#pricing" className="hover:text-sky-400">Pricing</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-900">Company</p>
            <ul className="space-y-2 text-sm font-700 text-sky-100/75">
              <li><a href="#features" className="hover:text-sky-400">About</a></li>
              <li><a href="#library" className="hover:text-sky-400">Careers</a></li>
              <li><a href="mailto:hello@plume.labs" className="hover:text-sky-400">Contact</a></li>
            </ul>
          </div>
          <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
            <p className="font-900">Stay in the loop</p>
            <label className="sr-only" htmlFor="newsletter-email">Email</label>
            <div className="flex gap-2">
              <input
                id="newsletter-email"
                type="email"
                placeholder="studio@plume.labs"
                className="h-11 min-w-0 flex-1 rounded-2xl border-0 bg-white/10 px-4 font-700 text-sky-50 outline-none placeholder:text-sky-100/50 focus:ring-2 focus:ring-sky-400"
              />
              <button type="submit" className="grid size-11 place-items-center rounded-2xl bg-sky-400 text-ink-900" aria-label="Send">
                <iconify-icon icon="ph:paper-plane-tilt-fill" width="18" />
              </button>
            </div>
          </form>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-sm font-700 text-sky-100/70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>c 2026 Plume Labs. Made with care, not em-dashes.</p>
            <div className="flex gap-4">
              <a href="#features" className="hover:text-sky-400">Privacy</a>
              <a href="#features" className="hover:text-sky-400">Terms</a>
              <a href="#features" className="hover:text-sky-400">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
