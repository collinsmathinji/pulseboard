import type { Metadata } from "next";
import Script from "next/script";
import { Caveat, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { AnalyticsScripts } from "@/components/analytics";
import { SiteJsonLd } from "@/components/social";
import {
  siteAnalytics,
  siteTwitterHandle,
  siteUrl,
} from "@/lib/integrations";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const site = siteUrl();
const twitter = siteTwitterHandle();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "Pulseboard — the weekly scorecard for founders",
  description:
    "One screen for MRR, paying users, runway, and this week's three priorities. $12/month.",
  applicationName: "Pulseboard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site,
    siteName: "Pulseboard",
    title: "Pulseboard — the weekly scorecard for founders",
    description:
      "One Monday page for MRR, paying users, runway, and the three things that have to move.",
    images: [
      {
        url: "/hero-founder.png",
        width: 1200,
        height: 1200,
        alt: "A founder walking to write the week’s numbers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulseboard — the weekly scorecard for founders",
    description:
      "One Monday page for MRR, paying users, runway, and the three things that have to move.",
    images: ["/hero-founder.png"],
    ...(twitter ? { site: twitter, creator: twitter } : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#e8e6e1] text-[#171a16]">
        <Script
          src="https://vayahq.com/b/3b43368419783db58ac44cd3b4c2586a.js"
          strategy="beforeInteractive"
        />
        <AnalyticsScripts {...siteAnalytics()} />
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
