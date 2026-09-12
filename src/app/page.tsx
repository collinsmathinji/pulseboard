import Link from "next/link";
import { LandingMock, SiteHeader } from "@/components/landing";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_42%)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="grid items-center gap-12 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-amber-400">
              Founder command center
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-zinc-50 md:text-6xl">
              Stop managing the company in twelve tabs.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-7 text-zinc-400">
              Pulseboard is the weekly operating scorecard for solo founders.
              MRR, paying users, runway, and this week&apos;s three priorities
              — on one screen. Built to get you to five paying customers.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login?next=/billing">
                <Button size="lg">Start for $12/mo</Button>
              </Link>
              <a href="#pricing">
                <Button size="lg" variant="outline">
                  $99 founding year
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              Pay to use. Cancel anytime. No 40-chart analytics suite.
            </p>
          </div>
          <LandingMock />
        </section>

        <section className="grid gap-4 py-12 md:grid-cols-3">
          {[
            {
              title: "Weekly scorecard",
              body: "Log the numbers once a week. See what moved. Keep three priorities, not thirty.",
            },
            {
              title: "Path to 5",
              body: "A paying-customer log with name, amount, and date. The metric that actually matters for an early product.",
            },
            {
              title: "Manual first",
              body: "No Stripe/GA OAuth maze. Type the numbers you already know. Integrations can wait.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-6"
            >
              <h2 className="font-serif text-2xl text-zinc-50">{item.title}</h2>
              <p className="mt-3 text-zinc-400">{item.body}</p>
            </div>
          ))}
        </section>

        <section id="pricing" className="py-12">
          <h2 className="font-serif text-4xl text-zinc-50">Simple price.</h2>
          <p className="mt-2 max-w-xl text-zinc-400">
            Cheap enough to buy on a whim. Real enough that we count you as a
            paying user.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-amber-400/40 bg-zinc-900/50 p-8">
              <p className="text-sm text-amber-300">Founder</p>
              <p className="mt-2 font-serif text-5xl">$12</p>
              <p className="text-zinc-500">per month</p>
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
            </div>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8">
              <p className="text-sm text-zinc-400">Founding year</p>
              <p className="mt-2 font-serif text-5xl">$99</p>
              <p className="text-zinc-500">per year · save $45</p>
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
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-600">
        Pulseboard · built for the Vaya startup dashboard challenge
      </footer>
    </div>
  );
}
