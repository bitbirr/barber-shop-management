"use client";

import "iconify-icon";
import Image from "next/image";
import { SignInCard } from "@/components/landing/sign-in-card";
import { HandDrawnUnderline } from "@/components/landing/hand-drawn-underline";
import { BrandMark } from "@/components/landing/brand-mark";

const ticker = [
  "Meskel flash sale: 30% off Shop plan for 30 days",
  "Telebirr and CBE Birr on the till",
  "Addis launch: first 200 shops get SMS packs free",
  "Walk-ins, WhatsApp, and chair calendars in one floor",
  "ETB reporting. No dollar dashboards.",
];

const shops = [
  { icon: "ph:scissors-fill", name: "Bole Fade House" },
  { icon: "ph:crown-fill", name: "Piassa Lineup" },
  { icon: "ph:lightning-fill", name: "Merkato Kings" },
  { icon: "ph:sun-horizon-fill", name: "Hawassa Clip" },
  { icon: "ph:map-pin-fill", name: "Bahir Dar Barbers" },
];

const features = [
  {
    icon: "ph:calendar-check-fill",
    title: "Chair calendar that fills itself",
    body: "Walk-ins, WhatsApp bookings, and standing Saturday slots on one board. Your barbers see who is next without shouting across the floor.",
    tint: "bg-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white",
  },
  {
    icon: "ph:currency-circle-dollar-fill",
    title: "Till in ETB, not guesswork",
    body: "Close the day in birr. Split Telebirr, CBE Birr, and cash. Know which fade paid the rent before you lock the door.",
    tint: "bg-coral-300/40 text-coral-600 group-hover:bg-coral-500 group-hover:text-white",
  },
  {
    icon: "ph:broadcast-fill",
    title: "Bring regulars back",
    body: "SMS and WhatsApp nudges when a client is overdue. Built for Addis traffic, not Silicon Valley drip campaigns.",
    tint: "bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white",
  },
];

const playbook = [
  { icon: "ph:armchair-fill", title: "Three-chair floor", remixes: "Used in Bole", tint: "bg-sky-100 text-sky-600" },
  { icon: "ph:users-three-fill", title: "Saturday rush roster", remixes: "Used in Piassa", tint: "bg-coral-300/50 text-coral-600" },
  { icon: "ph:device-mobile-fill", title: "Telebirr checkout", remixes: "Used in Merkato", tint: "bg-sky-100 text-sky-700" },
  { icon: "ph:megaphone-fill", title: "Eid and Meskel promos", remixes: "Seasonal pack", tint: "bg-coral-300/40 text-coral-500" },
];

const stickers = [
  { src: "/marketing/sticker-fade.png", alt: "Fade clippers sticker", className: "sticker-float left-2 top-6 w-20 sm:w-24" },
  { src: "/marketing/sticker-birr.png", alt: "Birr coin sticker", className: "sticker-float-slow right-4 top-16 w-16 sm:right-8 sm:w-20" },
  { src: "/marketing/sticker-chair.png", alt: "Barber chair sticker", className: "sticker-float bottom-4 right-8 w-20 sm:bottom-8 sm:w-24" },
];

export function BitBarberLanding() {
  return (
    <div className="plume relative min-h-screen overflow-x-hidden bg-cloud text-ink-900">
      <div className="pointer-events-none absolute inset-0 dotgrid opacity-40" aria-hidden="true" />
      <div className="ghost-blob pointer-events-none absolute -left-16 top-24 size-64 rounded-full bg-sky-200/70" />
      <div className="ghost-blob-slow pointer-events-none absolute right-[-4rem] top-40 size-72 rounded-full bg-coral-300/50" />

      <div className="relative z-50 overflow-hidden bg-ink-900 text-gold-400">
        <div className="promo-marquee flex w-max gap-10 whitespace-nowrap py-2 text-[11px] font-800 uppercase tracking-[0.18em]">
          {[...ticker, ...ticker].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2 text-sky-50">
              <span className="size-1.5 rounded-full bg-gold-400" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/75 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <nav className="hidden items-center gap-7 text-sm font-700 text-ink-700 lg:flex">
            <a href="#features" className="hover:text-sky-500">The floor</a>
            <a href="#playbook" className="hover:text-sky-500">Playbook</a>
            <a href="#promo" className="hover:text-sky-500">Launch offer</a>
            <a href="#pricing" className="hover:text-sky-500">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#signin" className="hidden text-sm font-800 text-ink-700 hover:text-sky-500 sm:inline">
              Log in
            </a>
            <a
              href="#signin"
              className="promo-pulse group inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-900 text-white hover:bg-sky-500"
            >
              Open my shop
              <iconify-icon icon="ph:arrow-right-bold" width="14" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-cloud to-cloud">
          <div className="absolute inset-0 dotgrid opacity-50" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-20">
            <div className="text-center lg:text-left">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-800 text-ink-700 shadow-soft ring-1 ring-sky-100">
                <iconify-icon icon="ph:map-pin-fill" width="16" className="text-coral-500" />
                Built for Ethiopian barber shops
              </p>
              <h1 className="text-4xl font-900 tracking-tight text-ink-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
                Run the shop you{" "}
                <span className="text-sky-500">promised</span>, from the first{" "}
                <span className="relative inline-block">
                  fade
                  <HandDrawnUnderline />
                </span>{" "}
                to close.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg font-700 leading-relaxed text-ink-500 lg:mx-0">
                Bit-Barber System is the all-in-one SaaS for barber shops in Ethiopia. Book chairs, take birr, roster the team, and keep regulars coming back. One floor. Zero paper chaos.
              </p>
              <ul className="mt-6 flex flex-col items-center gap-2 text-sm font-800 text-ink-700 sm:flex-row sm:justify-center lg:justify-start">
                {["14-day free trial", "ETB pricing", "Telebirr ready"].map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <iconify-icon icon="ph:check-circle-fill" width="18" className="text-sky-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <div className="flex -space-x-2">
                  {["from-sky-400 to-sky-600", "from-coral-400 to-coral-600", "from-gold-400 to-sky-500", "from-ink-900 to-sky-700"].map(
                    (tone, index) => (
                      <span
                        key={tone}
                        className={`grid size-10 place-items-center rounded-full bg-gradient-to-br ${tone} text-[10px] font-900 text-white ring-2 ring-white`}
                      >
                        {index === 3 ? "+1k" : ""}
                      </span>
                    )
                  )}
                </div>
                <p className="text-sm font-700 text-ink-500">Shops from Bole to Bahir Dar on the floor this week.</p>
              </div>
            </div>
            <div id="signin" className="scroll-mt-24">
              <SignInCard />
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-5 pb-6 sm:px-8">
          <div className="relative overflow-hidden rounded-5xl shadow-card ring-1 ring-sky-100">
            <Image
              src="/marketing/bit-barber-hero.png"
              alt="Barber chairs and team on a busy Addis Ababa shop floor"
              width={1600}
              height={900}
              className="h-56 w-full object-cover sm:h-80"
              priority
            />
            {stickers.map((sticker) => (
              <Image
                key={sticker.src}
                src={sticker.src}
                alt={sticker.alt}
                width={160}
                height={160}
                className={`pointer-events-none absolute drop-shadow-xl ${sticker.className}`}
              />
            ))}
            <p className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-800 text-ink-900 shadow-soft">
              Live from an Addis floor
            </p>
          </div>
        </section>

        <section className="border-y border-sky-100 bg-white py-10">
          <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
            <p className="text-xs font-800 uppercase tracking-[0.22em] text-ink-500">On the floor with</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {shops.map((logo) => (
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
            <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-800 text-sky-700">Why shops switch</p>
            <h2 className="mt-4 max-w-xl text-3xl font-900 tracking-tight text-ink-900 sm:text-4xl">
              One system. The whole shop.
            </h2>
            <p className="mt-3 max-w-xl text-base font-700 leading-relaxed text-ink-500">
              Appointments, chairs, staff, till, and regulars. Bit-Barber System is the SaaS stack Ethiopian barbers actually finish the day with.
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

        <section id="playbook" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-sky-700 via-sky-700 to-coral-600 py-20 text-white">
          <div className="absolute inset-0 dotgrid opacity-25" aria-hidden="true" />
          <div className="ghost-blob pointer-events-none absolute -right-10 top-8 size-56 rounded-full bg-white/20" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-800">Shop playbook</p>
              <h2 className="mt-4 text-3xl font-900 tracking-tight sm:text-4xl">
                Steal a setup that already works in Ethiopia.
              </h2>
              <p className="mt-4 max-w-md text-base font-700 leading-relaxed text-sky-50/85">
                Three-chair floors, Saturday rush, holiday promo packs. Start from a shop that looks like yours, then make it yours.
              </p>
              <a
                href="#promo"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-900 text-sky-700"
              >
                Grab the launch offer
                <iconify-icon icon="ph:arrow-up-right-bold" width="16" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {playbook.map((item, index) => (
                <article
                  key={item.title}
                  className={`prompt-card ghost-blob rounded-3xl bg-white p-4 text-ink-900 shadow-card ${index % 2 === 1 ? "mt-6" : ""}`}
                >
                  <span className={`mb-3 grid size-11 place-items-center rounded-2xl ${item.tint}`}>
                    <iconify-icon icon={item.icon} width="20" />
                  </span>
                  <p className="font-900">{item.title}</p>
                  <p className="text-sm font-700 text-ink-500">{item.remixes}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="promo" className="scroll-mt-20 py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="relative overflow-hidden rounded-5xl shadow-lift ring-1 ring-sky-100">
              <Image
                src="/marketing/bit-barber-promo.png"
                alt="Bit-Barber System campaign artwork with clippers, chairs, and gold energy"
                width={1600}
                height={900}
                className="h-64 w-full object-cover sm:h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-900/80 via-ink-900/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                <p className="promo-pulse mb-3 inline-flex w-fit rounded-full bg-gold-400 px-3 py-1 text-xs font-900 uppercase tracking-[0.16em] text-ink-900">
                  Limited drop
                </p>
                <h2 className="max-w-lg text-3xl font-900 text-white sm:text-4xl">Meskel shop sprint.</h2>
                <p className="mt-2 max-w-md font-700 text-sky-50/90">
                  30% off the Shop plan for 30 days. Free SMS pack for the first 200 Ethiopian shops. Claim it before the chairs fill.
                </p>
                <a
                  href="#signin"
                  className="mt-5 inline-flex w-fit rounded-full bg-white px-5 py-3 font-900 text-ink-900"
                >
                  Claim the sprint
                </a>
              </div>
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
              <span className="relative mx-auto mb-5 grid size-14 place-items-center overflow-hidden rounded-3xl shadow-soft ring-1 ring-sky-100">
                <img src="/brand/logo-mark.png" alt="" className="size-14 object-cover" />
              </span>
              <h2 className="relative text-3xl font-900 tracking-tight text-ink-900 sm:text-4xl">
                Priced in birr. Built for one-chair to chain.
              </h2>
              <p className="relative mx-auto mt-3 max-w-md font-700 text-ink-500">
                Starter 499 ETB. Shop 1,499 ETB. Chain 3,999 ETB. Start free, then pick a plan when the floor is humming.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#signin"
                  className="inline-flex rounded-full bg-gradient-to-r from-sky-700 to-coral-600 px-6 py-3 font-900 text-white shadow-soft"
                >
                  Start the free trial
                </a>
                <a
                  href="#features"
                  className="inline-flex rounded-full bg-white px-6 py-3 font-900 text-ink-700 ring-2 ring-sky-100"
                >
                  See the floor tools
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
              Bit-Barber System. All-in-one SaaS for Ethiopian barber shops that want a cleaner floor and a fuller till.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { href: "https://t.me", icon: "ph:telegram-logo-fill", label: "Telegram" },
                { href: "https://www.facebook.com", icon: "ph:facebook-logo-fill", label: "Facebook" },
                { href: "https://www.tiktok.com", icon: "ph:tiktok-logo-fill", label: "TikTok" },
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
              <li><a href="#features" className="hover:text-sky-400">The floor</a></li>
              <li><a href="#playbook" className="hover:text-sky-400">Playbook</a></li>
              <li><a href="#promo" className="hover:text-sky-400">Launch offer</a></li>
              <li><a href="#pricing" className="hover:text-sky-400">Pricing</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-900">Company</p>
            <ul className="space-y-2 text-sm font-700 text-sky-100/75">
              <li><a href="#features" className="hover:text-sky-400">About BitBirr</a></li>
              <li><a href="mailto:info@bitbirr.net" className="hover:text-sky-400">Contact</a></li>
              <li><a href="#promo" className="hover:text-sky-400">Partner shops</a></li>
            </ul>
          </div>
          <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
            <p className="font-900">Shop flash alerts</p>
            <label className="sr-only" htmlFor="newsletter-email">Email</label>
            <div className="flex gap-2">
              <input
                id="newsletter-email"
                type="email"
                placeholder="owner@shop.et"
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
            <p>c 2026 Bit-Barber System. Made in Ethiopia, for the chair.</p>
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
