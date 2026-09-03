# Selmani Website — SEO Audit

Site audited: `selmani-shpk.vercel.app` (Home, Technology, Services & Products, Industries, Projects, About, Contact, Privacy Policy — English and Albanian `/al/` versions of each). Audit combined direct source inspection of the Next.js/Sanity codebase with live checks of the deployed pages.

## Executive Summary

The site's biggest strength is its foundation: clean semantic URLs, one H1 per page, self-hosted fonts, HTTPS, and a genuinely strong mobile experience after this project's recent redesign work. But there's one issue that overrides everything else in this report: **the new site isn't live on the company's real domain yet.** Google currently indexes `selmanishpk.com.al`, a 2014-era WordPress site, while all the work described below lives on a Vercel preview URL that Google has no reason to rank. Until that's resolved, no amount of on-page polish here will show up in search results.

Once that's addressed, the next-biggest gaps are metadata-related: every single page on the new site — all seven sections, in both languages — currently ships the exact same `<title>` and meta description, and the Albanian pages serve English metadata with `lang="en"`. There's no robots.txt, no sitemap, no structured data, and no Open Graph tags for social sharing. None of these are hard to fix; they're just not built yet.

**Overall assessment: needs work, but the fixes are mostly mechanical, not architectural.** The site's content and structure are sound — this is a metadata and infrastructure gap, not a content or design problem.

## Priority 0: Domain Consolidation

This isn't in the standard checklist below because it's bigger than a checklist item.

`selmanishpk.com.al` is live right now, indexed (`meta-robots: index, follow`), and has its own Open Graph tags, backlinks (Facebook, LinkedIn), and years of accumulated history since 2014. The new site under audit here is only reachable at `selmani-shpk.vercel.app`. Two live sites for the same business, on two different domains, is a real risk: if both stay indexed, Google may split authority between them, rank the wrong one, or flag it as duplicate content.

Before investing further in on-page SEO, decide the migration path:

1. Point `selmanishpk.com.al` at the new site (update DNS/hosting), and
2. 301-redirect every old WordPress URL to its new equivalent (the old site's nav suggests roughly: `/rreth-nesh/` → `/about`, `/konstruksione-metalike-hot-dip-galvanizing-depozita-uji-zinkim/` → `/technology`, `/klientet/` and `/galeri/` → `/projects`, `/kontakt/` → `/contact`), and
3. Set `metadataBase` and canonical URLs to the real domain once it's live, so the fixes below actually count.

This is worth a conversation with whoever manages the domain/DNS before the rest of this list gets scheduled.

## Technical SEO Checklist

| Check | Status | Details |
|---|---|---|
| Domain / indexation target | **Fail** | New site not on the production domain (see above) |
| Robots.txt | **Fail** | `/robots.txt` returns 404 — doesn't exist |
| XML sitemap | **Fail** | `/sitemap.xml` returns 404 — doesn't exist |
| Per-page title tags | **Fail** | Identical on all 7+ pages, both locales — set once in `layout.tsx` |
| Per-page meta descriptions | **Fail** | Same as above |
| Canonical tags | **Fail** | None present on any page |
| Hreflang (EN/SQ alternates) | **Fail** | None — Google can't connect `/technology` to `/al/technology` as language variants |
| `<html lang>` | **Fail** | Hardcoded to `"en"` even on `/al/*` pages |
| Open Graph / Twitter cards | **Fail** | No `og:*` or `twitter:*` tags anywhere |
| Structured data (JSON-LD) | **Fail** | None. Organization/LocalBusiness schema is a quick win — name, address, phone, logo already exist in Sanity site settings |
| `/studio` (Sanity CMS) indexation | **Pass** | Already correctly serving `noindex` |
| HTTPS | **Pass** | Served via Vercel |
| URL structure | **Pass** | Clean, semantic, locale-prefixed (`/al/...`) rather than query-param based |
| Heading hierarchy | **Pass** | Exactly one H1 per page on every page checked |
| Image optimization | **Warning** | All 27 `<img>` usages sitewide are raw HTML `<img>`, not `next/image` — no responsive `srcset`, no automatic AVIF/WebP for local `/public` images, no built-in lazy-loading. Sanity-hosted images at least get CDN-side resizing via width params already in use |
| Image alt text | **Warning** | Icons/decorative backgrounds correctly use `alt=""`. But several content images fall back to `data.imageAlt ?? ""` — if an editor leaves that Sanity field blank, the image ships with no alt text. Worth an editorial pass through Sanity Studio to confirm it's filled in everywhere |
| Font loading | **Pass** | Self-hosted via `next/font/local` — avoids render-blocking external font requests |
| `metadataBase` | **Fail** | Not set — will make canonical/OG URL resolution unreliable once those are added |

## On-Page Issues

| Page | Issue | Severity | Recommended Fix |
|---|---|---|---|
| All pages (EN + AL) | Identical title/description sitewide | Critical | Add per-page `generateMetadata()` (see suggested copy below) |
| All `/al/*` pages | English metadata + `lang="en"` on Albanian pages | Critical | Localize metadata per locale; set `lang="sq"` conditionally in the root layout |
| All pages | No canonical tag | High | Add `alternates.canonical` once the production domain is set |
| All pages | No hreflang | High | Add `alternates.languages` linking each EN page to its `/al/` counterpart |
| Sitewide | No sitemap for search engines to discover pages | High | Add `src/app/sitemap.ts` covering all routes × both locales |
| Sitewide | No robots.txt | Medium | Add `src/app/robots.ts`, allow everything except `/studio` and `/api/*`, point to the sitemap |
| Sitewide | No social preview when links are shared | Medium | Add Open Graph + Twitter card metadata with a representative image per page |
| Sitewide | No Organization schema | Medium | Add JSON-LD using existing Sanity site settings (name, logo, phone, address, social links) |
| Various content images | Alt text depends on an optional CMS field | Low | Editorial pass in Sanity Studio; consider making `imageAlt` required on key image fields |

## Suggested Title / Description Starting Points

These are drafts to react to, not final copy — happy to refine tone or swap in real target keywords once you confirm the primary domain.

| Page | Suggested Title | Suggested Description |
|---|---|---|
| Home | Selmani Sh.p.k. \| Hot-Dip Galvanizing & Steel Construction, Albania | Over 25 years of hot-dip galvanizing and steel construction for civil, industrial, and infrastructure projects in Albania and abroad. |
| Technology | Hot-Dip Galvanizing & Steel Fabrication Process \| Selmani | See how Selmani's hot-dip galvanizing and steel fabrication technology protects steel structures from corrosion for decades. |
| Services & Products | Steel Services: Galvanizing, Metal Constructions, Tanks \| Selmani | Hot-dip galvanizing, metal construction, and custom steel tanks and containers — explore Selmani's full range of services and products. |
| Industries | Industries We Serve \| Selmani Steel & Galvanizing | From telecommunications to public infrastructure, see the industries Selmani equips with galvanized steel construction. |
| Projects | Our Projects \| Selmani Steel Constructions | Browse completed hot-dip galvanizing, metal construction, and tank projects delivered by Selmani across Albania. |
| About | About Selmani \| 25+ Years in Industrial Galvanizing | Selmani has delivered certified (ISO 9001) hot-dip galvanizing and steel construction since 1998. Learn our story. |
| Contact | Contact Selmani \| Request a Quote | Get in touch with Selmani for hot-dip galvanizing, steel construction, or custom tank manufacturing quotes. |

Albanian equivalents should be written natively, not machine-translated from these — happy to draft those too.

## Keyword Opportunities

No SEO tool (Ahrefs/Semrush/GSC) is connected to this session, so the figures below are directional based on the service categories the site already covers and a competitor scan, not pulled ranking/volume data. For real search-volume and difficulty numbers, connecting Google Search Console (free, and the most relevant data source once the domain is consolidated) or an SEO tool via MCP would sharpen this considerably.

| Keyword (EN) | Albanian equivalent | Intent | Notes |
|---|---|---|---|
| hot dip galvanizing Albania | zinkim në të nxehtë Shqipëri | Commercial | Core category term; currently owned by the old site's URL structure |
| steel construction company Albania | konstruksione metalike Shqipëri | Commercial | High relevance, used throughout the site already |
| galvanized water tanks | depozita uji të zinkuara | Transactional | Specific product page opportunity — matches the Tanks & Containers section |
| fuel tanks manufacturer Albania | depozita karburanti | Transactional | Same as above |
| telecommunications steel towers | struktura celiku telekomunikacioni | Commercial | Matches the "Telecom Structures" industry served |
| ISO 9001 galvanizing Albania | — | Commercial | Certification-driven searches; worth surfacing certifications as text (not just badge images) on the About/Home pages for crawlability |
| corrosion protection steel | mbrojtje nga korrozioni | Informational | Good fit for an FAQ or "why galvanize" explainer, which the Technology page partially covers already |

## Content Gap Observations

- **Certifications are currently image-only.** "EQA 2011005," "ISO 9001," "OHSAS540" appear as badge graphics on the homepage. Search engines can't read image text — repeating them as real text (even in an `alt` attribute or a small text line) would make them discoverable.
- **No FAQ content.** Common buyer questions ("how long does hot-dip galvanizing last," "galvanizing vs. painting," "how much does a custom tank cost") aren't answered anywhere. A short FAQ block (with `FAQPage` schema) on the Technology or Services page is a low-effort way to pick up "how/what/why" search traffic and a potential featured snippet.
- **Projects page has no descriptive copy**, just filterable image galleries. A sentence or two of context per project (scope, industry, materials) would give search engines something to index beyond image filenames.
- **No case studies or testimonials.** For a B2B contractor, a couple of named project write-ups ("built for X telecom operator") build both trust and long-tail keyword coverage that generic service pages can't.

## Prioritized Action Plan

**Quick wins (this week, mostly code-level, no new content needed):**
- Add `src/app/robots.ts` and `src/app/sitemap.ts` (allow all, disallow `/studio` and `/api`, list every route × locale).
- Add per-page `generateMetadata()` using the suggested titles/descriptions above as a starting point.
- Set `lang="sq"` conditionally in the root layout based on locale.
- Add `metadataBase` once the production domain is decided.
- Add Organization JSON-LD using data already in Sanity site settings.

**Strategic investments (plan for this quarter):**
- Resolve the domain situation (Priority 0) and set up 301 redirects from the old WordPress URLs.
- Add hreflang alternates linking every EN/AL page pair.
- Add Open Graph + Twitter card metadata with real page images.
- Migrate the 27 `<img>` usages to `next/image` for responsive images and lazy-loading — improves Core Web Vitals (LCP especially), a direct ranking factor.
- Editorial pass in Sanity Studio to confirm every content image has real alt text filled in.
- Write short descriptive copy for Projects entries; consider 2-3 case studies.
- Add an FAQ section with `FAQPage` schema.

## Design & Content-Structure Review

This section covers what a design-only review (no code/live-site access) could realistically catch — heading quality, content depth, image/alt-text readiness, and structural gaps — plus one significant finding that only showed up by actually checking the rendered output. This is separate from the domain-migration question; none of it depends on that.

**H1 quality.** Every page has exactly one H1 (confirmed earlier), but a few are weaker than they could be:

| Page | Current H1 | Note |
|---|---|---|
| Home | "Building Stronger, Protecting Longer." | Brand tagline — fine as a deliberate choice, but carries no keyword signal. Common trade-off for hero taglines. |
| Technology | "Technology" | Generic, single word. Doesn't say what technology, or mention galvanizing/steel at all. |
| Projects | "Projects" | Same issue — no context, no keyword. |
| Industries | "Industries We Serve" | Reasonable. |
| Services & Products | "Services & Products" | Reasonable, matches category naming. |
| About | "Our beginnings" | Reads as a storytelling opener, not a page-identifying heading — doesn't include "About" or the company name. |
| Contact | "Send us a message" | CTA-style, acceptable and clear. |

"Technology" and "Projects" are the two worth tightening — something like "Hot-Dip Galvanizing & Steel Fabrication Technology" and "Our Projects" gives search engines (and anyone landing mid-scroll from a search result) actual context.

**Heading hierarchy.** Mostly clean — H1 → H2 → H3 nesting is logical sitewide. One gap: the About page's "values" cards (Performance, Customer-focus, Durability) render as H3s with no H2 introducing that section, so the hierarchy jumps from the page H1 straight to H3. Minor, but worth a section heading there.

**Content depth per page** (rough word counts, includes shared nav/footer text):

| Page | Approx. words |
|---|---|
| Home | 418 |
| Services & Products | 419 |
| About | 408 |
| Industries | 354 |
| Technology | 249 |
| Contact | 142 |
| Projects | 88 |

Projects is thin — it's essentially just a filter UI and image grid with no descriptive text, which matches the content-gap note in the original audit (add a sentence or two per project). Technology is thinner than its subject matter deserves, and that's compounded by the finding below.

**Tab content isn't reliably indexable — the significant new finding.** Every `ServiceSection` (Hot Dip Galvanizing's Applications/Advantages, Metal Constructions' Civil Works/Industrial Projects, Tanks & Containers, and the same pattern on the Technology page) only renders the *active* tab's content into the actual page DOM. I checked this directly: the inactive tab's text does technically exist somewhere in the page's raw HTML, but only inside Next.js's serialized hydration payload (escaped JSON in a script tag) — not as real `<h2>`/`<p>` markup. Google's renderer takes a snapshot of the rendered DOM without clicking through UI tabs, so in practice, roughly half of each section's substantive content (whichever tab isn't shown by default) is invisible to search indexing. This affects every tabbed section on both the Services and Technology pages — it's a bigger content-visibility gap than the word counts above suggest, since a lot of real content exists but isn't crawlable as written.

The accordion panels (the "+/−" expandable groups) don't have this problem — those already render all panels into the DOM at all times and just hide the closed ones visually, so their content is fully crawlable.

**Images — alt-text readiness.** Spot-checking what the images actually depict: hero photos (tanks, steel structures), before/after galvanizing comparisons, and product photos (staircases, platforms, towers) are all genuinely descriptive subjects that alt text can meaningfully describe — this isn't a case of generic stock photography where alt text would be filler. The gap is purely whether the Sanity `imageAlt` fields are filled in (flagged in the original audit) — the images themselves are worth describing.

One more image-related note: Sanity's CDN serves images under hash-based filenames (e.g. `a1b2c3d4...-1600x900.jpg`), which is normal for a headless CMS but means there's no descriptive filename signal for image search. Not fixable without a custom asset pipeline — low priority, just worth knowing it's a ceiling on image-search visibility.

**Mobile load speed.** The lack of `next/image` (flagged in the original audit) has a concrete cost here: `ServicesHero`'s background photo is a static file served at its full 264KB regardless of device — a phone on a mobile connection downloads the exact same file as a desktop monitor, with no responsive `srcset` to serve it something smaller. The Sanity-hosted hero images at least get requested at a fixed width (2400px) via the CDN's resize API, but that's still 2400px handed to a 375px-wide phone screen — no responsive breakpoints, so mobile gets more image data than it needs on every page with a hero. This is the same root cause as the `next/image` migration already on the list; just naming the concrete impact.

**Room for FAQ / breadcrumbs.** Neither exists today. The Technology and Services pages' card layout (tabs + PDF download button) has natural room for a short FAQ block underneath without disrupting the design. Breadcrumbs are a smaller win here since the site is only one level deep (no nested category pages), but a simple "Home / Services & Products" trail costs little and pairs well with `BreadcrumbList` schema.

**Duplicate/overlapping content risk.** The homepage repeats condensed versions of the Hot Dip Galvanizing, Metal Constructions, and Tanks & Containers sections (via `MobileServiceCarousel` and the three showcase components) that also appear in full on the Services page. This is normal for a homepage teaser pattern and not a real duplicate-content penalty risk, but worth knowing the homepage's own keyword relevance for those specific terms is partially diluted by the fuller version living on `/services`.

## Alt-Text Audit (Sanity CMS Content)

Queried every document in the Sanity dataset (Home, About, Industries, Projects, Contact, Site Settings, and all 10 Service documents across both locales) and checked every image field against its alt-text field. The picture is better than the original audit assumed.

**Primary content images are fully covered.** Every hero image, section image, and service-tab image in the CMS has a real, descriptive `imageAlt` value — not placeholder text. Examples: "Hot-dip galvanized steel staircase," "Telecommunications transmission tower," "Galvanized steel poles being dipped into a treatment bath," "Grain silo steel structures against an overcast sky." These fields are also marked required in the schema, so this isn't at risk of regressing as new content gets added. No action needed here.

**Decorative icons correctly use empty alt text.** Feature-grid icons, commitment-grid icons, and metallic-constructions icons all render with `alt=""` in code. That's the right call under WCAG — each icon sits directly next to its own visible label ("Structural steel frames," "Mutual Trust," etc.), so a screen reader announcing the icon separately would just repeat the label. These have no alt field in the Sanity schema at all, which is fine since they're meant to stay decorative.

**The real gap: gallery and project-grid thumbnails have no per-image alt text.** Two places in the schema — each service document's `gallery` array (used in the "Selected Work" strip, 5 images per service) and the Projects page's `tabs[].groups[].images` array (used in the project photo grids, ~35–40 images per language) — store images as bare references with no alt field attached at all. The code fills in a generic positional fallback instead (`"Selected work 1"`, `"Hot Dip Galvanising project photo 3"`), which is non-empty and passes automated accessibility checks, but doesn't describe what's actually in the photo. Fixing this properly means a schema change (adding an `alt` string field to each array's image objects) plus writing real captions for roughly 110+ individual photos — a genuine content task, not something I can do from here since the write token is read-only. Worth doing eventually, low urgency: these are supplementary gallery shots, not the primary content search engines weight most heavily.

**Minor: a few alt texts aren't localized.** The About page's hero image, the Industries and Projects hero images, and the three Tanks & Containers tab images reuse the identical English alt string on the Albanian-locale documents (e.g. `industriesPage_sq` still has `"Grain silo steel structures against an overcast sky"` rather than an Albanian translation). Doesn't break anything — the description is still accurate — but a screen-reader user on the Albanian pages hears English. Nice-to-have, not urgent.

**Logo has no CMS-level alt field.** `siteSettings.logo` is used sitewide but its alt text ("Selmani") is hardcoded in `HeaderClient.tsx` rather than editable in Studio. Not a bug — it's short, accurate, and unlikely to need changing — just noting it's a code-level string if anyone ever needs to edit it.

If you want the gallery/project-grid captions written, I'd need real descriptions of what's in each photo (location, project type, etc.) — that's not something I can infer from a hash-named CDN filename. Happy to draft a schema change and placeholder Studio instructions whenever that content is ready.

## Next Steps

Domain/redirect work remains on hold per your note that the client hasn't signed off on the site yet. Everything else from this report's original list is now done: sitemap, robots.txt, per-page metadata, hreflang, `lang` attribute, JSON-LD, the FAQ section, tab-content crawlability, and the `next/image` migration.

Remaining open items, roughly in priority order:
- Domain migration and 301 redirects (blocked on client sign-off).
- Real per-image captions for the gallery/project-grid photos, if/when that content exists.
- Localized Albanian alt text for the handful of images noted above.

Let me know which of these you'd like tackled first — my instinct is the metadata/sitemap/robots.txt work, since it's self-contained and doesn't depend on the domain decision.
