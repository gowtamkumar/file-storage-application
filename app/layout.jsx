import AnalyticsScript from "@/components/AnalyticsScript";
import AuthProvider from "@/components/AuthProvider";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function generateMetadata() {
  await dbConnect();
  const settings = await SiteSettings.findOne().lean();

  const title = settings?.seo?.siteTitle || "FileStore";
  const titleTemplate = settings?.seo?.titleTemplate || "%s | FileStore";
  const description = settings?.seo?.metaDescription || "Secure file storage and sharing";
  const ogImage = settings?.seo?.ogImage || "";

  return {
    title: {
      default: title,
      template: titleTemplate,
    },
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: ogImage ? [ogImage] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: settings?.seo?.twitterHandle || '',
    },
    keywords: settings?.seo?.keywords ? settings.seo.keywords.split(',').map(k => k.trim()) : [],
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1677ff',
              },
            }}
          >
            <AuthProvider>
              {children}
              <AnalyticsScript />
            </AuthProvider>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
