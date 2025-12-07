import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Script from "next/script";

export default async function AnalyticsScript() {
  await dbConnect();
  const settings = await SiteSettings.findOne().select('seo.googleAnalyticsId').lean();
  const gaId = settings?.seo?.googleAnalyticsId;

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
