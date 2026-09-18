export type DemoFounder = {
  key: string;
  name: string;
  email: string;
  startup: string;
  mrrCents: number;
  payingUsers: number;
  runwayMonths: number;
  weeklyGoal: string;
  blurb: string;
};

/** Demo founders used for signup page try-outs and DB seeding. */
export const DEMO_FOUNDERS: DemoFounder[] = [
  {
    key: "ada",
    name: "Ada Chen",
    email: "ada@demo.pulseboard.lol",
    startup: "Northwind Labs",
    mrrCents: 184_000,
    payingUsers: 11,
    runwayMonths: 9,
    weeklyGoal: "Close two design partners",
    blurb: "B2B ops · $1.8k MRR",
  },
  {
    key: "ben",
    name: "Ben Ortiz",
    email: "ben@demo.pulseboard.lol",
    startup: "Harbor AI",
    mrrCents: 42_000,
    payingUsers: 3,
    runwayMonths: 14,
    weeklyGoal: "Ship the Monday digest",
    blurb: "AI notes · $420 MRR",
  },
  {
    key: "cara",
    name: "Cara Ng",
    email: "cara@demo.pulseboard.lol",
    startup: "Relay Desk",
    mrrCents: 96_000,
    payingUsers: 8,
    runwayMonths: 6.5,
    weeklyGoal: "Cut support backlog in half",
    blurb: "Support inbox · $960 MRR",
  },
  {
    key: "devon",
    name: "Devon Park",
    email: "devon@demo.pulseboard.lol",
    startup: "Stackline",
    mrrCents: 240_000,
    payingUsers: 19,
    runwayMonths: 11,
    weeklyGoal: "Ask five users for a yearly plan",
    blurb: "Dev tools · $2.4k MRR",
  },
  {
    key: "elena",
    name: "Elena Vos",
    email: "elena@demo.pulseboard.lol",
    startup: "Monday Metric",
    mrrCents: 12_000,
    payingUsers: 1,
    runwayMonths: 18,
    weeklyGoal: "Get paying user #2",
    blurb: "Solo founder · $120 MRR",
  },
];

export function findDemo(key: string) {
  return DEMO_FOUNDERS.find((d) => d.key === key);
}
