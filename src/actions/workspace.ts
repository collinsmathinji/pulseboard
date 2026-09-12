"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession, getWorkspace, isPaid } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { stripeConfigured } from "@/lib/stripe";
import { dollarsToCents } from "@/lib/utils";

const onboardingSchema = z.object({
  name: z.string().min(1).max(80),
  mrr: z.string(),
  payingUsers: z.string(),
  runwayMonths: z.string(),
  weeklyGoal: z.string().max(200),
});

export async function unlockLocalPlan(formData: FormData) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  if (stripeConfigured()) {
    redirect("/billing");
  }

  const annual = String(formData.get("plan") ?? "monthly") === "annual";
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      planStatus: "active",
      planInterval: annual ? "year" : "month",
    },
  });

  redirect(workspace.onboardingComplete ? "/app" : "/onboarding");
}

export async function completeOnboarding(formData: FormData) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  if (!isPaid(workspace)) redirect("/billing");

  const parsed = onboardingSchema.parse({
    name: formData.get("name"),
    mrr: formData.get("mrr"),
    payingUsers: formData.get("payingUsers"),
    runwayMonths: formData.get("runwayMonths"),
    weeklyGoal: formData.get("weeklyGoal"),
  });

  const mrrCents = dollarsToCents(parsed.mrr);
  const payingUsers = Math.max(0, Math.floor(Number(parsed.payingUsers) || 0));
  const runwayMonths = Math.max(0, Number.parseFloat(parsed.runwayMonths) || 0);

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      name: parsed.name.trim(),
      mrrCents,
      payingUsers,
      runwayMonths,
      weeklyGoal: parsed.weeklyGoal.trim(),
      onboardingComplete: true,
    },
  });

  await prisma.metricSnapshot.create({
    data: {
      workspaceId: workspace.id,
      mrrCents,
      payingUsers,
      runwayMonths,
    },
  });

  revalidatePath("/app");
  redirect("/app");
}

export async function updateGoal(formData: FormData) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const weeklyGoal = String(formData.get("weeklyGoal") ?? "").slice(0, 200);
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { weeklyGoal },
  });
  revalidatePath("/app");
}

export async function addCustomer(formData: FormData) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  if (!isPaid(workspace)) redirect("/billing");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const amountCents = dollarsToCents(String(formData.get("amount") ?? "0"));
  const paidAtRaw = String(formData.get("paidAt") ?? "");
  const paidAt = paidAtRaw ? new Date(paidAtRaw) : new Date();

  if (!name) {
    redirect("/app/customers?error=name");
  }

  await prisma.customer.create({
    data: {
      workspaceId: workspace.id,
      name,
      email,
      notes,
      amountCents,
      paidAt,
    },
  });

  const payingUsers = workspace.customers.length + 1;
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { payingUsers },
  });

  await prisma.metricSnapshot.create({
    data: {
      workspaceId: workspace.id,
      mrrCents: workspace.mrrCents,
      payingUsers,
      runwayMonths: workspace.runwayMonths,
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/customers");
  redirect("/app/customers");
}

export async function deleteCustomer(formData: FormData) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.customer.deleteMany({
    where: { id, workspaceId: workspace.id },
  });

  const payingUsers = Math.max(0, workspace.customers.length - 1);
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { payingUsers },
  });

  revalidatePath("/app");
  revalidatePath("/app/customers");
}

export async function saveWeeklyReview(formData: FormData) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  if (!isPaid(workspace)) redirect("/billing");

  const mrrCents = dollarsToCents(String(formData.get("mrr") ?? "0"));
  const payingUsers = Math.max(
    0,
    Math.floor(Number(formData.get("payingUsers")) || 0),
  );
  const runwayMonths = Math.max(
    0,
    Number.parseFloat(String(formData.get("runwayMonths") ?? "0")) || 0,
  );
  const weekOf = new Date(String(formData.get("weekOf") ?? Date.now()));

  await prisma.weeklyReview.create({
    data: {
      workspaceId: workspace.id,
      weekOf,
      mrrCents,
      payingUsers,
      runwayMonths,
      priority1: String(formData.get("priority1") ?? "").trim(),
      priority2: String(formData.get("priority2") ?? "").trim(),
      priority3: String(formData.get("priority3") ?? "").trim(),
      whatMoved: String(formData.get("whatMoved") ?? "").trim(),
    },
  });

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { mrrCents, payingUsers, runwayMonths },
  });

  await prisma.metricSnapshot.create({
    data: {
      workspaceId: workspace.id,
      mrrCents,
      payingUsers,
      runwayMonths,
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/review");
  redirect("/app");
}

export async function togglePriority(formData: FormData) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  if (!id || !["p1Done", "p2Done", "p3Done"].includes(field)) return;

  const review = workspace.reviews.find((r) => r.id === id);
  if (!review) return;

  await prisma.weeklyReview.update({
    where: { id },
    data: {
      [field]: !review[field as "p1Done" | "p2Done" | "p3Done"],
    },
  });
  revalidatePath("/app");
}
