import type { Metadata } from "next";
import { localizePath, type Locale } from "@/lib/locale";

// Builds the per-page pieces of Next.js Metadata (title, description,
// canonical, hreflang alternates, Open Graph, Twitter card) from one bare,
// un-prefixed path (e.g. "/technology" or "/" for the homepage) plus the
// locale-specific title/description text. Resolves against SITE_URL via
// metadataBase set in the root layout, so these can stay relative.
export function pageMetadata({
  path,
  locale,
  title,
  description,
}: {
  path: string;
  locale: Locale;
  title: string;
  description: string;
}): Metadata {
  const enPath = path;
  const sqPath = localizePath(path, "sq");
  const canonical = locale === "sq" ? sqPath : enPath;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enPath,
        sq: sqPath,
        "x-default": enPath,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Selmani",
      locale: locale === "sq" ? "sq_AL" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
