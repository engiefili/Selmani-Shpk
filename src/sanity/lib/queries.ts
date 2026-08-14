// No projection needed: image fields are stored as {_type:"image",
// asset:{_ref:"..."}} references, and @sanity/image-url can build a
// URL straight from that reference without dereferencing the asset
// document, so a plain "give me everything" query is enough here.
//
// The "!defined(language)" clause makes English matches resilient for
// the original batch of service documents migrated before the
// language field existed — they have no "language" value stored, so
// they'd otherwise fail to match "language == 'en'".
export const servicesByPageQuery = `*[_type == "service" && page == $page && (language == $language || (!defined(language) && $language == "en"))] | order(order asc)`;

// Singleton documents are looked up by a locale-suffixed _id
// ("homePage" / "homePage_sq") passed in as $id — see
// src/lib/locale.ts and src/sanity/lib/localizedFetch.ts.
export const homePageQuery = `*[_type == "homePage" && _id == $id][0]`;

export const aboutPageQuery = `*[_type == "aboutPage" && _id == $id][0]`;

export const industriesPageQuery = `*[_type == "industriesPage" && _id == $id][0]`;

export const projectsPageQuery = `*[_type == "projectsPage" && _id == $id][0]`;

export const contactPageQuery = `*[_type == "contactPage" && _id == $id][0]`;

export const siteSettingsQuery = `*[_type == "siteSettings" && _id == $id][0]`;
