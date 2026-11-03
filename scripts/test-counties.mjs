import assert from "node:assert/strict";
import fs from "node:fs";
import { countyFor, countyReference } from "./county-reference.mjs";

const { source, entries, records, incorporatedSources, incorporatedEntries } = countyReference;
assert.equal(source.url, "https://www.legislation.gov.uk/ukpga/1997/23/schedule/1");
assert.equal(source.accessed, "3 November 2026");
assert.match(source.sha256, /^[a-f0-9]{64}$/);
assert.equal(Object.keys(records).length, 361, "every authority needs a reviewed reference row");
assert.equal(Object.keys(records).filter((gss) => gss.startsWith("E09")).length, 33);
assert.equal(Object.keys(records).filter((gss) => gss.startsWith("E06")).length, 63);
assert.equal(Object.keys(records).filter((gss) => gss.startsWith("E08")).length, 36);

for (const [key, evidenceSource] of Object.entries(incorporatedSources)) {
  assert.equal(new URL(evidenceSource.url).hostname, "www.legislation.gov.uk", `${key} is primary statutory evidence`);
  assert.equal(evidenceSource.retrievedFrom, `${evidenceSource.url}/data.xml`);
  assert.equal(evidenceSource.accessed, "3 November 2026");
  assert.match(evidenceSource.sha256, /^[a-f0-9]{64}$/);
}
for (const [key, entry] of Object.entries(incorporatedEntries)) {
  assert.ok(entry.county && entry.note && entry.evidence.length, `${key} records its county and derivation`);
  for (const citation of entry.evidence) {
    assert.ok(incorporatedSources[citation.source], `${key} cites a recorded statutory source`);
    assert.ok(citation.quote && citation.provision, `${key} quotes an identified provision`);
  }
}

for (const [gss, row] of Object.entries(records)) {
  assert.ok(row.county === null || (typeof row.county === "string" && row.county.trim()), `${gss} has a county or an explicit null`);
  assert.ok(row.note?.trim(), `${gss} has a decision note, including every blank`);
  assert.ok(row.entries.length, `${gss} cites the schedule`);
  for (const key of row.entries) {
    assert.ok(entries[key]?.quote && entries[key]?.paragraph, `${gss} cites a quoted schedule provision`);
  }
  if (row.incorporatedEntry) {
    const evidence = incorporatedEntries[row.incorporatedEntry];
    assert.ok(evidence, `${gss} has an incorporated county entry`);
    assert.deepEqual(row.entries, ["OtherEnglishCounties"], `${gss} follows paragraph 2(c)`);
    assert.equal(row.county, evidence.county, `${gss} county matches the incorporated legislation`);
    if (gss.startsWith("E08")) {
      assert.ok(evidence.districts.includes(row.name.replace(/^St /, "St. ")), `${gss} is named in that metropolitan county`);
    }
  } else if (gss.startsWith("E09") || (gss.startsWith("E06") && row.county !== null)) {
    assert.equal(row.entries.length, 1, `${gss} has one county assignment`);
    const statutoryCounty = entries[row.entries[0]].county;
    assert.equal(row.county, statutoryCounty?.replace(/^The /, ""), `${gss} county matches the cited schedule entry`);
  }
}
assert.equal(countyFor("E09000032"), "Greater London", "Wandsworth belongs to Greater London");
assert.equal(countyFor("E06000032"), "Bedfordshire", "Luton belongs to Bedfordshire");
assert.equal(countyFor("E09000001"), "City of London", "the City is excluded from Greater London");
assert.equal(countyFor("E06000004"), null, "the river divides Stockton between two counties");
assert.deepEqual(records.E06000004.entries, ["Durham", "North Yorkshire"]);
assert.deepEqual(Object.keys(records).filter((gss) => gss.startsWith("E") && records[gss].county === null), ["E06000004"], "only Stockton lacks a single English county");
for (const gss of ["E06000036", "E06000037", "E06000038", "E06000039", "E06000040", "E06000041"]) {
  assert.equal(countyFor(gss), "Berkshire", `${gss} remains in Berkshire despite county council abolition`);
}
for (const gss of ["E08000038", "E08000039"]) {
  assert.equal(countyFor(gss), "South Yorkshire", `${gss} belongs to South Yorkshire`);
}
assert.throws(() => countyFor("E06000999"), /County evidence missing/);

// A supplied path permits the same test to check the old committed data without
// overwriting either working registry. Normal CI checks both published copies.
const paths = process.argv[2] ? [process.argv[2]] : [
  new URL("../src/data/registry/places.json", import.meta.url),
  new URL("../public/data/registry/places.json", import.meta.url),
];
for (const file of paths) {
  const registry = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.deepEqual(Object.keys(registry).sort(), Object.keys(records).sort(), "county reference and registry cover exactly the same authorities");
  const errors = [];
  for (const [gss, place] of Object.entries(registry)) {
    assert.equal(records[gss].name, place.name, `${gss} evidence identifies the same authority`);
    if (place.county !== countyFor(gss)) {
      errors.push(`${gss} ${place.name}: ${JSON.stringify(place.county)} should be ${JSON.stringify(countyFor(gss))}`);
    }
  }
  assert.equal(errors.length, 0, `County mismatches in ${file}:\n${errors.join("\n")}`);
}
console.log(`County checks passed for all 361 records in ${paths.length} registry files, including 33 London, 63 English unitary and 36 metropolitan records.`);
