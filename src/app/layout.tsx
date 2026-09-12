import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Pulseboard — the weekly scorecard for founders",
  description:
    "One screen for MRR, paying users, runway, and this week's three priorities. $12/month.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#06080c] text-slate-100">
        <Script
          src="https://vayahq.com/b/3b43368419783db58ac44cd3b4c2586a.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
