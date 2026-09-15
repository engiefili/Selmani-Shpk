import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

const client = createClient({
  projectId: "gp1cx0a9",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const dir = "/sessions/bold-optimistic-bohr/mnt/selmani-website/hero-preview-images";
const files = ["build.png", "galvanize-2.png", "last.png"];

const results = {};
for (const file of files) {
  const filePath = path.join(dir, file);
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, { filename: file });
  results[file] = asset._id;
}
console.log(JSON.stringify(results, null, 2));
