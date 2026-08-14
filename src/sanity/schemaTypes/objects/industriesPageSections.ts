import { defineField, defineType } from "sanity";

export const industrySectionItem = defineType({
  name: "industrySectionItem",
  title: "Industry section",
  type: "object",
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor ID",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "Industries" }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description (optional)", type: "text", rows: 3 }),
    defineField({
      name: "applications",
      title: "Typical applications",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "closing",
      title: "Closing paragraph (optional)",
      type: "text",
      rows: 2,
      description: "Only shown when this section also has an image.",
    }),
    defineField({ name: "image", title: "Image (optional)", type: "image" }),
    defineField({ name: "imageAlt", title: "Image alt text", type: "string", hidden: ({ parent }) => !parent?.image }),
    defineField({
      name: "imagePosition",
      title: "Image position",
      type: "string",
      options: { list: [{ title: "Left", value: "left" }, { title: "Right", value: "right" }] },
      initialValue: "right",
      hidden: ({ parent }) => !parent?.image,
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
