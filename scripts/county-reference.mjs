import fs from "node:fs";

// Reviewed legislation evidence, independent of sibling registries and signals.
export const countyReference = JSON.parse(fs.readFileSync(
  new URL("../data/ceremonialcounties.json", import.meta.url), "utf8",
));

export function countyFor(gss) {
  const row = countyReference.records[gss];
  if (!row) throw new Error(`County evidence missing for ${gss}. Review the schedule before adding a record.`);
  return row.county;
}
