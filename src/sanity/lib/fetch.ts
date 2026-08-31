import { draftMode } from "next/headers";

import { client } from "./client";
import { token } from "./token";

// Draft-aware fetch used everywhere instead of calling client.fetch
// directly. Outside of Draft Mode (the normal case for every visitor)
// this behaves exactly like before: published content, CDN-cached,
// revalidated every 60s. Inside Draft Mode (only active in Studio's
// Presentation preview pane) it switches to the "drafts" perspective,
// skips the CDN, and disables caching so edits show up immediately.
//
// stega (the invisible click-to-edit encoding) is intentionally left
// off — several places in this codebase compare Sanity string values
// directly (e.g. section.imagePosition === "left"), and stega
// encoding would silently break those comparisons. This trades away
// click-to-edit overlays for a simpler, lower-risk "preview drafts"
// feature, which is what was actually asked for.
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const isDraft = (await draftMode()).isEnabled;

  return client
    .withConfig({
      useCdn: !isDraft,
      token: isDraft ? token : undefined,
      perspective: isDraft ? "drafts" : "published",
    })
    .fetch<T>(query, params, {
      next: { revalidate: isDraft ? 0 : 60 },
      stega: false,
    });
}
