// One-off migration script: pushes the Services page's three
// ServiceSection blocks (Hot Dip Galvanizing, Metal Constructions,
// Tanks & Containers) into Sanity as "service" documents, matching
// the schema in src/sanity/schemaTypes.
//
// Run with:  node --env-file=.env.local scripts/migrate-services-page.mjs
//
// Safe to re-run: it uploads images once (cached by file path within a
// single run) and upserts documents by a fixed _id, so running it again
// just overwrites the same documents rather than duplicating them.

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
      "Run this with: node --env-file=.env.local scripts/migrate-services-page.mjs"
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

  // ---- Hot Dip Galvanizing ----
  const hotDipImage = await uploadImage("services/hotdip_main.jpg");
  const hotDipGallery = await Promise.all(
    [1, 2, 3, 4, 5].map((n) => uploadImage(`services/hotdip_gallery_${n}.jpg`))
  );

  const hotDip = {
    _id: "service-services-hot-dip-galvanizing",
    _type: "service",
    page: "services",
    order: 1,
    sectionId: { _type: "slug", current: "hot-dip-galvanizing" },
    eyebrow: "Services and Products",
    title: "Hot Dip Galvanizing",
    description:
      "We provide high-capacity hot-dip galvanizing for structural and industrial steel components. Ensuring long-term corrosion protection and reliable performance for civil, industrial, and infrastructure projects.",
    image: hotDipImage,
    imageAlt: "Hot-dip galvanized steel staircase",
    imageFit: "cover",
    pdfLabel: "PDF Technical Doc",
    gallery: hotDipGallery,
    tabs: [
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Applications",
        content: [
          textBlock(
            "Hot-dip galvanizing is suitable for a wide range of structural and industrial steel components.",
            "intro"
          ),
          {
            _type: "featureGridBlock",
            _key: crypto.randomUUID(),
            items: await featureItems([
              ["Structural steel frames", "icons/structural-steel-frames.png"],
              ["Transmission towers & masts", "icons/transmission-towers-masts.png"],
              ["Industrial platforms and walkways", "icons/industrial-platforms-walkways.png"],
              ["Fencing systems and gates", "icons/fencing-systems-gates.png"],
              ["Staircases and grating", "icons/staircases-grating.png"],
              ["Tanks and heavy steel components", "icons/tanks-heavy-steel.png"],
            ]),
          },
        ],
      },
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Advantages",
        content: [
          textBlock("Our hot-dip galvanizing service ensures:", "intro"),
          linkList(undefined, [
            "Long-term corrosion protection",
            "Reduced lifecycle maintenance costs",
            "Uniform coating of internal and external surfaces",
            "High durability in outdoor and aggressive environments",
            "Reliable performance for infrastructure and industrial projects",
          ]),
        ],
      },
    ],
  };

  // ---- Metal Constructions ----
  const metalImage = await uploadImage("services/metal_main.jpg");
  const metalGallery = await Promise.all(
    [1, 2, 3, 4, 5].map((n) => uploadImage(`services/metal_gallery_${n}.jpg`))
  );

  const metalConstructions = {
    _id: "service-services-metal-constructions",
    _type: "service",
    page: "services",
    order: 2,
    sectionId: { _type: "slug", current: "metal-constructions" },
    eyebrow: "Services and Products",
    title: "Metal Constructions",
    description:
      "Since 1998, our products and services have been present, tested, and validated in the Albanian construction and industrial markets. Through extensive experience, modern technology, and integration with hot dip galvanizing, we deliver steel structures with high durability, structural safety, and long-term performance.",
    image: metalImage,
    imageAlt: "Telecommunications transmission tower",
    imageFit: "cover",
    pdfLabel: "PDF Technical Doc",
    gallery: metalGallery,
    tabs: [
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Civil Works",
        content: [
          {
            _type: "accordionGroupBlock",
            _key: crypto.randomUUID(),
            items: [
              {
                _key: crypto.randomUUID(),
                title: "Steel Structures for Telecommunications & Transmission",
                items: await featureItems([
                  ["Bolted lattice transmission towers", "icons/lattice-transmission-towers.png"],
                  ["MW and RF antenna supports", "icons/mw-rf-antenna-supports.png"],
                  ["Transmission unit bases in various shapes and dimensions", "icons/transmission-unit-bases.png"],
                  ["Ice protection systems for transmission equipment", "icons/ice-protection-systems.png"],
                  ["Cable support structures for signal and power lines", "icons/cable-support-structures.png"],
                  ["Rooftop mast antennas", "icons/rooftop-mast-antennas.png"],
                  ["Radio and wireless internet hotspot antennas", "icons/wireless-hotspot-antennas.png"],
                ]),
              },
              {
                _key: crypto.randomUUID(),
                title: "Metal Products for Civil Construction",
                items: await featureItems([
                  ["Galvanized emergency staircases (straight and spiral)", "icons/staircases-emergency.png"],
                  ["Standard modular and custom galvanized fences", "icons/modular-fences.png"],
                  ["Galvanized sliding or swing gates (manual or automated)", "icons/sliding-swing-gates.png"],
                  ["Steel drainage channel grates in various load capacities and dimensions", "icons/drainage-channel-grates.png"],
                  ["Galvanized architectural barriers", "icons/architectural-barriers.png"],
                  ["Accumulation tanks for HVAC systems, heat exchangers, and boiler systems", "icons/hvac-accumulation-tanks.png"],
                  ["Galvanized greenhouses for long-term use", "icons/greenhouses.png"],
                ]),
              },
            ],
          },
        ],
      },
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Industrial Projects",
        content: [
          linkList(undefined, [
            "Lattice towers (GSM / HV & MV transmission)",
            "Structural frames and gantries",
            "Antenna supports and transmission bases",
            "Cable support structures",
            "Service platforms for industrial facilities",
            "Walkways and access platforms for plant operations",
            "Heavy-duty support structures for industrial equipment",
          ]),
        ],
      },
    ],
  };

  // ---- Tanks & Containers ----
  const tankImage = await uploadImage("services/tanks_main.jpg");
  const tankFuelImage = await uploadImage("services/tanks_fuel.png");
  const tankStainlessImage = await uploadImage("services/tanks_stainless.png");
  const tanksGallery = await Promise.all(
    [1, 2, 3, 4, 5].map((n) => uploadImage(`services/tanks_gallery_${n}.jpg`))
  );

  const tanksContainers = {
    _id: "service-services-tanks-containers",
    _type: "service",
    page: "services",
    order: 3,
    sectionId: { _type: "slug", current: "tanks-containers" },
    eyebrow: "Services and Products",
    title: "Tanks & Containers",
    description:
      "We manufacture galvanized and stainless steel tanks for water, fuel, and industrial systems, available in standard capacities or custom configurations.",
    image: tankImage,
    imageAlt: "Steel tank manufacturing",
    imageFit: "contain",
    pdfLabel: "PDF Technical Doc",
    gallery: tanksGallery,
    tabs: [
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Water",
        image: tankImage,
        imageAlt: "Galvanized stainless steel water storage tank",
        content: [
          textBlock("Water Storage Tanks", "title"),
          textBlock(
            "Galvanized water tanks designed for residential, agricultural, and industrial use.",
            "body"
          ),
          linkList("Typical capacities:", [
            "500 – 5,000 L (standard models)",
            "Larger volumes available on request",
          ]),
          linkList("Key features:", [
            "Corrosion-resistant galvanized finish",
            "Reinforced structural design for stability",
            "Easy installation and maintenance",
          ]),
          linkList("Applications:", [
            "Domestic water storage",
            "Agricultural irrigation systems",
            "Industrial utility water",
          ]),
        ],
      },
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Fuel",
        image: tankFuelImage,
        imageAlt: "Above-ground steel fuel storage tank",
        content: [
          textBlock("Fuel Storage Tanks", "title"),
          textBlock(
            "Industrial fuel storage tanks manufactured for above-ground or mobile applications.",
            "body"
          ),
          linkList("Typical capacities:", [
            "10,000 – 20,000 L",
            "Custom volumes available",
          ]),
          linkList("Configurations:", [
            "Above-ground stationary tanks",
            "Mobile/on-truck tanks",
          ]),
          linkList("Applications:", [
            "Industrial facilities",
            "Construction sites",
            "Agricultural fuel storage",
          ]),
        ],
      },
      {
        _type: "serviceTab",
        _key: crypto.randomUUID(),
        label: "Stainless Steel",
        image: tankStainlessImage,
        imageAlt: "Stainless steel tank and vessel manway detail",
        content: [
          textBlock("Stainless Steel Tanks & Vessels", "title"),
          textBlock(
            "Custom-fabricated stainless steel tanks and vessels for hygienic and industrial applications.",
            "body"
          ),
          linkList("Products include:", [
            "Food industry vessels",
            "Mixing tanks",
            "HVAC boilers and accumulators",
            "Heat exchangers",
          ]),
          linkList("Applications:", [
            "Various capacities",
            "Vertical or horizontal configurations",
            "Custom-engineered designs",
          ]),
        ],
      },
    ],
  };

  for (const doc of [hotDip, metalConstructions, tanksContainers]) {
    await client.createOrReplace(doc);
    console.log(`  upserted ${doc._id}`);
  }

  console.log("\nDone. Check the Studio at localhost:3000/studio");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
