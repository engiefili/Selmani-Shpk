import { defineField, defineType } from "sanity";

// Singleton: global data shared across every page — header nav/logo,
// footer catalog links, and contact/social info reused in both the
// Footer and the Contact page's map band.
export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "navLinks",
      title: "Header nav links",
      type: "array",
      of: [{ type: "navLinkItem" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "contactCtaLabel",
      title: "Header \"Contact\" button label",
      type: "string",
      initialValue: "Contact Us",
    }),
    defineField({
      name: "languageSwitcherLabel",
      title: "Language switcher label",
      type: "string",
      description: "Text on the language toggle button in the header (e.g. \"AL\").",
      initialValue: "AL",
    }),
    defineField({
      name: "footerCatalogRow1",
      title: "Footer catalog — row 1",
      type: "array",
      of: [{ type: "footerCatalogLink" }],
    }),
    defineField({
      name: "footerCatalogRow2",
      title: "Footer catalog — row 2",
      type: "array",
      of: [{ type: "footerCatalogLink" }],
    }),
    defineField({
      name: "companyName",
      title: "Company legal name",
      type: "string",
      initialValue: "Selmani Imp-Exp sh.pk",
    }),
    defineField({
      name: "headquartersLabel",
      title: "Headquarters heading (Contact page)",
      type: "string",
      initialValue: "Headquarters",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
      ],
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
    }),
    defineField({
      name: "mapLinkUrl",
      title: "Google Maps \"view\" link URL",
      type: "url",
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright text",
      type: "string",
      initialValue: "© 2026 — Copyright",
    }),
    defineField({
      name: "rightsReservedText",
      title: "\"All rights reserved\" text",
      type: "string",
      initialValue: "All rights reserved",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
