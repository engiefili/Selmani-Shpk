import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

// Called by Studio's Presentation tool when an editor opens the
// preview pane. Verifies the request came from a real Studio session,
// then flips on Next.js Draft Mode for that browser so subsequent
// page loads render unpublished/draft content instead of published.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: token || "" }),
});
