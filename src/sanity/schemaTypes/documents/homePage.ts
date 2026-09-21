import { defineField, defineType } from "sanity";

// Singleton document — there's only ever one homepage. We fix its _id
// to "homePage" (see structure.ts) so editors always land on the same
// document instead of a list.
export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "hero", title: "Hero", type: "heroSection" }),
    defineField({ name: "keyFigures", title: "Key Figures Strip", type: "keyFiguresSection" }),
    defineField({ name: "aboutUs", title: "About Us", type: "aboutUsSection" }),
    defineField({ name: "hotDipGalvanizing", title: "Hot Dip Galvanizing", type: "hotDipHomeSection" }),
    defineField({ name: "metallicConstructions", title: "Metallic Constructions", type: "metallicConstructionsSection" }),
    defineField({ name: "tanksShowcase", title: "Tanks & Containers", type: "tanksShowcaseSection" }),
    defineField({ name: "process", title: "Process", type: "homeProcessSection" }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
