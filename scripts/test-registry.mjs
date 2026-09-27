import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(siteRoot, "src", "data", "registry", "places.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const records = Object.entries(registry);
const wikidataLookup = JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "registry", "wikidata-by-gss.json"), "utf8"));
const publishedRegistry = fs.readFileSync(path.join(siteRoot, "public", "data", "registry", "places.json"), "utf8");

assert.equal(publishedRegistry, fs.readFileSync(registryPath, "utf8"), "the published registry is byte-identical to the source registry");
assert.deepEqual(Object.keys(wikidataLookup).sort(), Object.keys(registry).sort(), "the Wikidata lookup has one entry for every registry GSS code");
for (const [gss, qid] of Object.entries(wikidataLookup)) {
  if (qid !== null) assert.match(qid, /^Q\d+$/, `${gss} lookup value is a QID`);
}
const resolvedWikidata = Object.values(wikidataLookup).filter(Boolean).length;
assert.equal(resolvedWikidata, 328, "the committed Wikidata lookup resolves 328 codes to a single item");
const sourceIds = ["ukelections", "ukdemographics", "aidoge", "asylumstats", "ukfoodhygiene"];
const expectedBurnleyUrls = {
  ukelections: "https://ukelections.co.uk/seats/burnley/",
  ukdemographics: "https://ukdemographics.co.uk/places/burnley/",
  aidoge: "https://aidoge.co.uk/councils/burnley/",
  asylumstats: "https://asylumstats.co.uk/places/burnley/",
  ukfoodhygiene: "https://ukfoodhygiene.co.uk/councils/burnley/",
};

assert.equal(records.length, 361, "registry must contain every local authority");
assert.equal(new Set(records.map(([gss]) => gss)).size, records.length, "every GSS key must be unique");
assert.equal(new Set(records.map(([, place]) => place.slug)).size, records.length, "every place slug must be unique");

const urls = [];
for (const [gss, place] of records) {
  assert.equal(place.gss, gss, `${gss} must match its registry key`);
  assert.match(place.gss, /^[ESWN][0-9]{8}$/);
  assert.match(place.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(place.name && place.officialName && place.type && place.country && place.region, `${gss} has required geography`);
  assert.equal(place.wikidata, wikidataLookup[gss] ?? null, `${gss} Wikidata identifier comes from the committed lookup`);
  if (place.wikidata !== null) assert.match(place.wikidata, /^Q\d+$/, `${gss} Wikidata identifier is a QID`);

  for (const source of sourceIds) {
    const coverage = place.coverage[source];
    assert.equal(typeof coverage.hasPage, "boolean", `${gss} ${source} hasPage is boolean`);
    if (coverage.hasPage) {
      assert.ok(coverage.slug, `${gss} ${source} page has a confirmed slug`);
      assert.ok(coverage.url, `${gss} ${source} page has a URL`);
      assert.ok(coverage.url.endsWith("/"), `${gss} ${source} URL has a trailing slash`);
      urls.push(coverage.url);
    } else {
      assert.equal(coverage.slug, null, `${gss} ${source} missing page has null slug`);
      assert.equal(coverage.url, null, `${gss} ${source} missing page has null URL`);
    }
  }
}

assert.equal(new Set(urls).size, urls.length, "every confirmed coverage URL must be unique");
assert.equal(records.filter(([, place]) => place.coverage.ukfoodhygiene.hasPage).length, 361, "UK Food Hygiene covers every place");
// D10: with Asylum Stats and UK Food Hygiene on every record, no place has a single source.
assert.ok(records.every(([, place]) => sourceIds.filter((source) => place.coverage[source].hasPage).length >= 2), "every place has at least two sources");

const burnley = registry.E07000117;
assert.ok(burnley, "Burnley must be present");
for (const source of sourceIds) {
  assert.equal(burnley.coverage[source].hasPage, true, `Burnley has ${source} coverage`);
  assert.equal(burnley.coverage[source].url, expectedBurnleyUrls[source], `Burnley ${source} URL is exact`);
}

console.log(`Registry checks passed for ${records.length} places, ${urls.length} confirmed coverage URLs and ${resolvedWikidata} Wikidata identifiers.`);
