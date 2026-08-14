// One-off migration script: pushes the global Site Settings singleton
// (logo, header nav, footer, contact info, social links) and the
// Contact page's hero copy into Sanity.
//
// Note: the header logo is still referenced via a Figma-hosted URL
// (https://www.figma.com/api/mcp/asset/...) rather than a local file —
// leftover from the original design handoff. This script fetches it
// and re-uploads it into Sanity permanently; if that link has gone
// stale, it'll print a warning and continue (add the logo manually in
// Studio afterward).
//
// Run with:  node --env-file=.env.local scripts/migrate-contact-and-site-settings.mjs

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN.\n" +
      "Run this with: node --env-file=.env.local scripts/migrate-contact-and-site-settings.mjs"
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

async function uploadImageFromUrl(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, { filename });
    console.log(`  uploaded ${filename}`);
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`  WARNING: could not fetch/upload ${filename} (${url}) — ${err.message}`);
    console.warn(`  Skipping; add it manually in Studio afterward.`);
    return undefined;
  }
}

async function run() {
  console.log("Fetching the logo and building the Site Settings document...\n");

  const logo = await uploadImageFromUrl(
    "https://www.figma.com/api/mcp/asset/85d6a554-e21f-43d5-aa62-afbf0e7c0f02.png",
    "selmani-logo.png"
  );

  const siteSettings = {
    _id: "siteSettings",
    _type: "siteSettings",
    logo,
    navLinks: [
      { _type: "navLinkItem", _key: crypto.randomUUID(), label: "About Us", href: "/about" },
      {
        _type: "navLinkItem",
        _key: crypto.randomUUID(),
        label: "Services & Products",
        href: "/services",
        dropdown: [
          { _type: "navDropdownItem", _key: crypto.randomUUID(), label: "Hot Dip Galvanizing", href: "/services#hot-dip-galvanizing" },
          { _type: "navDropdownItem", _key: crypto.randomUUID(), label: "Metal Constructions", href: "/services#metal-constructions" },
          { _type: "navDropdownItem", _key: crypto.randomUUID(), label: "Tanks & Containers", href: "/services#tanks-containers" },
        ],
      },
      { _type: "navLinkItem", _key: crypto.randomUUID(), label: "Technology", href: "/technology" },
      { _type: "navLinkItem", _key: crypto.randomUUID(), label: "Industries", href: "/industries" },
      { _type: "navLinkItem", _key: crypto.randomUUID(), label: "Projects", href: "/projects" },
    ],
    contactCtaLabel: "Contact Us",
    languageSwitcherLabel: "AL",
    footerCatalogRow1: [
      { _type: "footerCatalogLink", _key: crypto.randomUUID(), label: "About Us", href: "/about" },
      { _type: "footerCatalogLink", _key: crypto.randomUUID(), label: "Services & Products" },
      { _type: "footerCatalogLink", _key: crypto.randomUUID(), label: "Industries" },
    ],
    footerCatalogRow2: [
      { _type: "footerCatalogLink", _key: crypto.randomUUID(), label: "Technology" },
      { _type: "footerCatalogLink", _key: crypto.randomUUID(), label: "Clients" },
      { _type: "footerCatalogLink", _key: crypto.randomUUID(), label: "Gallery" },
    ],
    companyName: "Selmani Imp-Exp sh.pk",
    headquartersLabel: "Headquarters",
    phone: "+355 68 201 3326",
    email: "info@selmanishpk.com",
    address: "Rruga Konferenca e Pezes, Ish Kombinati Misto Mame, Tiranë 1027",
    socialLinks: {
      linkedin:
        "https://www.linkedin.com/in/selmani-sh-p-k-hot-dip-galvanizing-metal-construction-97b42593/",
      instagram: "https://www.instagram.com/selmanisteel/?hl=en",
      facebook: "https://www.facebook.com/selmanishpk",
    },
    mapEmbedUrl: "https://www.google.com/maps?q=41.3170579,19.7810026&z=16&output=embed",
    mapLinkUrl: "https://maps.app.goo.gl/BQFZ2oMUpxnzuwZH9",
    copyrightText: "© 2026 — Copyright",
    rightsReservedText: "All rights reserved",
  };

  const contactPage = {
    _id: "contactPage",
    _type: "contactPage",
    heroHeading: "Send us a\nmessage",
    heroSubtext:
      "Connect with us for advanced galvanizing solutions, expert consultation, and long-term partnerships.",
  };

  console.log("\nSaving documents to Sanity...");
  await client.createOrReplace(siteSettings);
  console.log("  upserted siteSettings");
  await client.createOrReplace(contactPage);
  console.log("  upserted contactPage");

  console.log("\nDone. Check the Studio at localhost:3000/studio");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
