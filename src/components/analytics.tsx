import Script from "next/script";
import { parseGaId, parseGtmId } from "@/lib/integrations";

export function AnalyticsScripts({
  gaId,
  gtmId,
}: {
  gaId?: string;
  gtmId?: string;
}) {
  const ga = parseGaId(gaId ?? "");
  const gtm = parseGtmId(gtmId ?? "");
  if (!ga && !gtm) return null;

  return (
    <>
      {gtm ? (
        <>
          <Script id={`gtm-${gtm}`} strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height="0"
              width="0"
              className="hidden"
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}
      {ga ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id={`ga4-${ga}`} strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
