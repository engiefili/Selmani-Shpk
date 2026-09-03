import type { MetadataRoute } from "next";
import { localizePath } from "@/lib/locale";
import { SITE_URL } from "@/lib/siteUrl";

// Pages that exist in both English and Albanian (the "/al" prefix).
const LOCALIZED_ROUTES = [
  "/",
  "/technology",
  "/services",
  "/industries",
  "/projects",
  "/about",
  "/contact",
];

// English-only utility pages — not worth a translated duplicate.
const EN_ONLY_ROUTES = ["/privacy-policy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of LOCALIZED_ROUTES) {
    const enUrl = `${SITE_URL}${route}`;
    const sqUrl = `${SITE_URL}${localizePath(route, "sq")}`;
    const alternates = { languages: { en: enUrl, sq: sqUrl } };

    entries.push({ url: enUrl, alternates, changeFrequency: "monthly", priority: route === "/" ? 1 : 0.8 });
    entries.push({ url: sqUrl, alternates, changeFrequency: "monthly", priority: route === "/" ? 1 : 0.8 });
  }

  for (const route of EN_ONLY_ROUTES) {
    entries.push({ url: `${SITE_URL}${route}`, changeFrequency: "yearly", priority: 0.3 });
  }

  return entries;
}
