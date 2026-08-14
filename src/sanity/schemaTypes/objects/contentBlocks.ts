import { defineField, defineType } from "sanity";

// These four block types cover every content pattern used inside a
// ServiceSection tab across both the Services and Technology pages:
// a standalone paragraph, a grid of icon+label items, a simple bullet
// list, or a group of collapsible accordion panels (each containing a
// feature grid). An editor composes a tab by stacking these blocks in
// whatever order/combination matches the design.

export const textBlock = defineType({
  name: "textBlock",
  title: "Text",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      description:
        "Controls typography: Intro is the large opening paragraph, Label is a small heading like \"The process ensures:\", Title/Body are used for the Tanks & Containers style title + description pairing.",
      options: {
        list: [
          { title: "Intro paragraph", value: "intro" },
          { title: "Label / sub-heading", value: "label" },
          { title: "Title", value: "title" },
          { title: "Body", value: "body" },
        ],
      },
      initialValue: "intro",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "text", subtitle: "style" },
  },
});

export const featureGridBlock = defineType({
  name: "featureGridBlock",
  title: "Feature grid",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading (optional)",
      type: "string",
      description: 'e.g. "The process ensures:" shown above the grid.',
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "featureItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare({ title, items }) {
      return {
        title: title || "Feature grid",
        subtitle: `${items?.length ?? 0} item(s)`,
      };
    },
  },
});

export const linkListBlock = defineType({
  name: "linkListBlock",
  title: "Bullet list",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading (optional)",
      type: "string",
      description: 'e.g. "Typical capacities:" shown above the list.',
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare({ title, items }) {
      return {
        title: title || "Bullet list",
        subtitle: `${items?.length ?? 0} item(s)`,
      };
    },
  },
});

export const accordionGroupBlock = defineType({
  name: "accordionGroupBlock",
  title: "Accordion group",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Panels",
      type: "array",
      of: [
        {
          type: "object",
          name: "accordionPanel",
          fields: [
            defineField({
              name: "title",
              title: "Panel title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "featureItem" }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare({ title, items }) {
              return {
                title,
                subtitle: `${items?.length ?? 0} item(s)`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }) {
      return {
        title: "Accordion group",
        subtitle: `${items?.length ?? 0} panel(s)`,
      };
    },
  },
});
