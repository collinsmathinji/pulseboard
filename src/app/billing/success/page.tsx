import { redirect } from "next/navigation";
import { requireSession, getWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const { session_id: sessionId } = await searchParams;

  if (stripe && sessionId) {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    if (
      checkout.payment_status === "paid" ||
      checkout.status === "complete"
    ) {
      const customerId =
        typeof checkout.customer === "string"
          ? checkout.customer
          : checkout.customer?.id;
      const subscriptionId =
        typeof checkout.subscription === "string"
          ? checkout.subscription
          : checkout.subscription?.id;
      await prisma.workspace.update({
        where: { id: workspace.id },
        data: {
          planStatus: "active",
          stripeCustomerId: customerId ?? workspace.stripeCustomerId,
          stripeSubscriptionId:
            subscriptionId ?? workspace.stripeSubscriptionId,
        },
      });
    }
  }

  redirect(workspace.onboardingComplete ? "/app" : "/onboarding");
}
