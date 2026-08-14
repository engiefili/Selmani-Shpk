import { defineField, defineType } from "sanity";

// Singleton — see structure.ts (_id fixed to "projectsPage").
export default defineType({
  name: "projectsPage",
  title: "Projects Page",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero title", type: "string", initialValue: "Projects" }),
    defineField({ name: "heroImage", title: "Hero image", type: "image", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroImageAlt", title: "Hero image alt text", type: "string" }),
    defineField({
      name: "tabs",
      title: "Service tabs",
      type: "array",
      of: [{ type: "projectServiceTab" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Projects Page" };
    },
  },
});
