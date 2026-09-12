import { redirect } from "next/navigation";
import { requireSession, getWorkspace, isPaid } from "@/lib/workspace";
import { BrandMark } from "@/components/brand";
import { Button } from "@/components/ui";
import { stripeConfigured } from "@/lib/stripe";
import { PortalCanvas, PageKicker, PageTitle } from "@/components/portal";
import Link from "next/link";

export default async function BillingPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const paid = isPaid(workspace);

  return (
    <PortalCanvas className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        <BrandMark />
        <PageKicker>{paid ? "Founder plan" : "Pay to use"}</PageKicker>
        <PageTitle className="mt-3">
          {paid ? "You're in." : "Cheap enough to buy on a whim."}
        </PageTitle>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
          {paid
            ? "Your Founder plan is active. Open the Monday page or manage billing."
            : stripeConfigured()
              ? "Real checkout. $12/month or $99 for the founding year."
              : "Stripe keys are not set, so local checkout unlocks the app without charging a card."}
        </p>

        {paid ? (
          <div className="mt-8 flex flex-col gap-3 sm:max-w-sm">
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
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <form
              action="/api/stripe/checkout"
              method="post"
              className="rounded-[28px] bg-white/5 p-6"
            >
              <input type="hidden" name="plan" value="monthly" />
              <p className="text-sm text-[#e8b44d]">Founder</p>
              <p className="mt-2 font-black text-5xl tracking-tight">$12</p>
              <p className="mt-1 text-sm text-white/45">per month</p>
              <ul className="mt-5 space-y-1 text-sm text-white/65">
                <li>KPI dashboard + sparkline</li>
                <li>Paying customer log</li>
                <li>Weekly review ritual</li>
              </ul>
              <Button type="submit" className="mt-6 w-full" size="lg">
                Get the Founder plan
              </Button>
            </form>
            <form
              action="/api/stripe/checkout"
              method="post"
              className="rounded-[28px] bg-[#d8d8e2] p-6 text-[#16081f]"
            >
              <input type="hidden" name="plan" value="annual" />
              <p className="text-sm text-[#16081f]/50">Founding year</p>
              <p className="mt-2 font-black text-5xl tracking-tight">$99</p>
              <p className="mt-1 text-sm text-[#16081f]/55">per year · save $45</p>
              <ul className="mt-5 space-y-1 text-sm text-[#16081f]/70">
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
      </div>
    </PortalCanvas>
  );
}
