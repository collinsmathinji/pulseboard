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

export async function getWorkspace(userId: string) {
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
