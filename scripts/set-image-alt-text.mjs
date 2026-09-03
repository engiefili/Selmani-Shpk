// One-time script: writes real, hand-written alt text onto every gallery
// and project-grid photo in Sanity (the images that had no per-image alt
// field until this pass — see selmani-seo-audit.md's "Alt-Text Audit"
// section for the full writeup of why these were missing).
//
// Every caption below was written after actually viewing the photo via
// the Sanity CDN — these are not generated/guessed descriptions.
//
// SETUP (one-time):
//   1. Go to sanity.io/manage -> your project -> API -> Tokens -> Add API token.
//      Name it something like "alt-text-script", role "Editor" (write access).
//   2. Copy the token and add this line to .env.local:
//        SANITY_API_WRITE_TOKEN=sk...
//      (Do NOT commit this token or paste it in chat.)
//   3. From the project root, run:
//        node --env-file=.env.local scripts/set-image-alt-text.mjs --dry-run
//      to preview every write with no changes made, then run again
//      without --dry-run to actually commit:
//        node --env-file=.env.local scripts/set-image-alt-text.mjs
//   4. If your Node version is older than 20.6, `--env-file` won't work —
//      instead run: SANITY_API_WRITE_TOKEN=sk... node scripts/set-image-alt-text.mjs
//
// Safe to re-run: every operation is a plain `set`, so running it twice
// just writes the same text again.

import { createClient } from "@sanity/client";

const DRY_RUN = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET — run this from the project root with .env.local loaded."
  );
  process.exit(1);
}
if (!token && !DRY_RUN) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN. Add it to .env.local (see the comment at the top of this file), or pass --dry-run to preview without one."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ---------------------------------------------------------------------
// Caption dictionary — one entry per unique photo (keyed by the asset's
// content hash, the first segment of its Sanity asset _ref/filename).
// Several photos appear in both a service's "gallery" strip and the
// Projects page grid as separate uploads of the same shot; they share
// a caption below on purpose.
// ---------------------------------------------------------------------
const CAPTIONS = {
  "203deefa3df3ca811b7c23f06413c012d1af28a6": {
    en: "Workers installing a galvanized steel staircase and railing on a modular container building",
    sq: "Punëtorë duke instaluar një shkallë dhe parmakë prej çeliku të zinkuar në një ndërtesë modulare kontejneri",
  },
  "bc8eebfe169f68e9f04ca969eebbef4562805f3d": {
    en: "Wire mesh baskets and steel racks staged inside the galvanizing plant before dipping",
    sq: "Shporta rrjetë teli dhe rafte çeliku të përgatitura brenda impiantit të zinkimit para zhytjes",
  },
  "55c48dd049f63ec5bfe12a46d514698603d86705": {
    en: "Rows of freshly hot-dip galvanized steel rods hanging to dry",
    sq: "Rreshta shufrash çeliku sapo të zinkuara në të nxehtë, të varura për tharje",
  },
  "2ffa29d325b3f33478c449dedc9419ac9b76a1ec": {
    en: "Worker climbing a galvanized steel access staircase inside a building stairwell",
    sq: "Punëtor duke ngjitur një shkallë çeliku të zinkuar brenda një kalimi ndërtese",
  },
  "df6f39a36bd9e75e8a961c51ebd6ab45822f2011": {
    en: "Technician hooking a wire mesh panel onto the overhead line before it enters the galvanizing bath",
    sq: "Teknik duke varur një panel rrjetë teli në linjën e sipërme para se të hyjë në banjën e zinkimit",
  },
  "abe920c95df1177a78383fb249c6f5b789828666": {
    en: "Galvanized steel emergency staircase attached to the exterior of an office building",
    sq: "Shkallë emergjence prej çeliku të zinkuar e montuar në fasadën e jashtme të një ndërtese zyrash",
  },
  "202b635988f438dfeaa3c202cda807be536b36ce": {
    en: "Steel balcony railings installed along the facade of a brick apartment building",
    sq: "Parmakë ballkoni prej çeliku të instaluar përgjatë fasadës së një pallati me tulla",
  },
  "b7be8ea4f4df7b0c9b8ccb1529f17bb33e5c8a1d": {
    en: "Tall telecommunications transmission mast under construction on-site, with a crane truck nearby",
    sq: "Shtyllë e lartë transmetimi telekomunikacioni në ndërtim e sipër, me një kamion vinç pranë",
  },
  "89d05db7a4fe512c8176bbc99fe2b59f53b8f8bc": {
    en: "Yellow-painted steel staircase inside a concrete-framed industrial building",
    sq: "Shkallë prej çeliku e lyer në të verdhë brenda një ndërtese industriale me strukturë betoni",
  },
  "e7f1e364e47d318819068b5510c7119f8904ea4d": {
    en: "View up through the steel lattice framework of a transmission tower",
    sq: "Pamje nga poshtë përmes strukturës rrjetore prej çeliku të një kulle transmetimi",
  },
  "8d091acb6afd833794348cbd90bfa2a36fe1eb7b": {
    en: "Vertical galvanized steel storage vessel with a flanged side connection",
    sq: "Enë vertikale ruajtjeje prej çeliku të zinkuar me lidhje anësore me fllanxhë",
  },
  "deb2901f35f94060cc0bcf5bf570492049e06f84": {
    en: "Angular galvanized steel tank with a hinged lid, staged in the fabrication yard",
    sq: "Depozitë këndore prej çeliku të zinkuar me kapak me menteshë, e vendosur në oborrin e prodhimit",
  },
  "d5586c057c7396c407d83df083acc468d26cc948": {
    en: "Horizontal stainless steel tank with multiple flange fittings, delivered on-site",
    sq: "Depozitë horizontale inoksi me disa lidhje fllanxhe, e dorëzuar në terren",
  },
  "a791db04dd6c92bfe5a8e56c2ea7f72206dd778b": {
    en: "Stainless steel tank end-plates laid out during fabrication",
    sq: "Kapakë anësorë inoksi për depozita, të shtruar gjatë procesit të prodhimit",
  },
  "d8b1908c6ec311e85c345db653bc93beeabe4f01": {
    en: "Polished horizontal stainless steel tank with top-mounted flange fittings",
    sq: "Depozitë horizontale inoksi e lëmuar me lidhje fllanxhe të montuara sipër",
  },
  "3f36e097c4f27d32c18e2bd2a4ec08b8690e4331": {
    en: "Rows of freshly hot-dip galvanized steel rods hanging to dry",
    sq: "Rreshta shufrash çeliku sapo të zinkuara në të nxehtë, të varura për tharje",
  },
  "c3f382ad588dfbad49eb934ed9ad386e156657ef": {
    en: "Workers installing a galvanized steel staircase and railing on a modular container building",
    sq: "Punëtorë duke instaluar një shkallë dhe parmakë prej çeliku të zinkuar në një ndërtesë modulare kontejneri",
  },
  "3e40746b863dc2581d1095b777b1a0fcfed9d6a0": {
    en: "Wire mesh baskets and steel racks staged inside the galvanizing plant before dipping",
    sq: "Shporta rrjetë teli dhe rafte çeliku të përgatitura brenda impiantit të zinkimit para zhytjes",
  },
  "622378c01b445f16ef45e40b3546e4f1ebbfa5b8": {
    en: "Worker climbing a galvanized steel access staircase inside a building stairwell",
    sq: "Punëtor duke ngjitur një shkallë çeliku të zinkuar brenda një kalimi ndërtese",
  },
  "5e34729864f8c7735404286627d4fb4084358184": {
    en: "Technician hooking a wire mesh panel onto the overhead line before it enters the galvanizing bath",
    sq: "Teknik duke varur një panel rrjetë teli në linjën e sipërme para se të hyjë në banjën e zinkimit",
  },
  "40cea4c1a93db6d7187130626765de341a0e4315": {
    en: "Galvanized steel access staircase leading to a rooftop generator platform",
    sq: "Shkallë aksesi prej çeliku të zinkuar që të çon te platforma e gjeneratorit në çati",
  },
  "5aaff4c35fc6eaad412372ac8f7a03bde415ac97": {
    en: "Black slatted metal sliding gate and fence at a residential building entrance",
    sq: "Portë rrëshqitëse dhe gardh metalik me shirita të zinj në hyrjen e një pallati banimi",
  },
  "180f22866afb0803bd04fefd9f78c43fcf396950": {
    en: "Worker guiding a row of large galvanized cylindrical tanks along the overhead conveyor line",
    sq: "Punëtor duke drejtuar një rresht depozitash të mëdha cilindrike të zinkuara përgjatë linjës së sipërme transportuese",
  },
  "ec0d10a730c75fa3ae07e13336fa919c3b796559": {
    en: "Worker fabricating a large angled galvanized steel hopper panel in the workshop",
    sq: "Punëtor duke prodhuar një panel të madh hinke prej çeliku të zinkuar në punishte",
  },
  "64ed1957e90d62ee5bdbe079dfd5c72fa7da337d": {
    en: "Stacked galvanized steel flanges staged for shipment outdoors",
    sq: "Fllanxha çeliku të zinkuara, të stivosura jashtë gati për transport",
  },
  "2273088fb9235ac1dff997c3e184d13bf8aaa736": {
    en: "Stacked galvanized steel pipe flanges and elbow fittings",
    sq: "Fllanxha tubash dhe bërryla prej çeliku të zinkuar, të stivosura",
  },
  "93c853d8aa1d864505bc98022c2b80ad6c57cb33": {
    en: "Galvanized steel support poles fabricated with angled bends, staged in the workshop",
    sq: "Shtylla mbështetëse prej çeliku të zinkuar, të prodhuara me përkulje këndore, në punishte",
  },
  "adedba3f8cb3a3d1df2c4f30a3aaadf3873ff007": {
    en: "Galvanized steel funnel brackets bolted together in a grid assembly",
    sq: "Kllapa hinke prej çeliku të zinkuar, të bulonuara në një montim rrjetor",
  },
  "963d720d488eed680b6e9b0f0ac5a93b54f3ac92": {
    en: "Galvanized steel grating walkway and staircase on a rooftop terrace with a mountain backdrop",
    sq: "Kalim dhe shkallë me rrjetë çeliku të zinkuar në një tarracë çatie me male në sfond",
  },
  "5d128cbce8c6a3909b82a039b0deea7cf5b1e680": {
    en: "Galvanized steel mounting brackets hanging from an overhead beam before installation",
    sq: "Kllapa montimi prej çeliku të zinkuar, të varura nga një trarë i sipërm para instalimit",
  },
  "b9fdf9541c797783106fab4089e13e26788599e6": {
    en: "Galvanized steel emergency staircase attached to the exterior of an office building",
    sq: "Shkallë emergjence prej çeliku të zinkuar e montuar në fasadën e jashtme të një ndërtese zyrash",
  },
  "d967596bc24cfa55098a0b5130dcd1aa0d3ff124": {
    en: "Steel sliding gate with vertical bar fencing at an industrial site entrance",
    sq: "Portë rrëshqitëse çeliku me gardh shufrash vertikale në hyrjen e një objekti industrial",
  },
  "ee42ca4a40aa7fe5aea90d2005011649b64964fc": {
    en: "Decorative stone-patterned metal gate set into a stone perimeter wall",
    sq: "Portë metalike dekorative me motiv guri, e vendosur në një mur rrethues prej guri",
  },
  "e0ebe1f10e02884ae9d187a8c70bd3e4146a8668": {
    en: "Black lattice-pattern metal pedestrian gate at a residential pool terrace",
    sq: "Portë këmbësore metalike e zezë me motiv rrjetor, te tarraca e pishinës së një banese",
  },
  "f390c5188985ba2f661c46f906a9a68ef47627d1": {
    en: "Balcony with black metal railing overlooking a hillside townscape",
    sq: "Ballkon me parmak metalik të zi me pamje nga një qytet mbi kodër",
  },
  "94cac82ff2f65d05dbd50b6524f57fc2820b4ae2": {
    en: "Black metal safety railing enclosing a concrete stairwell during construction",
    sq: "Parmak sigurie metalik i zi që rrethon një kalim shkallësh prej betoni gjatë ndërtimit",
  },
  "dd24ad903bbb60a2c8d646b7313bf4a62c545f15": {
    en: "Louvered metal ventilation grilles set into an exterior wall",
    sq: "Grila metalike ventilimi me llamela, të vendosura në një mur të jashtëm",
  },
  "8b537a4c2d6f9dee188698041cf46f7396728154": {
    en: "Steel balcony railings installed along the facade of a brick apartment building",
    sq: "Parmakë ballkoni prej çeliku të instaluar përgjatë fasadës së një pallati me tulla",
  },
  "bd1cae2889d626156ad56ef64d2f846ef63e0df0": {
    en: "Decorative perforated metal panel with a tree-branch pattern, used as a floor grate",
    sq: "Panel metalik dekorativ i perforuar me motiv degësh peme, i përdorur si grilë dyshemeje",
  },
  "b3871a408392aeb8352787858f2d01e37e8b14c0": {
    en: "Decorative metal fence panel featuring a deer silhouette design",
    sq: "Panel gardhi metalik dekorativ me siluetën e një dreri",
  },
  "0e3f278a470f783c04a19ee6b721a266cd23dbb2": {
    en: "Black metal interior staircase railing with vertical bar spindles",
    sq: "Parmak i brendshëm shkallësh prej metali të zi me shufra vertikale",
  },
  "eb466c7fbd170218d534399ee87ae5755f7e2cb4": {
    en: "Galvanized steel pergola frame attached to a house, with a mountain view beyond",
    sq: "Strukturë pergole prej çeliku të zinkuar e montuar te një shtëpi, me pamje nga malet",
  },
  "f1895b018b66caf3bf9d8fd3d8e8d85d0171d9de": {
    en: "Black metal gabion planter boxes flanking the entrance stairs of a container building",
    sq: "Kuti gabion metalike të zeza me bimë, anash shkallëve të hyrjes së një ndërtese kontejneri",
  },
  "7734140ebf871771f3e15b612099c5caeff99c53": {
    en: "Steel balcony railings on a brick apartment building facade",
    sq: "Parmakë ballkoni prej çeliku në fasadën e një pallati me tulla",
  },
  "124d4233cfccdc8cd83e92afc7408060d9713b2c": {
    en: "Black metal staircase railing along a landscaped garden path",
    sq: "Parmak shkallësh prej metali të zi përgjatë një shtegu kopshti të gjelbëruar",
  },
  "ba1744e3e85b938889fe5cc4b02ebe15dd449083": {
    en: "Galvanized steel frame structure installed on a rooftop, hills in the background",
    sq: "Strukturë prej çeliku të zinkuar e instaluar në çati, me kodra në sfond",
  },
  "bef1cbf3fd40da22d06f6ff723ebcb074c9c395b": {
    en: "Close-up of stacked galvanized steel mounting plates",
    sq: "Pamje nga afër e pllakave të montimit prej çeliku të zinkuar, të stivosura",
  },
  "a4f0af915186379acc7a06df55f94ac63250d093": {
    en: "Stacked galvanized steel pipe elbow fittings",
    sq: "Bërryla tubash prej çeliku të zinkuar, të stivosur",
  },
  "3fa0b3b4c0942e45eba0d3555afa9ec124b26f92": {
    en: "Close-up of a perforated galvanized steel panel with rows of tube ends",
    sq: "Pamje nga afër e një paneli çeliku të zinkuar të perforuar me rreshta majash tubash",
  },
  "377f9fb9369e9e3b329fdccbe086dd9345020b67": {
    en: "Stacked galvanized steel box-section brackets",
    sq: "Kllapa çeliku të zinkuar me seksion kutie, të stivosura",
  },
  "18634df50b39bf9802a770aa678fe8f788daf1a2": {
    en: "Stacked galvanized steel hopper panels with diamond-plate tread surfaces",
    sq: "Panele hinke prej çeliku të zinkuar, të stivosura, me sipërfaqe antirrëshqitëse",
  },
  "ceaeeb9dd8151c4167561e1ca06c13026f7aeef7": {
    en: "Ornate scrollwork ironwork railing with a fresh galvanized finish",
    sq: "Parmak hekuri me punim dekorativ dhe finiturë të freskët zinku",
  },
  "25de1d5ef1205d8bfbfd733100a08e920f7386bb": {
    en: "Galvanized steel tanks and bundled steel pipes staged in the fabrication yard",
    sq: "Depozita dhe tuba çeliku të zinkuar, të grumbulluara në oborrin e prodhimit",
  },
  "67d8d4bf333bd4ce7bd4bf04acc3f7c63f9edc7d": {
    en: "Rows of galvanized welded wire mesh fence panels",
    sq: "Rreshta panelesh gardhi prej rrjetë teli të saldruar dhe të zinkuar",
  },
  "45a640f75d578e83511e6f66818533033ccc7255": {
    en: "Close-up of galvanized diamond-plate steel sheeting",
    sq: "Pamje nga afër e llamarinës prej çeliku të zinkuar me sipërfaqe antirrëshqitëse",
  },
  "99addf42238b1c8be18b20a16ccffe47e5ff6bce": {
    en: "Galvanized steel structural frame with diagonal cross-bracing",
    sq: "Strukturë çeliku të zinkuar me traversa diagonale përforcuese",
  },
  "169878a923a95fcc17477c0a28f2a064c0efee68": {
    en: "Close-up detail of ornate galvanized scrollwork ironwork",
    sq: "Detaj nga afër i një punimi dekorativ hekuri të zinkuar",
  },
  "6ec9002e3cd2fc6497ce424632c0b62e03411bad": {
    en: "Galvanized steel security grille installed at a commercial building entrance",
    sq: "Grilë sigurie prej çeliku të zinkuar e instaluar në hyrjen e një ndërtese komerciale",
  },
  "307e6f38e315ebea24ab4024123b7f61284d5421": {
    en: "Telecommunications transmission tower with antennas against a cloudy sky",
    sq: "Kullë transmetimi telekomunikacioni me antena, në sfond qielli me re",
  },
  "f668ccf306d8abf284ca1a597595222fb36cc2d2": {
    en: "View up through the steel lattice framework of a transmission tower",
    sq: "Pamje nga poshtë përmes strukturës rrjetore prej çeliku të një kulle transmetimi",
  },
  "d87773d7233adbf009461d0261bc4e84963031bb": {
    en: "Yellow-painted steel staircase inside a concrete-framed industrial building",
    sq: "Shkallë prej çeliku e lyer në të verdhë brenda një ndërtese industriale me strukturë betoni",
  },
  "7c2688449df14fe01f00df010555103e186d850b": {
    en: "Galvanized welded wire mesh perimeter fencing at an industrial facility entrance",
    sq: "Gardh rrethues me rrjetë teli të saldruar dhe të zinkuar në hyrjen e një objekti industrial",
  },
  "5d43c9eabbe84efd19e8cceedda297bc1d46cd4e": {
    en: "Row of galvanized steel mobile storage bins on caster wheels",
    sq: "Rresht kutish lëvizëse ruajtjeje prej çeliku të zinkuar, me rrota",
  },
  "e90cdcc9d05cdbd402e04506dfb3cecfbb63257e": {
    en: "Galvanized steel staircase with checker-plate treads built into a narrow stairwell",
    sq: "Shkallë prej çeliku të zinkuar me shkallare antirrëshqitëse, e ndërtuar në një kalim të ngushtë",
  },
  "cdcbebef35c5c50b5aac6385f7bcb81c8249f661": {
    en: "Galvanized steel pedestrian footbridge crossing a stream in a rural setting",
    sq: "Urë këmbësore prej çeliku të zinkuar që kalon mbi një përrua në një zonë rurale",
  },
  "a72715396501dd6c948c6f8dcffc9e75ec785d72": {
    en: "Vertical galvanized steel storage vessel with a flanged side connection",
    sq: "Enë vertikale ruajtjeje prej çeliku të zinkuar me lidhje anësore me fllanxhë",
  },
  "c7d25d499b5d90483f87e118e13215bb818ba65f": {
    en: "Angular galvanized steel tank with a hinged lid, staged in the fabrication yard",
    sq: "Depozitë këndore prej çeliku të zinkuar me kapak me menteshë, e vendosur në oborrin e prodhimit",
  },
  "05286d3a887a077a61a42ea05eb3dd0f84481072": {
    en: "Horizontal stainless steel tank with multiple flange fittings, delivered on-site",
    sq: "Depozitë horizontale inoksi me disa lidhje fllanxhe, e dorëzuar në terren",
  },
  "7e470d117b4e1087834982107cf6f60a73d6b4f7": {
    en: "Horizontal cylindrical steel tank on support legs, before finishing",
    sq: "Depozitë horizontale cilindrike prej çeliku mbi këmbë mbështetëse, para finiturës",
  },
  "5552e1ff907d53e678bb7964bbd3cce129d19882": {
    en: "Stainless steel tank end-plates laid out during fabrication",
    sq: "Kapakë anësorë inoksi për depozita, të shtruar gjatë procesit të prodhimit",
  },
  "b2cd9685ac3035d4b8be17f0f5bc314ef58f31bb": {
    en: "Polished horizontal stainless steel tank with top-mounted flange fittings",
    sq: "Depozitë horizontale inoksi e lëmuar me lidhje fllanxhe të montuara sipër",
  },
  "a048273460bf6d06e348c491dd23fddfac30270a": {
    en: "Close-up of a galvanized steel tank panel with a welded seam and mounting brackets",
    sq: "Pamje nga afër e një paneli depozite prej çeliku të zinkuar me tegel të saldruar dhe kllapa montimi",
  },
  "30671946c9d948a942f3aa0f60624a584194a1cd": {
    en: "Square galvanized steel storage tank staged in the fabrication yard",
    sq: "Depozitë katrore prej çeliku të zinkuar, e vendosur në oborrin e prodhimit",
  },
};

function altFor(hash, lang) {
  const entry = CAPTIONS[hash];
  if (!entry) throw new Error(`No caption written for asset hash ${hash}`);
  return lang === "sq" ? entry.sq : entry.en;
}

// ---------------------------------------------------------------------
// Per-document image order. Each entry is either:
//   { key: "<_key>", hash: "<asset hash>" }   -- when the array item has a _key
//   { index: N, hash: "<asset hash>" }         -- when it doesn't (older gallery items)
// ---------------------------------------------------------------------

const galleryHDG_EN = ["203deefa3df3ca811b7c23f06413c012d1af28a6","bc8eebfe169f68e9f04ca969eebbef4562805f3d","55c48dd049f63ec5bfe12a46d514698603d86705","2ffa29d325b3f33478c449dedc9419ac9b76a1ec","df6f39a36bd9e75e8a961c51ebd6ab45822f2011"];
const galleryHDG_SQ_keys = ["XuxZZDDTVvM155fmMOA6kz","XuxZZDDTVvM155fmMOA6o3","XuxZZDDTVvM155fmMOA6r7","XuxZZDDTVvM155fmMOA6uB","XuxZZDDTVvM155fmMOA6xF"];
const galleryMC = ["abe920c95df1177a78383fb249c6f5b789828666","202b635988f438dfeaa3c202cda807be536b36ce","b7be8ea4f4df7b0c9b8ccb1529f17bb33e5c8a1d","89d05db7a4fe512c8176bbc99fe2b59f53b8f8bc","e7f1e364e47d318819068b5510c7119f8904ea4d"];
const galleryTC = ["8d091acb6afd833794348cbd90bfa2a36fe1eb7b","deb2901f35f94060cc0bcf5bf570492049e06f84","d5586c057c7396c407d83df083acc468d26cc948","a791db04dd6c92bfe5a8e56c2ea7f72206dd778b","d8b1908c6ec311e85c345db653bc93beeabe4f01"];

const projTab1_keys = ["ea890a53-f2f4-4d8b-a729-573abbc2323e","c12a9dfd-0e11-4be8-b9fc-96672c903786","8ef221cc-c867-4653-a980-ead977c2e0c5","27a81164-cc1d-43a2-90b6-9501d256c5db","60131d2f-e091-47b7-81a0-7baede396c11","17c144fd-cfcc-4959-8c10-e3576e30cad3","27d0ca97-89b7-48a6-a063-2174ad1c3df1","e197f12d-d716-412a-bc79-305e70b52a94","d1228d8e-71a5-4242-bc41-a245006746c2","edcbe239-cbf0-4a21-8a97-4cd550c4d43c","27303869-b17f-4739-8854-c878e367d973","c69fbec5-2421-41e6-adc4-be577f8fa146","72813431-912f-4267-ab07-e266ecc2b46c","43dc5ce0-f3e3-4f19-888c-f9d14f35ef47","538e068c-1af2-4346-aec6-ee6d557208c0"];
const projTab1_hashes = ["c3f382ad588dfbad49eb934ed9ad386e156657ef","3e40746b863dc2581d1095b777b1a0fcfed9d6a0","3f36e097c4f27d32c18e2bd2a4ec08b8690e4331","622378c01b445f16ef45e40b3546e4f1ebbfa5b8","5e34729864f8c7735404286627d4fb4084358184","40cea4c1a93db6d7187130626765de341a0e4315","5aaff4c35fc6eaad412372ac8f7a03bde415ac97","180f22866afb0803bd04fefd9f78c43fcf396950","ec0d10a730c75fa3ae07e13336fa919c3b796559","64ed1957e90d62ee5bdbe079dfd5c72fa7da337d","2273088fb9235ac1dff997c3e184d13bf8aaa736","93c853d8aa1d864505bc98022c2b80ad6c57cb33","adedba3f8cb3a3d1df2c4f30a3aaadf3873ff007","963d720d488eed680b6e9b0f0ac5a93b54f3ac92","5d128cbce8c6a3909b82a039b0deea7cf5b1e680"];

const projTab2Civil_EN_keys = ["73cd614fc41b","2952e0ca5313","82074926cde5","41d62c22d205","3e1be27d74bd","a1396221826b","531894071b23","3d23ed22bd35","3e13c56fbd4e","749f35a9a692","50a32773aa01","9b229706c4d8","e96b30d1486c","464da5550efc","a7e218ce0786"];
const projTab2Civil_EN_hashes = ["b9fdf9541c797783106fab4089e13e26788599e6","d967596bc24cfa55098a0b5130dcd1aa0d3ff124","ee42ca4a40aa7fe5aea90d2005011649b64964fc","e0ebe1f10e02884ae9d187a8c70bd3e4146a8668","f390c5188985ba2f661c46f906a9a68ef47627d1","94cac82ff2f65d05dbd50b6524f57fc2820b4ae2","dd24ad903bbb60a2c8d646b7313bf4a62c545f15","8b537a4c2d6f9dee188698041cf46f7396728154","bd1cae2889d626156ad56ef64d2f846ef63e0df0","b3871a408392aeb8352787858f2d01e37e8b14c0","0e3f278a470f783c04a19ee6b721a266cd23dbb2","eb466c7fbd170218d534399ee87ae5755f7e2cb4","f1895b018b66caf3bf9d8fd3d8e8d85d0171d9de","7734140ebf871771f3e15b612099c5caeff99c53","124d4233cfccdc8cd83e92afc7408060d9713b2c"];

const projTab2Civil_SQ_keys = ["d0e8fdab341c","711643fde64d","876bd2bc3d64","244c90e6505b","62c8e0c41a16","97d5f404b7cd","c4e34c3a1ffc","c511d3784eeb","5d6874f53b52","81f88e258ad0","561d15433aa9","d2e46bca8bd5","ab760df43c64","a6a07ab7e690","fd85088438c8"];
const projTab2Civil_SQ_hashes = ["b9fdf9541c797783106fab4089e13e26788599e6","d967596bc24cfa55098a0b5130dcd1aa0d3ff124","124d4233cfccdc8cd83e92afc7408060d9713b2c","7734140ebf871771f3e15b612099c5caeff99c53","f1895b018b66caf3bf9d8fd3d8e8d85d0171d9de","eb466c7fbd170218d534399ee87ae5755f7e2cb4","0e3f278a470f783c04a19ee6b721a266cd23dbb2","b3871a408392aeb8352787858f2d01e37e8b14c0","bd1cae2889d626156ad56ef64d2f846ef63e0df0","8b537a4c2d6f9dee188698041cf46f7396728154","dd24ad903bbb60a2c8d646b7313bf4a62c545f15","94cac82ff2f65d05dbd50b6524f57fc2820b4ae2","f390c5188985ba2f661c46f906a9a68ef47627d1","e0ebe1f10e02884ae9d187a8c70bd3e4146a8668","ee42ca4a40aa7fe5aea90d2005011649b64964fc"];

const projTab2Ind_EN_keys = ["1b8f4bf8ded7","02d229a3af6a","5b93cb80fa99","9b1742a5877d","d488614f0127","0a24a75600ce","4f457ab62401","df8a76c31d01","15d5e680af2a","01d7688bbb40","f122df9d6bd4","2f38d490f0da","5a356179109a","5d34f7a9d54a","aed19ed629bc","091761e878ad","ff9b95f7c2e9","2fa01be12bc8","8a9fbd54d9de","2c22c14410cb"];
const projTab2Ind_EN_hashes = ["ba1744e3e85b938889fe5cc4b02ebe15dd449083","bef1cbf3fd40da22d06f6ff723ebcb074c9c395b","a4f0af915186379acc7a06df55f94ac63250d093","3fa0b3b4c0942e45eba0d3555afa9ec124b26f92","377f9fb9369e9e3b329fdccbe086dd9345020b67","18634df50b39bf9802a770aa678fe8f788daf1a2","ceaeeb9dd8151c4167561e1ca06c13026f7aeef7","25de1d5ef1205d8bfbfd733100a08e920f7386bb","67d8d4bf333bd4ce7bd4bf04acc3f7c63f9edc7d","45a640f75d578e83511e6f66818533033ccc7255","99addf42238b1c8be18b20a16ccffe47e5ff6bce","169878a923a95fcc17477c0a28f2a064c0efee68","6ec9002e3cd2fc6497ce424632c0b62e03411bad","307e6f38e315ebea24ab4024123b7f61284d5421","f668ccf306d8abf284ca1a597595222fb36cc2d2","d87773d7233adbf009461d0261bc4e84963031bb","7c2688449df14fe01f00df010555103e186d850b","5d43c9eabbe84efd19e8cceedda297bc1d46cd4e","e90cdcc9d05cdbd402e04506dfb3cecfbb63257e","cdcbebef35c5c50b5aac6385f7bcb81c8249f661"];

const projTab2Ind_SQ_keys = ["e00a8eb472b6","54f489dba19b","1d1de04931a0","724d23e779c0","8f5de12c5ed7","35c144e3f77c","d77dd39d2a69","6dc5be2037e5","cb44a2d18514","e31c62b7b457","06542e769813","b624a11699ef","457e3942c970","141b9fd6724d","b89ad5c2abd0","69781ea36b89","49757fa43441","ee402861a81a","a4c4b2b6b619","1a2ace4caced"];
const projTab2Ind_SQ_hashes = ["ba1744e3e85b938889fe5cc4b02ebe15dd449083","bef1cbf3fd40da22d06f6ff723ebcb074c9c395b","a4f0af915186379acc7a06df55f94ac63250d093","3fa0b3b4c0942e45eba0d3555afa9ec124b26f92","377f9fb9369e9e3b329fdccbe086dd9345020b67","18634df50b39bf9802a770aa678fe8f788daf1a2","ceaeeb9dd8151c4167561e1ca06c13026f7aeef7","25de1d5ef1205d8bfbfd733100a08e920f7386bb","67d8d4bf333bd4ce7bd4bf04acc3f7c63f9edc7d","45a640f75d578e83511e6f66818533033ccc7255","99addf42238b1c8be18b20a16ccffe47e5ff6bce","169878a923a95fcc17477c0a28f2a064c0efee68","6ec9002e3cd2fc6497ce424632c0b62e03411bad","307e6f38e315ebea24ab4024123b7f61284d5421","f668ccf306d8abf284ca1a597595222fb36cc2d2","d87773d7233adbf009461d0261bc4e84963031bb","7c2688449df14fe01f00df010555103e186d850b","e90cdcc9d05cdbd402e04506dfb3cecfbb63257e","cdcbebef35c5c50b5aac6385f7bcb81c8249f661","5d43c9eabbe84efd19e8cceedda297bc1d46cd4e"];

const projTab3_keys = ["b98e3607-8d0a-47e1-a011-e7adfbeeff26","412b9258-f78b-4732-9598-c960c5f046c7","d9441834-9ac1-4e7f-817a-d88b76da23d0","ae3301b7-0b08-486e-be46-d868f4b3f288","5f4d6e02-8cd7-4161-bd69-9402edb5e78b","850b72ec-95cf-4379-ab2e-454b95027dd2","41009e72-56f5-4794-9a66-6f16b4d9fe44","e1c553a3-88ef-45e8-84cb-5d4b6e2f74a0"];
const projTab3_hashes = ["a72715396501dd6c948c6f8dcffc9e75ec785d72","c7d25d499b5d90483f87e118e13215bb818ba65f","05286d3a887a077a61a42ea05eb3dd0f84481072","7e470d117b4e1087834982107cf6f60a73d6b4f7","5552e1ff907d53e678bb7964bbd3cce129d19882","b2cd9685ac3035d4b8be17f0f5bc314ef58f31bb","a048273460bf6d06e348c491dd23fddfac30270a","30671946c9d948a942f3aa0f60624a584194a1cd"];

// _key values for the tabs/groups themselves (identical between EN and SQ).
const TAB_HDG = "d61b3c06-be51-4caa-941e-167a1f51e53e";
const GROUP_HDG = "3c085607-9c48-408f-8457-d3447ccd4343";
const TAB_MC = "fa6f95a8-0eb5-44eb-98aa-428f784d3ca9";
const GROUP_MC_CIVIL = "310516bc-ff69-4ee0-ba24-82f0223bec67";
const GROUP_MC_IND = "2c56b44d-48eb-48a4-8777-bd5b53ceae2e";
const TAB_TC = "b293b907-3ecb-4f78-a25b-44c3ff8521ad";
const GROUP_TC = "6c2f0b52-742b-436e-9ffc-289d31713207";

function buildImagePatch(basePath, keys, hashes, lang) {
  const patch = {};
  keys.forEach((key, i) => {
    patch[`${basePath}[_key=="${key}"].alt`] = altFor(hashes[i], lang);
  });
  return patch;
}

function buildGalleryPatchByIndex(hashes, lang) {
  const patch = {};
  hashes.forEach((hash, i) => {
    patch[`gallery[${i}].alt`] = altFor(hash, lang);
  });
  return patch;
}

function buildGalleryPatchByKey(keys, hashes, lang) {
  const patch = {};
  keys.forEach((key, i) => {
    patch[`gallery[_key=="${key}"].alt`] = altFor(hashes[i], lang);
  });
  return patch;
}

// ---------------------------------------------------------------------
// Full list of document patches to apply.
// ---------------------------------------------------------------------
const DOC_PATCHES = [
  {
    id: "service-services-hot-dip-galvanizing",
    patch: buildGalleryPatchByIndex(galleryHDG_EN, "en"),
  },
  {
    id: "service-services-hot-dip-galvanizing_sq",
    patch: buildGalleryPatchByKey(galleryHDG_SQ_keys, galleryHDG_EN, "sq"),
  },
  {
    id: "service-services-metal-constructions",
    patch: buildGalleryPatchByIndex(galleryMC, "en"),
  },
  {
    id: "service-services-metal-constructions_sq",
    patch: buildGalleryPatchByIndex(galleryMC, "sq"),
  },
  {
    id: "service-services-tanks-containers",
    patch: buildGalleryPatchByIndex(galleryTC, "en"),
  },
  {
    id: "service-services-tanks-containers_sq",
    patch: {
      ...buildGalleryPatchByIndex(galleryTC, "sq"),
      // Also fix the three Tanks & Containers tab images that were
      // reusing English alt text on the Albanian document.
      'tabs[_key=="da9e96d3-6855-45f8-9bc3-3da225dea180"].imageAlt':
        "Depozitë uji prej çeliku inoks të zinkuar",
      'tabs[_key=="54d5c51d-1f9a-4cf0-9ed8-5b5294676be2"].imageAlt':
        "Depozitë karburanti prej çeliku, e instaluar mbi tokë",
      'tabs[_key=="c6e456e2-0298-468c-8e48-2c3cea402fb6"].imageAlt':
        "Detaj i vrimës së inspektimit të një depozite/ene prej inoksi",
    },
  },
  {
    id: "projectsPage",
    patch: {
      ...buildImagePatch(
        `tabs[_key=="${TAB_HDG}"].groups[_key=="${GROUP_HDG}"].images`,
        projTab1_keys,
        projTab1_hashes,
        "en"
      ),
      ...buildImagePatch(
        `tabs[_key=="${TAB_MC}"].groups[_key=="${GROUP_MC_CIVIL}"].images`,
        projTab2Civil_EN_keys,
        projTab2Civil_EN_hashes,
        "en"
      ),
      ...buildImagePatch(
        `tabs[_key=="${TAB_MC}"].groups[_key=="${GROUP_MC_IND}"].images`,
        projTab2Ind_EN_keys,
        projTab2Ind_EN_hashes,
        "en"
      ),
      ...buildImagePatch(
        `tabs[_key=="${TAB_TC}"].groups[_key=="${GROUP_TC}"].images`,
        projTab3_keys,
        projTab3_hashes,
        "en"
      ),
    },
  },
  {
    id: "projectsPage_sq",
    patch: {
      heroImageAlt: "Strukturë çatie prej çeliku me rrjetë diagonale",
      ...buildImagePatch(
        `tabs[_key=="${TAB_HDG}"].groups[_key=="${GROUP_HDG}"].images`,
        projTab1_keys,
        projTab1_hashes,
        "sq"
      ),
      ...buildImagePatch(
        `tabs[_key=="${TAB_MC}"].groups[_key=="${GROUP_MC_CIVIL}"].images`,
        projTab2Civil_SQ_keys,
        projTab2Civil_SQ_hashes,
        "sq"
      ),
      ...buildImagePatch(
        `tabs[_key=="${TAB_MC}"].groups[_key=="${GROUP_MC_IND}"].images`,
        projTab2Ind_SQ_keys,
        projTab2Ind_SQ_hashes,
        "sq"
      ),
      ...buildImagePatch(
        `tabs[_key=="${TAB_TC}"].groups[_key=="${GROUP_TC}"].images`,
        projTab3_keys,
        projTab3_hashes,
        "sq"
      ),
    },
  },
  {
    id: "aboutPage_sq",
    patch: { "hero.imageAlt": "Ambientet e fabrikës SELMANI" },
  },
  {
    id: "industriesPage_sq",
    patch: {
      heroImageAlt: "Struktura metalike sitash gruri në një qiell të vrenjtur",
    },
  },
];

async function run() {
  console.log(
    `${DRY_RUN ? "[DRY RUN] " : ""}Writing alt text for ${DOC_PATCHES.length} documents...\n`
  );

  for (const { id, patch } of DOC_PATCHES) {
    const fieldCount = Object.keys(patch).length;
    console.log(`- ${id}  (${fieldCount} field${fieldCount === 1 ? "" : "s"})`);

    if (DRY_RUN) {
      for (const [path, value] of Object.entries(patch)) {
        console.log(`    ${path} = ${JSON.stringify(value)}`);
      }
      continue;
    }

    try {
      await client.patch(id).set(patch).commit({ autoGenerateArrayKeys: false });
      console.log("    done");
    } catch (err) {
      console.error(`    FAILED: ${err.message}`);
    }
  }

  console.log(
    `\n${DRY_RUN ? "Dry run complete — nothing was written." : "All patches submitted."}`
  );
}

run();
