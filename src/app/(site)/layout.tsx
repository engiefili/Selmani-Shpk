import type { Metadata } from "next";
import { draftMode, headers } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";

import { DisableDraftMode } from "@/components/DisableDraftMode";
import { getLocale } from "@/lib/locale";
import { SITE_URL } from "@/lib/siteUrl";
import { getSiteSettings } from "@/sanity/lib/siteSettings";

// Geom — the brand typeface. Body text follows the typography spec
// (Regular/Medium), but page hero titles use the Black weight for a
// bolder, heavier look per direct design reference.
const geom = localFont({
  variable: "--font-geom",
  src: [
    { path: "../../fonts/Geom-Light.ttf", weight: "300", style: "normal" },
    { path: "../../fonts/Geom-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/Geom-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/Geom-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../fonts/Geom-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../fonts/Geom-Black.ttf", weight: "900", style: "normal" },
  ],
});

// The site isn't on its real domain yet (see SITE_URL) — until the DNS
// migration happens, any *.vercel.app request gets noindex'd so this
// preview URL can never itself get indexed and compete with the
// production domain once that's live. Per-page metadata below still
// composes normally; only the robots directive is host-dependent.
export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("host") ?? "";
  const isPreviewHost = host.endsWith(".vercel.app");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Selmani | Industrial Galvanizing & Steel Constructions",
      template: "%s | Selmani",
    },
    description:
      "Over 25 years of experience in industrial galvanizing and steel constructions, serving civil, industrial, and infrastructure sectors locally and internationally.",
    robots: isPreviewHost
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      siteName: "Selmani",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  const locale = await getLocale();
  const { settings, logoUrl } = await getSiteSettings(locale);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url: SITE_URL,
    logo: logoUrl,
    image: logoUrl,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "AL",
    },
    sameAs: [
      settings.socialLinks?.linkedin,
      settings.socialLinks?.instagram,
      settings.socialLinks?.facebook,
    ].filter(Boolean),
  };

  return (
    <html lang={locale} className={`${geom.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        {isDraftMode && <DisableDraftMode />}
      </body>
    </html>
  );
}
