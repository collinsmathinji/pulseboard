import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getWorkspace } from "@/lib/workspace";
import {
  ANNUAL_AMOUNT,
  MONTHLY_AMOUNT,
  appUrl,
  stripe,
  stripeConfigured,
} from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/signup?next=/billing", appUrl()));
  }

  const contentType = request.headers.get("content-type") ?? "";
  let plan = "monthly";
  if (contentType.includes("form")) {
    const form = await request.formData();
    plan = String(form.get("plan") ?? "monthly");
  } else {
    const json = (await request.json().catch(() => ({}))) as { plan?: string };
    plan = json.plan ?? "monthly";
  }
  const annual = plan === "annual";

  const workspace = await getWorkspace(session.user.id);

  if (!stripeConfigured() || !stripe) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY." },
        { status: 500 },
      );
    }

    await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        planStatus: "active",
        planInterval: annual ? "year" : "month",
      },
    });

    const next = workspace.onboardingComplete ? "/app" : "/onboarding";
    return NextResponse.redirect(new URL(next, appUrl()), 303);
  }

  const priceId = annual
    ? process.env.STRIPE_PRICE_ANNUAL
    : process.env.STRIPE_PRICE_MONTHLY;

  const lineItems = priceId
    ? [{ price: priceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: annual
                ? "Pulseboard Founding — annual"
                : "Pulseboard Founder",
              description:
                "Weekly operating scorecard for founders. Cancel anytime.",
            },
            unit_amount: annual ? ANNUAL_AMOUNT : MONTHLY_AMOUNT,
            recurring: { interval: annual ? "year" : "month" },
          },
          quantity: 1,
        },
      ];

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: workspace.stripeCustomerId ?? undefined,
    customer_email: workspace.stripeCustomerId
      ? undefined
      : (session.user.email ?? undefined),
    line_items: lineItems,
    success_url: `${appUrl()}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl()}/billing`,
    metadata: {
      userId: session.user.id,
      workspaceId: workspace.id,
    },
    subscription_data: {
      metadata: {
        userId: session.user.id,
        workspaceId: workspace.id,
      },
    },
  });

  if (!checkout.url) {
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(checkout.url, 303);
}
