import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const signalsDirectory = path.join(siteRoot, "src", "data", "signals");
const sourceIds = ["ukelections", "ukdemographics", "aidoge", "asylumstats", "ukfoodhygiene"];
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
      assert.doesNotMatch(String(signal.value), /\b(?:null|undefined|NaN)\b/, `${source} ${gss} value is built from present source fields`);
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
// UK Demographics crime: shape and cross-source checks rather than a pinned release figure,
// so a quarterly ONS edition passes without editing this file.
const registry = JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "registry", "places.json"), "utf8"));
const formatLongDate = (iso) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
const crimeSignals = Object.entries(feeds.ukdemographics).filter(([, signal]) => signal.value !== null);
assert.ok(crimeSignals.length > 0, "UK Demographics crime feed has signals");
const crimeSnapshots = new Set(crimeSignals.map(([, signal]) => signal.snapshotDate));
assert.equal(crimeSnapshots.size, 1, "every UK Demographics crime signal comes from one edition");
for (const [gss, signal] of crimeSignals) {
  const coverage = registry[gss]?.coverage?.ukdemographics;
  assert.ok(coverage?.hasPage, `ukdemographics ${gss} has a signal only where the registry has a page`);
  assert.equal(signal.url, coverage.url, `ukdemographics ${gss} URL matches the registry`);
  assert.equal(typeof signal.value, "number", `ukdemographics ${gss} value is a number`);
  assert.ok(signal.value > 0 && Number(signal.value.toFixed(1)) === signal.value, `ukdemographics ${gss} value is a positive one-decimal rate`);
  assert.equal(signal.unit, "per 1,000 residents");
  assert.equal(signal.label, "Total recorded crime");
  assert.match(signal.snapshotDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(signal.period, /^latest held by source: Year ending [A-Z][a-z]+ \d{4}, [^;]+; dataset updated \d{1,2} [A-Z][a-z]+ \d{4}\.$/, `ukdemographics ${gss} period names the year ending and the source`);
  assert.ok(signal.period.endsWith(`dataset updated ${formatLongDate(signal.snapshotDate)}.`), `ukdemographics ${gss} period date matches snapshotDate`);
}
// Cross-source, on this Mac only: the UK Demographics file the feed was built from. CI has
// no copy, and a local checkout of another edition is reported rather than failed.
const ukdCrimePath = process.env.UKD_CRIME_DASHBOARD ?? "/Users/tompickup/ukdemographics/src/data/live/crime-dashboard.json";
if (fs.existsSync(ukdCrimePath)) {
  const ukd = JSON.parse(fs.readFileSync(ukdCrimePath, "utf8"));
  const [feedSnapshot] = crimeSnapshots;
  if (ukd.lastUpdated === feedSnapshot) {
    for (const [gss, signal] of Object.entries(feeds.ukdemographics)) {
      const area = ukd.areas[gss];
      const expected = area && registry[gss].coverage.ukdemographics.hasPage && area.totalCrimeRate !== null ? Number(area.totalCrimeRate.toFixed(1)) : null;
      assert.equal(signal.value, expected, `ukdemographics ${gss} value matches ${ukdCrimePath}`);
    }
    console.log(`UK Demographics crime feed matches ${ukdCrimePath} for all ${Object.keys(feeds.ukdemographics).length} places.`);
  } else {
    console.warn(`Skipped the UK Demographics cross-check: ${ukdCrimePath} is the ${ukd.lastUpdated} edition, the feed is ${feedSnapshot}.`);
  }
} else {
  console.log("Skipped the UK Demographics cross-check: no local crime-dashboard.json.");
}
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

const foodBurnley = feeds.ukfoodhygiene.E07000117;
assert.match(foodBurnley.value, /^\d{1,3}\.\d%$/, "UK Food Hygiene value is a one-decimal percentage");
assert.equal(foodBurnley.unit, "%");
assert.match(foodBurnley.label, /^Businesses rated 5 out of [\d,]+ rated$/);
assert.match(foodBurnley.period, /^Official register as at \d{1,2} [A-Z][a-z]+ \d{4}\.$/);
assert.equal(foodBurnley.url, "https://ukfoodhygiene.co.uk/councils/burnley/");
for (const [gss, signal] of Object.entries(feeds.ukfoodhygiene)) {
  if (gss.startsWith("S")) assert.equal(signal.value, null, `${gss} Scottish pass/improvement scheme has no 0 to 5 share`);
}

console.log(`Signal checks passed for ${sourceIds.length} source feeds, the UK Demographics crime checks and the exact Burnley signals for the other feeds (UK Food Hygiene ${foodBurnley.value} of ${foodBurnley.label.match(/out of ([\d,]+)/)[1]} rated, ${foodBurnley.snapshotDate}).`);
