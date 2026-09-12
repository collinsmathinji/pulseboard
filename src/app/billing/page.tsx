import { redirect } from "next/navigation";
import { requireSession, getWorkspace, isPaid } from "@/lib/workspace";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui";
import { stripeConfigured } from "@/lib/stripe";
import Link from "next/link";

export default async function BillingPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const paid = isPaid(workspace);

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-16">
      <BrandMark />
      <h1 className="mt-6 font-serif text-4xl text-zinc-50">
        {paid ? "You're in." : "Pay to use Pulseboard."}
      </h1>
      <p className="mt-3 text-zinc-400">
        {paid
          ? "Your Founder plan is active. Manage billing or go to the dashboard."
          : stripeConfigured()
            ? "Real checkout. $12/month or $99 for the founding year."
            : "Stripe keys are not set, so local checkout unlocks the app without charging a card."}
      </p>

      {paid ? (
        <div className="mt-8 flex flex-col gap-3">
          <Link href={workspace.onboardingComplete ? "/app" : "/onboarding"}>
            <Button className="w-full" size="lg">
              {workspace.onboardingComplete
                ? "Open dashboard"
                : "Finish setup"}
            </Button>
          </Link>
          {workspace.stripeCustomerId ? (
            <form action="/api/stripe/portal" method="post">
              <Button type="submit" variant="outline" className="w-full" size="lg">
                Manage subscription
              </Button>
            </form>
          ) : null}
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          <form action="/api/stripe/checkout" method="post">
            <input type="hidden" name="plan" value="monthly" />
            <Button type="submit" className="w-full" size="lg">
              $12 / month
            </Button>
          </form>
          <form action="/api/stripe/checkout" method="post">
            <input type="hidden" name="plan" value="annual" />
            <Button type="submit" variant="outline" className="w-full" size="lg">
              $99 / year
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
