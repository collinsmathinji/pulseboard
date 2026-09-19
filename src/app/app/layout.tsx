import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireSession, getWorkspace, isPaid } from "@/lib/workspace";
import { AppNav } from "@/components/app-nav";
import { AnalyticsScripts } from "@/components/analytics";

export default async function AppShell({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  if (!isPaid(workspace)) redirect("/billing");
  if (!workspace.onboardingComplete) redirect("/onboarding");

  return (
    <div className="app-shell flex min-h-svh flex-col lg:flex-row">
      <AppNav workspaceName={workspace.name} email={session.user.email} />
      <div className="min-w-0 flex-1 px-5 py-6 lg:px-10 lg:py-8">{children}</div>
      <AnalyticsScripts
        gaId={workspace.gaMeasurementId}
        gtmId={workspace.gtmContainerId}
      />
    </div>
  );
}
