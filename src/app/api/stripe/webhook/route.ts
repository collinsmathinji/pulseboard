import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function markPaid(workspaceId: string, customerId?: string | null, subscriptionId?: string | null, interval?: string | null) {
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      planStatus: "active",
      stripeCustomerId: customerId ?? undefined,
      stripeSubscriptionId: subscriptionId ?? undefined,
      planInterval: interval ?? undefined,
    },
  });
}

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const workspaceId = session.metadata?.workspaceId;
    if (workspaceId) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      await markPaid(workspaceId, customerId, subscriptionId, null);
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object;
    const workspaceId = sub.metadata?.workspaceId;
    const status = sub.status === "active" || sub.status === "trialing"
      ? "active"
      : "unpaid";
    if (workspaceId) {
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          planStatus: event.type === "customer.subscription.deleted" ? "canceled" : status,
          stripeSubscriptionId: sub.id,
          stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
          planInterval: sub.items.data[0]?.price.recurring?.interval ?? undefined,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
