import type { SocialLink } from "@/lib/integrations";
import { shareLinks, siteSocial, siteUrl } from "@/lib/integrations";
import { cn } from "@/lib/utils";

export function SocialLinks({
  links,
  className,
  tone = "gold",
}: {
  links?: SocialLink[];
  className?: string;
  tone?: "gold" | "ink";
}) {
  const items = links ?? siteSocial();
  if (items.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2", className)}>
      {items.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            target="_blank"
            rel="me noopener noreferrer"
            className={
              tone === "gold"
                ? "text-sm text-[#b8922a] underline-offset-4 hover:underline"
                : "text-sm text-[#5c635c] underline-offset-4 hover:underline"
            }
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ShareRow({
  text = "One Monday page for MRR, paying users, runway, and this week's three priorities.",
}: {
  text?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {shareLinks(text).map((link) => (
        <a
          key={link.key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/8 px-3 py-1.5 text-sm text-white/70 hover:bg-white/12 hover:text-white"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export function SiteJsonLd() {
  const sameAs = siteSocial().map((link) => link.href);
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Pulseboard",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl(),
    description:
      "One screen for MRR, paying users, runway, and this week's three priorities.",
    offers: {
      "@type": "Offer",
      price: "12.00",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Pulseboard",
      url: siteUrl(),
      sameAs,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
