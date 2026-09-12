import { requireSession, getWorkspace } from "@/lib/workspace";
import { saveWeeklyReview } from "@/actions/workspace";
import { startOfWeek } from "@/lib/utils";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";

export default async function ReviewPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const weekOf = startOfWeek();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
        Ritual
      </p>
      <h1 className="mt-2 font-serif text-4xl text-zinc-50">Weekly review</h1>
      <p className="mt-2 text-zinc-400">
        Fifteen minutes. Update the numbers, pick three priorities, write what
        moved.
      </p>

      <form action={saveWeeklyReview} className="mt-8 space-y-5">
        <input type="hidden" name="weekOf" value={weekOf.toISOString()} />
        <div className="grid gap-3 sm:grid-cols-3">
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
        <div>
          <Label htmlFor="priority1">Priority 1</Label>
          <Input id="priority1" name="priority1" placeholder="The one thing" />
        </div>
        <div>
          <Label htmlFor="priority2">Priority 2</Label>
          <Input id="priority2" name="priority2" />
        </div>
        <div>
          <Label htmlFor="priority3">Priority 3</Label>
          <Input id="priority3" name="priority3" />
        </div>
        <div>
          <Label htmlFor="whatMoved">What moved this week?</Label>
          <Textarea
            id="whatMoved"
            name="whatMoved"
            placeholder="Wins, stalls, conversations."
          />
        </div>
        <Button type="submit" size="lg">
          Save week
        </Button>
      </form>

      {workspace.reviews.length > 0 ? (
        <div className="mt-12 space-y-3">
          <h2 className="font-serif text-2xl">Past weeks</h2>
          {workspace.reviews.map((review) => (
            <Card key={review.id}>
              <p className="text-sm text-zinc-500">
                Week of {review.weekOf.toISOString().slice(0, 10)}
              </p>
              <p className="mt-2 text-zinc-200">
                {review.whatMoved || "No notes"}
              </p>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
