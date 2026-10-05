// One-time import of the 5 launch "Insights" articles from the client's
// "Selmani Steel Knowledge Base — SEO Content Pack" .docx into Sanity.
//
// Parses the .docx directly (no pandoc needed): Title paragraphs start each
// article, the label/value pairs under it are the SEO metadata, Heading1 →
// h2, Heading2 → h3, ListBullet → bullet list items, anything else → paragraphs. The
// "WEBSITE CTA" / "Implementation note" / "Suggested hero visual" lines are
// instructions to the developer, not article copy, so they're skipped (the
// RFQ call-to-action is a permanent part of the article template instead).
//
// Also uploads each article's embedded technical diagram, plus a Selmani
// factory photo from /public as the cover image (the client asked for
// photography to replace the diagrams as hero visuals where available).
//
// Safe to re-run: documents use fixed ids and are createOrReplace'd.
//
// SETUP: needs SANITY_API_WRITE_TOKEN in .env.local (Editor role).
//
// Run:
//   node --env-file=.env.local scripts/migrate-insights.mjs <path/to/pack.docx> --dry-run
//   node --env-file=.env.local scripts/migrate-insights.mjs <path/to/pack.docx>

import { createClient } from "@sanity/client";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");
const docxPath = process.argv.find((a) => a.endsWith(".docx"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!docxPath) {
  console.error("Pass the path to the .docx content pack.");
  process.exit(1);
}
if (!projectId || !dataset || (!token && !DRY_RUN)) {
  console.error("Missing Sanity env — run from the project root with .env.local loaded.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ---- per-article presentation data that isn't in the docx -------------
// Order matches the docx (1–5). `cover` is a photo from /public.
const ARTICLES = [
  {
    category: "Hot-Dip Galvanizing",
    cover: "public/technology/hotdip_process.jpg",
    coverAlt: "Galvanized steel tubes lifted above the zinc bath in the Selmani galvanizing line",
    related: [2, 3, 4],
    featured: true,
  },
  {
    category: "Standards & Quality",
    cover: "public/projects/hdg/hdg_11.jpg",
    coverAlt: "Hot-dip galvanized steel flanges with a uniform zinc coating",
    related: [1, 4],
  },
  {
    category: "Hot-Dip Galvanizing",
    cover: "public/projects/hdg/hdg_13.jpg",
    coverAlt: "Hot-dip galvanized steel assemblies after zinc coating",
    related: [1, 2],
  },
  {
    category: "Engineering & Design",
    cover: "public/projects/hdg/hdg_15.jpg",
    coverAlt: "Galvanized steel profiles with vent and drain openings, ready for dispatch",
    related: [1, 2],
  },
  {
    category: "Procurement & Export",
    cover: "public/technology/steelfab.jpg",
    coverAlt: "Welder working on a steel assembly in the Selmani fabrication workshop",
    related: [1, 4, 2],
  },
];
// Staggered so the list keeps the pack's 1→5 order when sorted newest-first.
const PUBLISHED = ["2026-09-30", "2026-09-29", "2026-09-28", "2026-09-27", "2026-09-26"];

// ---- docx parsing ------------------------------------------------------
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "insights-docx-"));
execFileSync("unzip", ["-q", "-o", docxPath, "-d", tmp]);
const xml = fs.readFileSync(path.join(tmp, "word/document.xml"), "utf8");

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const paras = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map((m) => {
  const p = m[0];
  const style = p.match(/<w:pStyle w:val="([^"]+)"/)?.[1] ?? "";
  const text = decode([...p.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((t) => t[1]).join("")).trim();
  return { style, text };
});

const LABELS = {
  "SEO title": "seoTitle",
  "Meta description": "metaDescription",
  "Suggested URL": "url",
  "Primary keywords": "keywords",
  "Suggested alt text": "diagramAlt",
};

const raw = [];
let cur = null;
for (let i = 0; i < paras.length; i++) {
  const { style, text } = paras[i];
  if (text === "Internal Linking Map") break;
  if (style === "Title" && /^\d+\.\s/.test(text)) {
    cur = { title: text.replace(/^\d+\.\s*/, ""), meta: {}, body: [] };
    raw.push(cur);
    continue;
  }
  if (!cur || !text) continue;
  if (LABELS[text]) {
    cur.meta[LABELS[text]] = paras[++i].text;
    continue;
  }
  if (/^Suggested hero visual/.test(text)) continue;
  if (/^WEBSITE CTA/.test(text)) continue;
  if (/^Implementation note/.test(text)) continue;
  cur.body.push({ style, text });
}

// ---- Portable Text -----------------------------------------------------
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);
const span = (text, marks = []) => ({ _type: "span", _key: key(), text, marks });

function block(style, children, extra = {}) {
  return { _type: "block", _key: key(), style, markDefs: [], children, ...extra };
}

function toPortableText(items) {
  return items.map(({ style, text }) => {
    if (style === "Heading1") return block("h2", [span(text)]);
    if (style === "Heading2") return block("h3", [span(text)]);
    if (style === "ListBullet") {
      // "Term — explanation" → bold term, so process steps scan well.
      const m = text.match(/^([^—]{2,40}) — (.+)$/);
      const children = m ? [span(m[1], ["strong"]), span(` — ${m[2]}`)] : [span(text)];
      return block("normal", children, { listItem: "bullet", level: 1 });
    }
    return block("normal", [span(text)]);
  });
}

// ---- main --------------------------------------------------------------
if (raw.length !== ARTICLES.length) {
  console.error(`Expected ${ARTICLES.length} articles, parsed ${raw.length}.`);
  process.exit(1);
}

const slugs = raw.map((a) => a.meta.url.split("/").filter(Boolean).pop());
const docId = (slug) => `insight-${slug}`;

async function upload(file, filename) {
  const asset = await client.assets.upload("image", fs.createReadStream(file), { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

for (let i = 0; i < raw.length; i++) {
  const a = raw[i];
  const cfg = ARTICLES[i];
  const slug = slugs[i];
  const doc = {
    _id: docId(slug),
    _type: "insight",
    title: a.title,
    slug: { _type: "slug", current: slug },
    category: cfg.category,
    excerpt: a.meta.metaDescription,
    featured: !!cfg.featured,
    coverImageAlt: cfg.coverAlt,
    diagramAlt: a.meta.diagramAlt,
    body: toPortableText(a.body),
    relatedInsights: cfg.related.map((n) => ({
      _type: "reference",
      _key: key(),
      _ref: docId(slugs[n - 1]),
    })),
    publishedAt: PUBLISHED[i],
    updatedAt: PUBLISHED[i],
    seoTitle: a.meta.seoTitle,
    metaDescription: a.meta.metaDescription,
    keywords: a.meta.keywords.split(";").map((k) => k.trim()).filter(Boolean),
  };

  if (DRY_RUN) {
    console.log(`#${i + 1} ${slug} — ${doc.body.length} blocks, ${doc.keywords.length} keywords`);
    continue;
  }

  doc.coverImage = await upload(cfg.cover, path.basename(cfg.cover));
  doc.diagram = await upload(path.join(tmp, `word/media/image${i + 1}.png`), `${slug}-diagram.png`);
  // Referenced docs must exist before a strong reference to them is written,
  // so first pass writes without relations; second pass (below) adds them.
  const { relatedInsights, ...withoutRelated } = doc;
  await client.createOrReplace(withoutRelated);
  doc._related = relatedInsights;
  console.log(`✓ ${slug}`);
  raw[i].doc = doc;
}

if (!DRY_RUN) {
  for (const a of raw) {
    await client
      .patch(a.doc._id)
      .set({ relatedInsights: a.doc._related })
      .commit();
  }
  console.log("✓ related links set");
}
