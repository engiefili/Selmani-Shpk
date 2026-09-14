import type { Image } from "sanity";

// An image array item with the "alt" field added by the array's `of`
// definition in the schema (e.g. service.gallery, projectImageGroup.images)
// — plain `Image` doesn't carry it since that field only exists on these
// specific array item shapes, not on every image in the dataset.
export type ImageWithAlt = Image & { _key?: string; alt?: string };

export type SanityFeatureItem = {
  _key: string;
  label: string;
  icon?: Image;
};

export type TextBlock = {
  _key: string;
  _type: "textBlock";
  text: string;
  style: "intro" | "label" | "title" | "body";
};

export type FeatureGridBlock = {
  _key: string;
  _type: "featureGridBlock";
  heading?: string;
  items: SanityFeatureItem[];
};

export type LinkListBlock = {
  _key: string;
  _type: "linkListBlock";
  heading?: string;
  items: string[];
};

export type AccordionGroupBlock = {
  _key: string;
  _type: "accordionGroupBlock";
  items: {
    _key: string;
    title: string;
    items: SanityFeatureItem[];
  }[];
};

export type ContentBlock =
  | TextBlock
  | FeatureGridBlock
  | LinkListBlock
  | AccordionGroupBlock;

export type ServiceTabDoc = {
  _key: string;
  label: string;
  image?: Image;
  imageAlt?: string;
  content: ContentBlock[];
};

export type ProcessStepDoc = {
  _key: string;
  label: string;
  icon?: Image;
};

export type HomePageDoc = {
  _id: string;
  hero: {
    // New multi-slide shape. Optional for one deploy cycle: the published
    // document won't have this until the content is published in Studio
    // (see the legacy fields below, kept as a same-cutover fallback).
    slides?: {
      _key: string;
      image: Image;
      imageAlt?: string;
      heading: string;
      subheading: string;
    }[];
    // Legacy single-slide shape — no longer editable in Studio, but kept
    // here so the site keeps rendering correctly on published content
    // that hasn't been migrated to `slides` yet.
    heading?: string;
    subheading?: string;
    backgroundImage?: Image;
    backgroundImageAlt?: string;
    certifications?: { line1: string; line2: string }[];
    ctaLabel?: string;
  };
  aboutUs: {
    eyebrow?: string;
    text: string;
    image: Image;
    imageAlt?: string;
  };
  hotDipGalvanizing: {
    eyebrow?: string;
    title: string;
    beforeImage: Image;
    beforeLabel?: string;
    afterImage: Image;
    afterLabel?: string;
    benefits: { title: string; description: string }[];
    ctaLabel?: string;
  };
  metallicConstructions: {
    eyebrow?: string;
    title: string;
    services: { title: string; industries: string; icon?: Image }[];
    description: string;
    ctaLabel?: string;
  };
  tanksShowcase: {
    eyebrow?: string;
    title: string;
    image: Image;
    imageAlt?: string;
    tanks: { title: string; description: string; image?: Image; imageAlt?: string }[];
    ctaLabel?: string;
  };
};

export type AboutPageDoc = {
  _id: string;
  hero: {
    heading?: string;
    intro: string;
    image: Image;
    imageAlt?: string;
    journeyHeading: string;
    journeyPoints: string[];
  };
  valuesGrid: {
    values: { title: string; description: string; image?: Image }[];
  };
  servicesBand: {
    eyebrow?: string;
    heading: string;
    backgroundImage: Image;
    intro: string;
    bullets: { label: string; description: string }[];
    ctaLabel?: string;
  };
  clientsGrid: {
    heading?: string;
    clients: string[];
  };
  commitmentGrid: {
    heading?: string;
    intro: string;
    commitments: { label: string; icon?: Image }[];
  };
};

export type IndustrySectionDoc = {
  _key: string;
  sectionId: { current: string };
  eyebrow?: string;
  title: string;
  description?: string;
  applications: string[];
  closing?: string;
  image?: Image;
  imageAlt?: string;
  imagePosition?: "left" | "right";
};

export type IndustriesPageDoc = {
  _id: string;
  heroTitle: string;
  heroDescription?: string;
  heroImage: Image;
  heroImageAlt?: string;
  sections: IndustrySectionDoc[];
};

export type ProjectImageGroupDoc = {
  _key: string;
  subLabel?: string;
  images: ImageWithAlt[];
};

export type ProjectServiceTabDoc = {
  _key: string;
  tabId: { current: string };
  label: string;
  groups: ProjectImageGroupDoc[];
};

export type ProjectsPageDoc = {
  _id: string;
  heroTitle: string;
  heroImage: Image;
  heroImageAlt?: string;
  tabs: ProjectServiceTabDoc[];
};

export type ServiceDoc = {
  _id: string;
  page: "services" | "technology";
  order: number;
  sectionId: { current: string };
  eyebrow?: string;
  title: string;
  description: string;
  image: Image;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  pdfLabel?: string;
  tabs: ServiceTabDoc[];
  processSteps?: {
    heading: string;
    steps: ProcessStepDoc[];
  };
  gallery?: ImageWithAlt[];
};

export type NavDropdownItemDoc = {
  _key: string;
  label: string;
  href: string;
};

export type NavLinkItemDoc = {
  _key: string;
  label: string;
  href: string;
  dropdown?: NavDropdownItemDoc[];
};

export type FooterCatalogLinkDoc = {
  _key: string;
  label: string;
  href?: string;
};

export type SiteSettingsDoc = {
  _id: string;
  logo: Image;
  navLinks: NavLinkItemDoc[];
  contactCtaLabel?: string;
  languageSwitcherLabel?: string;
  footerCatalogRow1?: FooterCatalogLinkDoc[];
  footerCatalogRow2?: FooterCatalogLinkDoc[];
  companyName?: string;
  headquartersLabel?: string;
  phone: string;
  email: string;
  address: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  mapEmbedUrl?: string;
  mapLinkUrl?: string;
  copyrightText?: string;
  rightsReservedText?: string;
  ctaBandImage?: Image;
};

export type ContactPageDoc = {
  _id: string;
  heroHeading: string;
  heroSubtext: string;
};
