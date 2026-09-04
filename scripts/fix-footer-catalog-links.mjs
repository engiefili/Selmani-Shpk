// One-time fix: the footer's "Catalog" links (About Us / Services & Products /
// Industries / Technology / Clients / Gallery) never matched the main header
// nav. Two problems, both from the original content migration:
//   1. Every link except "About Us" had no href — they all rendered as "#".
//   2. "Clients" and "Gallery" don't correspond to any real page (there's no
//      standalone /clients or /gallery route), while "Projects" — a real
//      page that IS in the header nav — was missing from the footer.
// This rewrites both footerCatalogRow1/2 (English siteSettings and Albanian
// siteSettings_sq) to exactly mirror the header nav: About Us, Services &
// Products, Technology, Industries, Projects — each with a working href.
//
// SETUP: same as scripts/set-image-alt-text.mjs — needs SANITY_API_WRITE_TOKEN
// in .env.local (Editor-role token from sanity.io/manage).
//
// Run:
//   node --env-file=.env.local scripts/fix-footer-catalog-links.mjs --dry-run
//   node --env-file=.env.local scripts/fix-footer-catalog-links.mjs

import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const DRY_RUN = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET — run this from the project root with .env.local loaded."
  );
  process.exit(1);
}
if (!token && !DRY_RUN) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN. Add it to .env.local (see scripts/set-image-alt-text.mjs for setup steps), or pass --dry-run to preview without one."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

function link(label, href) {
  return { _key: randomUUID(), _type: "footerCatalogLink", label, href };
}

const UPDATES = [
  {
    id: "siteSettings",
    footerCatalogRow1: [
      link("About Us", "/about"),
      link("Services & Products", "/services"),
      link("Technology", "/technology"),
    ],
    footerCatalogRow2: [link("Industries", "/industries"), link("Projects", "/projects")],
  },
  {
    id: "siteSettings_sq",
    footerCatalogRow1: [
      link("Rreth Nesh", "/about"),
      link("Shërbime & Produkte", "/services"),
      link("Teknologjia", "/technology"),
    ],
    footerCatalogRow2: [link("Industritë", "/industries"), link("Projekte", "/projects")],
  },
];

async function run() {
  for (const { id, footerCatalogRow1, footerCatalogRow2 } of UPDATES) {
    console.log(`\n${id}:`);
    console.log("  row1:", footerCatalogRow1.map((l) => `${l.label} -> ${l.href}`).join(", "));
    console.log("  row2:", footerCatalogRow2.map((l) => `${l.label} -> ${l.href}`).join(", "));

    if (DRY_RUN) continue;

    await client
      .patch(id)
      .set({ footerCatalogRow1, footerCatalogRow2 })
      .commit();
    console.log(`  ✓ updated`);
  }

  console.log(DRY_RUN ? "\nDry run — no changes written." : "\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
