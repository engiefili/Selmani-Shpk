import { defineLocations, type PresentationPluginOptions } from "sanity/presentation";

// Singletons are duplicated per locale via a suffixed _id
// ("homePage" / "homePage_sq" — see src/lib/locale.ts), so the
// preview link needs to detect that suffix and prefix "/al"
// accordingly, matching the site's actual routing.
function pathFor(id: string | undefined, basePath: string): string {
  const isSq = id?.endsWith("_sq") ?? false;
  const prefix = isSq ? "/al" : "";
  if (basePath === "/") return prefix || "/";
  return `${prefix}${basePath}`;
}

function singleton(title: string, basePath: string) {
  return defineLocations({
    select: { id: "_id" },
    resolve: (doc) => ({
      locations: [{ title, href: pathFor(doc?.id, basePath) }],
    }),
  });
}

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    homePage: singleton("Home Page", "/"),
    aboutPage: singleton("About Page", "/about"),
    industriesPage: singleton("Industries Page", "/industries"),
    projectsPage: singleton("Projects Page", "/projects"),
    contactPage: singleton("Contact Page", "/contact"),
    siteSettings: singleton("Site Settings", "/"),
    service: defineLocations({
      select: { id: "_id", page: "page", sectionId: "sectionId.current", title: "title" },
      resolve: (doc) => {
        const basePath = doc?.page === "technology" ? "/technology" : "/services";
        const anchor = doc?.sectionId ? `#${doc.sectionId}` : "";
        return {
          locations: [
            {
              title: doc?.title || "Service section",
              href: `${pathFor(doc?.id, basePath)}${anchor}`,
            },
          ],
        };
      },
    }),
  },
};
