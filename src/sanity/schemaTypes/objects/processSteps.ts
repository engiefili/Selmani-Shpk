import { defineField, defineType } from "sanity";

// The "Surface Preparation Stages" step-by-step strip shown below the
// Hot Dip Galvanizing section on the Technology page.
export default defineType({
  name: "processSteps",
  title: "Process steps",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Surface Preparation Stages",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "processStep",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
            }),
          ],
          preview: {
            select: { title: "label", media: "icon" },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", steps: "steps" },
    prepare({ title, steps }) {
      return { title, subtitle: `${steps?.length ?? 0} step(s)` };
    },
  },
});
