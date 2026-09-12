import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

async function ensureUser(userId: string) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (existing) return existing;

  const session = await auth();
  const email =
    session?.user?.id === userId
      ? session.user.email?.trim().toLowerCase() || undefined
      : undefined;
  const name =
    session?.user?.name ?? email?.split("@")[0] ?? "Founder";

  try {
    return await prisma.user.create({
      data: { id: userId, email, name },
    });
  } catch {
    return prisma.user.create({
      data: { id: userId, name },
    });
  }
}

export async function getWorkspace(userId: string) {
  await ensureUser(userId);
  return prisma.workspace.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      name: "My startup",
    },
    include: {
      snapshots: { orderBy: { recordedAt: "asc" } },
      customers: { orderBy: { paidAt: "desc" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 12 },
    },
  });
}

export function isPaid(workspace: { planStatus: string }) {
  return workspace.planStatus === "active";
}
