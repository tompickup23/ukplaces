import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(siteRoot, "src", "data", "registry", "constituencies.json");
const pconsPath = "/Users/tompickup/ukelections/data/identity/pcons-ge-next.json";
const demographicsPath = "/Users/tompickup/ukdemographics/src/data/live/pcon-dataset.json";
const membersPath = "/Users/tompickup/ukdemographics/src/data/live/mp-directory.json";

const pcons = JSON.parse(fs.readFileSync(pconsPath, "utf8")).pcons;
const demographics = JSON.parse(fs.readFileSync(demographicsPath, "utf8")).pcons;
const members = JSON.parse(fs.readFileSync(membersPath, "utf8"));
const membersByConstituency = new Map(members.members.map((member) => [member.constituencyName, member]));
const mpSnapshotDate = members.lastUpdated?.slice(0, 10) ?? null;

const records = {};
for (const constituency of pcons) {
  if (!constituency.slug || records[constituency.slug]) {
    throw new Error(`Constituency slug is missing or duplicated: ${constituency.slug}`);
  }

  const demographicsRecord = constituency.pcon24cd ? demographics[constituency.pcon24cd] : null;
  const member = membersByConstituency.get(constituency.name) ?? null;
  const result = constituency.ge2024 ?? {};

  records[constituency.slug] = {
    slug: constituency.slug,
    name: constituency.name,
    pcon24cd: constituency.pcon24cd ?? null,
    country: constituency.country ?? null,
    region: constituency.region ?? null,
    lad24cds: constituency.lad24cds ?? [],
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
console.log(`Generated ${Object.keys(records).length} constituency records.`);
