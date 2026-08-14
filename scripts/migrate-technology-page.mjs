// One-off migration script: pushes the Technology page's two
// ServiceSection blocks (Hot Dip Galvanizing, Steel Fabrication) into
// Sanity as "service" documents with page="technology".
//
// Run with:  node --env-file=.env.local scripts/migrate-technology-page.mjs
//
// Safe to re-run (upserts by fixed _id, caches uploads within a run).
//
// Note: the "Surface Preparation Stages" step strip on this page uses
// generic lucide-react icons (not custom artwork like everywhere else
// on the site), so it's left as-is in the page code rather than moved
// into Sanity — nothing meaningful to manage there via the CMS yet.

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
      "Run this with: node --env-file=.env.local scripts/migrate-technology-page.mjs"
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

const assetCache = new Map();

async function uploadImage(relativePath) {
  if (assetCache.has(relativePath)) return assetCache.get(relativePath);
  const filePath = path.join(publicDir, relativePath);
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(relativePath),
  });
  const ref = {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
  assetCache.set(relativePath, ref);
  console.log(`  uploaded ${relativePath}`);
  return ref;
}

async function featureItems(pairs) {
  const items = [];
  for (const [label, iconPath] of pairs) {
    items.push({
      _type: "featureItem",
      _key: crypto.randomUUID(),
      label,
      icon: await uploadImage(iconPath),
    });
  }
  return items;
}

function linkList(heading, items) {
  return {
    _type: "linkListBlock",
    _key: crypto.randomUUID(),
    heading,
    items,
  };
}

function textBlock(text, style) {
  return { _type: "textBlock", _key: crypto.randomUUID(), text, style };
}

async function run() {
  console.log("Uploading images and building documents...\n");

  // ---- Hot Dip Galvanizing (Technology) ----
  const hotDipImage = await uploadImage("technology/hotdip_process.jpg");

  const hotDip = {
    _id: "service-technology-hot-dip-galvanizing",
    _type: "service",
    page: "technology",
    order: 1,
    sectionId: { _type: "slug", current: "hot-dip-galvanizing" },
    eyebrow: "Technology",
    title: "Hot Dip Galvanizing",
    description:
      "We provide high-capacity hot-dip galvanizing for structural and industrial steel components. Ensuring long-term corrosion protection and reliable performance for civil, industrial, and infrastructure projects.",
    image: hotDipImage,
    imageAlt: "Galvanized steel poles being dipped into a treatment bath",
    imageFit: "cover",
    pdfLabel: "PDF Technical Doc",
    tabs: [
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Process",
        content: [
          textBlock(
            "Hot-dip galvanizing is suitable for a wide range of structural and industrial steel components.",
            "intro"
          ),
          {
            _type: "featureGridBlock",
            _key: crypto.randomUUID(),
            heading: "The process ensures:",
            items: await featureItems([
              ["Complete internal and external coating coverage", "icons/coating-coverage.png"],
              ["Uniform surface protection", "icons/uniform-protection.png"],
              ["Long-term resistance against corrosion", "icons/corrosion-resistance.png"],
            ]),
          },
        ],
      },
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Technical Data",
        content: [
          linkList("The process ensures:", [
            "Zinc bath dimensions: 6500 × 1700 × 2600 mm",
            "Immersion temperature: approx. 450°C",
            "Suitable for large structural components",
            "Designed for civil, industrial, and infrastructure applications",
          ]),
        ],
      },
    ],
  };

  // ---- Steel Fabrication ----
  const steelFabImage = await uploadImage("technology/steelfab.jpg");

  const steelFabrication = {
    _id: "service-technology-steel-fabrication",
    _type: "service",
    page: "technology",
    order: 2,
    sectionId: { _type: "slug", current: "steel-fabrication" },
    eyebrow: "Technology",
    title: "Steel Fabrication",
    description:
      "From cutting and forming to welding and structural assembly, we fabricate custom-engineered steel components that integrate seamlessly with our hot-dip galvanizing line.",
    image: steelFabImage,
    imageAlt: "Welder fabricating a steel structural beam",
    imageFit: "cover",
    pdfLabel: "PDF Technical Doc",
    tabs: [
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Capabilities",
        content: [
          {
            _type: "featureGridBlock",
            _key: crypto.randomUUID(),
            items: await featureItems([
              ["Cutting and forming of steel components", "icons/steel-cutting-forming.png"],
              ["Welding and structural assembly", "icons/welding-assembly.png"],
              ["Production of custom-engineered metal structures", "icons/custom-metal-structures.png"],
              ["Integration with hot-dip galvanizing", "icons/hotdip-integration.png"],
            ]),
          },
        ],
      },
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Applications",
        content: [
          linkList(undefined, [
            "Transmission towers and supports",
            "Service platforms and industrial frames",
            "Tanks and structural components",
            "Civil construction elements",
          ]),
        ],
      },
    ],
  };

  for (const doc of [hotDip, steelFabrication]) {
    await client.createOrReplace(doc);
    console.log(`  upserted ${doc._id}`);
  }

  console.log("\nDone. Check the Studio at localhost:3000/studio");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
