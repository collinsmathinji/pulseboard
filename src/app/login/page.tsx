import { authFlags, signIn } from "@/auth";
import { auth } from "@/auth";
import { BrandMark } from "@/components/brand";
import { Button, Input, Label } from "@/components/ui";
import { StandaloneCard, PageKicker, PageTitle } from "@/components/portal";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; sent?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const next = params.next || "/billing";

  if (session?.user) {
    redirect(next);
  }

  async function emailSignIn(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "");
    const dest = String(formData.get("next") ?? "/billing");
    if (authFlags.resend && !authFlags.emailLogin) {
      await signIn("resend", { email, redirectTo: dest });
      return;
    }
    await signIn("credentials", { email, redirectTo: dest });
  }

  async function googleSignIn() {
    "use server";
    await signIn("google", { redirectTo: next });
  }

  return (
    <StandaloneCard>
      <BrandMark />
      <PageKicker>Founder portal</PageKicker>
      <PageTitle className="mt-3">Sign in</PageTitle>
      <p className="mt-3 text-sm leading-6 text-white/55">
        Use your work email. You&apos;ll pick a plan next — $12/mo or $99/year.
      </p>
      {params.sent ? (
        <p className="mt-4 rounded-2xl bg-[#e8b44d]/12 px-3 py-2 text-sm text-[#e8b44d]">
          Check your inbox for a login link.
        </p>
      ) : null}
      <form action={emailSignIn} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Continue
        </Button>
      </form>
      {authFlags.google ? (
        <form action={googleSignIn} className="mt-3">
          <Button type="submit" variant="outline" className="w-full" size="lg">
            Continue with Google
          </Button>
        </form>
      ) : null}
    </StandaloneCard>
  );
}
