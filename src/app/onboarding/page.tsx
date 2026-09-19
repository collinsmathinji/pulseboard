import { redirect } from "next/navigation";
import { requireSession, getWorkspace, isPaid } from "@/lib/workspace";
import { completeOnboarding } from "@/actions/workspace";
import { AuthFrame } from "@/components/auth-frame";
import { Button, Input, Label } from "@/components/ui";

export default async function OnboardingPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  if (!isPaid(workspace)) redirect("/billing");
  if (workspace.onboardingComplete) redirect("/app");

  return (
    <AuthFrame
      kicker="Step 3 of 3 · Setup"
      title="Name the company."
      body="Plan is active. Log the numbers you already know. You can change them every Monday."
      step={3}
      formKicker="Then open the page"
      formTitle="First numbers"
      formBody="A name, MRR, paying users, runway, and this week’s sentence."
    >
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
    </AuthFrame>
  );
}
