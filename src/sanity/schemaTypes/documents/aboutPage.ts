import { defineField, defineType } from "sanity";

// Singleton — see structure.ts (_id fixed to "aboutPage").
export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "hero", title: "Hero", type: "aboutHeroSection" }),
    defineField({ name: "valuesGrid", title: "Values Grid", type: "valuesGridSection" }),
    defineField({ name: "servicesBand", title: "Services Band", type: "servicesBandSection" }),
    defineField({ name: "clientsGrid", title: "Clients Grid", type: "clientsGridSection" }),
    defineField({ name: "commitmentGrid", title: "Commitment Grid", type: "commitmentGridSection" }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
