import fs from "node:fs";
import { fetchLocalLinksExport } from "./local-links-export.mjs";
import { authorityIndex, extractOfficialNames, resolveOfficialName, validateOfficialNames } from "./official-names.mjs";

const read = (name) => JSON.parse(fs.readFileSync(new URL(`../src/data/registry/${name}.json`, import.meta.url), "utf8"));
const places = read("places");
const counties = read("county-councils");
const { predecessors } = read("gss-predecessors");
const reference = extractOfficialNames(await fetchLocalLinksExport(), places, counties, predecessors);
const index = authorityIndex(reference.rows);
let placeChanges = 0;
let countyChanges = 0;
for (const [gss, place] of Object.entries(places)) {
  const resolved = resolveOfficialName(gss, index, predecessors);
  if (place.officialName !== resolved.officialName) placeChanges += 1;
  delete place.officialNameVia;
  Object.assign(place, resolved);
}
for (const [gss, county] of Object.entries(counties)) {
  const resolved = resolveOfficialName(gss, index, predecessors);
  if (county.name !== resolved.officialName) countyChanges += 1;
  county.name = resolved.officialName;
}
// Finish every join and guard before writing any output. Other place fields stay intact.
validateOfficialNames({ places, counties, predecessors, reference });
const write = (file, data) => fs.writeFileSync(new URL(`../${file}`, import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
for (const directory of ["src", "public"]) {
  write(`${directory}/data/registry/places.json`, places);
  write(`${directory}/data/registry/official-names.json`, reference);
}
write("src/data/registry/county-councils.json", counties);
console.log(`Official names refreshed: ${placeChanges} place changes; ${countyChanges} county council changes.`);
console.log(`Edition: ${reference.source.lastModified}; retrieved ${reference.source.retrievedOn}; SHA-256 ${reference.source.sha256}`);
