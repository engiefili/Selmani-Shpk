// Read-only "Viewer" token used only to preview DRAFT (unpublished)
// content in Studio's Presentation tool. Create it at sanity.io/manage
// → API → Tokens → Add API token → role "Viewer", then set it as
// SANITY_API_READ_TOKEN in .env.local (and in Vercel's project env
// vars for production preview). Never commit it or paste it in chat —
// add it directly in those two places.
//
// Left undefined (not thrown) if missing, since draft mode is opt-in:
// the public site works fine without this token, only the preview
// feature needs it.
export const token = process.env.SANITY_API_READ_TOKEN;
