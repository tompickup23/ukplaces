import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

// Run after committing registry changes. Dates describe changes to UK Places
// records, never the age of an MP source or the time a build happens.
const file = "src/data/registry/constituencies.json";
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }).trim();
const records = JSON.parse(fs.readFileSync(file, "utf8"));
assert.deepEqual(records, JSON.parse(git("show", `HEAD:${file}`)), "commit registry changes before recording their dates");
const hash = (record) => createHash("sha256").update(JSON.stringify(record)).digest("hex");
const revisions = git("log", "--format=%H", "--", file).split("\n").reverse();
const dates = {};
for (const revision of revisions) {
  const snapshot = JSON.parse(git("show", `${revision}:${file}`));
  const date = git("show", "-s", "--format=%cI", revision).slice(0, 10);
  for (const [slug, record] of Object.entries(snapshot)) {
    const sha256 = hash(record);
    if (dates[slug]?.sha256 !== sha256) dates[slug] = { date, revision, sha256 };
  }
}
const output = Object.fromEntries(Object.entries(records).map(([slug, record]) => {
  assert.equal(dates[slug]?.sha256, hash(record), `${slug} matches its recorded revision`);
  return [slug, dates[slug]];
}));
fs.writeFileSync("src/data/registry/constituency-content-dates.json", `${JSON.stringify(output, null, 2)}\n`);
console.log(`Recorded Git-backed content dates for ${Object.keys(output).length} constituencies.`);
