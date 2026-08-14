// One-off migration script: pushes the homepage's content into Sanity
// as the singleton "homePage" document (_id: "homePage").
//
// Run with:  node --env-file=.env.local scripts/migrate-homepage.mjs

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
      "Run this with: node --env-file=.env.local scripts/migrate-homepage.mjs"
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

async function run() {
  console.log("Uploading images and building the home page document...\n");

  const heroBg = await uploadImage("hero_pipes.jpg");
  const aboutImg = await uploadImage("about_medallion.jpg");
  const beforeImg = await uploadImage("galvanized_texture.jpg");
  const afterImg = await uploadImage("rusty_texture.jpg");
  const tankImg = await uploadImage("tank_product.jpg");

  const telecomIcon = await uploadImage("icons/telecom-structures.png");
  const platformsIcon = await uploadImage("icons/steel-platforms.png");
  const civilIcon = await uploadImage("icons/civil-metal-works.png");
  const tanksIcon = await uploadImage("icons/process-tanks.png");
  const industrialIcon = await uploadImage("icons/industrial-steel-works.png");

  const doc = {
    _id: "homePage",
    _type: "homePage",
    hero: {
      _type: "heroSection",
      heading: "Building Stronger,\nProtecting Longer.",
      subheading:
        "If you can dream it, we can build it, galvanize it, and make it last.",
      backgroundImage: heroBg,
      backgroundImageAlt: "Stacked galvanized steel pipes",
      certifications: [
        { _key: crypto.randomUUID(), line1: "Certified", line2: "EQA 2011005" },
        { _key: crypto.randomUUID(), line1: "Certified", line2: "ISO 9001" },
        { _key: crypto.randomUUID(), line1: "Certified", line2: "OHSAS540" },
      ],
      ctaLabel: "Explore our work",
    },
    aboutUs: {
      _type: "aboutUsSection",
      eyebrow: "About Us",
      text: "Over 25 years of experience in industrial galvanizing and steel constructions, serving civil, industrial, and infrastructure sectors locally and internationally.",
      image: aboutImg,
      imageAlt: "Selmani metal medallion emblem",
    },
    hotDipGalvanizing: {
      _type: "hotDipHomeSection",
      eyebrow: "Services",
      title: "Hot Dip Galvanizing",
      beforeImage: beforeImg,
      beforeLabel: "Hot-dip galvanized",
      afterImage: afterImg,
      afterLabel: "Non-galvanized",
      benefits: [
        {
          _key: crypto.randomUUID(),
          title: "Saves Time",
          description:
            "Hot-Dip Galvanizing (HDG) technology provides the most efficient protection against corrosion, surpassing any other treatment or coating method.",
        },
        {
          _key: crypto.randomUUID(),
          title: "Protects the Environment",
          description:
            "Hot-Dip Galvanizing (HDG) technology provides the most efficient protection against corrosion, surpassing any other treatment or coating method.",
        },
        {
          _key: crypto.randomUUID(),
          title: "Economic Advantages",
          description:
            "Hot-Dip Galvanizing (HDG) technology provides the most efficient protection against corrosion, surpassing any other treatment or coating method.",
        },
        {
          _key: crypto.randomUUID(),
          title: "Structural Durability",
          description:
            "Hot-Dip Galvanizing (HDG) technology provides the most efficient protection against corrosion, surpassing any other treatment or coating method.",
        },
      ],
      ctaLabel: "Learn More",
    },
    metallicConstructions: {
      _type: "metallicConstructionsSection",
      eyebrow: "Services",
      title: "Metallic Constructions",
      services: [
        { _key: crypto.randomUUID(), title: "Telecom Structures", industries: "GSM & Transmission", icon: telecomIcon },
        { _key: crypto.randomUUID(), title: "Steel Platforms", industries: "Industrial Facilities", icon: platformsIcon },
        { _key: crypto.randomUUID(), title: "Civil Metal Works", industries: "Public & Private Construction", icon: civilIcon },
        { _key: crypto.randomUUID(), title: "Process Tanks", industries: "Water, Fuel & HVAC", icon: tanksIcon },
        { _key: crypto.randomUUID(), title: "Industrial Steel Works", industries: "Manufacturing & Processing", icon: industrialIcon },
      ],
      description:
        "Our company provides construction solutions for various civil projects, designed and executed according to your specific requirements.",
      ctaLabel: "Learn More",
    },
    tanksShowcase: {
      _type: "tanksShowcaseSection",
      eyebrow: "Services",
      title: "Tanks & Containers for Various Usages",
      image: tankImg,
      imageAlt: "Water tank product",
      tanks: [
        {
          _key: crypto.randomUUID(),
          title: "Hot Dip Galvanized Sanitary Water Tanks",
          description:
            "We also manufacture custom water tanks according to client requirements, with various geometries depending on the installation site.",
        },
        {
          _key: crypto.randomUUID(),
          title: "Fuel Tanks",
          description:
            "Fuel tanks up to 20,000 L, with static configuration, which can be installed above or below ground. Tanker trucks up to 10,000 L.",
        },
        {
          _key: crypto.randomUUID(),
          title: "Stainless Steel Containers",
          description:
            "Stainless steel vessels and tanks for the food industry, in various shapes and volumes (containers, mixers, etc.)",
        },
        {
          _key: crypto.randomUUID(),
          title: "HVAC Storage Tanks & Boilers",
          description:
            "Accumulators for HVAC systems (central heating and cooling). Heat exchangers (boilers) with 1, 2, or 3 heat exchange coils.",
        },
      ],
      ctaLabel: "Learn More",
    },
  };

  await client.createOrReplace(doc);
  console.log("  upserted homePage");

  console.log("\nDone. Check the Studio at localhost:3000/studio");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
