import { requireSession, getWorkspace } from "@/lib/workspace";
import { saveWeeklyReview } from "@/actions/workspace";
import { formatMoney, startOfWeek } from "@/lib/utils";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import { PageKicker, PageTitle, formatWeekStamp, isoWeek } from "@/components/portal";

export default async function ReviewPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const weekOf = startOfWeek();
  const latest = workspace.reviews[0];
  const sameWeek =
    latest && startOfWeek(latest.weekOf).getTime() === weekOf.getTime();

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <PageKicker>
        Ritual · week {isoWeek()} · {formatWeekStamp(weekOf)}
      </PageKicker>
      <PageTitle>Write the week</PageTitle>
      <p className="mt-3 text-sm leading-6 text-white/55">
        Fifteen minutes. Update the numbers, pick three priorities, write what
        moved. Then close the tabs.
      </p>

      <form action={saveWeeklyReview} className="mt-8 space-y-4">
        <input type="hidden" name="weekOf" value={weekOf.toISOString()} />

        <Card>
          <p className="font-mono text-sm text-[#e8b44d]">01 · Four numbers</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="mrr">MRR (USD)</Label>
              <Input
                id="mrr"
                name="mrr"
                type="number"
                min="0"
                step="1"
                defaultValue={String(workspace.mrrCents / 100)}
              />
            </div>
            <div>
              <Label htmlFor="payingUsers">Paying users</Label>
              <Input
                id="payingUsers"
                name="payingUsers"
                type="number"
                min="0"
                defaultValue={String(workspace.payingUsers)}
              />
            </div>
            <div>
              <Label htmlFor="runwayMonths">Runway (months)</Label>
              <Input
                id="runwayMonths"
                name="runwayMonths"
                type="number"
                min="0"
                step="0.5"
                defaultValue={String(workspace.runwayMonths)}
              />
            </div>
          </div>
        </Card>

        <Card>
          <p className="font-mono text-sm text-[#e8b44d]">02 · Keep three</p>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="priority1">Priority 1</Label>
              <Input
                id="priority1"
                name="priority1"
                placeholder="The one thing"
                defaultValue={sameWeek ? latest?.priority1 : ""}
              />
            </div>
            <div>
              <Label htmlFor="priority2">Priority 2</Label>
              <Input
                id="priority2"
                name="priority2"
                defaultValue={sameWeek ? latest?.priority2 : ""}
              />
            </div>
            <div>
              <Label htmlFor="priority3">Priority 3</Label>
              <Input
                id="priority3"
                name="priority3"
                defaultValue={sameWeek ? latest?.priority3 : ""}
              />
            </div>
          </div>
        </Card>

        <Card>
          <p className="font-mono text-sm text-[#e8b44d]">03 · What moved</p>
          <div className="mt-4">
            <Label htmlFor="whatMoved">Wins, stalls, conversations</Label>
            <Textarea
              id="whatMoved"
              name="whatMoved"
              placeholder="What actually changed since last Monday."
              defaultValue={sameWeek ? latest?.whatMoved : ""}
            />
          </div>
        </Card>

        <Button type="submit" size="lg">
          Save week
        </Button>
      </form>

      {workspace.reviews.length > 0 ? (
        <div className="mt-12">
          <h2 className="font-black text-2xl tracking-tight">Past weeks</h2>
          <div className="mt-4 space-y-3">
            {workspace.reviews.map((review) => (
              <Card key={review.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-[#e8b44d]">
                    Week of{" "}
                    {review.weekOf.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="font-mono text-sm text-white/45">
                    {formatMoney(review.mrrCents)} · {review.payingUsers} users ·{" "}
                    {review.runwayMonths} mo
                  </p>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-white/80">
                  {[review.priority1, review.priority2, review.priority3]
                    .filter(Boolean)
                    .map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                </ul>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {review.whatMoved || "No notes"}
                </p>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
