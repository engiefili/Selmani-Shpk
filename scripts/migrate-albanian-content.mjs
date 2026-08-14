// One-off migration script: pushes Albanian ("sq") counterparts of every
// singleton page and service section into Sanity, based on the
// translated copy Gigi supplied from the Figma design.
//
// Strategy: for each document, fetch the existing English document,
// then build a new document that reuses the SAME images/assets but
// with Albanian text overlaid, saved under a suffixed _id (e.g.
// "homePage_sq") with language: "sq". See src/lib/locale.ts for how
// the site picks between the two at request time.
//
// A couple of long paragraph descriptions (Services page, Technology
// page, Industries page) are my own faithful Albanian translation of
// the known English source rather than a pixel-transcription of the
// screenshots, since those paragraphs were too small to transcribe
// with full confidence — worth a proofread pass in Studio.
//
// Two things are still left in English on purpose, matching the Figma
// file exactly: the footer's "© 2026 — Copyright / All rights
// reserved" line, and the Technology page's "Technical Data" tab
// (zinc bath dimensions / temperature spec sheet).
//
// Run with:  node --env-file=.env.local scripts/migrate-albanian-content.mjs

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN.\n" +
      "Run this with: node --env-file=.env.local scripts/migrate-albanian-content.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function key() {
  return crypto.randomUUID();
}

// Overlays Albanian text onto a fetched English "content" blocks array
// (textBlock / featureGridBlock / linkListBlock / accordionGroupBlock),
// preserving _key and image/icon references untouched.
function translateContent(enContent, translations) {
  return enContent.map((block, i) => {
    const t = translations[i];
    if (block._type === "textBlock") {
      return { ...block, text: t };
    }
    if (block._type === "featureGridBlock") {
      return {
        ...block,
        ...(t.heading !== undefined ? { heading: t.heading } : {}),
        items: block.items.map((item, j) => ({ ...item, label: t.items[j] })),
      };
    }
    if (block._type === "linkListBlock") {
      return {
        ...block,
        ...(t.heading !== undefined ? { heading: t.heading } : {}),
        items: t.items,
      };
    }
    if (block._type === "accordionGroupBlock") {
      return {
        ...block,
        items: block.items.map((group, j) => ({
          ...group,
          title: t.items[j].title,
          items: group.items.map((item, k) => ({
            ...item,
            label: t.items[j].items[k],
          })),
        })),
      };
    }
    return block;
  });
}

async function fetchDoc(id) {
  const doc = await client.fetch(`*[_id == $id][0]`, { id });
  if (!doc) throw new Error(`Could not find English document "${id}" — run the earlier migrations first.`);
  return doc;
}

async function upsert(doc) {
  await client.createOrReplace(doc);
  console.log(`  upserted ${doc._id}`);
}

// ---------------------------------------------------------------------
// siteSettings_sq
// ---------------------------------------------------------------------
async function migrateSiteSettings() {
  const en = await fetchDoc("siteSettings");

  const navLabels = {
    "/about": "Rreth Nesh",
    "/services": "Shërbime & Produkte",
    "/technology": "Teknologjia",
    "/industries": "Industritë",
    "/projects": "Projekte",
  };
  const dropdownLabels = {
    "/services#hot-dip-galvanizing": "Zinkim në të Nxehtë",
    "/services#metal-constructions": "Konstruksione Metalike",
    "/services#tanks-containers": "Depozita & Kontenier",
  };

  const doc = {
    ...en,
    _id: "siteSettings_sq",
    language: "sq",
    navLinks: en.navLinks.map((link) => ({
      ...link,
      label: navLabels[link.href] ?? link.label,
      dropdown: link.dropdown?.map((item) => ({
        ...item,
        label: dropdownLabels[item.href] ?? item.label,
      })),
    })),
    contactCtaLabel: "Na kontaktoni",
    languageSwitcherLabel: "EN",
    footerCatalogRow1: [
      { _type: "footerCatalogLink", _key: key(), label: "Rreth Nesh", href: "/about" },
      { _type: "footerCatalogLink", _key: key(), label: "Shërbime & Produkte" },
      { _type: "footerCatalogLink", _key: key(), label: "Industritë" },
    ],
    footerCatalogRow2: [
      { _type: "footerCatalogLink", _key: key(), label: "Teknologjia" },
      { _type: "footerCatalogLink", _key: key(), label: "Klientët" },
      { _type: "footerCatalogLink", _key: key(), label: "Galeria" },
    ],
    headquartersLabel: "Zyrat Qendrore",
    // phone / email / address / social / map: kept identical to the
    // English document — these are facts, not translated copy, and
    // the Figma mockup's numbers were placeholder/lorem content.
  };
  await upsert(doc);
}

// ---------------------------------------------------------------------
// contactPage_sq
// ---------------------------------------------------------------------
async function migrateContactPage() {
  const doc = {
    _id: "contactPage_sq",
    _type: "contactPage",
    heroHeading: "Na dërgoni\nnjë mesazh",
    heroSubtext:
      "Bashkëpunoni me ne për zgjidhje të avancuara në zinkim, ekspertizë teknike dhe marrëdhënie afatgjata partneriteti.",
  };
  await upsert(doc);
}

// ---------------------------------------------------------------------
// homePage_sq
// ---------------------------------------------------------------------
async function migrateHomePage() {
  const en = await fetchDoc("homePage");

  const doc = {
    _id: "homePage_sq",
    _type: "homePage",
    language: "sq",
    hero: {
      ...en.hero,
      heading: "Struktura më të forta.\nMbrojtje më afatgjatë.",
      subheading:
        "Nga ideja te realizimi, ndërtojmë dhe zinkojmë struktura që i rezistojnë kohës.",
      certifications: en.hero.certifications.map((c) => ({ ...c, line1: "Certifikuar" })),
      ctaLabel: "Zbuloni punimet tona",
    },
    aboutUs: {
      ...en.aboutUs,
      eyebrow: "Rreth nesh",
      text: "Me mbi 25 vite përvojë në zinkimin industrial dhe konstruksionet e çelikut, ofrojmë zgjidhje për sektorin civil, industrial dhe të infrastrukturës, brenda dhe jashtë vendit.",
    },
    hotDipGalvanizing: {
      ...en.hotDipGalvanizing,
      eyebrow: "Shërbime",
      title: "Zinkim në të Nxehtë",
      beforeLabel: "E zinkuar",
      afterLabel: "E pazinkuar",
      benefits: [
        { _key: key(), title: "Kursen kohë", description: "Teknologjia e zinkimit me zhytje (HDG) ofron mbrojtjen më efikase kundër korrozionit, përtej çdo metode tjetër trajtimi apo veshjeje." },
        { _key: key(), title: "Mbron Mjedisin", description: "Teknologjia e zinkimit me zhytje (HDG) ofron mbrojtjen më efikase kundër korrozionit, përtej çdo metode tjetër trajtimi apo veshjeje." },
        { _key: key(), title: "Përparësi ekonomike", description: "Teknologjia e zinkimit me zhytje (HDG) ofron mbrojtjen më efikase kundër korrozionit, përtej çdo metode tjetër trajtimi apo veshjeje." },
        { _key: key(), title: "Qëndrueshmëri konstruktive", description: "Teknologjia e zinkimit me zhytje (HDG) ofron mbrojtjen më efikase kundër korrozionit, përtej çdo metode tjetër trajtimi apo veshjeje." },
      ],
      ctaLabel: "Mëso më shumë",
    },
    metallicConstructions: {
      ...en.metallicConstructions,
      eyebrow: "Shërbime",
      title: "Konstruksione Metalike",
      services: [
        { _key: key(), title: "Struktura Telekomunikacioni", industries: "GSM & Transmetim", icon: en.metallicConstructions.services[0]?.icon },
        { _key: key(), title: "Platforma Metalike", industries: "Facilitete Industriale", icon: en.metallicConstructions.services[1]?.icon },
        { _key: key(), title: "Punime Metalike Civile", industries: "Konstruksione Publike & Private", icon: en.metallicConstructions.services[2]?.icon },
        { _key: key(), title: "Depozita Procesi", industries: "Sisteme Uji, Karburanti dhe HVAC", icon: en.metallicConstructions.services[3]?.icon },
        { _key: key(), title: "Konstruksione Metalike Industriale", industries: "Prodhim & Përpunim", icon: en.metallicConstructions.services[4]?.icon },
      ],
      description: "Shoqëria jonë ofron konstruksione për ndërtime të ndryshme civile sipas kërkesave tuaja.",
      ctaLabel: "Mëso më shumë",
    },
    tanksShowcase: {
      ...en.tanksShowcase,
      eyebrow: "Shërbime",
      title: "Depozita & Kontejnerë për Përdorime të Ndryshme",
      tanks: [
        { _key: key(), title: "Depozita Uji të Zinkuara", description: "Realizojmë gjithashtu depozita uji me porosi, sipas kërkesave të klientit, me gjeometri të ndryshme në funksion të vendit të instalimit." },
        { _key: key(), title: "Depozita Karburanti", description: "Depozita për karburante deri në 20.000 L, me regjim statik, të cilat mund të qëndrojnë mbi sipërfaqe apo nën të. Autocisterna deri në 10.000 L." },
        { _key: key(), title: "Enë Inoksi", description: "Enë dhe depozita inox për industrinë ushqimore, me forma dhe vëllime të ndryshme (kontenitorë, përzierës, etj.)." },
        { _key: key(), title: "Akumulatorë dhe Shkëmbyes Nxehtësie", description: "Akumulatorë për impiantet e kondicionimit (ngrohje-ftohje qendrore). Shkëmbyes nxehtësie (bojler) me 1, 2 ose 3 bateri shkëmbimi nxehtësie." },
      ],
      ctaLabel: "Mëso më shumë",
    },
  };
  await upsert(doc);
}

// ---------------------------------------------------------------------
// aboutPage_sq
// ---------------------------------------------------------------------
async function migrateAboutPage() {
  const en = await fetchDoc("aboutPage");

  const doc = {
    _id: "aboutPage_sq",
    _type: "aboutPage",
    language: "sq",
    hero: {
      ...en.hero,
      heading: "Fillimet tona",
      intro: "E themeluar në vitin 1994, SELMANI IMP-EXP nisi aktivitetin si distributor me shumicë i materialeve të ndërtimit, duke krijuar shumë shpejt një reputacion të bazuar te korrektësia dhe besueshmëria. Gjatë dekadave, fokusi ynë te partneritetet afatgjata ka nxitur zgjerimin industrial të kompanisë. Sot, falë përkushtimit profesional dhe standardit të lartë të shërbimit, kemi ndërtuar një portofol të konsoliduar klientësh që na pozicionon si partner të besuar për kompani lider në Shqipëri dhe jashtë saj, në sektorët e ndërtimit, industrisë dhe infrastrukturës.",
      journeyHeading: "Çdo hap i historisë sonë pasqyron vlerat dhe parimet që na kanë udhëhequr që nga dita e parë.",
      journeyPoints: [
        "Çdo gjë nisi në vitin 1994, kur fituam për herë të parë besimin e klientëve përmes një premtimi të thjeshtë për cilësi.",
        "Në vitin 1998, hodhëm hapin tonë të parë të madh, duke realizuar një investim të rëndësishëm për të arritur edhe më shumë.",
        "Viti 2000 shënoi rritjen tonë, ndërsa zgjeruam kapacitetet për t'iu shërbyer projekteve tuaja me saktësi.",
        "Sot, e vazhdojmë këtë rrugëtim duke ndërthurur teknologjinë e avancuar me mbi 30 vite punë të palodhur dhe pasion.",
      ],
    },
    valuesGrid: {
      values: [
        {
          _key: key(),
          title: "Fokusuar në Cilësi dhe Performancë",
          description: "Ne investojmë vazhdimisht në zhvillimin e kapaciteteve, teknologjive dhe proceseve tona për të prodhuar rezultate të qëndrueshme dhe me standarde të larta cilësie. Falë një organizimi efikas të punës, pajisjeve moderne me kapacitet të lartë dhe një ekipi teknik me eksperiencë, ne ofrojmë zgjidhje të besueshme për projekte të çdo madhësie.",
          image: en.valuesGrid.values[0]?.image,
        },
        {
          _key: key(),
          title: "Partneritete të Orientuara drejt Klientit",
          description: "Nga faza e konsultimit deri në përmbushjen e projektit, ne garantojmë komunikim transparent, përkushtim të vazhdueshëm dhe asistencë teknike profesionale.",
        },
        {
          _key: key(),
          title: "Të Orientuar drejt Qëndrueshmërisë",
          description: "Duke kombinuar teknologjinë moderne të zinkimit me eksperiencën tonë në prodhimin e konstruksioneve prej çeliku, ne krijojmë zgjidhje të projektuara për jetëgjatësi të lartë, rezistencë ndaj faktorëve atmosferikë dhe kushteve të kërkesës së lartë industriale.",
          image: en.valuesGrid.values[2]?.image,
        },
      ],
    },
    servicesBand: {
      ...en.servicesBand,
      eyebrow: "Shërbime",
      heading: "Jemi të specializuar në proceset e zinkimit dhe realizimin e konstruksioneve prej çeliku për sektorët e ndërtimit civil, industrisë dhe infrastrukturës.",
      intro: "Ofrojmë zgjidhje metalike me kapacitet të lartë dhe precizion inxhinierik për projekte në Shqipëri dhe më gjerë.",
      bullets: [
        { _key: key(), label: "Zinkim në të nxehtë", description: "Mbrojtje superiore dhe afatgjatë kundër korrozionit." },
        { _key: key(), label: "Konstruksione metalike", description: "Ekspertizë në realizimin e strukturave civile dhe industriale." },
        { _key: key(), label: "Produkte të personalizuara", description: "Depozita dhe komponentë strukturorë të projektuar me saktësi sipas kërkesave." },
      ],
      ctaLabel: "Zbulo Shërbimet",
    },
    clientsGrid: {
      heading: "Klientë & Kontraktorë",
      clients: [
        "Kontraktorë GSM",
        "Kontraktorë Ndërtimi / Kontraktorë Veprash Civile (Publike)",
        "Ndërtues / Kontraktorë Veprash Industriale",
        "Ente Shtetërore (Publike)",
        "Klientë Familjarë",
      ],
    },
    commitmentGrid: {
      heading: "Përkushtimi Ynë ndaj Klientëve",
      intro: "Çdo bashkëpunim përfaqëson një partneritet afatgjatë të bazuar në:",
      commitments: [
        { _key: key(), label: "Besim Reciprok", icon: en.commitmentGrid.commitments[0]?.icon },
        { _key: key(), label: "Zgjidhje Teknike të Personalizuara", icon: en.commitmentGrid.commitments[1]?.icon },
        { _key: key(), label: "Standarde të Larta Shërbimi", icon: en.commitmentGrid.commitments[2]?.icon },
        { _key: key(), label: "Asistencë Profesionale nga Faza e Projektimit deri në Realizimin Përfundimtar", icon: en.commitmentGrid.commitments[3]?.icon },
      ],
    },
  };
  await upsert(doc);
}

// ---------------------------------------------------------------------
// industriesPage_sq
// ---------------------------------------------------------------------
async function migrateIndustriesPage() {
  const en = await fetchDoc("industriesPage");

  const sectionText = [
    {
      title: "Telekomunikacion & Transmetim",
      description: "Ne projektojmë dhe prodhojmë struktura metalike të zinkuara për kontraktorë GSM dhe projekte të transmetimit të sinjalit, që kërkojnë mbrojtje afatgjatë ndaj korrozionit.",
      applications: [
        "Kulla transmetimi GSM",
        "Bazamente dhe mbështetëse për antena",
        "Struktura mbështetëse për pajisje dhe kabllo",
        "Instalime urbane dhe në çati",
        "Struktura mbështetëse për kabllo sinjali dhe energjie",
      ],
      closing: "Zinkimi i strukturave tona metalike siguron mbrojtje ndaj korrozionit, ekspozimit ndaj erës dhe lagështisë, duke garantuar jetëgjatësi të lartë për infrastrukturën e telekomunikacionit.",
    },
    {
      title: "Konstruksione Metalike Civile",
      description: "Konstruksionet tona metalike përdoren gjerësisht në projekte ndërtimi publike dhe private. Bashkëpunojmë me kontraktorë dhe partnerë ndërtimi për konstruksione metalike civile të qëndrueshme dhe elemente mbrojtëse prej çeliku.",
      applications: [
        "Sisteme rrethimi dhe porta të zinkuara",
        "Barriera sigurie dhe shkallë emergjence",
        "Grila kullimi dhe platforma aksesi",
        "Struktura të jashtme të zinkuara",
      ],
      closing: undefined,
    },
    {
      title: "Fabrikim dhe Konstruksione Metalike Industriale",
      description: undefined,
      applications: [
        "Platforma metalike industriale",
        "Korniza dhe struktura mbështetëse",
        "Komponentë të specializuar të prodhuar sipas kërkesave",
        "Montime të mëdha strukturore",
      ],
      closing: undefined,
    },
    {
      title: "Infrastrukturë & Punime Publike",
      description: "Shërbime zinkimi afatgjata dhe zinkim industrial për ura, shërbime publike, infrastrukturë urbane dhe institucione publike në të gjithë Shqipërinë.",
      applications: [
        "Elemente strukturore për ambiente të jashtme",
        "Komponentë metalikë për projekte infrastrukturore publike",
        "Sisteme mbrojtjeje afatgjatë ndaj korrozionit",
      ],
      closing: undefined,
    },
    {
      title: "Projekte të Personalizuara dhe Private",
      description: "Nëse kërkoni një zgjidhje më specifike, ne ofrojmë shërbime metalike profesionale për aplikime të personalizuara, të përshtatura sipas kërkesave teknike.",
      applications: [
        "Konstruksione metalike sipas kërkesave të klientit",
        "Rezervuarë uji të personalizuar sipas specifikimeve teknike",
        "Struktura metalike të prodhuara me porosi",
      ],
      closing: undefined,
    },
  ];

  const doc = {
    _id: "industriesPage_sq",
    _type: "industriesPage",
    language: "sq",
    heroTitle: "Industritë\nqë Shërbejmë",
    heroDescription:
      "Ofrojmë zinkim me zhytje me kapacitet të lartë për komponentë strukturorë dhe industrialë prej çeliku, duke garantuar mbrojtje afatgjatë kundër korrozionit dhe performancë të qëndrueshme për projekte civile, industriale dhe të infrastrukturës.",
    heroImage: en.heroImage,
    heroImageAlt: en.heroImageAlt,
    sections: en.sections.map((s, i) => ({
      _key: s._key,
      _type: "industrySectionItem",
      sectionId: s.sectionId,
      eyebrow: "Industritë",
      title: sectionText[i].title,
      description: sectionText[i].description,
      applications: sectionText[i].applications,
      closing: sectionText[i].closing,
      image: s.image,
      imageAlt: s.imageAlt,
      imagePosition: s.imagePosition,
    })),
  };
  await upsert(doc);
}

// ---------------------------------------------------------------------
// projectsPage_sq — same galleries, translated labels only
// ---------------------------------------------------------------------
async function migrateProjectsPage() {
  const en = await fetchDoc("projectsPage");

  const tabLabels = {
    "hot-dip-galvanising": "Zinkim në të Nxehtë",
    "metal-constructions": "Konstruksione Metalike",
    "tanks-containers": "Depozita & Kontenier",
  };
  const subLabels = {
    "Civil Construction": "Ndërtim Civil",
    "Industrial Construction": "Ndërtim Industrial",
  };

  const doc = {
    _id: "projectsPage_sq",
    _type: "projectsPage",
    language: "sq",
    heroTitle: "Projekte",
    heroImage: en.heroImage,
    heroImageAlt: en.heroImageAlt,
    tabs: en.tabs.map((tab) => ({
      ...tab,
      label: tabLabels[tab.tabId.current] ?? tab.label,
      groups: tab.groups.map((group) => ({
        ...group,
        subLabel: group.subLabel ? subLabels[group.subLabel] ?? group.subLabel : group.subLabel,
      })),
    })),
  };
  await upsert(doc);
}

// ---------------------------------------------------------------------
// service documents (_sq)
// ---------------------------------------------------------------------
async function migrateServiceHotDipGalvanizing() {
  const en = await fetchDoc("service-services-hot-dip-galvanizing");
  const doc = {
    ...en,
    _id: "service-services-hot-dip-galvanizing_sq",
    language: "sq",
    eyebrow: "Shërbime dhe Produkte",
    title: "Zinkim në të Nxehtë",
    description: "Ofrojmë zinkim me zhytje me kapacitet të lartë për komponentë strukturorë dhe industrialë prej çeliku, duke garantuar mbrojtje afatgjatë kundër korrozionit dhe performancë të qëndrueshme për projekte civile, industriale dhe të infrastrukturës.",
    pdfLabel: "Dokument Teknik PDF",
    tabs: [
      {
        ...en.tabs[0],
        label: "Aplikimet",
        content: translateContent(en.tabs[0].content, [
          "Zinkimi në të nxehtë është i përshtatshëm për një gamë të gjerë komponentësh strukturorë dhe industrialë prej çeliku.",
          { items: ["Korniza strukturore prej çeliku", "Kulla transmetimi dhe shtylla metalike", "Platforma pune dhe kalime industriale", "Sisteme rrethimi dhe porta", "Shkallë dhe grila metalike", "Rezervuarë dhe komponentë të rëndë metali"] },
        ]),
      },
      {
        ...en.tabs[1],
        label: "Avantazhet",
        content: translateContent(en.tabs[1].content, [
          "Shërbimi ynë i zinkimit në të nxehtë siguron:",
          { items: ["Mbrojtje afatgjatë ndaj korrozionit", "Reduktim i kostove të mirëmbajtjes", "Veshje uniforme e sipërfaqeve të brendshme dhe të jashtme", "Qëndrueshmëri e lartë në ambiente të jashtme dhe agresive", "Performancë e besueshme për projekte infrastrukturore dhe industriale"] },
        ]),
      },
    ],
  };
  await upsert(doc);
}

async function migrateServiceMetalConstructions() {
  const en = await fetchDoc("service-services-metal-constructions");
  const doc = {
    ...en,
    _id: "service-services-metal-constructions_sq",
    language: "sq",
    eyebrow: "Shërbime dhe Produkte",
    title: "Konstruksione Metalike",
    description: "Që nga viti 1998, produktet dhe shërbimet tona janë prezente, të testuara dhe të vlerësuara në tregun shqiptar të ndërtimit dhe industrisë. Falë përvojës së gjerë, teknologjisë moderne dhe integrimit me zinkimin në të nxehtë, ofrojmë struktura çeliku me qëndrueshmëri të lartë, siguri strukturore dhe performancë afatgjatë.",
    pdfLabel: "Dokument Teknik PDF",
    tabs: [
      {
        ...en.tabs[0],
        label: "Punime Civile",
        content: translateContent(en.tabs[0].content, [
          {
            items: [
              {
                title: "Struktura Metalike për Telekomunikacion dhe Transmetim",
                items: ["Kulla të zinkuara me bulona të çmontueshme për transmetim", "Suporte për antena MW dhe RF", "Bazamente për njësi transmetimi në forma dhe dimensione të ndryshme", "Mbrojtëse akulli për pajisjet dhe njësitë e transmetimit", "Struktura mbështetëse për kabllo sinjali dhe linja energjie", "Antena me shtylla të montuara në çati", "Antena për transmetim radio dhe hotspot interneti wireless"],
              },
              {
                title: "Produkte Metalike për Konstruksione Civile",
                items: ["Shkallë emergjence të zinkuara (të drejta dhe spirale)", "Gardhe të zinkuara modulare standarde dhe të personalizuara", "Porta rrëshqitëse ose me hapje të zinkuara (manuale ose automatike)", "Grila kullimi prej çeliku në kapacitete dhe përmasa të ndryshme", "Barriera arkitektonike të zinkuara", "Rezervuarë akumulimi për sisteme HVAC, shkëmbyes nxehtësie dhe kaldaja", "Sera metalike të zinkuara për përdorim afatgjatë"],
              },
            ],
          },
        ]),
      },
      {
        ...en.tabs[1],
        label: "Punime Industriale",
        content: translateContent(en.tabs[1].content, [
          { items: ["Kulla me strukturë rrjetë (lattice) për GSM dhe linja transmetimi (tension mesatar/të lartë)", "Korniza dhe struktura mbajtëse", "Struktura mbështetëse për antena dhe bazamente pajisjesh transmetimi", "Struktura mbështetëse për kabllo", "Platforma shërbimi për impiante industriale", "Kalime dhe platforma aksesi për operimet e impiantit", "Struktura mbështetëse të rënda për pajisje industriale"] },
        ]),
      },
    ],
  };
  await upsert(doc);
}

async function migrateServiceTanksContainers() {
  const en = await fetchDoc("service-services-tanks-containers");
  const doc = {
    ...en,
    _id: "service-services-tanks-containers_sq",
    language: "sq",
    eyebrow: "Shërbime dhe Produkte",
    title: "Depozita & Kontejnerë",
    description: "Prodhojmë depozita të zinkuara dhe prej inoksi për ujë, karburant dhe sisteme industriale, të disponueshme në kapacitete standarde ose konfigurime të personalizuara.",
    pdfLabel: "Dokument Teknik PDF",
    tabs: [
      {
        ...en.tabs[0],
        label: "Ujë",
        content: translateContent(en.tabs[0].content, [
          "Depozita Uji",
          "Depozita uji të zinkuara, të projektuara për përdorim rezidencial, bujqësor dhe industrial.",
          { heading: "Kapacitetet tipike:", items: ["500 – 5.000 L (modele standarde)", "Vëllime më të mëdha të disponueshme sipas kërkesës"] },
          { heading: "Veçoritë kryesore:", items: ["Shtresë zinku rezistente ndaj korrozionit", "Dizajn strukturor i përforcuar për stabilitet", "Instalim dhe mirëmbajtje e lehtë"] },
          { heading: "Përdorimet:", items: ["Depozitim uji për përdorim familjar", "Sisteme ujitjeje bujqësore", "Ujë për përdorime industriale"] },
        ]),
      },
      {
        ...en.tabs[1],
        label: "Karburant",
        content: translateContent(en.tabs[1].content, [
          "Depozita Karburanti",
          "Depozita industriale për ruajtjen e karburantit, të prodhuara për përdorim mbi tokë ose të lëvizshëm.",
          { heading: "Kapacitetet tipike:", items: ["10.000 – 20.000 L", "Vëllime të personalizuara sipas kërkesës"] },
          { heading: "Konfigurimet:", items: ["Depozita statike mbi tokë", "Depozita mobile/të montuara në kamion"] },
          { heading: "Përdorimet:", items: ["Objekte industriale", "Kantiere ndërtimi", "Ruajtje karburanti bujqësor"] },
        ]),
      },
      {
        ...en.tabs[2],
        label: "Inoks",
        content: translateContent(en.tabs[2].content, [
          "Depozita dhe Enë prej Inoksi",
          "Depozita dhe enë inox të prodhuara sipas kërkesave specifike, për aplikime higjienike dhe industriale.",
          { heading: "Produktet përfshijnë:", items: ["Enë për industrinë ushqimore", "Depozita përzierjeje", "Kaldaja dhe akumulatorë HVAC", "Shkëmbyes nxehtësie"] },
          { heading: "Përdorimet:", items: ["Kapacitete të ndryshme", "Konfigurime vertikale ose horizontale", "Dizajne të projektuara sipas kërkesave"] },
        ]),
      },
    ],
  };
  await upsert(doc);
}

async function migrateServiceTechHotDip() {
  const en = await fetchDoc("service-technology-hot-dip-galvanizing");
  const doc = {
    ...en,
    _id: "service-technology-hot-dip-galvanizing_sq",
    language: "sq",
    eyebrow: "Teknologjia",
    title: "Zinkim në të Nxehtë",
    description: "Ofrojmë zinkim me zhytje me kapacitet të lartë për komponentë strukturorë dhe industrialë prej çeliku, duke garantuar mbrojtje afatgjatë kundër korrozionit dhe performancë të qëndrueshme për projekte civile, industriale dhe të infrastrukturës.",
    pdfLabel: "Dokument Teknik PDF",
    tabs: [
      {
        ...en.tabs[0],
        label: "Procesi",
        content: translateContent(en.tabs[0].content, [
          "Zinkimi në të nxehtë është i përshtatshëm për një gamë të gjerë komponentësh strukturorë dhe industrialë prej çeliku.",
          { heading: "Procesi siguron:", items: ["Mbulim të plotë të sipërfaqeve të brendshme dhe të jashtme", "Mbrojtje uniforme në të gjithë sipërfaqen", "Rezistencë afatgjatë ndaj korrozionit"] },
        ]),
      },
      {
        // Technical Data tab kept in English, matching the Figma file.
        ...en.tabs[1],
        label: "Të Dhëna Teknike",
      },
    ],
  };
  await upsert(doc);
}

async function migrateServiceSteelFabrication() {
  const en = await fetchDoc("service-technology-steel-fabrication");
  const doc = {
    ...en,
    _id: "service-technology-steel-fabrication_sq",
    language: "sq",
    eyebrow: "Teknologjia",
    title: "Fabrikim Metalik",
    description: "Nga prerja dhe formimi deri te saldimi dhe montimi strukturor, prodhojmë komponentë çeliku të projektuar posaçërisht, që integrohen pa probleme me linjën tonë të zinkimit në të nxehtë.",
    pdfLabel: "Dokument Teknik PDF",
    tabs: [
      {
        ...en.tabs[0],
        label: "Kapacitetet",
        content: translateContent(en.tabs[0].content, [
          { items: ["Prerja dhe formimi i komponentëve metalike", "Saldimi dhe montimi i strukturave metalike", "Prodhimi i strukturave metalike të personalizuara sipas kërkesave të projektit", "Integrimi me procesin e zinkimit në të nxehtë"] },
        ]),
      },
      {
        ...en.tabs[1],
        label: "Aplikimet",
        content: translateContent(en.tabs[1].content, [
          { items: ["Kulla transmetimi dhe struktura mbështetëse", "Platforma shërbimi dhe korniza industriale", "Depozita dhe komponentë strukturorë", "Elementë për konstruksione civile"] },
        ]),
      },
    ],
  };
  await upsert(doc);
}

async function run() {
  console.log("Migrating Albanian content...\n");

  console.log("Site Settings...");
  await migrateSiteSettings();

  console.log("Contact Page...");
  await migrateContactPage();

  console.log("Home Page...");
  await migrateHomePage();

  console.log("About Page...");
  await migrateAboutPage();

  console.log("Industries Page...");
  await migrateIndustriesPage();

  console.log("Projects Page...");
  await migrateProjectsPage();

  console.log("Services: Hot Dip Galvanizing...");
  await migrateServiceHotDipGalvanizing();

  console.log("Services: Metal Constructions...");
  await migrateServiceMetalConstructions();

  console.log("Services: Tanks & Containers...");
  await migrateServiceTanksContainers();

  console.log("Technology: Hot Dip Galvanizing...");
  await migrateServiceTechHotDip();

  console.log("Technology: Steel Fabrication...");
  await migrateServiceSteelFabrication();

  console.log("\nDone. Check the Studio at localhost:3000/studio — each page now has an English/Shqip pair.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
