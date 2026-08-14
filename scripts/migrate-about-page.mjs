// One-off migration script: pushes the About page's content into
// Sanity as the singleton "aboutPage" document (_id: "aboutPage").
//
// Run with:  node --env-file=.env.local scripts/migrate-about-page.mjs
//
// Note: several images on this page are still referenced via
// Figma-hosted URLs (https://www.figma.com/api/mcp/asset/...) rather
// than local files under /public — leftover from the original design
// handoff. Those Figma asset links can expire. This script fetches
// each one and re-uploads it into Sanity permanently; if any of them
// have gone stale, it'll print a warning and continue with the rest
// rather than failing the whole migration — you'd just need to
// manually add that one image in Studio afterward.

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN.\n" +
      "Run this with: node --env-file=.env.local scripts/migrate-about-page.mjs"
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

async function uploadImageFromUrl(url, filename) {
  if (assetCache.has(url)) return assetCache.get(url);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, { filename });
    const ref = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
    assetCache.set(url, ref);
    console.log(`  uploaded ${filename}`);
    return ref;
  } catch (err) {
    console.warn(`  WARNING: could not fetch/upload ${filename} (${url}) — ${err.message}`);
    console.warn(`  Skipping this image; add it manually in Studio afterward.`);
    return undefined;
  }
}

async function run() {
  console.log("Fetching remote images and building the About page document...\n");

  const heroImage = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/4ef61213-1163-402e-959a-ae5fbf6aff9a.png",
    "about-hero.png"
  );
  const valuesLeft = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/72b59bc6-93e8-4c64-aec8-f1992d18dff9.png",
    "values-performance.png"
  );
  const valuesRight = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/0cb94b84-f7cd-4f04-8bcc-12f2206c71a1.png",
    "values-durability.png"
  );
  const servicesBandBg = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/c57828d7-6a6a-40a1-80c5-521348c356e2.png",
    "services-band-bg.png"
  );
  const commitmentIcon1 = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/33d9d7b6-8d38-47ba-9068-b2e607be311e.svg",
    "commitment-mutual-trust.svg"
  );
  const commitmentIcon2 = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/13ea6647-a392-4ea0-b118-51d0d2436025.svg",
    "commitment-customized-solutions.svg"
  );
  const commitmentIcon3 = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/c9c84dbb-274c-44a0-9891-f8c43219596d.svg",
    "commitment-service-standards.svg"
  );
  const commitmentIcon4 = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/98c6ea3f-de48-4f31-9f98-7873cb5e2819.svg",
    "commitment-support.svg"
  );

  const doc = {
    _id: "aboutPage",
    _type: "aboutPage",
    hero: {
      _type: "aboutHeroSection",
      heading: "Our beginnings",
      intro:
        "Founded in 1994, SELMANI IMP-EXP began as a wholesale distributor of construction materials, quickly establishing a reputation for reliability. Over the decades, that focus on long-term partnerships has fueled our industrial expansion. Today, through professional dedication and quality service, we have built a consolidated portfolio that makes us a trusted partner for national and international leaders in construction, industry, and infrastructure.",
      image: heroImage,
      imageAlt: "SELMANI facility",
      journeyHeading:
        "Every step of our journey reflects the values we've stood by from day one.",
      journeyPoints: [
        "It began in 1994, when we earned our first trust through a simple promise of quality.",
        "By 1998, we took our first leap by making a major investment to achieve even more.",
        "The year 2000 marked our growth, as we expanded our capabilities to serve your projects with precision.",
        "Today, we continue this journey by combining advanced technology with over 30 years of hard work and passion.",
      ],
    },
    valuesGrid: {
      _type: "valuesGridSection",
      values: [
        {
          _key: crypto.randomUUID(),
          title: "Performance-oriented",
          description:
            "We continuously upgrade our facilities and processes to deliver consistent, high-quality results. With efficient production flow, high-capacity equipment, and a skilled technical team, we ensure reliable output for projects of any scale.",
          image: valuesLeft,
        },
        {
          _key: crypto.randomUUID(),
          title: "Customer-focused",
          description:
            "From consultation to execution, we prioritize clarity, responsiveness, and technical support. Our goal is to help clients achieve long-lasting, cost-effective solutions for their metal structures.",
        },
        {
          _key: crypto.randomUUID(),
          title: "Durability-driven",
          description:
            "With advanced hot-dip galvanizing technology and expertise in steel fabrication, we engineer solutions designed to withstand time, weather, and demanding industrial conditions.",
          image: valuesRight,
        },
      ],
    },
    servicesBand: {
      _type: "servicesBandSection",
      eyebrow: "Services",
      heading:
        "We specialize in galvanizing and steel constructions for the civil, industrial, and infrastructure sectors.",
      backgroundImage: servicesBandBg,
      intro:
        "Delivering high-capacity, precision-engineered metal solutions for projects across Albania and beyond.",
      bullets: [
        { _key: crypto.randomUUID(), label: "Hot-Dip Galvanizing", description: "Superior, long-lasting corrosion protection." },
        { _key: crypto.randomUUID(), label: "Metallic Constructions", description: "Expert civil and industrial construction." },
        { _key: crypto.randomUUID(), label: "Custom Fabrication", description: "Engineered tanks and structural components." },
      ],
      ctaLabel: "Explore Services",
    },
    clientsGrid: {
      _type: "clientsGridSection",
      heading: "Clients & Contractors",
      clients: [
        "Contractors GSM",
        "Contractors Builders / Civil (Public) Works Contractors",
        "Builders / Contractors of Industrial Works",
        "Government Entities (Public)",
        "Residential Clients",
      ],
    },
    commitmentGrid: {
      _type: "commitmentGridSection",
      heading: "Our Commitment to Clients",
      intro: "Every collaboration represents a long-term partnership based on:",
      commitments: [
        { _key: crypto.randomUUID(), label: "Mutual Trust", icon: commitmentIcon1 },
        { _key: crypto.randomUUID(), label: "Customized Technical Solutions", icon: commitmentIcon2 },
        { _key: crypto.randomUUID(), label: "High Service Standards", icon: commitmentIcon3 },
        { _key: crypto.randomUUID(), label: "Professional Support From Design To Final Implementation", icon: commitmentIcon4 },
      ],
    },
  };

  await client.createOrReplace(doc);
  console.log("  upserted aboutPage");

  console.log("\nDone. Check the Studio at localhost:3000/studio");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
