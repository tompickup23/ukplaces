import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(siteRoot, "src", "data", "registry", "places.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const records = Object.entries(registry);
const sourceIds = ["ukelections", "ukdemographics", "aidoge", "asylumstats"];
const expectedBurnleyUrls = {
  ukelections: "https://ukelections.co.uk/seats/burnley/",
  ukdemographics: "https://ukdemographics.co.uk/places/burnley/",
  aidoge: "https://aidoge.co.uk/councils/burnley/",
  asylumstats: "https://asylumstats.co.uk/places/burnley/",
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
  assert.equal(place.wikidata, null, `${gss} has no unverified Wikidata identifier`);

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

const burnley = registry.E07000117;
assert.ok(burnley, "Burnley must be present");
for (const source of sourceIds) {
  assert.equal(burnley.coverage[source].hasPage, true, `Burnley has ${source} coverage`);
  assert.equal(burnley.coverage[source].url, expectedBurnleyUrls[source], `Burnley ${source} URL is exact`);
}

console.log(`Registry checks passed for ${records.length} places and ${urls.length} confirmed coverage URLs.`);
