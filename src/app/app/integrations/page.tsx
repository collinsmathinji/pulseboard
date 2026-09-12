import Link from "next/link";
import { requireSession, getWorkspace } from "@/lib/workspace";
import {
  integrationCount,
  shareLinks,
  stripeIntegrationStatus,
  workspaceSocial,
} from "@/lib/integrations";
import {
  clearAnalytics,
  clearSocial,
  saveAnalytics,
  saveSocial,
} from "@/actions/integrations";
import { Button, Card, Input, Label } from "@/components/ui";
import { PageKicker, PageTitle } from "@/components/portal";
import { ShareRow } from "@/components/social";

function StatusPill({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs ${
        on ? "bg-[#e8b44d]/16 text-[#e8b44d]" : "bg-white/8 text-white/45"
      }`}
    >
      {label}
    </span>
  );
}

export default async function IntegrationsPage() {
  const session = await requireSession();
  const workspace = await getWorkspace(session.user.id);
  const stripe = stripeIntegrationStatus();
  const social = workspaceSocial(workspace);
  const counts = integrationCount(workspace);
  const share = shareLinks(
    `${workspace.name} runs the week from one Pulseboard page.`,
  );

  return (
    <div className="mx-auto max-w-3xl pb-6">
      <PageKicker>Systems · {workspace.name}</PageKicker>
      <PageTitle>Plug the stack in.</PageTitle>
      <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
        Three slots. Analytics measures the page. Stripe takes the money.
        Social is how the week leaves the building.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-white/45">Connected</p>
          <p className="mt-2 font-black text-3xl">{counts.connected} / 3</p>
        </Card>
        <Card>
          <p className="text-sm text-white/45">Payments</p>
          <p className="mt-2 font-black text-3xl">
            {stripe.paymentsLive ? "Live" : "Local"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-white/45">Social profiles</p>
          <p className="mt-2 font-black text-3xl">{social.length}</p>
        </Card>
      </div>

      <Card className="mt-4">
        <p className="font-mono text-sm text-[#e8b44d]">01 · Google Analytics</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusPill
            on={Boolean(workspace.gaMeasurementId)}
            label={
              workspace.gaMeasurementId
                ? `GA4 ${workspace.gaMeasurementId}`
                : "GA4 empty"
            }
          />
          <StatusPill
            on={Boolean(workspace.gtmContainerId)}
            label={
              workspace.gtmContainerId
                ? `GTM ${workspace.gtmContainerId}`
                : "GTM empty"
            }
          />
        </div>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Paste a GA4 measurement ID and Pulseboard loads gtag on your founder
          pages. Add GTM if you already route tags through a container. IDs stay
          on this workspace in Supabase — they are not secrets, but they are
          yours.
        </p>
        <ol className="mt-4 space-y-2 text-sm leading-6 text-white/65">
          <li>1. Open Google Analytics → Admin → Data streams → Web.</li>
          <li>2. Copy the Measurement ID. It looks like G-XXXXXXXX.</li>
          <li>3. Optional: Tag Manager → Admin → Container ID (GTM-XXXX).</li>
          <li>4. Save. Reload Overview — the scripts are on the page.</li>
        </ol>
        <form action={saveAnalytics} className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="gaMeasurementId">GA4 measurement ID</Label>
            <Input
              id="gaMeasurementId"
              name="gaMeasurementId"
              placeholder="G-XXXXXXXXXX"
              defaultValue={workspace.gaMeasurementId}
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="gtmContainerId">GTM container ID</Label>
            <Input
              id="gtmContainerId"
              name="gtmContainerId"
              placeholder="GTM-XXXXXXX"
              defaultValue={workspace.gtmContainerId}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button type="submit">Save analytics</Button>
            {workspace.gaMeasurementId || workspace.gtmContainerId ? (
              <Button formAction={clearAnalytics} variant="outline" type="submit">
                Disconnect
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="mt-4">
        <p className="font-mono text-sm text-[#e8b44d]">02 · Stripe</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusPill
            on={stripe.paymentsLive}
            label={stripe.paymentsLive ? "Secret key set" : "No secret key"}
          />
          <StatusPill
            on={stripe.webhook}
            label={stripe.webhook ? "Webhook secret set" : "Webhook missing"}
          />
          <StatusPill
            on={workspace.planStatus === "active"}
            label={
              workspace.planStatus === "active"
                ? `Plan ${workspace.planInterval ?? "active"}`
                : workspace.planStatus
            }
          />
        </div>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Stripe is the payment slot for Pulseboard itself. Keys live in the
          server environment, not in this form. When they are present, checkout
          charges a card. When they are not, local checkout unlocks the app
          without taking money.
        </p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-2xl bg-white/4 px-4 py-3">
            <dt className="text-white/45">Checkout</dt>
            <dd className="mt-1 text-white">
              {stripe.paymentsLive
                ? "Live Checkout Session on /api/stripe/checkout"
                : "Local unlock on billing — no charge"}
            </dd>
          </div>
          <div className="rounded-2xl bg-white/4 px-4 py-3">
            <dt className="text-white/45">Webhook</dt>
            <dd className="mt-1 text-white">
              {stripe.webhook
                ? "customer.subscription.* will update this workspace"
                : "Point Stripe to /api/stripe/webhook before going live"}
            </dd>
          </div>
          <div className="rounded-2xl bg-white/4 px-4 py-3">
            <dt className="text-white/45">Prices</dt>
            <dd className="mt-1 text-white">
              {stripe.priceMonthly || stripe.priceAnnual
                ? `${stripe.priceMonthly ? "Monthly ID set" : "Monthly price_data"} · ${stripe.priceAnnual ? "Annual ID set" : "Annual price_data"}`
                : "$12 / month and $99 / year via price_data"}
            </dd>
          </div>
          <div className="rounded-2xl bg-white/4 px-4 py-3">
            <dt className="text-white/45">This workspace</dt>
            <dd className="mt-1 text-white">
              {workspace.stripeCustomerId
                ? `Customer ${workspace.stripeCustomerId.slice(0, 12)}…`
                : "No Stripe customer yet"}
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/billing">
            <Button>Open billing</Button>
          </Link>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" type="button">
              Stripe Dashboard
            </Button>
          </a>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="font-mono text-sm text-[#e8b44d]">03 · Social</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {social.length === 0 ? (
            <StatusPill on={false} label="No profiles yet" />
          ) : (
            social.map((link) => (
              <StatusPill key={link.key} on label={link.label} />
            ))
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Handles or full URLs. Pulseboard normalizes them, shows them on
          Overview, and builds share links for the week. Site-wide Pulseboard
          profiles (the marketing footer) still come from environment variables.
        </p>
        <form action={saveSocial} className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="socialX">X / Twitter</Label>
            <Input
              id="socialX"
              name="socialX"
              placeholder="@handle or https://x.com/handle"
              defaultValue={workspace.socialX}
            />
          </div>
          <div>
            <Label htmlFor="socialLinkedin">LinkedIn</Label>
            <Input
              id="socialLinkedin"
              name="socialLinkedin"
              placeholder="in/you or company/you"
              defaultValue={workspace.socialLinkedin}
            />
          </div>
          <div>
            <Label htmlFor="socialInstagram">Instagram</Label>
            <Input
              id="socialInstagram"
              name="socialInstagram"
              placeholder="@handle"
              defaultValue={workspace.socialInstagram}
            />
          </div>
          <div>
            <Label htmlFor="socialFacebook">Facebook</Label>
            <Input
              id="socialFacebook"
              name="socialFacebook"
              placeholder="page name or URL"
              defaultValue={workspace.socialFacebook}
            />
          </div>
          <div>
            <Label htmlFor="socialYoutube">YouTube</Label>
            <Input
              id="socialYoutube"
              name="socialYoutube"
              placeholder="@channel"
              defaultValue={workspace.socialYoutube}
            />
          </div>
          <div>
            <Label htmlFor="socialWebsite">Website</Label>
            <Input
              id="socialWebsite"
              name="socialWebsite"
              placeholder="yourstartup.com"
              defaultValue={workspace.socialWebsite}
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button type="submit">Save social</Button>
            {social.length > 0 ? (
              <Button formAction={clearSocial} variant="outline" type="submit">
                Clear profiles
              </Button>
            ) : null}
          </div>
        </form>

        {social.length > 0 ? (
          <ul className="mt-5 space-y-2 text-sm">
            {social.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-[#e8b44d] underline-offset-4 hover:underline"
                >
                  {link.label} → {link.href.replace(/^https?:\/\//, "")}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6">
          <p className="text-sm text-white/45">Share this week</p>
          <div className="mt-3">
            <ShareRow text={`${workspace.name} writes the week on one page.`} />
          </div>
          <p className="mt-3 text-xs text-white/35">
            Opens {share.map((item) => item.label.replace("Share on ", "")).join(", ")}{" "}
            with Pulseboard’s URL already filled in.
          </p>
        </div>
      </Card>
    </div>
  );
}
