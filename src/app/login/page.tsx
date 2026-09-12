import { authFlags, signIn } from "@/auth";
import { auth } from "@/auth";
import { Button, Input, Label } from "@/components/ui";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_40%)] px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <Link href="/" className="font-serif text-2xl text-amber-300">
          Pulseboard
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-zinc-50">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Use your work email. You&apos;ll pick a plan next — $12/mo or $99/year.
        </p>
        {params.sent ? (
          <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
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
      </div>
    </div>
  );
}
