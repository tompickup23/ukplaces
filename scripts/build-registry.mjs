import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryDir = path.join(siteRoot, "src", "data", "registry");
const outputPath = path.join(registryDir, "places.json");
const overridesPath = path.join(registryDir, "slug-overrides.json");
// Committed output of scripts/build-wikidata-lookup.mjs, so a clean checkout builds offline.
const wikidataPath = path.join(registryDir, "wikidata-by-gss.json");

const sourcePaths = {
  crosswalk: "/Users/tompickup/aidoge-site/data/shared/council_crosswalk.json",
  sisterLinks: "/Users/tompickup/aidoge-site/data/sister-links.json",
  summaries: "/Users/tompickup/aidoge-site/data/summaries",
  ukelections: "/Users/tompickup/ukelections/data/identity/council-slug-to-lad24.json",
  ukdemographics: "/Users/tompickup/ukdemographics/src/data/live/ethnic-projections.json",
  asylumstats: "/Users/tompickup/asylumstats/data/marts/uk_routes/local-route-latest.json",
  counties: "/Users/tompickup/asylumstats/src/data/live/lad-to-county.json",
  reorganisation: "/Users/tompickup/ukelections/data/geography/lancashire-unitaries.json",
  // Both committed in the food hygiene repo, so a clean checkout of it is enough.
  ukfoodhygieneLaMap: "/Users/tompickup/ukfoodhygiene/etl/la_map.csv",
  ukfoodhygieneCrosswalk: "/Users/tompickup/ukfoodhygiene/etl/current_lad25_crosswalk.csv",
};

const sourceUrls = {
  ukelections: "https://ukelections.co.uk/seats/",
  ukdemographics: "https://ukdemographics.co.uk/places/",
  aidoge: "https://aidoge.co.uk/councils/",
  asylumstats: "https://asylumstats.co.uk/places/",
  ukfoodhygiene: "https://ukfoodhygiene.co.uk/councils/",
};

const typeLabels = {
  E06: "Unitary authority",
  E07: "Non-metropolitan district",
  E08: "Metropolitan district",
  E09: "London borough",
  S12: "Council area",
  W06: "Welsh principal area",
  N09: "Northern Ireland local government district",
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

// Minimal CSV reader: comma-separated, double-quoted fields may contain commas.
function readCsv(filePath) {
  const [header, ...rows] = fs.readFileSync(filePath, "utf8").trim().split(/\r?\n/).map((line) =>
    [...line.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g)].map(([, quoted, plain]) => quoted?.replace(/""/g, "\"") ?? plain),
  );
  return rows.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ""])));
}

function slugifyPublishedName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normaliseCountyName(name) {
  return name
    .toLowerCase()
    .replace(/\bcounty council\b|\bcc\b|\bcouncil\b/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function coverage(hasPage, slug, baseUrl) {
  return hasPage
    ? { hasPage: true, slug, url: `${baseUrl}${slug}/` }
    : { hasPage: false, slug: null, url: null };
}

const crosswalk = readJson(sourcePaths.crosswalk);
const sisterLinks = readJson(sourcePaths.sisterLinks);
const ukelections = readJson(sourcePaths.ukelections);
const ukdemographics = readJson(sourcePaths.ukdemographics);
const asylumstats = readJson(sourcePaths.asylumstats);
const counties = readJson(sourcePaths.counties);
const reorganisation = readJson(sourcePaths.reorganisation);
const slugOverrides = readJson(overridesPath);
const wikidataByGss = readJson(wikidataPath);

const asylumAreas = asylumstats.areas;
if (!Array.isArray(asylumAreas) || asylumAreas.length !== 361) {
  throw new Error("The asylum source must provide exactly 361 local authorities.");
}

const crosswalkRows = Object.entries(crosswalk.councils).map(([id, row]) => ({ id, ...row }));
const crosswalkByGss = new Map();
for (const row of crosswalkRows) {
  if (!row.ons_code) continue;
  const current = crosswalkByGss.get(row.ons_code) ?? [];
  current.push(row);
  crosswalkByGss.set(row.ons_code, current);
}

const countyCouncilGssByName = new Map(
  crosswalkRows
    .filter((row) => row.class === "SC" && row.ons_code)
    .map((row) => [normaliseCountyName(row.name), row.ons_code]),
);

/**
 * UK Demographics areas indexed by published-name slug, for GSS codes that have changed.
 *
 * Coverage was resolved on the current GSS code alone, and two authorities have been
 * recoded since UK Demographics keyed its data: Sheffield is E08000019 there and
 * E08000039 in the asylum source, Barnsley E08000016 against E08000038. Both publish a
 * live page, both came back hasPage:false, and the consuming sites dropped a working
 * cross-link because of it. Falling back to the slug fixes any future recode too, not
 * just these two.
 *
 * Only unique slugs are indexed. A slug shared by two areas cannot identify either, and
 * guessing there would turn a missing link into a wrong one, which is worse.
 */
const ukdemographicsBySlug = new Map();
const ukdemographicsSlugClashes = new Set();
for (const area of Object.values(ukdemographics.areas)) {
  const slug = slugifyPublishedName(area.areaName);
  if (ukdemographicsBySlug.has(slug)) ukdemographicsSlugClashes.add(slug);
  ukdemographicsBySlug.set(slug, area);
}
for (const slug of ukdemographicsSlugClashes) ukdemographicsBySlug.delete(slug);

const ukelectionsByGss = new Map();
for (const [slug, match] of Object.entries(ukelections.map)) {
  if (!match.lad24cd || match.match_type === "fuzzy" || slug === "surrey") continue;
  if (ukelectionsByGss.has(match.lad24cd)) {
    throw new Error(`Multiple UK Elections slugs map to ${match.lad24cd}.`);
  }
  ukelectionsByGss.set(match.lad24cd, slug);
}

const aidogeByGss = new Map();
for (const row of crosswalkRows) {
  if (!row.ons_code || !sisterLinks.links[row.id]) continue;
  const summaryPath = path.join(sourcePaths.summaries, `${row.id}.json`);
  if (!fs.existsSync(summaryPath)) continue;
  const summary = readJson(summaryPath);
  if (summary.ons_code !== row.ons_code || !summary.coverage?.last_refresh) continue;
  const current = aidogeByGss.get(row.ons_code) ?? [];
  current.push({ id: row.id, row, summary });
  aidogeByGss.set(row.ons_code, current);
}

// UK Food Hygiene council pages keyed on GSS from its own join file. Its LAD24 codes
// are moved to the current code only through the repo's own committed crosswalk
// (Barnsley and Sheffield); the two port health authorities carry no GSS code.
const ukfoodhygieneCrosswalk = new Map(
  readCsv(sourcePaths.ukfoodhygieneCrosswalk).map((row) => [row.legacy_gss_code, row.current_lad_code]),
);
const ukfoodhygieneByGss = new Map();
for (const row of readCsv(sourcePaths.ukfoodhygieneLaMap)) {
  if (!row.gss_code || !row.council_slug) continue;
  const gss = ukfoodhygieneCrosswalk.get(row.gss_code) ?? row.gss_code;
  if (ukfoodhygieneByGss.has(gss)) throw new Error(`Multiple UK Food Hygiene councils map to ${gss}.`);
  ukfoodhygieneByGss.set(gss, row.council_slug);
}

const decidedModel = reorganisation.models["four-unitary"];
const reorganisationBySlug = new Map();
for (const unitary of decidedModel.unitaries) {
  for (const districtSlug of unitary.districts) {
    reorganisationBySlug.set(districtSlug, {
      status: decidedModel.status,
      note: `${unitary.name} is a working geographic label in the government-decided four-unitary model; the source records that the arrangement remains subject to a Structural Change Order.`,
      sourceUrl: reorganisation.meta.sources[1].url,
      sourceDate: reorganisation.meta.process_timeline.government_decision,
    });
  }
}

const registry = {};
const unresolvedParents = [];

for (const area of [...asylumAreas].sort((left, right) => left.areaCode.localeCompare(right.areaCode))) {
  const gss = area.areaCode;
  const defaultSlug = slugifyPublishedName(area.areaName);
  const slug = slugOverrides[gss] ?? defaultSlug;
  const type = typeLabels[gss.slice(0, 3)];
  if (!type) throw new Error(`No type label is configured for ${gss}.`);

  const crosswalkMatches = crosswalkByGss.get(gss) ?? [];
  const exactCrosswalk = crosswalkMatches.length === 1 ? crosswalkMatches[0] : null;
  const aidogeMatches = aidogeByGss.get(gss) ?? [];
  const aidogeMatch = aidogeMatches.length === 1 ? aidogeMatches[0] : null;
  const county = area.countryName === "England" ? counties.lookup[gss] ?? null : null;
  const parentGss = gss.startsWith("E07") && county
    ? countyCouncilGssByName.get(normaliseCountyName(county)) ?? null
    : null;

  if (gss.startsWith("E07") && county && !parentGss) unresolvedParents.push(`${gss} (${county})`);

  const ukeSlug = ukelectionsByGss.get(gss) ?? null;
  const ukdArea = ukdemographics.areas[gss] ?? ukdemographicsBySlug.get(defaultSlug) ?? null;
  const ukdSlug = ukdArea ? slugifyPublishedName(ukdArea.areaName) : null;
  const asylumSlug = slugifyPublishedName(area.areaName);
  const foodHygieneSlug = ukfoodhygieneByGss.get(gss) ?? null;

  registry[gss] = {
    gss,
    slug,
    name: area.areaName,
    officialName: aidogeMatch?.summary.name ?? exactCrosswalk?.name ?? area.areaName,
    type,
    country: area.countryName,
    region: area.regionName,
    county,
    parentGss,
    wikidata: wikidataByGss[gss] ?? null,
    reorganisation: reorganisationBySlug.get(slug) ?? null,
    coverage: {
      ukelections: coverage(Boolean(ukeSlug), ukeSlug, sourceUrls.ukelections),
      ukdemographics: coverage(Boolean(ukdSlug), ukdSlug, sourceUrls.ukdemographics),
      aidoge: coverage(Boolean(aidogeMatch), aidogeMatch?.id ?? null, sourceUrls.aidoge),
      asylumstats: coverage(true, asylumSlug, sourceUrls.asylumstats),
      ukfoodhygiene: coverage(Boolean(foodHygieneSlug), foodHygieneSlug, sourceUrls.ukfoodhygiene),
    },
  };
}

if (unresolvedParents.length) {
  console.warn(`Parent GSS unavailable: ${unresolvedParents.join(", ")}`);
}

fs.writeFileSync(outputPath, `${JSON.stringify(registry, null, 2)}\n`);
// The published copy that sister sites read at /data/registry/places.json.
fs.writeFileSync(path.join(siteRoot, "public", "data", "registry", "places.json"), `${JSON.stringify(registry, null, 2)}\n`);

const coverageCounts = Object.fromEntries(
  ["ukelections", "ukdemographics", "aidoge", "asylumstats", "ukfoodhygiene"].map((source) => [
    source,
    Object.values(registry).filter((place) => place.coverage[source].hasPage).length,
  ]),
);

console.table(
  Object.entries(coverageCounts).map(([source, covered]) => ({ source, covered, total: Object.keys(registry).length })),
);
console.log("Burnley coverage:", registry.E07000117.coverage);
