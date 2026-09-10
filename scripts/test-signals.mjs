import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const signalsDirectory = path.join(siteRoot, "src", "data", "signals");
const sourceIds = ["ukelections", "ukdemographics", "aidoge", "asylumstats"];
const expectedFields = ["label", "period", "snapshotDate", "unit", "url", "value"];

const feeds = Object.fromEntries(
  sourceIds.map((source) => [
    source,
    JSON.parse(fs.readFileSync(path.join(signalsDirectory, `${source}.json`), "utf8")),
  ]),
);

for (const [source, feed] of Object.entries(feeds)) {
  assert.equal(Object.keys(feed).length, 361, `${source} has one signal for every place`);
  for (const [gss, signal] of Object.entries(feed)) {
    assert.deepEqual(Object.keys(signal).sort(), expectedFields, `${source} ${gss} has exactly six signal fields`);
    if (signal.value !== null) {
      assert.ok(signal.unit && signal.label && signal.period && signal.snapshotDate && signal.url, `${source} ${gss} complete signal`);
      assert.ok(signal.url.endsWith("/"), `${source} ${gss} URL has a trailing slash`);
    }
  }
}

assert.deepEqual(feeds.ukelections.E07000117, {
  value: "Reform 11 of 45",
  unit: "seats",
  label: "No overall control",
  period: "After the 7 May 2026 election; source dataset generated 30 August 2026.",
  snapshotDate: "2026-08-30",
  url: "https://ukelections.co.uk/seats/burnley/",
});
assert.deepEqual(feeds.ukdemographics.E07000117, {
  value: 107.4,
  unit: "per 1,000 residents",
  label: "Total recorded crime",
  period: "latest held by source: Year ending March 2024; dataset updated 28 April 2026.",
  snapshotDate: "2026-04-28",
  url: "https://ukdemographics.co.uk/places/burnley/",
});
assert.deepEqual(feeds.aidoge.E07000117, {
  value: "£38,056,787",
  unit: "GBP",
  label: "Published payments",
  period: "2025/26",
  snapshotDate: "2026-09-06",
  url: "https://aidoge.co.uk/councils/burnley/",
});
assert.deepEqual(feeds.asylumstats.E07000117, {
  value: 471,
  unit: "people on support; 46.66 per 10,000",
  label: "Asylum support",
  period: "As at 30 June 2026.",
  snapshotDate: "2026-06-30",
  url: "https://asylumstats.co.uk/places/burnley/",
});

console.log("Signal checks passed for four source feeds and the exact Burnley signals.");
