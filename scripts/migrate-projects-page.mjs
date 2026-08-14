// One-off migration script: pushes the Projects page's photo galleries
// into Sanity as the singleton "projectsPage" document.
//
// This uploads 59 images total (1 hero + 15 HDG + 15 civil + 20
// industrial + 8 tanks), so it will take a few minutes to run — that's
// expected, just let it finish.
//
// Run with:  node --env-file=.env.local scripts/migrate-projects-page.mjs

import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN.\n" +
      "Run this with: node --env-file=.env.local scripts/migrate-projects-page.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function uploadImage(relativePath) {
  const filePath = path.join(publicDir, relativePath);
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(relativePath),
  });
  console.log(`  uploaded ${relativePath}`);
  return { _type: "image", _key: crypto.randomUUID(), asset: { _type: "reference", _ref: asset._id } };
}

async function uploadSequence(dir, prefix, count) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    const filename = `${prefix}_${String(i).padStart(2, "0")}.jpg`;
    images.push(await uploadImage(`projects/${dir}/${filename}`));
  }
  return images;
}

async function run() {
  console.log("Uploading images and building the Projects page document...\n");

  const heroImage = await uploadImage("projects/hero3.jpg");

  console.log("\nHot Dip Galvanising (15 images)...");
  const hdgImages = await uploadSequence("hdg", "hdg", 15);

  console.log("\nCivil Construction (15 images)...");
  const civilImages = await uploadSequence("civil", "civil", 15);

  console.log("\nIndustrial Construction (20 images)...");
  const industrialImages = await uploadSequence("industrial", "industrial", 20);

  console.log("\nTanks & Containers (8 images)...");
  const tanksImages = await uploadSequence("tanks", "tanks", 8);

  const doc = {
    _id: "projectsPage",
    _type: "projectsPage",
    heroTitle: "Projects",
    heroImage,
    heroImageAlt: "Steel diagrid roof structure",
    tabs: [
      {
        _type: "projectServiceTab",
        _key: crypto.randomUUID(),
        tabId: { _type: "slug", current: "hot-dip-galvanising" },
        label: "Hot Dip Galvanising",
        groups: [
          { _type: "projectImageGroup", _key: crypto.randomUUID(), images: hdgImages },
        ],
      },
      {
        _type: "projectServiceTab",
        _key: crypto.randomUUID(),
        tabId: { _type: "slug", current: "metal-constructions" },
        label: "Metal Constructions",
        groups: [
          { _type: "projectImageGroup", _key: crypto.randomUUID(), subLabel: "Civil Construction", images: civilImages },
          { _type: "projectImageGroup", _key: crypto.randomUUID(), subLabel: "Industrial Construction", images: industrialImages },
        ],
      },
      {
        _type: "projectServiceTab",
        _key: crypto.randomUUID(),
        tabId: { _type: "slug", current: "tanks-containers" },
        label: "Tanks & Containers",
        groups: [
          { _type: "projectImageGroup", _key: crypto.randomUUID(), images: tanksImages },
        ],
      },
    ],
  };

  console.log("\nSaving document to Sanity...");
  await client.createOrReplace(doc);
  console.log("  upserted projectsPage");

  console.log("\nDone. Check the Studio at localhost:3000/studio");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
