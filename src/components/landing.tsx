"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
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

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3 5.5h12M3 9h12M3 12.5h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
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

export function SiteHeader() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
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
      <nav className="flex items-center gap-3 text-[#16081f] md:gap-4">
        <a
          href="#ritual"
          className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-[#16081f]/8 sm:flex"
          aria-label="The ritual"
        >
          <HomeIcon />
        </a>
        <a
          href="#pricing"
          className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-[#16081f]/8 sm:flex"
          aria-label="Price"
        >
          <MenuIcon />
        </a>
        <Link
          href="/login?next=/billing"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#e8b44d] px-5 text-sm font-medium text-[#16081f]"
        >
          <HomeIcon />
          Start for $12
        </Link>
      </nav>
    </header>
  );
}

export function LandingPage() {
  return (
    <div className="landing min-h-full px-3 py-4 sm:px-6 sm:py-7 lg:px-10">
      <section className="relative mx-auto min-h-[min(860px,92svh)] max-w-[1280px] overflow-hidden rounded-[32px] bg-[#16081f] md:rounded-[40px]">
        <div className="absolute inset-0 grid md:grid-cols-2" aria-hidden>
          <div className="bg-[#16081f]" />
          <div className="bg-[#d8d8e2]" />
        </div>

        <SiteHeader />

        <div className="relative z-10 grid min-h-[calc(min(860px,92svh)-5.5rem)] md:grid-cols-2">
          <div className="flex flex-col justify-center px-6 pb-28 pt-6 md:px-10 md:pr-48 md:pb-24 lg:pr-56">
            <h1 className="font-sans text-[clamp(3.4rem,7.4vw,6.8rem)] leading-[0.82] font-black tracking-[-0.045em] text-white">
              <span className="landing-rise block">THE</span>
              <span
                className="landing-rise mt-1 block text-right"
                style={{ animationDelay: "90ms" }}
              >
                WEEK
              </span>
            </h1>
            <p
              className="landing-rise mt-8 max-w-[16.5rem] text-sm leading-6 text-white/70"
              style={{ animationDelay: "180ms" }}
            >
              One Monday page for MRR, paying users, runway, and the three
              things that have to move.
            </p>
            <a
              href="#ritual"
              className="landing-rise mt-6 inline-flex h-10 w-fit items-center rounded-full bg-[#e8b44d] px-5 text-sm font-medium text-[#16081f]"
              style={{ animationDelay: "240ms" }}
            >
              Learn more
            </a>
          </div>

          <div className="relative flex flex-col justify-center px-6 pb-16 pt-48 text-[#16081f] md:px-10 md:pl-48 md:pt-6 md:pb-24 lg:pl-56">
            <Link
              href="/login?next=/billing"
              className="landing-rise mb-10 ml-auto flex h-11 w-full max-w-[280px] items-center gap-3 rounded-full bg-white px-4 text-sm text-[#16081f]/55"
              style={{ animationDelay: "160ms" }}
            >
              <SearchIcon />
              Start this week
            </Link>
            <p
              className="landing-rise text-right font-sans text-[clamp(3.4rem,7.4vw,6.8rem)] leading-[0.82] font-black tracking-[-0.045em] text-[#16081f]"
              style={{ animationDelay: "220ms" }}
            >
              <span className="relative block">
                ONE
                <span className="absolute -top-6 -right-3 hidden text-3xl font-light text-[#e8b44d] md:inline">
                  *
                </span>
              </span>
              <span className="mt-1 block">PAGE</span>
            </p>
          </div>
        </div>

        <div className="landing-circle pointer-events-none absolute top-[42%] left-1/2 z-20 h-[min(48vw,340px)] w-[min(48vw,340px)] overflow-hidden rounded-full bg-[#d8d8e2] ring-2 ring-[#e8b44d] md:top-1/2">
          <Image
            src="/hero-founder.png"
            alt="A founder walking to write the week’s numbers"
            fill
            priority
            sizes="430px"
            className="object-cover object-[center_12%]"
          />
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 h-11 rounded-b-[32px] bg-[#e8b44d] md:h-12 md:rounded-b-[40px]"
          aria-hidden
        />
      </section>

      <section
        id="ritual"
        className="mx-auto mt-6 max-w-[1280px] scroll-mt-8 rounded-[32px] bg-[#16081f] px-6 py-16 text-white md:mt-8 md:rounded-[40px] md:px-16 md:py-24"
      >
        <Reveal>
          <p className="text-sm text-white/50">The ritual</p>
          <h2 className="mt-3 max-w-xl font-sans text-4xl leading-[0.95] font-black tracking-tight md:text-6xl">
            Same page every Monday.
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {RITUAL.map((item, i) => (
            <Reveal key={item.n} delay={i * 80}>
              <li>
                <p className="text-sm text-[#e8b44d]">{item.n}</p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {item.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section
        id="pricing"
        className="mx-auto mt-6 max-w-[1280px] scroll-mt-8 overflow-hidden rounded-[32px] bg-[#d8d8e2] md:mt-8 md:rounded-[40px]"
      >
        <div className="grid md:grid-cols-2">
          <Reveal className="px-6 py-14 md:px-16 md:py-20">
            <p className="text-sm text-[#16081f]/50">Price</p>
            <h2 className="mt-3 font-sans text-4xl leading-[0.95] font-black tracking-tight text-[#16081f] md:text-6xl">
              Cheap enough to buy on a whim.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#16081f]/65">
              $12 a month, or $99 for the founding year. Real enough that we
              count you as a paying user.
            </p>
          </Reveal>
          <div className="grid gap-px bg-[#16081f]/10 md:grid-cols-2">
            <Reveal className="bg-[#d8d8e2] px-6 py-14 md:px-10">
              <p className="text-sm text-[#16081f]/50">Founder</p>
              <p className="mt-3 font-black text-6xl tracking-tight text-[#16081f]">
                $12
              </p>
              <p className="mt-1 text-sm text-[#16081f]/55">per month</p>
              <Link href="/login?next=/billing" className="mt-8 block">
                <Button className="w-full bg-[#16081f] text-white hover:bg-[#2a1436]">
                  Get the Founder plan
                </Button>
              </Link>
            </Reveal>
            <Reveal delay={80} className="bg-[#16081f] px-6 py-14 text-white md:px-10">
              <p className="text-sm text-white/50">Founding year</p>
              <p className="mt-3 font-black text-6xl tracking-tight">$99</p>
              <p className="mt-1 text-sm text-white/55">per year · save $45</p>
              <Link href="/login?next=/billing" className="mt-8 block">
                <Button className="w-full">Get the founding year</Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1280px] px-6 py-10 text-center text-sm text-[#e8b44d]/90">
        Pulseboard · Nairobi · write the numbers down
      </footer>
    </div>
  );
}
