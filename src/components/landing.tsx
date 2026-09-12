import Link from "next/link";
import { Button } from "@/components/ui";

export function LandingMock() {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-[0_0_80px_rgba(251,191,36,0.08)]">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="ml-3 text-xs text-zinc-500">pulseboard.app / overview</span>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-4">
        {[
          ["MRR", "$1,284"],
          ["Paying users", "5"],
          ["Runway", "11 mo"],
          ["This week", "Ship checkout"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {label}
            </p>
            <p className="mt-2 font-serif text-2xl text-zinc-50">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
          <p className="text-sm text-zinc-400">MRR, last 6 weeks</p>
          <svg viewBox="0 0 320 72" className="mt-3 h-16 w-full text-amber-400">
            <path
              d="M0,58 L64,50 L128,46 L192,32 L256,28 L320,14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
          <p className="text-sm text-zinc-400">This week’s three</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-200">
            <li className="flex gap-2">
              <span className="text-amber-400">1.</span> Email 10 founders
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">2.</span> Close user #4
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">3.</span> Post Indie Hackers
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-serif text-2xl text-amber-300">
        Pulseboard
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100">
          Sign in
        </Link>
        <Link href="/login?next=/billing">
          <Button size="sm">Start for $12/mo</Button>
        </Link>
      </div>
    </header>
  );
}
