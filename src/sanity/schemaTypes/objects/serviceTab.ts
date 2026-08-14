import { defineField, defineType } from "sanity";

// One tab within a ServiceSection (e.g. "Applications" / "Advantages").
export default defineType({
  name: "serviceTab",
  title: "Tab",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Tab label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image override (optional)",
      type: "image",
      description:
        "If set, this tab shows its own image instead of the section's default image (used by Tanks & Containers' Water/Fuel/Stainless tabs).",
    }),
    defineField({
      name: "imageAlt",
      title: "Image alt text",
      type: "string",
      hidden: ({ parent }) => !parent?.image,
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "textBlock" },
        { type: "featureGridBlock" },
        { type: "linkListBlock" },
        { type: "accordionGroupBlock" },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "label" },
  },
});
