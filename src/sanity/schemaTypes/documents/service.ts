import { defineField, defineType } from "sanity";

// One ServiceSection card — e.g. "Hot Dip Galvanizing" on the Services
// page, or "Steel Fabrication" on the Technology page. Both pages use
// the exact same section layout, so one document type covers both;
// the "page" field decides which page it belongs on.
export default defineType({
  name: "service",
  title: "Service section",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Shqip (Albanian)", value: "sq" },
        ],
        layout: "radio",
      },
      initialValue: "en",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Services", value: "services" },
          { title: "Technology", value: "technology" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order on page",
      type: "number",
      description: "Lower numbers appear first.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sectionId",
      title: "Section anchor ID",
      type: "slug",
      description:
        'Used for the page URL anchor, e.g. "hot-dip-galvanizing" → /services#hot-dip-galvanizing.',
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow label",
      type: "string",
      initialValue: "Services and Products",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Default image",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageAlt",
      title: "Default image alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageFit",
      title: "Image fit",
      type: "string",
      options: {
        list: [
          { title: "Cover (fills the frame, cropped)", value: "cover" },
          { title: "Contain (whole image visible)", value: "contain" },
        ],
      },
      initialValue: "cover",
    }),
    defineField({
      name: "pdfLabel",
      title: "PDF button label",
      type: "string",
      initialValue: "PDF Technical Doc",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF file",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "tabs",
      title: "Tabs",
      type: "array",
      of: [{ type: "serviceTab" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "processSteps",
      title: "Process steps (optional)",
      type: "processSteps",
      description:
        'Only used by the Hot Dip Galvanizing section on the Technology page ("Surface Preparation Stages").',
    }),
    defineField({
      name: "gallery",
      title: "Gallery images",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description: "Shown in the \"Selected Work\" strip below this section.",
    }),
  ],
  preview: {
    select: { title: "title", page: "page", language: "language", media: "image" },
    prepare({ title, page, language, media }) {
      return { title, subtitle: `${page} · ${language || "en"}`, media };
    },
  },
});
