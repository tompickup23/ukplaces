import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(siteRoot, "src", "data", "registry", "places.json");
const outputPath = path.join(siteRoot, "src", "data", "registry", "place-constituencies.json");
const sourcePath = "/Users/tompickup/ukelections/data/identity/pcons-ge-next.json";
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const constituencies = JSON.parse(fs.readFileSync(sourcePath, "utf8")).pcons;

const byPlace = Object.fromEntries(Object.keys(registry).map((gss) => [gss, []]));
for (const constituency of constituencies) {
  for (const gss of constituency.lad24cds) {
    if (!byPlace[gss]) continue;
    byPlace[gss].push({
      pcon24cd: constituency.pcon24cd,
      name: constituency.name,
      slug: constituency.slug,
      url: `https://ukelections.co.uk/seats/parliament/${constituency.slug}/`,
    });
  }
}

for (const places of Object.values(byPlace)) places.sort((left, right) => left.name.localeCompare(right.name));
fs.writeFileSync(outputPath, `${JSON.stringify(byPlace, null, 2)}\n`);
console.log(`Generated constituency membership for ${Object.keys(byPlace).length} places.`);
