import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const recordsPath = path.join(siteRoot, "src", "data", "registry", "constituencies.json");
const records = JSON.parse(fs.readFileSync(recordsPath, "utf8"));
const entries = Object.entries(records);
const dates = JSON.parse(fs.readFileSync(path.join(siteRoot, "src/data/registry/constituency-content-dates.json"), "utf8"));
const places = JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "registry", "places.json"), "utf8"));
const placeConstituencies = JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "registry", "place-constituencies.json"), "utf8"));

assert.equal(fs.readFileSync(path.join(siteRoot, "public", "data", "registry", "constituencies.json"), "utf8"), fs.readFileSync(recordsPath, "utf8"), "the published constituency registry is byte-identical to the source");
assert.equal(entries.length, 650, "registry must contain all 650 constituency records");
assert.equal(new Set(entries.map(([slug]) => slug)).size, entries.length, "every constituency slug must be unique");
assert.equal(new Set(entries.map(([, record]) => record.slug)).size, entries.length, "every record slug must be unique");

for (const [slug, record] of entries) {
  assert.equal(dates[slug]?.sha256, createHash("sha256").update(JSON.stringify(record)).digest("hex"), `${slug} content date matches its record`);
  assert.match(dates[slug].date, /^\d{4}-\d{2}-\d{2}$/, `${slug} content date is recorded`);
  assert.match(dates[slug].revision, /^[a-f0-9]{40}$/, `${slug} has a provenance commit`);
  assert.equal(record.slug, slug, `${slug} must match its registry key`);
  assert.ok(record.name, `${slug} has a name`);
  assert.ok(Array.isArray(record.lad24cds), `${slug} keeps the UK Elections local-authority codes`);
  assert.ok(record.ladCodes.length > 0, `${slug} has at least one current local authority`);
  for (const gss of record.ladCodes) assert.ok(places[gss], `${slug} authority ${gss} is in the place registry`);
  assert.match(record.pcon24cd ?? "", /^(?:E14|S14|W07|N05)\d{6}$/, `${slug} has a PCON code`);
  assert.equal(typeof record.ukdemographics.hasPage, "boolean", `${slug} has a demographics coverage flag`);
  assert.equal(record.result.url, `https://ukelections.co.uk/seats/parliament/${slug}/`, `${slug} has the confirmed election URL`);


  if (record.ukdemographics.hasPage) {
    assert.ok(record.ukdemographics.slug, `${slug} has a confirmed demographics slug`);
    assert.equal(record.ukdemographics.url, `https://ukdemographics.co.uk/constituencies/${record.ukdemographics.slug}/`);
  } else {
    assert.equal(record.ukdemographics.slug, null, `${slug} has a null demographics slug when not confirmed`);
    assert.equal(record.ukdemographics.url, null, `${slug} has a null demographics URL when not confirmed`);
  }
}

const burnley = records.burnley;
assert.ok(burnley, "Burnley must be present");
assert.equal(burnley.pcon24cd, "E14001142");
assert.deepEqual(burnley.ladCodes, ["E07000117", "E07000122"], "Burnley constituency is Burnley then Pendle");
assert.equal(new Set(entries.map(([, record]) => record.pcon24cd)).size, 650, "every PCON code is unique");
assert.equal(records["aberdeen-north"].pcon24cd, "S14000060", "Scottish codes come from the ONS name match");
assert.deepEqual(records["barnsley-north"].ladCodes, ["E08000038"], "recoded authorities resolve to the current code");
assert.ok(Object.keys(places).every((gss) => placeConstituencies[gss].length > 0), "every place lists at least one constituency");
assert.equal(burnley.mp.name, "Oliver Ryan");
assert.equal(burnley.result.winnerName, "Oliver Ryan");
assert.equal(burnley.result.url, "https://ukelections.co.uk/seats/parliament/burnley/");
assert.equal(burnley.ukdemographics.url, "https://ukdemographics.co.uk/constituencies/burnley/");

console.log(`Constituency checks passed for ${entries.length} records.`);
