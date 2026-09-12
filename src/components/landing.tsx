"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui";
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

const PRIORITIES = [
  { text: "Email 10 founders who already asked", done: true },
  { text: "Close paying user #4", done: false },
  { text: "Post the weekly numbers on Indie Hackers", done: false },
] as const;

const CUSTOMERS = [
  ["Amina K.", "$29", "Sep 8"],
  ["Leo Park", "$12", "Sep 6"],
  ["Nia W.", "$99", "Sep 2"],
] as const;

const HEADLINES = ["Stop managing", "the company", "in twelve tabs."] as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
          return;
        }
        if (!once) setInView(false);
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return { ref, inView };
}

function useCountUp(target: number, active: boolean, ms = 1400) {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / ms);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, ms, reduced, target]);

  return value;
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

export function SiteHeader({ scrolled = false }: { scrolled?: boolean }) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-30 transition-all duration-500",
        scrolled
          ? "border-b border-cyan-200/10 bg-[#06080c]/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <BrandMark />
        <nav className="flex items-center gap-4 text-sm sm:gap-5">
          <a
            href="#ritual"
            className="hidden text-zinc-400 transition hover:text-zinc-100 sm:inline"
          >
            The ritual
          </a>
          <a
            href="#pricing"
            className="hidden text-zinc-400 transition hover:text-zinc-100 sm:inline"
          >
            Price
          </a>
          <Link
            href="/login"
            className="text-zinc-400 transition hover:text-zinc-100"
          >
            Sign in
          </Link>
          <Link href="/login?next=/billing">
            <Button size="sm">
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Start for $12/mo</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function LandingBoard() {
  const [live, setLive] = useState(false);
  const [checked, setChecked] = useState(false);
  const reduced = usePrefersReducedMotion();
  const mrr = useCountUp(1284, live);
  const users = useCountUp(3, live);
  const runway = useCountUp(11, live);

  useEffect(() => {
    setLive(true);
    const wait = reduced ? 0 : 1500;
    const timer = window.setTimeout(() => setChecked(true), wait);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <div className="landing-rise overflow-hidden rounded-[28px] border border-cyan-200/18 bg-[#0b1018] shadow-[0_40px_90px_-36px_rgba(0,0,0,0.95),0_0_0_1px_rgba(56,189,248,0.12)]">
      <div className="flex items-center justify-between gap-4 border-b border-cyan-200/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate font-serif text-lg text-cyan-200">
            Studio North
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:inline">
            Overview
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
          <span className="hidden sm:inline">Customers</span>
          <span className="hidden text-zinc-700 sm:inline">/</span>
          <span className="rounded-full bg-zinc-800 px-2 py-1 text-zinc-200">
            Weekly review
          </span>
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-2xl border border-cyan-400/25 bg-cyan-400/8 px-4 py-3 sm:mx-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-cyan-100">
          <p>2 more paying users to hit 5.</p>
          <p className="font-mono text-[11px] text-cyan-200/80">
            {users} / 5
          </p>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-cyan-400/15">
          <div
            className={cn(
              "h-full rounded-full bg-cyan-400",
              live && "landing-bar",
            )}
            style={{ width: "60%" }}
          />
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-4">
        {[
          ["MRR", `$${mrr.toLocaleString("en-US")}`],
          ["Paying users", String(users)],
          ["Runway", `${runway} mo`],
          ["This week", "Ship checkout"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-cyan-200/12 bg-zinc-950/55 p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {label}
            </p>
            <p className="mt-2 flex items-center font-serif text-2xl text-zinc-50">
              {value}
              {label === "This week" ? (
                <span className="landing-caret ml-0.5 inline-block h-6 w-[2px] bg-cyan-300" />
              ) : null}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 px-4 pb-4 sm:px-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-cyan-200/10 bg-zinc-950/30 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">MRR trend</p>
            <span className="font-mono text-[10px] text-emerald-300/80">
              +38%
            </span>
          </div>
          <svg
            viewBox="0 0 320 72"
            className="mt-3 h-16 w-full text-cyan-400"
            aria-hidden
          >
            <path
              d="M0,62 L64,54 L128,50 L192,34 L256,28 L320,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={live ? "landing-draw" : undefined}
            />
          </svg>
        </div>

        <div className="rounded-2xl border border-cyan-200/10 bg-zinc-950/30 p-4">
          <p className="text-sm text-zinc-400">This week&apos;s three</p>
          <ul className="mt-3 space-y-2.5">
            {PRIORITIES.map((item, i) => {
              const done = item.done && checked;
              return (
                <li
                  key={item.text}
                  className={cn(
                    "flex items-start gap-2 text-sm",
                    live && "landing-rise",
                    done ? "text-zinc-500 line-through" : "text-zinc-200",
                  )}
                  style={{ animationDelay: `${700 + i * 140}ms` }}
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-zinc-600 text-[10px] text-cyan-400">
                    {done ? <span className="landing-check">✓</span> : null}
                  </span>
                  {item.text}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-cyan-200/10 px-4 py-3 sm:px-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Recent paying customers
          </p>
          <span className="text-sm text-cyan-300">View all</span>
        </div>
        <ul className="divide-y divide-cyan-200/10">
          {CUSTOMERS.map(([name, amount, date], i) => (
            <li
              key={name}
              className={cn(
                "flex items-center justify-between py-2 text-sm",
                live && "landing-rise",
              )}
              style={{ animationDelay: `${1100 + i * 120}ms` }}
            >
              <span className="text-zinc-200">{name}</span>
              <span className="font-mono text-zinc-500">
                {amount}
                <span className="mx-2 text-zinc-700">·</span>
                {date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stamp, setStamp] = useState("Monday · this week");
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setScrolled(window.scrollY > 16);
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setStamp(
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    );
  }, []);

  return (
    <div className="landing relative min-h-full overflow-x-hidden">
      <div className="landing-grain" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[820px] overflow-hidden"
        aria-hidden
      >
        <div className="landing-grid" aria-hidden />
        <div className="landing-orb -left-24 top-16 h-80 w-80 bg-cyan-400/20" />
        <div className="landing-orb right-[-5rem] top-52 h-72 w-72 bg-violet-500/18" />
      </div>

      <div
        className="pointer-events-none fixed top-0 left-0 z-20 hidden h-full w-px bg-cyan-200/15 lg:block"
        style={{ left: "2.25rem" }}
        aria-hidden
      >
        <div
          className="w-px bg-cyan-400"
          style={{ height: `${Math.max(8, progress * 100)}%` }}
        />
      </div>
      <div
        className="fixed top-0 left-0 z-30 h-0.5 bg-cyan-400 lg:hidden"
        style={{ width: `${progress * 100}%` }}
        aria-hidden
      />

      <SiteHeader scrolled={scrolled} />

      <main className="relative mx-auto max-w-6xl px-5 pt-28 pb-16 md:px-8 md:pt-32">
        <section className="max-w-3xl pb-10 md:pb-14">
          <p
            className="landing-rise font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-400"
            style={{ animationDelay: "40ms" }}
          >
            Weekly scorecard · Nairobi
          </p>
          <h1 className="mt-5 font-serif text-[3.2rem] leading-[0.92] text-zinc-50 sm:text-6xl md:text-7xl">
            {HEADLINES.map((line, i) => (
              <span
                key={line}
                className="landing-rise block"
                style={{ animationDelay: `${90 + i * 90}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p
            className="landing-rise mt-6 max-w-xl text-lg leading-8 text-zinc-400"
            style={{ animationDelay: "380ms" }}
          >
            Four numbers. Three priorities. One Monday ritual. Pulseboard is
            the operating page for a solo founder trying to get to five paying
            customers.
          </p>
          <div
            className="landing-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "460ms" }}
          >
            <Link href="/login?next=/billing">
              <Button size="lg">Start for $12/mo</Button>
            </Link>
            <a href="#ritual">
              <Button size="lg" variant="outline">
                See the ritual
              </Button>
            </a>
          </div>
          <p
            className="landing-rise mt-4 font-mono text-xs tracking-wide text-zinc-500"
            style={{ animationDelay: "540ms" }}
          >
            {stamp} · pay to use · cancel anytime
          </p>
        </section>

        <section
          className={cn("relative", !reduced && "landing-float")}
          aria-label="Pulseboard scorecard"
        >
          <LandingBoard />
        </section>

        <section id="ritual" className="scroll-mt-28 py-24 md:py-32">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-400">
              How the week works
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl text-zinc-50 md:text-5xl">
              One page. Same ritual every Monday.
            </h2>
          </Reveal>

          <ol className="relative mt-14">
            <div
              className="pointer-events-none absolute top-0 bottom-0 left-[1.15rem] hidden w-px bg-cyan-200/15 md:block"
              aria-hidden
            />
            {RITUAL.map((item, i) => (
              <Reveal key={item.n} delay={i * 90}>
                <li className="relative grid gap-4 border-t border-cyan-200/10 py-10 md:grid-cols-[7rem_minmax(0,18rem)_1fr] md:gap-10">
                  <span className="relative font-serif text-4xl text-cyan-300/90">
                    <span className="absolute top-3 -left-8 hidden h-2.5 w-2.5 rounded-full bg-cyan-400 md:block" />
                    {item.n}
                  </span>
                  <h3 className="font-serif text-3xl text-zinc-50">
                    {item.title}
                  </h3>
                  <p className="max-w-xl text-lg leading-8 text-zinc-400">
                    {item.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="pricing" className="scroll-mt-28 pb-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-400">
              Price
            </p>
            <h2 className="mt-3 font-serif text-4xl text-zinc-50 md:text-5xl">
              Cheap enough to buy on a whim.
            </h2>
            <p className="mt-3 max-w-xl text-lg text-zinc-400">
              Real enough that we count you as a paying user.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Reveal>
              <article className="relative overflow-hidden rounded-[28px] border border-cyan-300/35 bg-cyan-400/[0.06] p-8">
                <div
                  className="landing-fill absolute inset-y-0 left-0 w-1 bg-cyan-400"
                  aria-hidden
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                  Founder
                </p>
                <p className="mt-3 font-serif text-6xl text-zinc-50">$12</p>
                <p className="mt-1 text-zinc-500">per month</p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                  <li>KPI dashboard + sparkline</li>
                  <li>Paying customer log</li>
                  <li>Weekly review ritual</li>
                </ul>
                <Link href="/login?next=/billing" className="mt-8 block">
                  <Button className="w-full" size="lg">
                    Get the Founder plan
                  </Button>
                </Link>
              </article>
            </Reveal>
            <Reveal delay={90}>
              <article className="rounded-[28px] border border-cyan-200/12 bg-zinc-950/40 p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  Founding year
                </p>
                <p className="mt-3 font-serif text-6xl text-zinc-50">$99</p>
                <p className="mt-1 text-zinc-500">per year · save $45</p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                  <li>Everything in Founder</li>
                  <li>Lock the early price</li>
                  <li>Cancel anytime from billing</li>
                </ul>
                <Link href="/login?next=/billing" className="mt-8 block">
                  <Button className="w-full" size="lg" variant="outline">
                    Get the founding year
                  </Button>
                </Link>
              </article>
            </Reveal>
          </div>
        </section>

        <Reveal>
          <section className="rounded-[28px] border border-cyan-200/12 bg-zinc-950/35 px-6 py-12 text-center md:px-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-400">
              Open the page
            </p>
            <h2 className="mt-4 font-serif text-4xl text-zinc-50 md:text-5xl">
              Write Monday&apos;s numbers.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-400">
              No charts suite. No twelve tabs. One scorecard, $12 a month.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/login?next=/billing">
                <Button size="lg">Start the scorecard</Button>
              </Link>
            </div>
          </section>
        </Reveal>
      </main>

      <footer className="border-t border-cyan-200/10 py-8 text-center font-mono text-xs tracking-wide text-zinc-600">
        Pulseboard · Nairobi · built for founders who still write the numbers
        down
      </footer>
    </div>
  );
}
