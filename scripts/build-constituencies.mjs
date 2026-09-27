import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(siteRoot, "src", "data", "registry", "constituencies.json");
const pconsPath = "/Users/tompickup/ukelections/data/identity/pcons-ge-next.json";
const demographicsPath = "/Users/tompickup/ukdemographics/src/data/live/pcon-dataset.json";
const membersPath = "/Users/tompickup/ukdemographics/src/data/live/mp-directory.json";
// Both committed in ukelections: the ONS boundary file (official PCON24 codes and
// names) and a grouped count of ONS Postcode Directory live postcodes by
// constituency and current (LAD25) local authority.
const boundariesPath = "/Users/tompickup/ukelections/data/geography/pcon24-simplified.geojson";
const crosswalkPath = "/Users/tompickup/ukelections/data/ons-pcon24-lad25-postcode-crosswalk.json";
// A constituency and authority are paired when at least this many live postcodes
// fall in both. Below it the ONS file holds six pairs of one to three postcodes
// each (at most 0.13 per cent of a seat), boundary slivers rather than shared
// ground; the next smallest pair has 29. With this floor the pairs match the UK
// Elections lists exactly for every seat on unchanged authorities (551 of 551).
const MIN_SHARED_POSTCODES = 10;

const pcons = JSON.parse(fs.readFileSync(pconsPath, "utf8")).pcons;
const demographics = JSON.parse(fs.readFileSync(demographicsPath, "utf8")).pcons;
const members = JSON.parse(fs.readFileSync(membersPath, "utf8"));
const membersByConstituency = new Map(members.members.map((member) => [member.constituencyName, member]));
const mpSnapshotDate = members.lastUpdated?.slice(0, 10) ?? null;

// UK Elections leaves the PCON code null for 77 seats (Scotland, Northern Ireland).
// Fill it only from an exact match on the official ONS name, unique both ways; the
// same match reproduces every one of the 573 codes UK Elections does carry.
const normaliseName = (name) => name.toLowerCase().replace(/&/g, "and").normalize("NFKD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]/g, "");
const onsCodesByName = new Map();
for (const feature of JSON.parse(fs.readFileSync(boundariesPath, "utf8")).features) {
  const key = normaliseName(feature.properties.PCON24NM);
  onsCodesByName.set(key, [...(onsCodesByName.get(key) ?? []), feature.properties.PCON24CD]);
}
const onsCode = (name) => {
  const codes = onsCodesByName.get(normaliseName(name)) ?? [];
  return codes.length === 1 ? codes[0] : null;
};
for (const constituency of pcons) {
  if (constituency.pcon24cd && onsCode(constituency.name) !== constituency.pcon24cd) {
    throw new Error(`ONS name match disagrees with UK Elections for ${constituency.name}; refusing to fill codes by name.`);
  }
}

const authoritiesByPcon = new Map();
for (const row of JSON.parse(fs.readFileSync(crosswalkPath, "utf8")).rows) {
  if (row.postcode_count < MIN_SHARED_POSTCODES) continue;
  authoritiesByPcon.set(row.pcon24cd, [...(authoritiesByPcon.get(row.pcon24cd) ?? []), row]);
}

const records = {};
for (const constituency of pcons) {
  if (!constituency.slug || records[constituency.slug]) {
    throw new Error(`Constituency slug is missing or duplicated: ${constituency.slug}`);
  }

  const pcon24cd = constituency.pcon24cd ?? onsCode(constituency.name);
  const demographicsRecord = pcon24cd ? demographics[pcon24cd] : null;
  // Current authority codes, largest share of the seat's postcodes first.
  const ladCodes = (authoritiesByPcon.get(pcon24cd) ?? [])
    .sort((left, right) => right.pcon_postcode_share - left.pcon_postcode_share)
    .map((row) => row.lad25cd);
  const member = membersByConstituency.get(constituency.name) ?? null;
  const result = constituency.ge2024 ?? {};

  records[constituency.slug] = {
    slug: constituency.slug,
    name: constituency.name,
    pcon24cd: pcon24cd ?? null,
    country: constituency.country ?? null,
    region: constituency.region ?? null,
    lad24cds: constituency.lad24cds ?? [],
    ladCodes,
    mp: member ? {
      name: member.mpName,
      party: member.party,
      electedDate: member.electedDate ?? null,
      snapshotDate: mpSnapshotDate,
    } : null,
    result: {
      winnerName: result.winner_name ?? null,
      winnerParty: result.winner_party ?? null,
      sourceUrl: result.source_url ?? null,
      url: `https://ukelections.co.uk/seats/parliament/${constituency.slug}/`,
    },
    ukdemographics: demographicsRecord ? {
      hasPage: true,
      slug: demographicsRecord.slug,
      url: `https://ukdemographics.co.uk/constituencies/${demographicsRecord.slug}/`,
    } : {
      hasPage: false,
      slug: null,
      url: null,
    },
  };
}

fs.writeFileSync(outputPath, `${JSON.stringify(records, null, 2)}\n`);
// The published copy that sister sites read at /data/registry/constituencies.json.
fs.writeFileSync(path.join(siteRoot, "public", "data", "registry", "constituencies.json"), `${JSON.stringify(records, null, 2)}\n`);
const values = Object.values(records);
console.log(`Generated ${values.length} constituency records: ${values.filter((record) => record.pcon24cd).length} with a PCON code, ${values.filter((record) => record.ladCodes.length).length} with local authorities.`);
