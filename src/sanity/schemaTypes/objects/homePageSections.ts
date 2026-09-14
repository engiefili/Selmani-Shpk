import { defineField, defineType } from "sanity";

export const certificationBadge = defineType({
  name: "certificationBadge",
  title: "Certification badge",
  type: "object",
  fields: [
    defineField({ name: "line1", title: "Line 1", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "line2", title: "Line 2", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "line1", subtitle: "line2" } },
});

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Hero slide",
  type: "object",
  fields: [
    defineField({ name: "image", title: "Background image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "imageAlt", title: "Background image alt text", type: "string" }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'Short punchy line, e.g. "WE BUILD IT."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "subheading", title: "Subheading", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "heading", media: "image" } },
});

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: [{ type: "heroSlide" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "certifications",
      title: "Certification badges",
      type: "array",
      of: [{ type: "certificationBadge" }],
    }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string", initialValue: "Explore our work" }),
  ],
});

export const aboutUsSection = defineType({
  name: "aboutUsSection",
  title: "About Us",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "About Us" }),
    defineField({ name: "text", title: "Text", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: "image", title: "Image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "imageAlt", title: "Image alt text", type: "string" }),
  ],
});

export const benefitItem = defineType({
  name: "benefitItem",
  title: "Benefit",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "title" } },
});

export const hotDipHomeSection = defineType({
  name: "hotDipHomeSection",
  title: "Hot Dip Galvanizing (homepage teaser)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "Services" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "beforeImage", title: "Before image (galvanized)", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "beforeLabel", title: "Before label", type: "string", initialValue: "Hot-dip galvanized" }),
    defineField({ name: "afterImage", title: "After image (rusted)", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "afterLabel", title: "After label", type: "string", initialValue: "Non-galvanized" }),
    defineField({ name: "benefits", title: "Benefits", type: "array", of: [{ type: "benefitItem" }], validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string", initialValue: "Learn More" }),
  ],
});

export const metallicServiceItem = defineType({
  name: "metallicServiceItem",
  title: "Service",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "industries", title: "Industries", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "icon", title: "Icon", type: "image" }),
  ],
  preview: { select: { title: "title", subtitle: "industries", media: "icon" } },
});

export const metallicConstructionsSection = defineType({
  name: "metallicConstructionsSection",
  title: "Metallic Constructions (homepage teaser)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "Services" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "services", title: "Services", type: "array", of: [{ type: "metallicServiceItem" }], validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: "description", title: "Closing description", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string", initialValue: "Learn More" }),
  ],
});

export const tankItem = defineType({
  name: "tankItem",
  title: "Tank",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description:
        "Optional — shown in the big frame when this item is selected. Falls back to the section's main image above if left blank.",
    }),
    defineField({ name: "imageAlt", title: "Image alt text", type: "string" }),
  ],
  preview: { select: { title: "title", media: "image" } },
});

export const tanksShowcaseSection = defineType({
  name: "tanksShowcaseSection",
  title: "Tanks & Containers (homepage teaser)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "Services" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "image", title: "Image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "imageAlt", title: "Image alt text", type: "string" }),
    defineField({ name: "tanks", title: "Tanks", type: "array", of: [{ type: "tankItem" }], validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string", initialValue: "Learn More" }),
  ],
});
