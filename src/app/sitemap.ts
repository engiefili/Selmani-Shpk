import type { MetadataRoute } from "next";
import { localizePath } from "@/lib/locale";
import { SITE_URL } from "@/lib/siteUrl";
import { sanityFetch } from "@/sanity/lib/fetch";
import { insightSlugsQuery } from "@/sanity/lib/queries";

// Pages that exist in both English and Albanian (the "/al" prefix).
const LOCALIZED_ROUTES = [
  "/",
  "/technology",
  "/services",
  "/industries",
  "/projects",
  "/about",
  "/contact",
  "/insights",
];

// English-only utility pages — not worth a translated duplicate.
const EN_ONLY_ROUTES = ["/privacy-policy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of LOCALIZED_ROUTES) {
    const enUrl = `${SITE_URL}${route}`;
    const sqUrl = `${SITE_URL}${localizePath(route, "sq")}`;
    const alternates = { languages: { en: enUrl, sq: sqUrl } };

    entries.push({ url: enUrl, alternates, changeFrequency: "monthly", priority: route === "/" ? 1 : 0.8 });
    entries.push({ url: sqUrl, alternates, changeFrequency: "monthly", priority: route === "/" ? 1 : 0.8 });
  }

  // Each Insights article (English copy, with the Albanian frame as alternate).
  const slugs = await sanityFetch<string[]>(insightSlugsQuery).catch(() => []);
  for (const slug of slugs) {
    const route = `/insights/${slug}`;
    const enUrl = `${SITE_URL}${route}`;
    const sqUrl = `${SITE_URL}${localizePath(route, "sq")}`;
    entries.push({
      url: enUrl,
      alternates: { languages: { en: enUrl, sq: sqUrl } },
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const route of EN_ONLY_ROUTES) {
    entries.push({ url: `${SITE_URL}${route}`, changeFrequency: "yearly", priority: 0.3 });
  }

  return entries;
}
