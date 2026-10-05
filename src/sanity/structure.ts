import type { StructureBuilder, StructureResolver } from "sanity/structure";

// Every singleton page is duplicated per locale via a fixed, suffixed
// _id ("homePage" / "homePage_sq") — see src/lib/locale.ts. Each pair
// is grouped under one nav item with an English and a Shqip child so
// editors can find both without the list doubling in length.
function singletonPair(S: StructureBuilder, schemaType: string, title: string) {
  return S.listItem()
    .title(title)
    .id(schemaType)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .title("English")
            .id(schemaType)
            .child(S.document().schemaType(schemaType).documentId(schemaType)),
          S.listItem()
            .title("Shqip (Albanian)")
            .id(`${schemaType}_sq`)
            .child(
              S.document()
                .schemaType(schemaType)
                .documentId(`${schemaType}_sq`)
            ),
        ])
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singletonPair(S, "homePage", "Home Page"),
      singletonPair(S, "aboutPage", "About Page"),
      singletonPair(S, "industriesPage", "Industries Page"),
      singletonPair(S, "projectsPage", "Projects Page"),
      singletonPair(S, "contactPage", "Contact Page"),
      singletonPair(S, "siteSettings", "Site Settings"),
      S.divider(),
      S.listItem()
        .title("Services page")
        .child(
          S.documentList()
            .title("Services page sections")
            .filter('_type == "service" && page == "services"')
            .apiVersion("2024-01-01")
            .params({})
        ),
      S.listItem()
        .title("Technology page")
        .child(
          S.documentList()
            .title("Technology page sections")
            .filter('_type == "service" && page == "technology"')
            .apiVersion("2024-01-01")
            .params({})
        ),
      S.listItem()
        .title("Insights (articles)")
        .child(
          S.documentTypeList("insight")
            .title("Insights")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            "service",
            "insight",
            "homePage",
            "aboutPage",
            "industriesPage",
            "projectsPage",
            "contactPage",
            "siteSettings",
          ].includes(item.getId() ?? "")
      ),
    ]);
