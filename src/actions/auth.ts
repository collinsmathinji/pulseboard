"use server";

import { redirect } from "next/navigation";
import { authFlags, signIn } from "@/auth";
import { findDemo, type DemoFounder } from "@/lib/demos";
import { prisma } from "@/lib/prisma";

function cleanEmail(formData: FormData) {
  return String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
}

function dest(formData: FormData, fallback: string) {
  const next = String(formData.get("next") ?? "").trim();
  return next.startsWith("/") ? next : fallback;
}

async function ensureDemoWorkspace(demo: DemoFounder, userId: string) {
  const workspace = await prisma.workspace.upsert({
    where: { userId },
    update: {
      name: demo.startup,
      mrrCents: demo.mrrCents,
      payingUsers: demo.payingUsers,
      runwayMonths: demo.runwayMonths,
      weeklyGoal: demo.weeklyGoal,
      onboardingComplete: true,
      planStatus: "active",
      planInterval: "month",
    },
    create: {
      userId,
      name: demo.startup,
      mrrCents: demo.mrrCents,
      payingUsers: demo.payingUsers,
      runwayMonths: demo.runwayMonths,
      weeklyGoal: demo.weeklyGoal,
      onboardingComplete: true,
      planStatus: "active",
      planInterval: "month",
    },
  });

  const existingCustomers = await prisma.customer.count({
    where: { workspaceId: workspace.id },
  });
  if (existingCustomers === 0 && demo.payingUsers > 0) {
    const sample = Math.min(demo.payingUsers, 3);
    const amount = Math.max(
      1_200,
      Math.round(demo.mrrCents / Math.max(demo.payingUsers, 1)),
    );
    await prisma.customer.createMany({
      data: Array.from({ length: sample }, (_, i) => ({
        workspaceId: workspace.id,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@${demo.key}.demo`,
        amountCents: amount,
        paidAt: new Date(Date.now() - i * 86_400_000 * 9),
        notes: "Seeded demo payment",
      })),
    });
  }

  return workspace;
}

export async function createAccount(formData: FormData) {
  const email = cleanEmail(formData);
  const name = String(formData.get("name") ?? "").trim();
  const next = dest(formData, "/billing");
  if (!email.includes("@")) {
    redirect(`/signup?notice=invalid&next=${encodeURIComponent(next)}`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect(`/login?notice=exists&next=${encodeURIComponent(next)}`);
  }

  if (authFlags.resend && !authFlags.emailLogin) {
    await signIn("resend", { email, redirectTo: next });
    return;
  }

  await signIn("credentials", {
    email,
    name,
    intent: "signup",
    redirectTo: next,
  });
}

export async function returnToAccount(formData: FormData) {
  const email = cleanEmail(formData);
  const next = dest(formData, "/app");
  if (!email.includes("@")) {
    redirect(`/login?notice=invalid&next=${encodeURIComponent(next)}`);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    redirect(`/signup?notice=missing&next=${encodeURIComponent("/billing")}`);
  }

  if (authFlags.resend && !authFlags.emailLogin) {
    await signIn("resend", { email, redirectTo: next });
    return;
  }

  await signIn("credentials", {
    email,
    intent: "signin",
    redirectTo: next,
  });
}

export async function continueWithGoogle(formData: FormData) {
  const next = dest(formData, "/app");
  await signIn("google", { redirectTo: next });
}

/** Open a pre-built demo founder scorecard (creates the account if needed). */
export async function startAsDemo(formData: FormData) {
  if (!authFlags.emailLogin) {
    redirect("/signup?notice=demo-off");
  }

  const demo = findDemo(String(formData.get("demo") ?? ""));
  if (!demo) {
    redirect("/signup?notice=invalid");
  }

  const user = await prisma.user.upsert({
    where: { email: demo.email },
    update: { name: demo.name },
    create: { email: demo.email, name: demo.name },
  });
  await ensureDemoWorkspace(demo, user.id);

  await signIn("credentials", {
    email: demo.email,
    intent: "signin",
    redirectTo: "/app",
  });
}
