import assert from "node:assert/strict";
import { parseCsv, fetchLocalLinksExport } from "./local-links-export.mjs";
import { authorityIndex, extractOfficialNames, KEPT_NAMES, PREDECESSOR_JOINS, readOfficialNameInputs, resolveOfficialName, validateOfficialNames } from "./official-names.mjs";
import "./check-official-names.mjs";

const inputs = readOfficialNameInputs();
const index = validateOfficialNames(inputs);
assert.equal(inputs.reference.rows.length, 380, "353 direct places, six predecessors and 21 county councils have evidence");
assert.equal(Object.values(inputs.places).filter((place) => place.officialNameVia).length, 6);
for (const [gss, name] of Object.entries(KEPT_NAMES)) {
  assert.equal(inputs.places[gss].officialName, name);
  assert.equal(inputs.places[gss].officialNameVia, undefined);
  assert.equal(inputs.predecessors[gss]?.some((entry) => entry.gss === PREDECESSOR_JOINS[gss]) ?? false, false);
}
for (const [gss, name] of Object.entries({
  E08000025: "Birmingham City Council",
  E09000006: "London Borough of Bromley",
  E06000010: "Hull City Council",
  E06000002: "Middlesbrough Borough Council",
  E07000146: "Borough Council of Kings Lynn and West Norfolk",
})) assert.equal(inputs.places[gss].officialName, name);

const mutated = (change) => {
  const copy = structuredClone(inputs);
  change(copy);
  return () => validateOfficialNames(copy);
};
assert.throws(mutated((copy) => {
  copy.reference.rows = copy.reference.rows.filter((row) => row.GSS !== "E08000025");
}), /officialName has no source/, "missing direct evidence fails");
assert.throws(mutated((copy) => {
  copy.reference.rows.push({ row: 2, GSS: "E08000025", "Authority Name": "Conflicting name" });
}), /two different Authority Names/, "conflicting names fail");
assert.throws(mutated((copy) => {
  delete copy.predecessors.E08000038;
  copy.reference.rows = copy.reference.rows.filter((row) => row.GSS !== "E08000016");
}), /officialName has no source/, "predecessor evidence is required");
assert.throws(mutated((copy) => { copy.places.E08000038.officialNameVia = "E08000019"; }), /predecessor does not match/);
assert.throws(mutated((copy) => { copy.places.E06000065.officialName = "Invented name"; }), /does not match its source/, "kept names are exact exceptions");
assert.throws(mutated((copy) => {
  copy.reference.rows = copy.reference.rows.filter((row) => row.GSS !== "E10000017");
}), /county council name has no source/);
assert.throws(mutated((copy) => { delete copy.reference.source.sha256; }), /string/, "edition hash is required");
assert.throws(() => resolveOfficialName("E06000999", index, { E06000999: [{ gss: "E08000016" }] }), /has no source/, "unlisted predecessor joins fail");

const rows = [
  ["  Council, \"Name\"  ", "E08000025"],
  ["  Council, \"Name\"  ", "E08000025"],
  ["Ignored name", "E06000999"],
  ["Another ignored name", "E06000999"],
];
const extracted = extractOfficialNames({ source: {}, rows }, inputs.places, inputs.counties, inputs.predecessors);
assert.equal(extracted.rows.length, 1, "out of scope rows are ignored and identical repeats collapse");
assert.equal(resolveOfficialName("E08000025", authorityIndex(extracted.rows), {}).officialName, rows[0][0], "names are copied without tidying");
assert.equal(extracted.rows[0].row, 2, "row numbers include the header");
assert.throws(() => extractOfficialNames({ source: {}, rows: [...rows, ["Changed name", "E08000025"]] }, inputs.places, inputs.counties, inputs.predecessors), /two different Authority Names/);
assert.deepEqual(parseCsv('"  Council, ""Name""  ",E08000025\r\n"two\nlines",E08000038\r\n'), [rows[0], ["two\nlines", "E08000038"]]);

// No live request in tests: failed downloads must stop the refresh before any write.
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async () => new Response("unavailable", { status: 503 });
  await assert.rejects(fetchLocalLinksExport(), /HTTP 503/);
  globalThis.fetch = async () => new Response("wrong columns\n", { headers: { "last-modified": inputs.reference.source.lastModified } });
  await assert.rejects(fetchLocalLinksExport(), /Unexpected export columns/);
} finally {
  globalThis.fetch = originalFetch;
}
console.log("Official name failure guards and verbatim joins passed.");
