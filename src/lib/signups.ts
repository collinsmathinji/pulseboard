import { prisma } from "@/lib/prisma";
import { DEMO_FOUNDERS } from "@/lib/demos";

const demoEmails = new Set(DEMO_FOUNDERS.map((d) => d.email));

export async function getSignupStats() {
  try {
    const [total, recent] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        orderBy: { id: "desc" },
        take: 8,
        select: { name: true, email: true, image: true },
      }),
    ]);

    const faces = recent.map((u) => ({
      name: u.name?.trim() || u.email?.split("@")[0] || "Founder",
      isDemo: Boolean(u.email && demoEmails.has(u.email)),
    }));

    return { total, faces };
  } catch {
    return {
      total: DEMO_FOUNDERS.length,
      faces: DEMO_FOUNDERS.map((d) => ({
        name: d.name,
        isDemo: true,
      })),
    };
  }
}
