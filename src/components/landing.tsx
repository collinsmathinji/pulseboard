"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SocialLinks } from "@/components/social";
import { DEMO_FOUNDERS } from "@/lib/demos";
import { cn } from "@/lib/utils";

const RITUAL = [
  {
    n: "01",
    title: "Write the week",
    body: "Monday morning. MRR, paying users, runway, and the one sentence that has to move. Fifteen minutes. Then close the tabs.",
  },
  {
    n: "02",
    title: "Keep three",
    body: "Not a backlog. Three priorities you can actually finish before Friday. Check them off as you go. Nothing else gets a line.",
  },
  {
    n: "03",
    title: "Count to five",
    body: "A customer log with name, amount, and date. The only metric that matters before you have product-market fit.",
  },
] as const;

const FEATURED = DEMO_FOUNDERS[0];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("landing-in", inView && "is-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function DemoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    const video = videoRef.current;
    if (!video) return;
    void video.play().then(() => setPlaying(true));
  }

  return (
    <div className="relative mt-8 overflow-hidden border border-[var(--rule)] bg-[var(--ink)]">
      <video
        ref={videoRef}
        className="aspect-video w-full bg-[var(--ink)]"
        controls={playing}
        playsInline
        preload="auto"
        poster="/demo-poster.jpg"
        aria-label="Pulseboard product demo"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <source src="/demo.mp4" type="video/mp4" />
        <track
          src="/demo.vtt"
          kind="captions"
          srcLang="en"
          label="English"
          default
        />
      </video>
      {playing ? null : (
        <button
          type="button"
          onClick={play}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--ink)]/25 text-[var(--sheet)] transition hover:bg-[var(--ink)]/15"
        >
          <span className="landing-float flex h-14 w-14 items-center justify-center bg-[var(--brass)] text-[var(--ink)]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 5.8v10.4L17 11 8 5.8Z" />
            </svg>
          </span>
          <span className="bg-[var(--ink)] px-4 py-1.5 text-sm font-medium text-[var(--sheet)]">
            Play the 1-minute demo
          </span>
        </button>
      )}
    </div>
  );
}

function FounderPhoto({
  founder,
  size = 48,
  className,
}: {
  founder: (typeof DEMO_FOUNDERS)[number];
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative shrink-0 overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={founder.image}
        alt=""
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
      <span className="sr-only">{founder.name}</span>
    </span>
  );
}

function formatMrr(cents: number) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[var(--sheet)]"
        >
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="rounded"
          />
          <span className="font-serif text-[1.35rem] tracking-tight">
            Pulseboard
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "#demo", label: "Demo" },
            { href: "#voices", label: "Founders" },
            { href: "#pricing", label: "Price" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-[var(--sheet)]/75 transition hover:text-[var(--sheet)]"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login?next=/app"
            className="ml-2 px-3 py-2 text-sm text-[var(--sheet)]/75 transition hover:text-[var(--sheet)]"
          >
            Sign in
          </Link>
          <Link
            href="/signup?next=/billing"
            className="ml-1 bg-[var(--brass)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:brightness-105"
          >
            Start for $12
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-[var(--sheet)] md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            {open ? (
              <path
                d="M5 5l10 10M15 5 5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--sheet)]/15 bg-[var(--ink)] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {[
              { href: "#demo", label: "Demo" },
              { href: "#voices", label: "Founders" },
              { href: "#pricing", label: "Price" },
              { href: "/login?next=/app", label: "Sign in" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-3 text-base text-[var(--sheet)]/85"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/signup?next=/billing"
              className="mt-2 bg-[var(--brass)] px-4 py-3 text-center text-sm font-medium text-[var(--ink)]"
              onClick={() => setOpen(false)}
            >
              Start for $12
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function LandingPage({ founderCount = 0 }: { founderCount?: number }) {
  return (
    <div className="landing relative min-h-svh overflow-x-hidden">
      <div className="landing-grain" aria-hidden />

      {/* Hero — one composition: brand, headline, line, CTAs, full-bleed photo */}
      <section className="relative min-h-[100svh] bg-[var(--ink)] text-[var(--sheet)]">
        <div className="landing-hero-media absolute inset-0">
          <Image
            src="/hero-founder.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%] opacity-55 md:object-[68%_18%] md:opacity-70"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/88 to-[var(--ink)]/35 md:via-[var(--ink)]/75 md:to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-[var(--ink)]/50 md:to-[var(--ink)]/30"
            aria-hidden
          />
        </div>

        <SiteHeader />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 md:justify-center md:px-8 md:pb-24 md:pt-24">
          <div className="max-w-xl">
            <p
              className="landing-rise font-serif text-4xl tracking-tight text-[var(--brass)] sm:text-5xl md:text-6xl"
              style={{ animationDelay: "40ms" }}
            >
              Pulseboard
            </p>
            <span
              className="landing-underline mt-3 block h-px w-16 bg-[var(--brass)]"
              aria-hidden
            />
            <h1
              className="landing-rise mt-6 font-sans text-[clamp(2.4rem,7vw,4.25rem)] leading-[0.95] font-black tracking-[-0.035em]"
              style={{ animationDelay: "120ms" }}
            >
              Write the week.
            </h1>
            <p
              className="landing-rise mt-3 font-hand text-2xl leading-snug text-[var(--brass)] md:text-3xl"
              style={{ animationDelay: "160ms" }}
            >
              fifteen minutes. then close the tabs.
            </p>
            <p
              className="landing-rise mt-5 max-w-sm text-[0.95rem] leading-7 text-[var(--sheet)]/72"
              style={{ animationDelay: "200ms" }}
            >
              One Monday page for MRR, paying users, runway, and the three
              things that have to move.
            </p>
            <div
              className="landing-rise mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "280ms" }}
            >
              <Link
                href="/signup?next=/billing"
                className="inline-flex h-12 items-center justify-center bg-[var(--brass)] px-6 text-sm font-medium text-[var(--ink)] transition hover:brightness-105"
              >
                Start for $12
              </Link>
              <a
                href="#demo"
                className="inline-flex h-12 items-center justify-center border border-[var(--sheet)]/35 px-6 text-sm font-medium text-[var(--sheet)] transition hover:border-[var(--sheet)]/70"
              >
                Watch the demo
              </a>
            </div>
            {founderCount > 0 ? (
              <p
                className="landing-rise mt-6 font-hand text-xl text-[var(--sheet)]/65"
                style={{ animationDelay: "360ms" }}
              >
                {founderCount}{" "}
                {founderCount === 1 ? "founder" : "founders"} already writing
                the week
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section
        id="demo"
        className="scroll-mt-20 bg-[var(--paper)] px-5 py-16 text-[var(--ink)] md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-hand text-xl text-[var(--moss)]">product</p>
            <h2 className="mt-3 max-w-xl font-sans text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl md:text-5xl">
              The Monday page, in one minute.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--mute)]">
              Account, scorecard, customers, weekly review — the loop founders
              actually keep.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <DemoPlayer />
          </Reveal>
        </div>
      </section>

      {/* Featured voice */}
      <section className="border-y border-[var(--rule)] bg-[var(--sheet)] px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <FounderPhoto
                founder={FEATURED}
                size={96}
                className="border border-[var(--rule)]"
              />
              <div>
                <p className="font-hand text-[1.65rem] leading-snug text-[var(--ink)] md:text-[2rem]">
                  “{FEATURED.quote}”
                </p>
                <p className="mt-5 font-hand text-lg text-[var(--moss)]">
                  — {FEATURED.name}, {FEATURED.startup}
                </p>
                <p className="mt-1 text-sm text-[var(--mute)]">
                  {FEATURED.role} · {FEATURED.blurb}
                </p>
                <Link
                  href="/signup?next=/billing"
                  className="mt-5 inline-flex text-sm font-medium text-[var(--moss)] underline-offset-4 hover:underline"
                >
                  Try {FEATURED.name.split(" ")[0]}’s demo scorecard →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ritual */}
      <section
        id="ritual"
        className="scroll-mt-20 bg-[var(--paper)] px-5 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-hand text-xl text-[var(--moss)]">the ritual</p>
            <h2 className="mt-3 max-w-lg font-sans text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl md:text-5xl">
              Same page every Monday.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {RITUAL.map((item, i) => (
              <Reveal key={item.n} delay={i * 70}>
                <li className="border-t border-[var(--ink)] pt-5">
                  <p className="font-mono text-xs tracking-wider text-[var(--moss)]">
                    {item.n}
                  </p>
                  <h3 className="mt-3 text-xl font-black tracking-tight md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--mute)]">
                    {item.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="voices"
        className="scroll-mt-20 bg-[var(--ink)] px-5 py-16 text-[var(--sheet)] md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-hand text-xl text-[var(--brass)]">
              from the demo founders
            </p>
            <h2 className="mt-3 max-w-2xl font-sans text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl md:text-5xl">
              Lived-in scorecards. Honest weeks.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--sheet)]/60">
              Open any demo on signup — MRR, customers, and three priorities
              already filled in.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-14">
            {DEMO_FOUNDERS.map((founder, i) => (
              <Reveal key={founder.key} delay={i * 60}>
                <figure className="border-t border-[var(--sheet)]/15 pt-6">
                  <blockquote className="font-hand text-[1.35rem] leading-8 text-[var(--sheet)]/90 md:text-[1.5rem]">
                    “{founder.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <FounderPhoto
                      founder={founder}
                      size={52}
                      className="border border-[var(--sheet)]/20"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--sheet)]">
                        {founder.name}
                      </p>
                      <p className="truncate text-sm text-[var(--sheet)]/50">
                        {founder.role}, {founder.startup} ·{" "}
                        {formatMrr(founder.mrrCents)} MRR
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100} className="mt-14">
            <Link
              href="/signup?next=/billing"
              className="inline-flex h-12 w-full items-center justify-center bg-[var(--brass)] px-6 text-sm font-medium text-[var(--ink)] transition hover:brightness-105 sm:w-auto"
            >
              Create an account or try a demo
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="scroll-mt-20 bg-[var(--paper)] px-5 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16 lg:items-end">
          <Reveal>
            <p className="font-hand text-xl text-[var(--moss)]">price</p>
            <h2 className="mt-3 font-sans text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl md:text-5xl">
              Cheap enough to buy on a whim.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--mute)]">
              $12 a month, or $99 for the founding year. Real enough that we
              count you as a paying user.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal className="border border-[var(--rule)] bg-[var(--sheet)] p-6 md:p-8">
              <p className="text-sm text-[var(--mute)]">Founder</p>
              <p className="mt-3 font-black text-5xl tracking-tight text-[var(--ink)]">
                $12
              </p>
              <p className="mt-1 text-sm text-[var(--mute)]">per month</p>
              <Link
                href="/signup?next=/billing"
                className="mt-8 inline-flex h-11 w-full items-center justify-center bg-[var(--ink)] text-sm font-medium text-[var(--sheet)] transition hover:bg-[var(--moss-deep)]"
              >
                Get the Founder plan
              </Link>
            </Reveal>
            <Reveal
              delay={80}
              className="border border-[var(--ink)] bg-[var(--ink)] p-6 text-[var(--sheet)] md:p-8"
            >
              <p className="text-sm text-[var(--sheet)]/55">Founding year</p>
              <p className="mt-3 font-black text-5xl tracking-tight">$99</p>
              <p className="mt-1 text-sm text-[var(--sheet)]/55">
                per year · save $45
              </p>
              <Link
                href="/signup?next=/billing"
                className="mt-8 inline-flex h-11 w-full items-center justify-center bg-[var(--brass)] text-sm font-medium text-[var(--ink)] transition hover:brightness-105"
              >
                Get the founding year
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--rule)] bg-[var(--sheet)] px-5 py-12 text-center md:px-8">
        <p className="font-serif text-2xl text-[var(--ink)]">Pulseboard</p>
        <SocialLinks className="mt-5 mb-4" tone="ink" />
        <p className="font-hand text-xl text-[var(--moss)]">
          Nairobi · write the numbers down
        </p>
        <p className="mt-4 text-sm text-[var(--mute)]">
          <Link href="/login?next=/app" className="hover:text-[var(--ink)]">
            Sign in
          </Link>
          <span className="mx-2 text-[var(--rule)]">·</span>
          <Link
            href="/signup?next=/billing"
            className="hover:text-[var(--ink)]"
          >
            Create an account
          </Link>
          <span className="mx-2 text-[var(--rule)]">·</span>
          <a href="#voices" className="hover:text-[var(--ink)]">
            Founder voices
          </a>
        </p>
      </footer>
    </div>
  );
}
