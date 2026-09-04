// Uploads the 4 generated product images and sets them on the matching
// items in the homepage's "Tanks & Containers" list, for both locales.
//
// This also FIXES a mix-up from the first pass: the very first test image
// (water-tank.png — the one with a gauge + two valves) was actually meant
// to be the Fuel Tanks shot, not the water tank. This run moves it there
// and uploads the correct, simpler water tank image instead.
//
// SETUP: same as scripts/set-image-alt-text.mjs — needs SANITY_API_WRITE_TOKEN
// in .env.local.
//
// Run:
//   node --env-file=.env.local scripts/set-tank-image.mjs --dry-run
//   node --env-file=.env.local scripts/set-tank-image.mjs

import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";

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

// One entry per product. `imagePath` is a local file to upload;
// `reuseAssetId` reuses an asset that's already in Sanity instead (used for
// the fuel tank, since that exact file was already uploaded under the wrong
// item last time — no need to upload the same bytes twice).
const PRODUCTS = [
  {
    label: "Water Tank",
    imagePath: new URL("./product-images/water-tank-v2.png", import.meta.url),
    keys: { homePage: "eb873f62-cb18-484e-8180-fe1881c4a13d", homePage_sq: "d00b842a-3310-4706-bd42-722126343f01" },
    alt: {
      homePage: "Galvanized steel sanitary water tank with an inspection hatch and vent cap",
      homePage_sq: "Depozitë uji prej çeliku të zinkuar me kapak inspektimi dhe valvul ajrimi",
    },
  },
  {
    label: "Fuel Tank",
    reuseAssetId: "image-19021054e698f61d684fca3a1fbacca41dab6aab-1536x1024-png",
    keys: { homePage: "e0df7069-80bf-4b81-bfb7-6898bc74cad9", homePage_sq: "55fd1d65-1654-4dfe-9b43-3bb986f7899f" },
    alt: {
      homePage: "Galvanized steel fuel tank with a fill cap, pressure gauge, and valve fittings",
      homePage_sq: "Depozitë karburanti prej çeliku të zinkuar me kapak mbushjeje, manometër dhe valvula",
    },
  },
  {
    label: "Stainless Steel Container",
    imagePath: new URL("./product-images/stainless-container.png", import.meta.url),
    keys: { homePage: "a05205f0-e1e5-441c-965a-02ae1aa503ec", homePage_sq: "4eda4af4-971a-42e1-817a-0525d548e0a3" },
    alt: {
      homePage: "Polished stainless steel food-grade mixing vessel with a hinged lid",
      homePage_sq: "Enë përzierjeje inoksi e lëmuar për industrinë ushqimore me kapak me menteshë",
    },
  },
  {
    label: "HVAC Tank",
    imagePath: new URL("./product-images/hvac-tank.png", import.meta.url),
    keys: { homePage: "5477a7d2-aa16-4f92-ba09-c44d24e5daa4", homePage_sq: "1c33a38f-b705-47d9-bc3f-0e16f3fb8c6a" },
    alt: {
      homePage: "Upright HVAC accumulator tank with pipe connections and a pressure gauge",
      homePage_sq: "Depozitë akumuluese HVAC vertikale me lidhje tubash dhe manometër",
    },
  },
];

async function run() {
  for (const product of PRODUCTS) {
    console.log(`\n${product.label}:`);

    let assetId = product.reuseAssetId;
    if (!assetId) {
      console.log(`  reading ${product.imagePath.pathname}`);
      if (!DRY_RUN) {
        const buffer = await readFile(product.imagePath);
        console.log("  uploading...");
        const asset = await client.assets.upload("image", buffer, {
          filename: product.imagePath.pathname.split("/").pop(),
        });
        assetId = asset._id;
        console.log(`  ✓ uploaded: ${assetId}`);
      } else {
        console.log("  (would upload)");
      }
    } else {
      console.log(`  reusing existing asset: ${assetId}`);
    }

    for (const docId of ["homePage", "homePage_sq"]) {
      const key = product.keys[docId];
      const alt = product.alt[docId];
      console.log(`  ${docId} -> tanks[_key=="${key}"]  alt: ${alt}`);
      if (DRY_RUN) continue;

      await client
        .patch(docId)
        .set({
          [`tanksShowcase.tanks[_key=="${key}"].image`]: {
            _type: "image",
            asset: { _type: "reference", _ref: assetId },
          },
          [`tanksShowcase.tanks[_key=="${key}"].imageAlt`]: alt,
        })
        .commit();
    }
  }

  console.log(DRY_RUN ? "\nDry run — no changes written." : "\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
