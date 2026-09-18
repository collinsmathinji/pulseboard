import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, authFlags } from "@/auth";
import { continueWithGoogle, createAccount, startAsDemo } from "@/actions/auth";
import { BrandMark } from "@/components/brand";
import { Button, Input, Label } from "@/components/ui";
import { DEMO_FOUNDERS } from "@/lib/demos";
import { getSignupStats } from "@/lib/signups";

const STEPS = [
  { n: "01", title: "Create an account", body: "Name + work email. Thirty seconds." },
  { n: "02", title: "Pick a plan", body: "$12 a month, or $99 for the founding year." },
  { n: "03", title: "Write the week", body: "MRR, paying users, runway, three priorities." },
] as const;

const NOTICES: Record<string, string> = {
  missing: "No Pulseboard for that email yet. Create one here.",
  invalid: "Use a real work email.",
  sent: "Check your inbox for the signup link.",
  "demo-off": "Demo founders need AUTH_ALLOW_EMAIL_LOGIN=true.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; notice?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const next = params.next || "/billing";
  const { total, faces } = await getSignupStats();

  if (session?.user) {
    redirect(next);
  }

  return (
    <div className="min-h-svh md:grid md:grid-cols-2">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[#16081f] px-6 py-8 text-white md:px-10 md:py-10">
        <div
          className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#e8b44d]/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <BrandMark />
        <div className="relative py-12 md:py-0">
          <p className="text-sm text-[#e8b44d]">New founder</p>
          <h1 className="mt-3 max-w-sm font-sans text-4xl leading-[0.92] font-black tracking-tight md:text-5xl">
            Start this week.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
            One account. Then a plan. Then the Monday page — MRR, paying users,
            runway, three priorities.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {faces.slice(0, 5).map((face, i) => (
                <span
                  key={`${face.name}-${i}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#16081f] bg-[#e8b44d] text-xs font-bold text-[#16081f]"
                  title={face.name}
                >
                  {face.name.slice(0, 1).toUpperCase()}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/65">
              <span className="font-semibold text-white">{total}</span>{" "}
              {total === 1 ? "founder" : "founders"} already writing the week
            </p>
          </div>
          <ol className="mt-10 space-y-5">
            {STEPS.map((step) => (
              <li key={step.n} className="grid grid-cols-[auto_1fr] gap-3">
                <span className="font-mono text-sm text-[#e8b44d]">{step.n}</span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-sm text-white/50">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="relative hidden text-sm text-white/35 md:block">
          Already on Pulseboard?{" "}
          <Link
            href={`/login?next=${encodeURIComponent("/app")}`}
            className="text-[#e8b44d]"
          >
            Sign in
          </Link>
        </p>
      </section>

      <section className="flex items-center bg-[#d8d8e2] px-6 py-12 text-[#16081f] md:px-12">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm text-[#16081f]/50">Step 1 of 3 · Account</p>
          <h2 className="mt-3 font-sans text-3xl leading-[0.95] font-black tracking-tight">
            Create your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#16081f]/60">
            No password for now. We remember you on this browser for 30 days.
          </p>
          {params.notice && NOTICES[params.notice] ? (
            <p className="mt-4 rounded-2xl bg-[#16081f]/8 px-3 py-2 text-sm text-[#16081f]">
              {NOTICES[params.notice]}
            </p>
          ) : null}

          <form action={createAccount} className="mt-8 space-y-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <Label htmlFor="name" className="text-[#16081f]/55">
                Your name
              </Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="name"
                placeholder="Ada"
                className="border-[#16081f]/12 bg-white text-[#16081f] placeholder:text-[#16081f]/35 focus:border-[#16081f]/35 focus:ring-[#16081f]/10"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#16081f]/55">
                Work email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="border-[#16081f]/12 bg-white text-[#16081f] placeholder:text-[#16081f]/35 focus:border-[#16081f]/35 focus:ring-[#16081f]/10"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Create account
            </Button>
          </form>

          {authFlags.google ? (
            <form action={continueWithGoogle} className="mt-3">
              <input type="hidden" name="next" value={next} />
              <Button
                type="submit"
                variant="outline"
                className="w-full border-[#16081f]/15 text-[#16081f] hover:bg-[#16081f]/6"
                size="lg"
              >
                Continue with Google
              </Button>
            </form>
          ) : null}

          {authFlags.emailLogin ? (
            <div className="mt-10">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-[#16081f]/12" />
                <p className="text-xs font-medium tracking-wide text-[#16081f]/45 uppercase">
                  Or try a demo founder
                </p>
                <span className="h-px flex-1 bg-[#16081f]/12" />
              </div>
              <p className="mt-3 text-sm text-[#16081f]/55">
                Real accounts in the database — unlocked scorecards so you can
                feel multiple signups live.
              </p>
              <ul className="mt-4 space-y-2">
                {DEMO_FOUNDERS.map((demo) => (
                  <li key={demo.key}>
                    <form action={startAsDemo}>
                      <input type="hidden" name="demo" value={demo.key} />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#16081f]/10 bg-white px-4 py-3 text-left transition hover:border-[#16081f]/25 hover:bg-white/80"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Image
                            src={demo.image}
                            alt=""
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-[#e8b44d]/50"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">
                              {demo.name}
                            </span>
                            <span className="mt-0.5 block text-xs text-[#16081f]/50">
                              {demo.startup} · {demo.blurb}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 text-xs font-medium text-[#16081f]/45">
                          Open →
                        </span>
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-6 text-sm text-[#16081f]/55">
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent("/app")}`}
              className="font-medium text-[#16081f] underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
