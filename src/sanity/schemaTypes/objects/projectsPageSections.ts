import { defineField, defineType } from "sanity";

export const projectImageGroup = defineType({
  name: "projectImageGroup",
  title: "Image group",
  type: "object",
  fields: [
    defineField({
      name: "subLabel",
      title: "Sub-label (optional)",
      type: "string",
      description: 'e.g. "Civil Construction" / "Industrial Construction" — leave blank if this tab has just one group.',
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "subLabel", images: "images" },
    prepare({ title, images }) {
      return {
        title: title || "Image group",
        subtitle: `${images?.length ?? 0} image(s)`,
      };
    },
  },
});

export const projectServiceTab = defineType({
  name: "projectServiceTab",
  title: "Service tab",
  type: "object",
  fields: [
    defineField({
      name: "tabId",
      title: "Tab ID",
      type: "slug",
      options: { source: "label" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "label", title: "Tab label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "groups",
      title: "Image groups",
      type: "array",
      of: [{ type: "projectImageGroup" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: { select: { title: "label" } },
});
