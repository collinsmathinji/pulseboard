import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWorkspace } from "@/lib/workspace";
import { appUrl, stripe, stripeConfigured } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", appUrl()));
  }

  const workspace = await getWorkspace(session.user.id);

  if (!stripeConfigured() || !stripe || !workspace.stripeCustomerId) {
    return NextResponse.redirect(new URL("/billing", appUrl()), 303);
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: workspace.stripeCustomerId,
    return_url: `${appUrl()}/billing`,
  });

  return NextResponse.redirect(portal.url, 303);
}
