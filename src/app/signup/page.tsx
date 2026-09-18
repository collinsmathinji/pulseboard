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
      <section className="relative flex flex-col justify-between overflow-hidden bg-[#171a16] px-6 py-8 text-[#f3f1ec] md:px-10 md:py-10">
        <BrandMark className="[&_span]:text-[#b8922a]" />
        <div className="relative py-12 md:py-0">
          <p className="text-sm tracking-wide text-[#b8922a] uppercase">
            New founder
          </p>
          <h1 className="mt-3 max-w-sm font-sans text-4xl leading-[0.95] font-black tracking-tight md:text-5xl">
            Start this week.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#f3f1ec]/65">
            One account. Then a plan. Then the Monday page — MRR, paying users,
            runway, three priorities.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {faces.slice(0, 5).map((face, i) => {
                const demo = DEMO_FOUNDERS.find(
                  (d) => d.name.split(" ")[0] === face.name.split(" ")[0],
                );
                return demo ? (
                  <Image
                    key={`${face.name}-${i}`}
                    src={demo.image}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-2 border-[#171a16] object-cover"
                    title={face.name}
                  />
                ) : (
                  <span
                    key={`${face.name}-${i}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#171a16] bg-[#b8922a] text-xs font-bold text-[#171a16]"
                    title={face.name}
                  >
                    {face.name.slice(0, 1).toUpperCase()}
                  </span>
                );
              })}
            </div>
            <p className="text-sm text-[#f3f1ec]/65">
              <span className="font-semibold text-[#f3f1ec]">{total}</span>{" "}
              {total === 1 ? "founder" : "founders"} already writing the week
            </p>
          </div>
          <ol className="mt-10 space-y-5">
            {STEPS.map((step) => (
              <li key={step.n} className="grid grid-cols-[auto_1fr] gap-3">
                <span className="font-mono text-sm text-[#b8922a]">{step.n}</span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-sm text-[#f3f1ec]/50">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="relative hidden text-sm text-[#f3f1ec]/40 md:block">
          Already on Pulseboard?{" "}
          <Link
            href={`/login?next=${encodeURIComponent("/app")}`}
            className="text-[#b8922a]"
          >
            Sign in
          </Link>
        </p>
      </section>

      <section className="flex items-center bg-[#e8e6e1] px-6 py-12 text-[#171a16] md:px-12">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm tracking-wide text-[#5c635c] uppercase">
            Step 1 of 3 · Account
          </p>
          <h2 className="mt-3 font-sans text-3xl leading-[0.95] font-black tracking-tight">
            Create your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5c635c]">
            No password for now. We remember you on this browser for 30 days.
          </p>
          {params.notice && NOTICES[params.notice] ? (
            <p className="mt-4 border border-[#c4c2bb] bg-[#f3f1ec] px-3 py-2 text-sm text-[#171a16]">
              {NOTICES[params.notice]}
            </p>
          ) : null}

          <form action={createAccount} className="mt-8 space-y-4">
            <input type="hidden" name="next" value={next} />
            <div>
              <Label htmlFor="name" className="text-[#5c635c]">
                Your name
              </Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="name"
                placeholder="Ada"
                className="rounded-md border-[#c4c2bb] bg-[#f3f1ec] text-[#171a16] placeholder:text-[#5c635c]/50 focus:border-[#2a5a45] focus:ring-[#2a5a45]/20"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#5c635c]">
                Work email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="rounded-md border-[#c4c2bb] bg-[#f3f1ec] text-[#171a16] placeholder:text-[#5c635c]/50 focus:border-[#2a5a45] focus:ring-[#2a5a45]/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-md bg-[#b8922a] text-[#171a16] hover:brightness-105"
              size="lg"
            >
              Create account
            </Button>
          </form>

          {authFlags.google ? (
            <form action={continueWithGoogle} className="mt-3">
              <input type="hidden" name="next" value={next} />
              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-md border-[#c4c2bb] text-[#171a16] hover:bg-[#f3f1ec]"
                size="lg"
              >
                Continue with Google
              </Button>
            </form>
          ) : null}

          {authFlags.emailLogin ? (
            <div className="mt-10">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-[#c4c2bb]" />
                <p className="text-xs font-medium tracking-wide text-[#5c635c] uppercase">
                  Or try a demo founder
                </p>
                <span className="h-px flex-1 bg-[#c4c2bb]" />
              </div>
              <p className="mt-3 text-sm text-[#5c635c]">
                Real accounts with unlocked scorecards — feel multiple signups
                live.
              </p>
              <ul className="mt-4 space-y-2">
                {DEMO_FOUNDERS.map((demo) => (
                  <li key={demo.key}>
                    <form action={startAsDemo}>
                      <input type="hidden" name="demo" value={demo.key} />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-between gap-3 border border-[#c4c2bb] bg-[#f3f1ec] px-4 py-3 text-left transition hover:border-[#171a16]/35"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Image
                            src={demo.image}
                            alt=""
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">
                              {demo.name}
                            </span>
                            <span className="mt-0.5 block text-xs text-[#5c635c]">
                              {demo.startup} · {demo.blurb}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 text-xs font-medium text-[#5c635c]">
                          Open →
                        </span>
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-6 text-sm text-[#5c635c]">
            Already have an account?{" "}
            <Link
              href={`/login?next=${encodeURIComponent("/app")}`}
              className="font-medium text-[#171a16] underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
