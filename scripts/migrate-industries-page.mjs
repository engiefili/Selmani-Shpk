// One-off migration script: pushes the Industries page's content into
// Sanity as the singleton "industriesPage" document.
//
// Run with:  node --env-file=.env.local scripts/migrate-industries-page.mjs

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
      "Run this with: node --env-file=.env.local scripts/migrate-industries-page.mjs"
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

function section(fields) {
  return { _type: "industrySectionItem", _key: crypto.randomUUID(), ...fields };
}

async function run() {
  console.log("Uploading images and building the Industries page document...\n");

  const heroImage = await uploadImage("industries/hero5.jpg");
  const telecomImage = await uploadImage("industries/telecom.jpg");
  const civilImage = await uploadImage("industries/civil.jpg");
  const infraImage = await uploadImage("industries/infrastructure.jpg");

  const doc = {
    _id: "industriesPage",
    _type: "industriesPage",
    heroTitle: "Industries\nWe Serve",
    heroDescription:
      "We provide high-capacity hot-dip galvanizing for structural and industrial steel components. Ensuring long-term corrosion protection and reliable performance for civil, industrial, and infrastructure projects.",
    heroImage,
    heroImageAlt: "Grain silo steel structures against an overcast sky",
    sections: [
      section({
        sectionId: { _type: "slug", current: "telecommunications-transmission" },
        eyebrow: "Industries",
        title: "Telecommunications & Transmission",
        description:
          "We design and fabricate galvanized steel structures for GSM contractors and signal transmission projects requiring long-term anti-corrosion protection.",
        applications: [
          "GSM transmission towers",
          "Antenna bases and supports",
          "Equipment and cable support structures",
          "Urban and rooftop installations",
          "Signal and power cable supports",
        ],
        closing:
          "Our steel galvanizing protects structures against corrosion, wind exposure and humidity, ensuring long service life for telecom infrastructure.",
        image: telecomImage,
        imageAlt: "Technician climbing a telecommunications transmission tower",
        imagePosition: "right",
      }),
      section({
        sectionId: { _type: "slug", current: "civil-metal-construction" },
        eyebrow: "Industries",
        title: "Civil Metal Construction",
        description:
          "Our metal constructions are widely used in public and private building projects. We collaborate with construction contractors and building partners on durable civil metal constructions and protective steel elements.",
        applications: [
          "Galvanized fencing systems and gates",
          "Safety barriers and emergency staircases",
          "Drainage grates and access platforms",
          "Outdoor galvanized structures",
        ],
        image: civilImage,
        imageAlt: "Steel structural frame of a building under construction",
        imagePosition: "left",
      }),
      section({
        sectionId: { _type: "slug", current: "industrial-metal-construction" },
        eyebrow: "Industries",
        title: "Industrial Metal Construction & Fabrication",
        applications: [
          "Industrial metal platforms",
          "Structural frames and supports",
          "Specialized fabricated components",
          "Large structural assemblies",
        ],
      }),
      section({
        sectionId: { _type: "slug", current: "infrastructure-public-works" },
        eyebrow: "Industries",
        title: "Infrastructure & Public Works",
        description:
          "Long-lasting steel galvanizing and industrial galvanizing services for bridges, utilities, urban infrastructure, and public institutions across Albania.",
        applications: [
          "Outdoor structural elements",
          "Public infrastructure metal components",
          "Long-term corrosion protection systems",
        ],
        image: infraImage,
        imageAlt: "Interior of a large steel-framed industrial warehouse",
        imagePosition: "right",
      }),
      section({
        sectionId: { _type: "slug", current: "custom-private-projects" },
        eyebrow: "Industries",
        title: "Custom & Private Projects",
        description:
          "If you are looking for something more specific, we provide professional metal services for custom applications tailored to technical requirements.",
        applications: [
          "Custom metal constructions",
          "Tailor-made water storage tanks",
          "Made-to-order steel structures",
        ],
      }),
    ],
  };

  await client.createOrReplace(doc);
  console.log("  upserted industriesPage");

  console.log("\nDone. Check the Studio at localhost:3000/studio");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
