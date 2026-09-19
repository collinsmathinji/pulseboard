import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, authFlags } from "@/auth";
import { continueWithGoogle, returnToAccount } from "@/actions/auth";
import { AuthFrame } from "@/components/auth-frame";
import { Notice } from "@/components/portal";
import { Button, Input, Label } from "@/components/ui";

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

  const signupHref = `/signup?next=${encodeURIComponent("/billing")}`;

  return (
    <AuthFrame
      kicker="Welcome back"
      title="Sign in."
      body="Returning founders land on the Monday page. New here? Create an account first — that path picks a plan."
      footer={
        <>
          New founder?{" "}
          <Link href={signupHref} className="text-[var(--brass)]">
            Create an account
          </Link>
        </>
      }
      formKicker="Returning founder"
      formTitle="Sign in"
      formBody="Use the same work email. We remember you on this browser for 30 days."
    >
      {notice && NOTICES[notice] ? <Notice>{NOTICES[notice]}</Notice> : null}
      <form action={returnToAccount} className="mt-8 space-y-4">
        <input type="hidden" name="next" value={next} />
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
      <p className="mt-6 text-sm text-[var(--mute)] md:hidden">
        New founder?{" "}
        <Link href={signupHref} className="font-medium text-[var(--ink)] underline">
          Create an account
        </Link>
      </p>
    </AuthFrame>
  );
}
