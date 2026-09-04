// Test script: uploads a per-tank image (the new transparent-PNG style) and
// sets it on a specific item in the homepage's "Tanks & Containers" list —
// e.g. the water tank item, so you can see how the click-to-swap + the new
// object-contain frame actually looks with a real image before generating
// the rest.
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

// Which item in each locale's tanksShowcase.tanks array to update, and the
// alt text to set alongside it.
const TARGETS = [
  {
    docId: "homePage",
    tankKey: "eb873f62-cb18-484e-8180-fe1881c4a13d", // "Hot Dip Galvanized Sanitary Water Tanks"
    imageAlt: "Galvanized steel sanitary water tank with an inspection hatch and vent cap",
  },
  {
    docId: "homePage_sq",
    tankKey: "d00b842a-3310-4706-bd42-722126343f01", // "Depozita Uji të Zinkuara"
    imageAlt: "Depozitë uji prej çeliku të zinkuar me kapak inspektimi dhe valvul ajrimi",
  },
];

const IMAGE_PATH = new URL("./product-images/water-tank.png", import.meta.url);

async function run() {
  console.log(`Image: ${IMAGE_PATH.pathname}`);

  if (DRY_RUN) {
    for (const t of TARGETS) {
      console.log(`\nWould upload image + set on ${t.docId} -> tanks[_key=="${t.tankKey}"]`);
      console.log(`  alt: ${t.imageAlt}`);
    }
    console.log("\nDry run — no changes written.");
    return;
  }

  const buffer = await readFile(IMAGE_PATH);
  console.log("Uploading image asset to Sanity...");
  const asset = await client.assets.upload("image", buffer, { filename: "water-tank.png" });
  console.log(`  ✓ uploaded: ${asset._id}`);

  for (const t of TARGETS) {
    console.log(`\n${t.docId}:`);
    await client
      .patch(t.docId)
      .set({
        [`tanksShowcase.tanks[_key=="${t.tankKey}"].image`]: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
        [`tanksShowcase.tanks[_key=="${t.tankKey}"].imageAlt`]: t.imageAlt,
      })
      .commit();
    console.log(`  ✓ updated`);
  }

  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
