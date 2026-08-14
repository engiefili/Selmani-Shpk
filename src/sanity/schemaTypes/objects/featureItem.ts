import { defineField, defineType } from "sanity";

// A single row in a FeatureGrid or an item inside an accordion group —
// e.g. "Structural steel frames" with its small icon.
export default defineType({
  name: "featureItem",
  title: "Feature item",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description:
        "Small icon shown next to the label. Optional — items without an icon just show the label.",
    }),
  ],
  preview: {
    select: { title: "label", media: "icon" },
  },
});
