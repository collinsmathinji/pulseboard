import Link from "next/link";
import { requireSession, getWorkspace } from "@/lib/workspace";
import { formatMoney, formatNumber } from "@/lib/utils";
import { KpiCard, Sparkline } from "@/components/kpi";
import { Button, Card, Input } from "@/components/ui";
import { togglePriority, updateGoal } from "@/actions/workspace";

export default async function DashboardPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const remaining = Math.max(0, 5 - workspace.payingUsers);
  const latestReview = workspace.reviews[0];
  const mrrPoints = workspace.snapshots.map((s) => s.mrrCents);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
            Overview
          </p>
          <h1 className="mt-2 font-serif text-4xl text-zinc-50">
            {workspace.name}
          </h1>
        </div>
        <Link href="/app/review">
          <Button>Log this week</Button>
        </Link>
      </div>

      {remaining > 0 ? (
        <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/8 px-4 py-3 text-sm text-cyan-100">
          {remaining} more paying user{remaining === 1 ? "" : "s"} to hit 5.
          Log them in{" "}
          <Link href="/app/customers" className="underline">
            Customers
          </Link>
          .
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-100">
          You have 5+ paying users. That is the Vaya milestone.
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="MRR" value={formatMoney(workspace.mrrCents)} />
        <KpiCard
          label="Paying users"
          value={formatNumber(workspace.payingUsers)}
          hint={`${Math.min(workspace.payingUsers, 5)} / 5`}
        />
        <KpiCard
          label="Runway"
          value={`${workspace.runwayMonths} mo`}
        />
        <KpiCard
          label="This week"
          value={workspace.weeklyGoal || "Set a goal"}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm text-zinc-400">MRR trend</p>
          <div className="mt-3">
            <Sparkline points={mrrPoints} />
          </div>
        </Card>
        <Card>
          <p className="text-sm text-zinc-400">This week&apos;s goal</p>
          <form action={updateGoal} className="mt-3 flex gap-2">
            <Input
              name="weeklyGoal"
              defaultValue={workspace.weeklyGoal}
              placeholder="One sentence."
            />
            <Button type="submit" variant="secondary">
              Save
            </Button>
          </form>
          {latestReview ? (
            <ul className="mt-5 space-y-2 text-sm">
              {[
                [latestReview.priority1, latestReview.p1Done, "p1Done"],
                [latestReview.priority2, latestReview.p2Done, "p2Done"],
                [latestReview.priority3, latestReview.p3Done, "p3Done"],
              ]
                .filter(([text]) => Boolean(text))
                .map(([text, done, field]) => (
                  <li key={String(field)}>
                    <form action={togglePriority}>
                      <input type="hidden" name="id" value={latestReview.id} />
                      <input type="hidden" name="field" value={String(field)} />
                      <button
                        type="submit"
                        className="flex w-full items-start gap-2 text-left text-zinc-200"
                      >
                        <span className="mt-0.5 h-4 w-4 rounded border border-zinc-600 text-center text-[10px] text-cyan-400">
                          {done ? "✓" : ""}
                        </span>
                        <span className={done ? "text-zinc-500 line-through" : ""}>
                          {String(text)}
                        </span>
                      </button>
                    </form>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">
              No review yet. Write this week&apos;s three priorities.
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">Recent paying customers</p>
          <Link href="/app/customers" className="text-sm text-cyan-300">
            View all
          </Link>
        </div>
        {workspace.customers.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">
            Nobody in the log yet. Add your first paying user.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-800">
            {workspace.customers.slice(0, 5).map((customer) => (
              <li
                key={customer.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span>{customer.name}</span>
                <span className="text-zinc-400">
                  {formatMoney(customer.amountCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
