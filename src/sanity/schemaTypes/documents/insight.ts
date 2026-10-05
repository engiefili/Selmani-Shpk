import { defineArrayMember, defineField, defineType } from "sanity";

export const INSIGHT_CATEGORIES = [
  "Hot-Dip Galvanizing",
  "Engineering & Design",
  "Standards & Quality",
  "Steel Fabrication",
  "Procurement & Export",
];

// One technical/editorial article in the "Insights" section. Unlike the
// page singletons, these are a growing list — editors add a new document
// per article and it appears on /insights automatically.
export default defineType({
  name: "insight",
  title: "Insight (article)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (H1)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: 'Becomes /insights/<slug>, e.g. "en-iso-1461-galvanizing-standard".',
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: INSIGHT_CATEGORIES },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Shown on the Insights cards and as the article's intro. 1–2 sentences.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "The featured article is shown large at the top of the Insights page.",
      initialValue: false,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      description: "Photo used on the card and at the top of the article. Landscape works best.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImageAlt",
      title: "Cover image alt text",
      type: "string",
    }),
    defineField({
      name: "diagram",
      title: "Technical diagram (optional)",
      type: "image",
      description: "Shown as a figure at the start of the article body.",
    }),
    defineField({
      name: "diagramAlt",
      title: "Diagram alt text",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "string",
                    title: "URL or site path",
                    description: 'e.g. "/services#hot-dip-galvanizing" or "https://…".',
                  }),
                ],
              },
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "relatedInsights",
      title: "Related articles",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "insight" }] })],
      description: "Shown at the end of the article. 2–3 works best.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "date",
      description: 'Shown next to "Reviewed by Selmani Steel Technical Team".',
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      description: "Browser/search title. Falls back to the article title.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Search-result description. Falls back to the excerpt.",
    }),
    defineField({
      name: "keywords",
      title: "Primary keywords",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
