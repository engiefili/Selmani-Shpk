import { defineField, defineType } from "sanity";

export const aboutHeroSection = defineType({
  name: "aboutHeroSection",
  title: "About Hero",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Our beginnings" }),
    defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "image", title: "Image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "imageAlt", title: "Image alt text", type: "string" }),
    defineField({ name: "journeyHeading", title: "Journey heading", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({
      name: "journeyPoints",
      title: "Journey bullet points",
      type: "array",
      of: [{ type: "text", rows: 2 }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});

export const aboutValueItem = defineType({
  name: "aboutValueItem",
  title: "Value",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "image",
      title: "Image (optional)",
      type: "image",
      description: "Only the first and third values in the list show an image in this layout.",
    }),
  ],
  preview: { select: { title: "title", media: "image" } },
});

export const valuesGridSection = defineType({
  name: "valuesGridSection",
  title: "Values Grid",
  type: "object",
  fields: [
    defineField({
      name: "values",
      title: "Values (exactly 3, in display order)",
      type: "array",
      of: [{ type: "aboutValueItem" }],
      validation: (Rule) => Rule.required().length(3),
    }),
  ],
});

export const servicesBandBullet = defineType({
  name: "servicesBandBullet",
  title: "Bullet",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "label" } },
});

export const servicesBandSection = defineType({
  name: "servicesBandSection",
  title: "Services Band",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "Services" }),
    defineField({ name: "heading", title: "Heading", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "backgroundImage", title: "Background image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "bullets", title: "Bullets", type: "array", of: [{ type: "servicesBandBullet" }], validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string", initialValue: "Explore Services" }),
  ],
});

export const clientsGridSection = defineType({
  name: "clientsGridSection",
  title: "Clients Grid",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Clients & Contractors" }),
    defineField({
      name: "clients",
      title: "Clients",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});

export const commitmentItem = defineType({
  name: "commitmentItem",
  title: "Commitment",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "icon", title: "Icon", type: "image" }),
  ],
  preview: { select: { title: "label", media: "icon" } },
});

export const commitmentGridSection = defineType({
  name: "commitmentGridSection",
  title: "Commitment Grid",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Our Commitment to Clients" }),
    defineField({ name: "intro", title: "Intro line", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "commitments", title: "Commitments", type: "array", of: [{ type: "commitmentItem" }], validation: (Rule) => Rule.required().min(1) }),
  ],
});
