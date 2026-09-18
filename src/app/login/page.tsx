import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, authFlags } from "@/auth";
import { continueWithGoogle, returnToAccount } from "@/actions/auth";
import { BrandMark } from "@/components/brand";
import { Button, Input, Label } from "@/components/ui";
import { StandaloneCard, PageKicker, PageTitle } from "@/components/portal";

const NOTICES: Record<string, string> = {
  exists: "That email already has a Pulseboard. Sign in here.",
  invalid: "Use a real work email.",
  sent: "Check your inbox for the sign-in link.",
  CredentialsSignin: "That email does not have an account yet.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    notice?: string;
    sent?: string;
    error?: string;
  }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const next = params.next || "/app";
  const notice = params.sent ? "sent" : params.notice || params.error;

  if (session?.user) {
    redirect(next);
  }

  return (
    <StandaloneCard>
      <BrandMark />
      <PageKicker>Welcome back</PageKicker>
      <PageTitle className="mt-3">Sign in</PageTitle>
      <p className="mt-3 text-sm leading-6 text-white/55">
        Returning founders land on the Monday page. New here? Create an account
        first — that path picks a plan.
      </p>
      {notice && NOTICES[notice] ? (
        <p className="mt-4 rounded-2xl bg-[#e8b44d]/12 px-3 py-2 text-sm text-[#e8b44d]">
          {NOTICES[notice]}
        </p>
      ) : null}
      <form action={returnToAccount} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Sign in
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
      <p className="mt-6 text-sm text-white/45">
        New founder?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent("/billing")}`}
          className="text-[#e8b44d] underline"
        >
          Create an account
        </Link>
      </p>
    </StandaloneCard>
  );
}
