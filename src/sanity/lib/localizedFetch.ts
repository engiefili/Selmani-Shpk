import type { Locale } from "@/lib/locale";
import { localizedDocId } from "@/lib/locale";

import { sanityFetch } from "./fetch";

// Fetches a singleton document for the given locale (e.g. "homePage"
// vs "homePage_sq"). Falls back to the English document if an
// Albanian one hasn't been created yet, so /al/* pages never render
// empty while translations are still being migrated.
export async function fetchLocalizedSingleton<T>(
  query: string,
  baseId: string,
  locale: Locale
): Promise<T | null> {
  const id = localizedDocId(baseId, locale);
  const doc = await sanityFetch<T | null>(query, { id });
  if (doc) return doc;
  if (locale === "sq") {
    return sanityFetch<T | null>(query, { id: baseId });
  }
  return null;
}

// Fetches the "service" documents for a page ("services" | "technology")
// in the given locale. Falls back to English if no Albanian sections
// have been migrated yet for that page.
export async function fetchLocalizedServices<T>(
  query: string,
  page: string,
  locale: Locale
): Promise<T[]> {
  const docs = await sanityFetch<T[]>(query, { page, language: locale });
  if (docs.length > 0) return docs;
  if (locale === "sq") {
    return sanityFetch<T[]>(query, { page, language: "en" });
  }
  return docs;
}
