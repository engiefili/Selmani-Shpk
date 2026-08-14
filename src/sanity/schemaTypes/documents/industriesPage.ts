import { defineField, defineType } from "sanity";

// Singleton — see structure.ts (_id fixed to "industriesPage").
export default defineType({
  name: "industriesPage",
  title: "Industries Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "text",
      rows: 2,
      description: 'Line break becomes a new line, e.g. "Industries\\nWe Serve"',
      initialValue: "Industries\nWe Serve",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "heroDescription", title: "Hero description", type: "text", rows: 3 }),
    defineField({ name: "heroImage", title: "Hero image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroImageAlt", title: "Hero image alt text", type: "string" }),
    defineField({
      name: "sections",
      title: "Industry sections",
      type: "array",
      of: [{ type: "industrySectionItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Industries Page" };
    },
  },
});
