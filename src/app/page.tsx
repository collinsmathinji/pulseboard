import { LandingPage } from "@/components/landing";
import { getSignupStats } from "@/lib/signups";

export default async function Home() {
  const { total } = await getSignupStats();
  return <LandingPage founderCount={total} />;
}
