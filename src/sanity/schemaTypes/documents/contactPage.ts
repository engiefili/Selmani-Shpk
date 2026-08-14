import { defineField, defineType } from "sanity";

// Singleton: page-specific content for the Contact page's hero band.
// Everything else on the page (address, phone, email, socials, map)
// comes from siteSettings, since it's identical to the Footer.
export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "text",
      rows: 2,
      description: 'Line breaks are respected, e.g. "Send us a\\nmessage".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero subtext",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
