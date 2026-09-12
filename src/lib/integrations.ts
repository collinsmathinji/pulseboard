const GA_RE = /^G-[A-Z0-9]+$/i;
const GTM_RE = /^GTM-[A-Z0-9]+$/i;

export type SocialKey =
  | "x"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "youtube"
  | "website";

export type SocialLink = {
  key: SocialKey;
  label: string;
  href: string;
};

export function siteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return raw.replace(/\/$/, "");
}

export function siteAnalytics() {
  const ga = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();
  const gtm = (process.env.NEXT_PUBLIC_GTM_ID ?? "").trim();
  return {
    gaId: GA_RE.test(ga) ? ga.toUpperCase() : "",
    gtmId: GTM_RE.test(gtm) ? gtm.toUpperCase() : "",
  };
}

export function siteSocial(): SocialLink[] {
  return normalizeSocial({
    x: process.env.NEXT_PUBLIC_X_URL ?? process.env.NEXT_PUBLIC_TWITTER_URL,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL,
    website: process.env.NEXT_PUBLIC_MARKETING_URL,
  });
}

export function siteTwitterHandle() {
  const fromEnv = (process.env.NEXT_PUBLIC_X_HANDLE ?? "").trim();
  if (fromEnv) return fromEnv.startsWith("@") ? fromEnv : `@${fromEnv}`;
  const x = siteSocial().find((link) => link.key === "x");
  if (!x) return "";
  const match = x.href.match(/(?:x|twitter)\.com\/([^/?#]+)/i);
  return match ? `@${match[1]}` : "";
}

export function stripeIntegrationStatus() {
  return {
    paymentsLive: Boolean(process.env.STRIPE_SECRET_KEY),
    webhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    priceMonthly: Boolean(process.env.STRIPE_PRICE_MONTHLY),
    priceAnnual: Boolean(process.env.STRIPE_PRICE_ANNUAL),
  };
}

export function parseGaId(value?: string | null) {
  const id = String(value ?? "").trim().toUpperCase();
  return GA_RE.test(id) ? id : "";
}

export function parseGtmId(value?: string | null) {
  const id = String(value ?? "").trim().toUpperCase();
  return GTM_RE.test(id) ? id : "";
}

export function normalizeSocialUrl(key: SocialKey, raw: string) {
  const value = raw.trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value.replace(/\/$/, "");

  const handle = value.replace(/^@/, "").replace(/^\/+/, "");
  if (!handle) return "";

  switch (key) {
    case "x":
      return `https://x.com/${handle}`;
    case "linkedin":
      return handle.includes("/")
        ? `https://www.linkedin.com/${handle}`
        : `https://www.linkedin.com/in/${handle}`;
    case "instagram":
      return `https://www.instagram.com/${handle}`;
    case "facebook":
      return `https://www.facebook.com/${handle}`;
    case "youtube":
      return handle.startsWith("channel/") || handle.startsWith("@")
        ? `https://www.youtube.com/${handle}`
        : `https://www.youtube.com/@${handle}`;
    case "website":
      return `https://${handle}`;
  }
}

export function normalizeSocial(input: Partial<Record<SocialKey, string | null | undefined>>): SocialLink[] {
  const labels: Record<SocialKey, string> = {
    x: "X",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    website: "Website",
  };

  return (Object.keys(labels) as SocialKey[])
    .map((key) => {
      const href = normalizeSocialUrl(key, String(input[key] ?? ""));
      return href ? { key, label: labels[key], href } : null;
    })
    .filter((link): link is SocialLink => Boolean(link));
}

export function workspaceSocial(workspace: {
  socialX?: string | null;
  socialLinkedin?: string | null;
  socialInstagram?: string | null;
  socialFacebook?: string | null;
  socialYoutube?: string | null;
  socialWebsite?: string | null;
}) {
  return normalizeSocial({
    x: workspace.socialX,
    linkedin: workspace.socialLinkedin,
    instagram: workspace.socialInstagram,
    facebook: workspace.socialFacebook,
    youtube: workspace.socialYoutube,
    website: workspace.socialWebsite,
  });
}

export function shareLinks(text: string) {
  const url = encodeURIComponent(siteUrl());
  const body = encodeURIComponent(text);
  return [
    {
      key: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${body}&url=${url}`,
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    },
    {
      key: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
  ] as const;
}

export function integrationCount(input: {
  gaMeasurementId?: string | null;
  gtmContainerId?: string | null;
  socialX?: string | null;
  socialLinkedin?: string | null;
  socialInstagram?: string | null;
  socialFacebook?: string | null;
  socialYoutube?: string | null;
  socialWebsite?: string | null;
  planStatus: string;
}) {
  const analytics = Boolean(parseGaId(input.gaMeasurementId) || parseGtmId(input.gtmContainerId));
  const social = workspaceSocial(input).length > 0;
  const stripe = input.planStatus === "active";
  return { analytics, social, stripe, connected: [analytics, social, stripe].filter(Boolean).length };
}
