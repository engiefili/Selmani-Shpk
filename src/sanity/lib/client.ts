import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Public, read-only client used by the website's pages to fetch published
// content. Uses the CDN for fast, cached reads. Do not use this client for
// writes or for reading draft/unpublished content.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
