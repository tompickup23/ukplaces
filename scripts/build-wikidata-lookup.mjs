import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// One-off lookup: Wikidata items carrying each registry GSS code as P836 (GSS code
// (2011)). A code is kept only when exactly one item carries it; no match or several
// matches (for example a council area and its council both tagged) stay null, so
// nothing here is chosen by judgement. Run by hand and commit the output; the
// registry build reads the committed file and never calls Wikidata.
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryDir = path.join(siteRoot, "src", "data", "registry");
const outputPath = path.join(registryDir, "wikidata-by-gss.json");
const registry = JSON.parse(fs.readFileSync(path.join(registryDir, "places.json"), "utf8"));
const codes = Object.keys(registry).sort();

const query = `SELECT ?gss ?item WHERE {
  VALUES ?gss { ${codes.map((code) => `"${code}"`).join(" ")} }
  ?item wdt:P836 ?gss .
}`;

const response = await fetch("https://query.wikidata.org/sparql", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/sparql-results+json",
    "User-Agent": "ukplaces-registry/1.0 (https://ukplaces.co.uk)",
  },
  body: new URLSearchParams({ query }),
});
if (!response.ok) throw new Error(`Wikidata SPARQL returned ${response.status}.`);
const { results } = await response.json();

const itemsByGss = new Map();
for (const binding of results.bindings) {
  const qid = binding.item.value.split("/").at(-1);
  if (!/^Q\d+$/.test(qid)) continue;
  const items = itemsByGss.get(binding.gss.value) ?? new Set();
  items.add(qid);
  itemsByGss.set(binding.gss.value, items);
}

const lookup = {};
let multiple = 0;
for (const code of codes) {
  const items = [...(itemsByGss.get(code) ?? [])];
  if (items.length > 1) multiple += 1;
  lookup[code] = items.length === 1 ? items[0] : null;
}

const resolved = Object.values(lookup).filter(Boolean).length;
if (resolved === 0) throw new Error("No GSS code resolved; refusing to write an empty lookup.");
fs.writeFileSync(outputPath, `${JSON.stringify(lookup, null, 2)}\n`);
console.log(`Wikidata lookup: ${resolved} of ${codes.length} codes resolved to one item; ${multiple} with several items and ${codes.length - resolved - multiple} with none stay null.`);
