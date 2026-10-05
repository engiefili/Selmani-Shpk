// Client-safe (no server-only imports) so client components can use it.

// UI strings for the Insights pages. The articles themselves are English
// only for now; /al shows the same articles inside a translated frame.
export const insightsCopy = {
  en: {
    eyebrow: "Technical & Editorial",
    title: "Insights",
    intro:
      "Technical notes, process know-how and buyer's guides from the Selmani Steel team — galvanizing, fabrication and the standards behind them.",
    all: "All",
    readArticle: "Read article",
    minRead: "min read",
    featured: "Featured",
    reviewedBy: "Reviewed by Selmani Steel Technical Team",
    updated: "Updated",
    inThisArticle: "In this article",
    relatedServices: "Related Selmani services",
    relatedReading: "Keep reading",
    breadcrumbRoot: "Insights",
    ctaTitle: "Planning a galvanizing or steel fabrication project?",
    ctaText:
      "Send us your drawings and requirements — our technical team will review manufacturability, galvanizing and export logistics before production begins.",
    rfq: "Send Your RFQ",
    sidebarCta: "Have a project in mind?",
    empty: "New articles are on the way.",
    englishOnly: "This article is currently available in English.",
    services: [
      { label: "Hot-Dip Galvanizing", href: "/services#hot-dip-galvanizing" },
      { label: "Steel Fabrication", href: "/services#metal-constructions" },
      { label: "Quality & Certifications", href: "/about" },
      { label: "Contact & RFQ", href: "/contact" },
    ],
    metaTitle: "Insights — Technical Articles on Galvanizing & Steel Fabrication",
    metaDescription:
      "Technical articles from Selmani Steel on hot-dip galvanizing, EN ISO 1461, design for galvanizing and steel fabrication in Albania.",
  },
  sq: {
    eyebrow: "Teknike & Editoriale",
    title: "Insights",
    intro:
      "Shënime teknike, njohuri mbi proceset dhe udhëzues për blerësit nga ekipi i Selmani Steel — zinkimi, prodhimi i konstruksioneve dhe standardet pas tyre.",
    all: "Të gjitha",
    readArticle: "Lexo artikullin",
    minRead: "min lexim",
    featured: "I veçantë",
    reviewedBy: "Rishikuar nga Ekipi Teknik i Selmani Steel",
    updated: "Përditësuar",
    inThisArticle: "Në këtë artikull",
    relatedServices: "Shërbime të lidhura",
    relatedReading: "Vazhdo leximin",
    breadcrumbRoot: "Insights",
    ctaTitle: "Po planifikoni një projekt zinkimi ose konstruksionesh metalike?",
    ctaText:
      "Na dërgoni vizatimet dhe kërkesat tuaja — ekipi ynë teknik do të shqyrtojë prodhueshmërinë, zinkimin dhe logjistikën e eksportit përpara fillimit të prodhimit.",
    rfq: "Dërgoni Kërkesën (RFQ)",
    sidebarCta: "Keni një projekt?",
    empty: "Artikuj të rinj do të publikohen së shpejti.",
    englishOnly: "Ky artikull është aktualisht i disponueshëm në anglisht.",
    services: [
      { label: "Zinkim në të Nxehtë", href: "/services#hot-dip-galvanizing" },
      { label: "Konstruksione Metalike", href: "/services#metal-constructions" },
      { label: "Cilësia & Certifikimet", href: "/about" },
      { label: "Kontakt & RFQ", href: "/contact" },
    ],
    metaTitle: "Insights — Artikuj Teknikë mbi Zinkimin dhe Konstruksionet Metalike",
    metaDescription:
      "Artikuj teknikë nga Selmani Steel mbi zinkimin në të nxehtë, EN ISO 1461, projektimin për zinkim dhe prodhimin e konstruksioneve metalike në Shqipëri.",
  },
} as const;
