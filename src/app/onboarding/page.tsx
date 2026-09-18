import { redirect } from "next/navigation";
import { requireSession, getWorkspace, isPaid } from "@/lib/workspace";
import { completeOnboarding } from "@/actions/workspace";
import { Button, Input, Label } from "@/components/ui";
import { StandaloneCard, PageKicker, PageTitle } from "@/components/portal";

export default async function OnboardingPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  if (!isPaid(workspace)) redirect("/billing");
  if (workspace.onboardingComplete) redirect("/app");

  return (
    <StandaloneCard className="max-w-xl">
      <PageKicker>Step 3 of 3 · Setup</PageKicker>
      <PageTitle className="mt-3">Name the company.</PageTitle>
      <p className="mt-3 text-sm leading-6 text-white/55">
        Plan is active. Log the numbers you already know. You can change them
        every Monday.
      </p>
      <form action={completeOnboarding} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="name">Startup name</Label>
          <Input id="name" name="name" required defaultValue={workspace.name} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="mrr">MRR (USD)</Label>
            <Input
              id="mrr"
              name="mrr"
              type="number"
              min="0"
              step="1"
              defaultValue="0"
            />
          </div>
          <div>
            <Label htmlFor="payingUsers">Paying users</Label>
            <Input
              id="payingUsers"
              name="payingUsers"
              type="number"
              min="0"
              step="1"
              defaultValue="0"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="runwayMonths">Runway (months)</Label>
          <Input
            id="runwayMonths"
            name="runwayMonths"
            type="number"
            min="0"
            step="0.5"
            defaultValue="0"
          />
        </div>
        <div>
          <Label htmlFor="weeklyGoal">This week&apos;s goal</Label>
          <Input
            id="weeklyGoal"
            name="weeklyGoal"
            placeholder="Get the next paying user"
          />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Open my scorecard
        </Button>
      </form>
    </StandaloneCard>
  );
}
