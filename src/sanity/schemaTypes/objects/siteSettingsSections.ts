import { defineField, defineType } from "sanity";

export const navDropdownItem = defineType({
  name: "navDropdownItem",
  title: "Dropdown item",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "href", title: "Link (relative path)", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const navLinkItem = defineType({
  name: "navLinkItem",
  title: "Nav link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "href", title: "Link (relative path)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "dropdown",
      title: "Dropdown items (optional)",
      type: "array",
      of: [{ type: "navDropdownItem" }],
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const footerCatalogLink = defineType({
  name: "footerCatalogLink",
  title: "Footer catalog link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "href",
      title: "Link (relative path, optional)",
      type: "string",
      description: "Leave blank if this link isn't wired up to a page yet.",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
