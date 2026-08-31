"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { resolve } from "./src/sanity/presentation/resolve";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // "Preview" tab — shows a live pane of the actual site rendering
    // your unsaved draft, side-by-side with the editing form, before
    // you publish. Studio and site share the same origin (both under
    // /studio and / on this app), so no separate preview URL/CORS
    // setup is needed.
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    // Vision lets you run GROQ queries directly in the Studio — useful
    // for debugging content while building out pages.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
