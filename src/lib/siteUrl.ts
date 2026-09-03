// Single source of truth for the site's absolute URL. Defaults to the
// Vercel preview domain so sitemap/canonical/OG/JSON-LD all work today —
// once the real domain goes live, set NEXT_PUBLIC_SITE_URL in Vercel's
// project settings and every one of those pieces picks it up automatically,
// no code changes required.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://selmani-shpk.vercel.app";
