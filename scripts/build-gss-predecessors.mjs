import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// One-off lookup: the code each registry authority carried before its current GSS code,
// from the ONS Code History Database "Changes" table. A predecessor is kept only where
// ONS records a change from it to the current code with the same name on both sides
// (a recode after a boundary amendment, such as Barnsley E08000016 to E08000038), so
// nothing is matched by judgement; merged or new authorities (North Yorkshire,
// Somerset in 2023) have no same-name predecessor and get none. Run by hand with the
// unzipped Changes.csv and commit the output:
//   node scripts/build-gss-predecessors.mjs <path to Changes.csv> "<CHD edition>"
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryDir = path.join(siteRoot, "src", "data", "registry");
const [changesPath, edition] = process.argv.slice(2);
if (!changesPath || !edition) throw new Error('Usage: node scripts/build-gss-predecessors.mjs <Changes.csv> "Code History Database (June 2026)"');

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quoted && character === '"' && line[index + 1] === '"') { cell += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) { cells.push(cell); cell = ""; }
    else cell += character;
  }
  cells.push(cell);
  return cells;
}

const [header, ...lines] = fs.readFileSync(changesPath, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
const columns = parseCsvLine(header);
for (const name of ["GEOGCD", "GEOGNM", "GEOGCD_P", "GEOGNM_P", "SI_ID", "SI_TITLE", "OPER_DATE"]) {
  if (!columns.includes(name)) throw new Error(`Changes.csv has no ${name} column`);
}
const registry = JSON.parse(fs.readFileSync(path.join(registryDir, "places.json"), "utf8"));
const predecessors = {};
for (const line of lines) {
  const row = Object.fromEntries(parseCsvLine(line).map((value, index) => [columns[index], value]));
  if (!registry[row.GEOGCD] || !/^[ENSW]\d{8}$/.test(row.GEOGCD_P) || row.GEOGCD_P === row.GEOGCD) continue;
  if (row.GEOGNM !== row.GEOGNM_P) continue;
  const [day, month, year] = row.OPER_DATE.slice(0, 10).split("/");
  (predecessors[row.GEOGCD] ??= []).push({ gss: row.GEOGCD_P, name: row.GEOGNM_P, from: `${year}-${month}-${day}`, order: `${row.SI_TITLE} (SI ${row.SI_ID})` });
}
const output = {
  source: `Office for National Statistics, ${edition}, Changes table`,
  predecessors: Object.fromEntries(Object.entries(predecessors).sort(([left], [right]) => left.localeCompare(right))),
};
fs.writeFileSync(path.join(registryDir, "gss-predecessors.json"), `${JSON.stringify(output, null, 2)}\n`);
console.log(`GSS predecessors: ${Object.keys(output.predecessors).length} registry codes have a same-name predecessor.`);
