import { headers } from "next/headers";

// Locale support: English is the default and lives at the root
// ("/services"); Albanian is prefixed ("/al/services"). Middleware
// rewrites "/al/..." to the un-prefixed route internally and stamps
// the request with "x-locale" / "x-pathname" headers so Server
// Components (which can't call usePathname()) can read the locale and
// the real, pre-rewrite URL.
export type Locale = "en" | "sq";

export const AL_PREFIX = "/al";

export async function getLocale(): Promise<Locale> {
  const h = await headers();
  return h.get("x-locale") === "sq" ? "sq" : "en";
}

// The real browser URL (before middleware strips the "/al" prefix).
export async function getPathname(): Promise<string> {
  const h = await headers();
  return h.get("x-pathname") || "/";
}

// Prefixes an internal path for the given locale. Leaves external
// URLs, mailto/tel links, and hash-only anchors untouched.
export function localizePath(path: string, locale: Locale): string {
  if (locale === "en") return path;
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  if (path === AL_PREFIX || path.startsWith(`${AL_PREFIX}/`)) return path;
  if (path === "/") return AL_PREFIX;
  return `${AL_PREFIX}${path}`;
}

// Given the real current pathname (already "/al/..." if on the
// Albanian site) and the locale we're currently on, returns the
// equivalent path on the *other* locale — used for the language
// switcher, so it lands on the same page rather than the homepage.
export function switchLocalePath(pathname: string, currentLocale: Locale): string {
  const bare =
    currentLocale === "sq"
      ? pathname.slice(AL_PREFIX.length) || "/"
      : pathname;
  const targetLocale: Locale = currentLocale === "sq" ? "en" : "sq";
  return localizePath(bare, targetLocale);
}

// Sanity singleton documents are duplicated per locale via a fixed,
// suffixed _id ("homePage" / "homePage_sq") rather than a locale
// field, so editors keep the same "always the same document" workflow
// per language.
export function localizedDocId(baseId: string, locale: Locale): string {
  return locale === "sq" ? `${baseId}_sq` : baseId;
}
