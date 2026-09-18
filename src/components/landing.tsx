"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui";
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
const TESTIMONIALS = DEMO_FOUNDERS;

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
      { threshold: 0.18 },
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

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.5 7.2 8 2.8l5.5 4.4V13a.8.8 0 0 1-.8.8H9.2V10H6.8v3.8H3.3A.8.8 0 0 1 2.5 13V7.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
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
    <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#16081f] shadow-[0_24px_80px_rgba(22,8,31,0.28)] ring-2 ring-[#e8b44d]">
      <video
        ref={videoRef}
        className="aspect-video w-full bg-[#16081f]"
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
        Your browser does not support the video tag.
      </video>
      {playing ? null : (
        <button
          type="button"
          onClick={play}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#16081f]/20 text-white transition hover:bg-[#16081f]/10"
        >
          <span className="landing-float flex h-16 w-16 items-center justify-center rounded-full bg-[#e8b44d] text-[#16081f] shadow-lg">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 5.8v10.4L17 11 8 5.8Z" />
            </svg>
          </span>
          <span className="rounded-full bg-[#16081f] px-4 py-1.5 text-sm font-medium text-[#e8b44d]">
            Play the 1-minute demo
          </span>
        </button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.2 10.2 13.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FounderPhoto({
  founder,
  size = 44,
}: {
  founder: (typeof DEMO_FOUNDERS)[number];
  size?: number;
}) {
  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-full ring-2 ring-[#e8b44d]/70"
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

export function SiteHeader() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-serif text-[22px] tracking-tight text-[#e8b44d]"
      >
        <Image
          src="/logo.png"
          alt=""
          width={28}
          height={28}
          className="rounded-md"
        />
        pulseboard
      </Link>
      <nav className="flex items-center gap-2 text-[#16081f] md:gap-3">
        <a
          href="#demo"
          className="hidden items-center rounded-full px-3 py-2 text-sm font-medium text-[#16081f]/70 hover:bg-[#16081f]/8 hover:text-[#16081f] sm:inline-flex"
        >
          Demo
        </a>
        <a
          href="#voices"
          className="hidden items-center rounded-full px-3 py-2 text-sm font-medium text-[#16081f]/70 hover:bg-[#16081f]/8 hover:text-[#16081f] sm:inline-flex"
        >
          Founders
        </a>
        <a
          href="#pricing"
          className="hidden items-center rounded-full px-3 py-2 text-sm font-medium text-[#16081f]/70 hover:bg-[#16081f]/8 hover:text-[#16081f] md:inline-flex"
        >
          Price
        </a>
        <Link
          href="/login?next=/app"
          className="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-[#16081f]/70 hover:bg-[#16081f]/8 hover:text-[#16081f]"
        >
          Sign in
        </Link>
        <Link
          href="/signup?next=/billing"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#e8b44d] px-5 text-sm font-medium text-[#16081f] transition hover:bg-[#f0c15a]"
        >
          <HomeIcon />
          Start for $12
        </Link>
      </nav>
    </header>
  );
}

export function LandingPage({ founderCount = 0 }: { founderCount?: number }) {
  return (
    <div className="landing relative min-h-svh">
      <div className="landing-grain" aria-hidden />

      <section className="relative overflow-hidden bg-[#16081f]">
        <div className="absolute inset-0 grid md:grid-cols-2" aria-hidden>
          <div className="relative bg-[#16081f]">
            <div className="landing-orb absolute -left-20 top-24 h-72 w-72 bg-[#e8b44d]/18" />
            <div className="landing-grid opacity-40" />
          </div>
          <div className="relative bg-[#d8d8e2]">
            <div
              className="landing-orb absolute -right-16 bottom-10 h-64 w-64 bg-[#16081f]/10"
              style={{ animationDelay: "-6s" }}
            />
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <SiteHeader />

          <div className="relative grid items-center md:grid-cols-2 md:min-h-[680px]">
            <div className="flex flex-col justify-center px-6 pb-16 pt-8 md:pr-36 md:pb-20 md:pl-8">
              <p
                className="landing-rise text-sm tracking-wide text-[#e8b44d]"
                style={{ animationDelay: "40ms" }}
              >
                Pulseboard
              </p>
              <h1 className="mt-3 font-sans text-[clamp(2.8rem,6vw,5rem)] leading-[0.86] font-black tracking-[-0.04em] text-white">
                <span className="landing-rise block">THE</span>
                <span
                  className="landing-rise mt-1 block text-right"
                  style={{ animationDelay: "90ms" }}
                >
                  WEEK
                </span>
              </h1>
              <p
                className="landing-rise mt-6 max-w-[17rem] text-sm leading-6 text-white/70"
                style={{ animationDelay: "180ms" }}
              >
                One Monday page for MRR, paying users, runway, and the three
                things that have to move.
              </p>
              <div
                className="landing-rise mt-6 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "240ms" }}
              >
                <Link
                  href="/signup?next=/billing"
                  className="inline-flex h-10 w-fit items-center rounded-full bg-[#e8b44d] px-5 text-sm font-medium text-[#16081f] transition hover:bg-[#f0c15a]"
                >
                  Start for $12
                </Link>
                <a
                  href="#demo"
                  className="inline-flex h-10 w-fit items-center rounded-full bg-white px-5 text-sm font-medium text-[#16081f] transition hover:bg-white/90"
                >
                  Watch the demo
                </a>
              </div>
              {founderCount > 0 ? (
                <p
                  className="landing-rise mt-5 text-sm text-white/45"
                  style={{ animationDelay: "300ms" }}
                >
                  <span className="text-[#e8b44d]">{founderCount}</span>{" "}
                  {founderCount === 1 ? "founder" : "founders"} already writing
                  the week
                </p>
              ) : null}
            </div>

            <div className="relative flex flex-col justify-center px-6 pb-16 pt-40 text-[#16081f] md:pt-8 md:pr-8 md:pb-20 md:pl-36">
              <Link
                href="/signup?next=/billing"
                className="landing-rise mb-8 ml-auto flex h-11 w-full max-w-[240px] items-center gap-3 rounded-full bg-white px-4 text-sm text-[#16081f]/55 shadow-sm transition hover:text-[#16081f]"
                style={{ animationDelay: "160ms" }}
              >
                <SearchIcon />
                Start this week
              </Link>
              <p
                className="landing-rise text-right font-sans text-[clamp(2.8rem,6vw,5rem)] leading-[0.86] font-black tracking-[-0.04em] text-[#16081f]"
                style={{ animationDelay: "220ms" }}
              >
                <span className="relative block">
                  ONE
                  <span className="absolute -top-5 -right-2 hidden text-2xl font-light text-[#e8b44d] md:inline">
                    *
                  </span>
                </span>
                <span className="mt-1 block">PAGE</span>
              </p>
            </div>

            <div className="landing-circle pointer-events-none absolute top-[38%] left-1/2 z-20 h-[240px] w-[240px] overflow-hidden rounded-full bg-[#d8d8e2] ring-2 ring-[#e8b44d] md:top-1/2 md:h-[300px] md:w-[300px]">
              <Image
                src="/hero-founder.png"
                alt="A founder walking to write the week’s numbers"
                fill
                priority
                sizes="300px"
                className="object-cover object-[center_12%]"
              />
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 h-1.5 bg-[#e8b44d]"
          aria-hidden
        />
      </section>

      <section
        id="demo"
        className="scroll-mt-24 bg-[#d8d8e2] px-6 py-16 text-[#16081f] md:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm text-[#16081f]/50">Watch it</p>
            <h2 className="mt-3 max-w-xl font-sans text-4xl leading-[0.95] font-black tracking-tight md:text-5xl">
              The Monday page, in one minute.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#16081f]/65">
              Landing, create an account, the scorecard, customers, the weekly
              review, and the systems you already use.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <DemoPlayer />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#16081f] px-6 py-16 text-white md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="mx-auto mb-8 flex justify-center">
              <FounderPhoto founder={FEATURED} size={88} />
            </div>
            <p className="font-serif text-3xl leading-snug text-[#e8b44d] md:text-4xl">
              “{FEATURED.quote}”
            </p>
            <p className="mt-6 text-sm text-white/55">
              <span className="text-white">{FEATURED.name}</span>
              {" · "}
              {FEATURED.role}, {FEATURED.startup}
              {" · "}
              {FEATURED.blurb}
            </p>
            <Link
              href={`/signup?next=/billing`}
              className="mt-8 inline-flex text-sm font-medium text-[#e8b44d] underline-offset-4 hover:underline"
            >
              Try {FEATURED.name.split(" ")[0]}’s demo scorecard →
            </Link>
          </Reveal>
        </div>
      </section>

      <section
        id="ritual"
        className="scroll-mt-8 bg-[#d8d8e2] px-6 py-20 text-[#16081f] md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm text-[#16081f]/50">The ritual</p>
            <h2 className="mt-3 max-w-xl font-sans text-4xl leading-[0.95] font-black tracking-tight md:text-5xl">
              Same page every Monday.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {RITUAL.map((item, i) => (
              <Reveal key={item.n} delay={i * 80}>
                <li>
                  <p className="font-mono text-sm text-[#e8b44d]">{item.n}</p>
                  <h3 className="mt-3 text-2xl font-black tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#16081f]/65">
                    {item.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="voices"
        className="scroll-mt-8 bg-[#16081f] px-6 py-20 text-white md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-sm text-[#e8b44d]">From the demo founders</p>
            <h2 className="mt-3 max-w-2xl font-sans text-4xl leading-[0.95] font-black tracking-tight md:text-5xl">
              Real scorecards. Real Monday rituals.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/60">
              Open any demo account on signup and feel a lived-in week — MRR,
              customers, and three priorities already filled in.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {TESTIMONIALS.map((founder, i) => (
              <Reveal key={founder.key} delay={i * 70}>
                <figure className="border-t border-white/10 pt-6">
                  <blockquote className="text-lg leading-8 text-white/85 md:text-xl">
                    “{founder.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <FounderPhoto founder={founder} size={48} />
                    <div className="min-w-0">
                      <p className="font-medium text-white">{founder.name}</p>
                      <p className="text-sm text-white/50">
                        {founder.role}, {founder.startup} ·{" "}
                        {formatMrr(founder.mrrCents)} MRR ·{" "}
                        {founder.payingUsers} paying
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-14 text-center">
            <Link
              href="/signup?next=/billing"
              className="inline-flex h-12 items-center rounded-full bg-[#e8b44d] px-6 text-sm font-medium text-[#16081f] transition hover:bg-[#f0c15a]"
            >
              Create an account or try a demo
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-8 bg-[#d8d8e2]">
        <div className="mx-auto grid max-w-6xl md:grid-cols-2">
          <Reveal className="px-6 py-16 md:px-8 md:py-20">
            <p className="text-sm text-[#16081f]/50">Price</p>
            <h2 className="mt-3 font-sans text-4xl leading-[0.95] font-black tracking-tight text-[#16081f] md:text-5xl">
              Cheap enough to buy on a whim.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#16081f]/65">
              $12 a month, or $99 for the founding year. Real enough that we
              count you as a paying user.
            </p>
          </Reveal>
          <div className="grid gap-px bg-[#16081f]/10 md:grid-cols-2">
            <Reveal className="bg-[#d8d8e2] px-6 py-16 md:px-8">
              <p className="text-sm text-[#16081f]/50">Founder</p>
              <p className="mt-3 font-black text-5xl tracking-tight text-[#16081f]">
                $12
              </p>
              <p className="mt-1 text-sm text-[#16081f]/55">per month</p>
              <Link href="/signup?next=/billing" className="mt-8 block">
                <Button className="w-full bg-[#16081f] text-white hover:bg-[#2a1436]">
                  Get the Founder plan
                </Button>
              </Link>
            </Reveal>
            <Reveal
              delay={80}
              className="bg-[#16081f] px-6 py-16 text-white md:px-8"
            >
              <p className="text-sm text-white/50">Founding year</p>
              <p className="mt-3 font-black text-5xl tracking-tight">$99</p>
              <p className="mt-1 text-sm text-white/55">per year · save $45</p>
              <Link href="/signup?next=/billing" className="mt-8 block">
                <Button className="w-full">Get the founding year</Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="bg-[#16081f] px-6 py-12 text-center">
        <p className="font-serif text-2xl text-[#e8b44d]">pulseboard</p>
        <SocialLinks className="mt-5 mb-4" />
        <p className="text-sm text-white/45">
          Nairobi · write the numbers down
        </p>
        <p className="mt-4 text-sm text-white/40">
          <Link href="/login?next=/app" className="hover:text-white">
            Sign in
          </Link>
          {" · "}
          <Link href="/signup?next=/billing" className="hover:text-white">
            Create an account
          </Link>
          {" · "}
          <a href="#voices" className="hover:text-white">
            Founder voices
          </a>
        </p>
      </footer>
    </div>
  );
}
