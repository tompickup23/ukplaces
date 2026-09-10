import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const recordsPath = path.join(siteRoot, "src", "data", "registry", "constituencies.json");
const records = JSON.parse(fs.readFileSync(recordsPath, "utf8"));
const entries = Object.entries(records);

assert.equal(entries.length, 650, "registry must contain all 650 constituency records");
assert.equal(new Set(entries.map(([slug]) => slug)).size, entries.length, "every constituency slug must be unique");
assert.equal(new Set(entries.map(([, record]) => record.slug)).size, entries.length, "every record slug must be unique");

for (const [slug, record] of entries) {
  assert.equal(record.slug, slug, `${slug} must match its registry key`);
  assert.ok(record.name, `${slug} has a name`);
  assert.ok(Array.isArray(record.lad24cds), `${slug} has local-authority codes`);
  assert.equal(typeof record.ukdemographics.hasPage, "boolean", `${slug} has a demographics coverage flag`);
  assert.equal(record.result.url, `https://ukelections.co.uk/seats/parliament/${slug}/`, `${slug} has the confirmed election URL`);

  if (record.pcon24cd === null) {
    assert.equal(record.ukdemographics.hasPage, false, `${slug} lacks a demographics page without a PCON code`);
  } else {
    assert.match(record.pcon24cd, /^[ESW][0-9]{8}$/);
  }

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
assert.ok(burnley.lad24cds.includes("E07000117"), "Burnley constituency includes Burnley local authority");
assert.equal(burnley.mp.name, "Oliver Ryan");
assert.equal(burnley.result.winnerName, "Oliver Ryan");
assert.equal(burnley.result.url, "https://ukelections.co.uk/seats/parliament/burnley/");
assert.equal(burnley.ukdemographics.url, "https://ukdemographics.co.uk/constituencies/burnley/");

console.log(`Constituency checks passed for ${entries.length} records.`);
