import { redirect } from "next/navigation";
import { requireSession, getWorkspace, isPaid } from "@/lib/workspace";
import { Button } from "@/components/ui";
import { stripeConfigured } from "@/lib/stripe";
import { unlockLocalPlan } from "@/actions/workspace";
import { AuthFrame } from "@/components/auth-frame";
import Link from "next/link";

export default async function BillingPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const paid = isPaid(workspace);
  const nextHref = workspace.onboardingComplete ? "/app" : "/onboarding";

  return (
    <AuthFrame
      kicker={paid ? "Founder plan" : "Step 2 of 3 · Plan"}
      title={paid ? "You're in." : "Pick a plan."}
      body={
        paid
          ? "Your Founder plan is active. Open the Monday page or manage billing."
          : stripeConfigured()
            ? "Account is ready. $12 a month, or $99 for the founding year, unlocks the scorecard."
            : "Account is ready. Stripe keys are not set, so local checkout unlocks the app without charging a card."
      }
      step={paid ? undefined : 2}
      wide
      formKicker={paid ? "Active" : "Cheap enough to buy on a whim"}
      formTitle={paid ? "Open the Monday page" : "Choose Founder or founding year"}
      formBody={
        paid
          ? `${workspace.name} is on the Founder plan.`
          : "Same page either way. The year just locks the early price."
      }
    >
      {paid ? (
        <div className="mt-8 flex flex-col gap-3 sm:max-w-sm">
          <Link href={nextHref}>
            <Button className="w-full" size="lg">
              {workspace.onboardingComplete ? "Open dashboard" : "Finish setup"}
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <form
            action={stripeConfigured() ? "/api/stripe/checkout" : unlockLocalPlan}
            method="post"
            className="border border-[var(--rule)] bg-[var(--sheet)] p-6"
          >
            <input type="hidden" name="plan" value="monthly" />
            <p className="text-sm text-[var(--mute)]">Founder</p>
            <p className="mt-3 font-black text-5xl tracking-tight text-[var(--ink)]">
              $12
            </p>
            <p className="mt-1 text-sm text-[var(--mute)]">per month</p>
            <ul className="mt-5 space-y-1 text-sm text-[var(--mute)]">
              <li>KPI dashboard + sparkline</li>
              <li>Paying customer log</li>
              <li>Weekly review ritual</li>
            </ul>
            <Button type="submit" variant="secondary" className="mt-6 w-full" size="lg">
              Get the Founder plan
            </Button>
          </form>
          <form
            action={stripeConfigured() ? "/api/stripe/checkout" : unlockLocalPlan}
            method="post"
            className="border border-[var(--ink)] bg-[var(--ink)] p-6 text-[var(--sheet)]"
          >
            <input type="hidden" name="plan" value="annual" />
            <p className="text-sm text-[var(--sheet)]/55">Founding year</p>
            <p className="mt-3 font-black text-5xl tracking-tight">$99</p>
            <p className="mt-1 text-sm text-[var(--sheet)]/55">
              per year · save $45
            </p>
            <ul className="mt-5 space-y-1 text-sm text-[var(--sheet)]/70">
              <li>Everything in Founder</li>
              <li>Lock the early price</li>
              <li>Cancel anytime from billing</li>
            </ul>
            <Button type="submit" className="mt-6 w-full" size="lg">
              Get the founding year
            </Button>
          </form>
        </div>
      )}
    </AuthFrame>
  );
}
