/**
 * Seed five demo founder accounts with unlocked scorecards.
 * Usage: node scripts/seed-demo-accounts.mjs
 */
import { PrismaClient } from "@prisma/client";

const DEMOS = [
  {
    name: "Ada Chen",
    email: "ada@demo.pulseboard.lol",
    startup: "Northwind Labs",
    mrrCents: 184000,
    payingUsers: 11,
    runwayMonths: 9,
    weeklyGoal: "Close two design partners",
  },
  {
    name: "Ben Ortiz",
    email: "ben@demo.pulseboard.lol",
    startup: "Harbor AI",
    mrrCents: 42000,
    payingUsers: 3,
    runwayMonths: 14,
    weeklyGoal: "Ship the Monday digest",
  },
  {
    name: "Cara Ng",
    email: "cara@demo.pulseboard.lol",
    startup: "Relay Desk",
    mrrCents: 96000,
    payingUsers: 8,
    runwayMonths: 6.5,
    weeklyGoal: "Cut support backlog in half",
  },
  {
    name: "Devon Park",
    email: "devon@demo.pulseboard.lol",
    startup: "Stackline",
    mrrCents: 240000,
    payingUsers: 19,
    runwayMonths: 11,
    weeklyGoal: "Ask five users for a yearly plan",
  },
  {
    name: "Elena Vos",
    email: "elena@demo.pulseboard.lol",
    startup: "Monday Metric",
    mrrCents: 12000,
    payingUsers: 1,
    runwayMonths: 18,
    weeklyGoal: "Get paying user #2",
  },
];

async function main() {
  const prisma = new PrismaClient();
  const created = [];

  try {
    for (const demo of DEMOS) {
      const user = await prisma.user.upsert({
        where: { email: demo.email },
        update: { name: demo.name },
        create: { email: demo.email, name: demo.name },
      });

      const workspace = await prisma.workspace.upsert({
        where: { userId: user.id },
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
          userId: user.id,
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

      const customerCount = await prisma.customer.count({
        where: { workspaceId: workspace.id },
      });
      if (customerCount === 0 && demo.payingUsers > 0) {
        const sample = Math.min(demo.payingUsers, 3);
        const amount = Math.max(
          1200,
          Math.round(demo.mrrCents / Math.max(demo.payingUsers, 1)),
        );
        await prisma.customer.createMany({
          data: Array.from({ length: sample }, (_, i) => ({
            workspaceId: workspace.id,
            name: `Customer ${i + 1}`,
            email: `customer${i + 1}@${demo.email.split("@")[0]}.demo`,
            amountCents: amount,
            paidAt: new Date(Date.now() - i * 86400000 * 9),
            notes: "Seeded demo payment",
          })),
        });
      }

      created.push({ email: demo.email, startup: demo.startup });
    }

    const total = await prisma.user.count();
    console.log(JSON.stringify({ seeded: created.length, total, created }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
