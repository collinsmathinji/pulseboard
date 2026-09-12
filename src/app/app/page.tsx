import Link from "next/link";
import { requireSession, getWorkspace } from "@/lib/workspace";
import { formatMoney, formatNumber, startOfWeek } from "@/lib/utils";
import { KpiCard, Sparkline } from "@/components/kpi";
import { Button, Card, Input } from "@/components/ui";
import { togglePriority, updateGoal } from "@/actions/workspace";
import {
  PageKicker,
  PageTitle,
  PathToFive,
  formatDelta,
  formatWeekStamp,
  isoWeek,
} from "@/components/portal";

export default async function DashboardPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const remaining = Math.max(0, 5 - workspace.payingUsers);
  const latestReview = workspace.reviews[0];
  const mrrPoints = workspace.snapshots.map((s) => s.mrrCents);
  const previous = workspace.snapshots.at(-2);
  const mrrDelta = previous ? workspace.mrrCents - previous.mrrCents : null;
  const userDelta = previous
    ? workspace.payingUsers - previous.payingUsers
    : null;
  const arpu =
    workspace.payingUsers > 0
      ? Math.round(workspace.mrrCents / workspace.payingUsers)
      : 0;
  const loggedRevenue = workspace.customers.reduce(
    (sum, customer) => sum + customer.amountCents,
    0,
  );
  const cashCover = Math.round(workspace.mrrCents * workspace.runwayMonths);
  const weekStart = startOfWeek();
  const reviewedThisWeek = Boolean(
    latestReview &&
      startOfWeek(latestReview.weekOf).getTime() === weekStart.getTime(),
  );
  const priorities = latestReview
    ? (
        [
          [latestReview.priority1, latestReview.p1Done, "p1Done"],
          [latestReview.priority2, latestReview.p2Done, "p2Done"],
          [latestReview.priority3, latestReview.p3Done, "p3Done"],
        ] as const
      ).filter(([text]) => Boolean(text))
    : [];
  const doneCount = priorities.filter(([, done]) => done).length;
  const ritual = [
    {
      n: "01",
      title: "Write the week",
      done: reviewedThisWeek,
      detail: reviewedThisWeek
        ? "This Monday is logged."
        : "Numbers are still last week’s.",
    },
    {
      n: "02",
      title: "Keep three",
      done: priorities.length === 3,
      detail:
        priorities.length === 0
          ? "No priorities yet."
          : `${doneCount} of ${priorities.length} checked off.`,
    },
    {
      n: "03",
      title: "Count to five",
      done: workspace.payingUsers >= 5,
      detail:
        remaining > 0
          ? `${remaining} more paying user${remaining === 1 ? "" : "s"}.`
          : "Milestone hit.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <PageKicker>
            Overview · week {isoWeek()} · {formatWeekStamp()}
          </PageKicker>
          <PageTitle>{workspace.name}</PageTitle>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
            Four numbers. Three priorities. One Monday page.{" "}
            {workspace.reviews.length === 1
              ? "1 week logged."
              : `${workspace.reviews.length} weeks logged.`}
          </p>
        </div>
        <Link href="/app/review">
          <Button size="lg">
            {reviewedThisWeek ? "Update this week" : "Log this week"}
          </Button>
        </Link>
      </div>

      <Card className="mt-8">
        <PathToFive count={workspace.payingUsers} />
        <p className="mt-3 text-sm text-white/55">
          {remaining > 0 ? (
            <>
              {remaining} more paying user{remaining === 1 ? "" : "s"} to the
              Vaya milestone. Log them in{" "}
              <Link href="/app/customers" className="text-[#e8b44d] underline">
                Customers
              </Link>
              .
            </>
          ) : (
            "You have 5+ paying users. That is the Vaya milestone."
          )}
        </p>
      </Card>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="MRR"
          value={formatMoney(workspace.mrrCents)}
          hint={
            mrrDelta === null
              ? "Log a second week to see change"
              : `${formatDelta(mrrDelta)} vs last week`
          }
        />
        <KpiCard
          label="Paying users"
          value={formatNumber(workspace.payingUsers)}
          hint={
            userDelta === null
              ? `${Math.min(workspace.payingUsers, 5)} / 5 to milestone`
              : `${userDelta >= 0 ? "+" : ""}${userDelta} this week · ${Math.min(workspace.payingUsers, 5)} / 5`
          }
        />
        <KpiCard
          label="Runway"
          value={`${workspace.runwayMonths} mo`}
          hint={
            cashCover > 0
              ? `${formatMoney(cashCover)} at current MRR`
              : "Set runway in the weekly review"
          }
        />
        <KpiCard
          label="This week"
          value={workspace.weeklyGoal || "Set a goal"}
          hint={
            reviewedThisWeek ? "Monday ritual done" : "Ritual still open"
          }
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-white/45">Average from paying users</p>
          <p className="mt-2 font-black text-3xl tracking-tight">
            {workspace.payingUsers > 0 ? formatMoney(arpu) : "—"}
          </p>
          <p className="mt-2 text-sm text-white/45">
            ARPU · {workspace.payingUsers} paying
          </p>
        </Card>
        <Card>
          <p className="text-sm text-white/45">Logged in the customer book</p>
          <p className="mt-2 font-black text-3xl tracking-tight">
            {formatMoney(loggedRevenue)}
          </p>
          <p className="mt-2 text-sm text-white/45">
            {workspace.customers.length === 1
              ? "1 payment recorded"
              : `${workspace.customers.length} payments recorded`}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-white/45">Weeks on the board</p>
          <p className="mt-2 font-black text-3xl tracking-tight">
            {workspace.reviews.length}
          </p>
          <p className="mt-2 text-sm text-white/45">
            {workspace.snapshots.length === 1
              ? "1 metric snapshot"
              : `${workspace.snapshots.length} metric snapshots`}
          </p>
        </Card>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white/45">MRR trend</p>
            {mrrDelta !== null ? (
              <span className="font-mono text-sm text-[#e8b44d]">
                {formatDelta(mrrDelta)}
              </span>
            ) : null}
          </div>
          <div className="mt-4">
            <Sparkline points={mrrPoints} />
          </div>
          {workspace.snapshots.length > 0 ? (
            <p className="mt-3 text-sm text-white/40">
              {workspace.snapshots.length === 1
                ? "1 week of numbers."
                : `${workspace.snapshots.length} weeks of numbers.`}
              Last recorded{" "}
              {workspace.snapshots
                .at(-1)
                ?.recordedAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              .
            </p>
          ) : null}
        </Card>

        <Card>
          <p className="text-sm text-white/45">Monday ritual</p>
          <ol className="mt-4 space-y-4">
            {ritual.map((item) => (
              <li key={item.n} className="flex gap-3">
                <span className="font-mono text-sm text-[#e8b44d]">
                  {item.n}
                </span>
                <div>
                  <p className="text-sm text-white">
                    {item.title}
                    {item.done ? " · done" : ""}
                  </p>
                  <p className="mt-1 text-sm text-white/45">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Card>
          <p className="text-sm text-white/45">This week&apos;s sentence</p>
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
          {priorities.length > 0 ? (
            <ul className="mt-5 space-y-2">
              {priorities.map(([text, done, field]) => (
                <li key={field}>
                  <form action={togglePriority}>
                    <input type="hidden" name="id" value={latestReview.id} />
                    <input type="hidden" name="field" value={field} />
                    <button
                      type="submit"
                      className="flex w-full items-start gap-2 text-left text-sm text-white"
                    >
                      <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded border border-white/20 text-[10px] text-[#e8b44d]">
                        {done ? "✓" : ""}
                      </span>
                      <span className={done ? "text-white/40 line-through" : ""}>
                        {text}
                      </span>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-white/45">
              No review yet.{" "}
              <Link href="/app/review" className="text-[#e8b44d] underline">
                Write this week&apos;s three
              </Link>
              .
            </p>
          )}
          {latestReview?.whatMoved ? (
            <div className="mt-5 border-t border-white/8 pt-4">
              <p className="text-sm text-white/45">What moved last time</p>
              <p className="mt-2 text-sm leading-6 text-white/80">
                {latestReview.whatMoved}
              </p>
            </div>
          ) : null}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/45">Paying customer log</p>
            <Link href="/app/customers" className="text-sm text-[#e8b44d]">
              View all
            </Link>
          </div>
          {workspace.customers.length === 0 ? (
            <p className="mt-4 text-sm text-white/45">
              Nobody in the log yet. Add your first paying user — even if it
              was $12.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-white/8">
              {workspace.customers.slice(0, 5).map((customer) => (
                <li
                  key={customer.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="text-white">{customer.name}</p>
                    <p className="mt-0.5 text-white/40">
                      {customer.paidAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                      {customer.notes ? ` · ${customer.notes}` : ""}
                    </p>
                  </div>
                  <span className="font-mono text-[#e8b44d]">
                    {formatMoney(customer.amountCents)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
