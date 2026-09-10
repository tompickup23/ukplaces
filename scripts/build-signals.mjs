import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.join(siteRoot, "src", "data");
const registry = JSON.parse(fs.readFileSync(path.join(dataRoot, "registry", "places.json"), "utf8"));
const outputDirectory = path.join(dataRoot, "signals");

const sourcePaths = {
  ukelections: "/Users/tompickup/ukelections/data/results/may-2026/council-control.json",
  ukdemographics: "/Users/tompickup/ukdemographics/src/data/live/crime-dashboard.json",
  aidogeSummaries: "/Users/tompickup/aidoge-site/data/summaries",
  asylumstats: "/Users/tompickup/asylumstats/data/marts/uk_routes/local-route-latest.json",
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

function formatDate(isoDate) {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function blankSignal() {
  return { value: null, unit: null, label: null, period: null, snapshotDate: null, url: null };
}

function writeFeed(id, feed) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, `${id}.json`), `${JSON.stringify(feed, null, 2)}\n`);
}

const partyNames = {
  con: "Conservative",
  green: "Green",
  lab: "Labour",
  ld: "Liberal Democrat",
  nat: "Nationalist",
  other: "Independent/Other",
  pc: "Plaid Cymru",
  ref: "Reform",
  snp: "SNP",
  ukip: "UKIP",
};

const electionData = readJson(sourcePaths.ukelections);
const electionBySlug = new Map(electionData.councils.map((council) => [council.council_slug, council]));
const electionGenerated = electionData.snapshot.generated_at.slice(0, 10);
const electionFeed = {};

for (const [gss, place] of Object.entries(registry)) {
  const slug = place.coverage.ukelections.slug;
  const council = slug ? electionBySlug.get(slug) : null;
  if (!council) {
    electionFeed[gss] = blankSignal();
    continue;
  }

  const partyCode = council.control.plurality_party ?? council.control.controlling_party;
  const seats = council.control.plurality_seats ?? council.post_may7.by_party[partyCode];
  const party = partyNames[partyCode] ?? partyCode;
  const snapshotDate = council.snapshotDate ?? electionGenerated;
  electionFeed[gss] = {
    value: `${party} ${seats} of ${council.cycle.total_seats}`,
    unit: "seats",
    label: council.control.status === "no_overall_control" ? "No overall control" : "Council control",
    period: `After the ${formatDate(electionData.snapshot.election_date)} election; source dataset generated ${formatDate(snapshotDate)}.`,
    snapshotDate,
    url: place.coverage.ukelections.url,
  };
}

const crimeData = readJson(sourcePaths.ukdemographics);
const crimeFeed = {};
for (const [gss, place] of Object.entries(registry)) {
  const crime = crimeData.areas[gss];
  if (!crime || !place.coverage.ukdemographics.hasPage || crime.totalCrimeRate === null) {
    crimeFeed[gss] = blankSignal();
    continue;
  }

  const snapshotDate = crime.snapshotDate ?? crimeData.lastUpdated;
  crimeFeed[gss] = {
    value: Number(crime.totalCrimeRate.toFixed(1)),
    unit: "per 1,000 residents",
    label: "Total recorded crime",
    period: `latest held by source: ${crime.period}; dataset updated ${formatDate(snapshotDate)}.`,
    snapshotDate,
    url: place.coverage.ukdemographics.url,
  };
}

const aidogeFeed = {};
for (const [gss, place] of Object.entries(registry)) {
  const id = place.coverage.aidoge.slug;
  const summaryPath = id ? path.join(sourcePaths.aidogeSummaries, `${id}.json`) : null;
  if (!summaryPath || !fs.existsSync(summaryPath)) {
    aidogeFeed[gss] = blankSignal();
    continue;
  }

  const summary = readJson(summaryPath);
  if (summary.ons_code !== gss || !summary.headline?.latest_fy || summary.headline.total_spend_net === null || !summary.coverage?.last_refresh) {
    aidogeFeed[gss] = blankSignal();
    continue;
  }

  aidogeFeed[gss] = {
    value: new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(summary.headline.total_spend_net),
    unit: "GBP",
    label: "Published payments",
    period: summary.headline.latest_fy,
    snapshotDate: summary.coverage.last_refresh,
    url: place.coverage.aidoge.url,
  };
}

const asylumData = readJson(sourcePaths.asylumstats);
const asylumByGss = new Map(asylumData.areas.map((area) => [area.areaCode, area]));
const asylumFeed = {};
for (const [gss, place] of Object.entries(registry)) {
  const area = asylumByGss.get(gss);
  if (!area || area.supportedAsylum === null) {
    asylumFeed[gss] = blankSignal();
    continue;
  }

  asylumFeed[gss] = {
    value: area.supportedAsylum,
    unit: `people on support; ${area.supportedAsylumRate.toFixed(2)} per 10,000`,
    label: "Asylum support",
    period: `As at ${formatDate(area.snapshotDate)}.`,
    snapshotDate: area.snapshotDate,
    url: place.coverage.asylumstats.url,
  };
}

writeFeed("ukelections", electionFeed);
writeFeed("ukdemographics", crimeFeed);
writeFeed("aidoge", aidogeFeed);
writeFeed("asylumstats", asylumFeed);

console.table(
  Object.entries({
    ukelections: electionFeed,
    ukdemographics: crimeFeed,
    aidoge: aidogeFeed,
    asylumstats: asylumFeed,
  }).map(([source, feed]) => ({
    source,
    signals: Object.values(feed).filter((signal) => signal.value !== null).length,
    total: Object.keys(feed).length,
  })),
);
