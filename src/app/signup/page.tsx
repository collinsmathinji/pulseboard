import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, authFlags } from "@/auth";
import { continueWithGoogle, createAccount, startAsDemo } from "@/actions/auth";
import { AuthFrame } from "@/components/auth-frame";
import { Notice } from "@/components/portal";
import { Button, Input, Label } from "@/components/ui";
import { DEMO_FOUNDERS } from "@/lib/demos";
import { getSignupStats } from "@/lib/signups";

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

  const loginHref = `/login?next=${encodeURIComponent("/app")}`;

  return (
    <AuthFrame
      kicker="New founder"
      title="Start this week."
      body="One account. Then a plan. Then the Monday page — MRR, paying users, runway, three priorities."
      step={1}
      aside={
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
                  className="h-9 w-9 rounded-full border-2 border-[var(--ink)] object-cover"
                  title={face.name}
                />
              ) : (
                <span
                  key={`${face.name}-${i}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--brass)] text-xs font-bold text-[var(--ink)]"
                  title={face.name}
                >
                  {face.name.slice(0, 1).toUpperCase()}
                </span>
              );
            })}
          </div>
          <p className="text-sm text-[var(--sheet)]/65">
            <span className="font-semibold text-[var(--sheet)]">{total}</span>{" "}
            {total === 1 ? "founder" : "founders"} already writing the week
          </p>
        </div>
      }
      footer={
        <>
          Already on Pulseboard?{" "}
          <Link href={loginHref} className="text-[var(--brass)]">
            Sign in
          </Link>
        </>
      }
      formKicker="Step 1 of 3 · Account"
      formTitle="Create your account"
      formBody="No password for now. We remember you on this browser for 30 days."
    >
      {params.notice && NOTICES[params.notice] ? (
        <Notice>{NOTICES[params.notice]}</Notice>
      ) : null}

      <form action={createAccount} className="mt-8 space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Ada"
          />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Create account
        </Button>
      </form>

      {authFlags.google ? (
        <form action={continueWithGoogle} className="mt-3">
          <input type="hidden" name="next" value={next} />
          <Button type="submit" variant="outline" className="w-full" size="lg">
            Continue with Google
          </Button>
        </form>
      ) : null}

      {authFlags.emailLogin ? (
        <div className="mt-10">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--rule)]" />
            <p className="font-hand text-lg text-[var(--moss)]">
              or try a demo founder
            </p>
            <span className="h-px flex-1 bg-[var(--rule)]" />
          </div>
          <p className="mt-3 text-sm text-[var(--mute)]">
            Real accounts with unlocked scorecards — feel multiple signups live.
          </p>
          <ul className="mt-4 space-y-2">
            {DEMO_FOUNDERS.map((demo) => (
              <li key={demo.key}>
                <form action={startAsDemo}>
                  <input type="hidden" name="demo" value={demo.key} />
                  <button
                    type="submit"
                    className="flex w-full items-center justify-between gap-3 border border-[var(--rule)] bg-[var(--sheet)] px-4 py-3 text-left transition hover:border-[var(--ink)]/35"
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
                        <span className="mt-0.5 block text-xs text-[var(--mute)]">
                          {demo.startup} · {demo.blurb}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-[var(--mute)]">
                      Open →
                    </span>
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 text-sm text-[var(--mute)] md:hidden">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-medium text-[var(--ink)] underline"
        >
          Sign in
        </Link>
      </p>
    </AuthFrame>
  );
}
