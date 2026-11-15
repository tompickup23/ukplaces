import assert from "node:assert/strict";
import fs from "node:fs";
import { EXPORT_URL, EXPORT_COLUMNS } from "./local-links-export.mjs";

// D1, 9 November 2026: only these eight predecessor candidates are authorised.
export const PREDECESSOR_JOINS = {
  E08000038: "E08000016",
  E08000039: "E08000019",
  E06000065: "E10000023",
  E06000066: "E10000027",
  S12000047: "S12000015",
  S12000048: "S12000024",
  S12000049: "S12000046",
  S12000050: "S12000044",
};

// The county predecessors are absent from our ONS mapping. Keep these exact values.
export const KEPT_NAMES = {
  E06000065: "North Yorkshire Council",
  E06000066: "Somerset Council",
};

export function authorityIndex(rows) {
  const index = new Map();
  for (const row of rows) {
    const gss = row.GSS;
    const name = row["Authority Name"];
    assert.match(gss, /^[ESWN][0-9]{8}$/);
    assert.ok(typeof name === "string" && name.trim(), `${gss} has no Authority Name`);
    assert.ok(Number.isInteger(row.row) && row.row >= 2, `${gss} has no export row`);
    if (index.has(gss) && index.get(gss)["Authority Name"] !== name) {
      throw new Error(`${gss} yields two different Authority Names`);
    }
    if (!index.has(gss)) index.set(gss, row);
  }
  return index;
}

export function resolveOfficialName(gss, index, predecessors) {
  const direct = index.get(gss);
  if (direct) return { officialName: direct["Authority Name"] };
  const via = PREDECESSOR_JOINS[gss];
  if (via && predecessors[gss]?.some((entry) => entry.gss === via) && index.has(via)) {
    return { officialName: index.get(via)["Authority Name"], officialNameVia: via };
  }
  if (Object.hasOwn(KEPT_NAMES, gss)) return { officialName: KEPT_NAMES[gss] };
  throw new Error(`${gss} officialName has no source`);
}

function allowedCodes(places, counties, predecessors) {
  return new Set([
    ...Object.keys(places),
    ...Object.keys(counties),
    ...Object.entries(PREDECESSOR_JOINS)
      .filter(([gss, via]) => Object.hasOwn(places, gss) && predecessors[gss]?.some((entry) => entry.gss === via))
      .map(([, via]) => via),
  ]);
}

export function extractOfficialNames(exportData, places, counties, predecessors) {
  const allowed = allowedCodes(places, counties, predecessors);
  const rows = exportData.rows.map(([name, gss], index) => ({ row: index + 2, GSS: gss, "Authority Name": name }))
    .filter((row) => allowed.has(row.GSS));
  // Read every relevant service row before reducing identical repeated names.
  const index = authorityIndex(rows);
  return { source: exportData.source, rows: [...index.values()].sort((left, right) => left.GSS.localeCompare(right.GSS)) };
}

export function readOfficialNameInputs() {
  const read = (name) => JSON.parse(fs.readFileSync(new URL(`../src/data/registry/${name}.json`, import.meta.url), "utf8"));
  return {
    places: read("places"),
    counties: read("county-councils"),
    predecessors: read("gss-predecessors").predecessors,
    reference: read("official-names"),
  };
}

export function validateOfficialNames({ places, counties, predecessors, reference }) {
  assert.equal(Object.keys(places).length, 361, "official names cover 361 places");
  assert.equal(Object.keys(counties).length, 21, "official names cover 21 county councils");
  const { source, rows } = reference;
  assert.equal(source.url, EXPORT_URL);
  assert.equal(source.name, "GOV.UK Local Links Manager");
  assert.equal(source.licence, "Open Government Licence v3.0");
  assert.ok(typeof source.lastModified === "string" && Number.isFinite(Date.parse(source.lastModified)), "pinned last-modified is required");
  assert.match(source.retrievedOn, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(source.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(source.columns, EXPORT_COLUMNS);
  assert.ok(Number.isInteger(source.totalRows) && source.totalRows > 0);
  const allowed = allowedCodes(places, counties, predecessors);
  for (const row of rows) {
    assert.ok(allowed.has(row.GSS), `${row.GSS} is outside the authorised joins`);
    assert.ok(row.row <= source.totalRows + 1, `${row.GSS} row is outside the export`);
  }
  const index = authorityIndex(rows);
  for (const [gss, place] of Object.entries(places)) {
    const expected = resolveOfficialName(gss, index, predecessors);
    assert.equal(place.officialName, expected.officialName, `${gss} officialName does not match its source`);
    assert.equal(place.officialNameVia, expected.officialNameVia, `${gss} predecessor does not match its source`);
  }
  // County records use name for the council's full name in their existing contract.
  for (const [gss, county] of Object.entries(counties)) {
    assert.ok(index.has(gss), `${gss} county council name has no source`);
    assert.equal(county.name, index.get(gss)["Authority Name"], `${gss} county council name does not match its source`);
  }
  return index;
}
