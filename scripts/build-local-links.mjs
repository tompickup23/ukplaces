import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Each council's own page for two services, from GOV.UK Local Links Manager's daily
// export (Open Government Licence v3.0), joined on GSS code. A link is kept only when
// the export has exactly one URL for the service and UK Places' own check reaches it
// (HTTP 200 after redirects, not landing on a home page). Where an authority is absent
// under its current code, the export is read under its ONS same-name predecessor
// (src/data/registry/gss-predecessors.json), never a name match. Run by hand, review the
// diff and commit; the site build never calls GOV.UK or a council site.
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPORT_URL = "https://local-links-manager.publishing.service.gov.uk/data/links_to_services_provided_by_local_authorities.csv";
const USER_AGENT = "UKPlacesLinkCheck/1.0 (+https://ukplaces.co.uk/methodology/)";
const outputPath = path.join(siteRoot, "src", "data", "local-links.json");
// Titles and codes as GOV.UK publishes them (www.gov.uk/api/content/<page>, details.lgsl_code
// and lgil_code). Northern Ireland has domestic rates, not council tax, so no council tax link.
const SERVICES = [
  { id: "councilTax", lgsl: 57, lgil: 8, title: "Pay your Council Tax", govuk: "https://www.gov.uk/pay-council-tax", countries: ["England", "Wales", "Scotland"] },
  { id: "bins", lgsl: 524, lgil: 8, title: "Find out your rubbish collection day", govuk: "https://www.gov.uk/rubbish-collection-day", countries: ["England", "Wales", "Scotland", "Northern Ireland"] },
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { cell += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else cell += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") { row.push(cell); cell = ""; }
    else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += character;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((cells) => cells.length > 1);
}

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { "User-Agent": USER_AGENT } });
    await response.body?.cancel();
    const landed = new URL(response.url);
    if (response.status !== 200) return { ok: false, reason: `HTTP ${response.status}` };
    if (landed.pathname === "/" && new URL(url).pathname !== "/") return { ok: false, reason: "redirects to the home page" };
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.name === "AbortError" ? "timed out" : error.message };
  } finally {
    clearTimeout(timer);
  }
}

async function mapLimit(items, limit, task) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) { const index = next++; results[index] = await task(items[index]); }
  }));
  return results;
}

const registry = JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "registry", "places.json"), "utf8"));
const { predecessors } = JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "registry", "gss-predecessors.json"), "utf8"));
const previous = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) : { places: {} };

const response = await fetch(EXPORT_URL, { headers: { "User-Agent": USER_AGENT } });
if (!response.ok) throw new Error(`Local Links Manager export returned HTTP ${response.status}`);
const lastModified = new Date(response.headers.get("last-modified") ?? "").toISOString().slice(0, 10);
const [header, ...rows] = parseCsv(await response.text());
const expected = ["Authority Name", "GSS", "Description", "LGSL", "LGIL", "URL", "Title", "Supported by GOV.UK"];
if (header.join() !== expected.join()) throw new Error(`Unexpected export columns: ${header.join()}`);
const urlsByKey = new Map();
for (const [, gss, , lgsl, lgil, rawUrl] of rows) {
  // A few export URLs carry stray spaces (Hull's bin page had a trailing one).
  const url = rawUrl.trim();
  if (!url) continue;
  const key = `${gss}|${lgsl}|${lgil}`;
  urlsByKey.set(key, new Set([...(urlsByKey.get(key) ?? []), url]));
}
const today = new Date().toISOString().slice(0, 10);

const candidates = [];
const places = {};
for (const place of Object.values(registry).sort((left, right) => left.gss.localeCompare(right.gss))) {
  const record = { links: {}, notes: {} };
  places[place.gss] = record;
  for (const service of SERVICES) {
    if (!service.countries.includes(place.country)) continue;
    // The current code first, then its ONS same-name predecessors, latest first.
    const codes = [place.gss, ...(predecessors[place.gss] ?? []).sort((left, right) => right.from.localeCompare(left.from)).map(({ gss }) => gss)];
    const found = codes.map((code) => ({ code, urls: urlsByKey.get(`${code}|${service.lgsl}|${service.lgil}`) })).find(({ urls }) => urls);
    if (!found) { record.notes[service.id] = "No link in the export"; continue; }
    if (found.urls.size !== 1) { record.notes[service.id] = "More than one link in the export"; continue; }
    const url = [...found.urls][0];
    if (!/^https?:\/\//.test(url)) { record.notes[service.id] = "Not a web address"; continue; }
    candidates.push({ gss: place.gss, service: service.id, url, via: found.code === place.gss ? null : found.code });
  }
}

// A failed check is retried once after a pause, so a slow or briefly failing site does
// not flip a link in and out between runs.
const checkTwice = async (url) => {
  const first = await check(url);
  if (first.ok) return first;
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return check(url);
};
const checks = await mapLimit(candidates, 6, (candidate) => checkTwice(candidate.url));
candidates.forEach((candidate, index) => {
  const record = places[candidate.gss];
  if (checks[index].ok) {
    record.links[candidate.service] = candidate.url;
    if (candidate.via) record.notes[candidate.service] = `Listed under the previous code ${candidate.via}`;
  } else record.notes[candidate.service] = `Not published: ${checks[index].reason}`;
});

// The date each place's links last changed on UK Places, so lastmod moves only then.
for (const [gss, record] of Object.entries(places)) {
  const hash = createHash("sha256").update(JSON.stringify(record.links)).digest("hex");
  const kept = previous.places[gss];
  record.sha256 = hash;
  record.since = Object.keys(record.links).length === 0 ? null : kept?.sha256 === hash && kept.since ? kept.since : today;
}

const output = {
  source: { name: "GOV.UK Local Links Manager", url: EXPORT_URL, exportDate: lastModified, licence: "Open Government Licence v3.0" },
  checkedOn: today,
  services: SERVICES,
  places,
};
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
const counts = SERVICES.map((service) => `${service.id} ${Object.values(places).filter((record) => record.links[service.id]).length}`);
const failed = Object.values(places).flatMap((record) => Object.values(record.notes)).filter((note) => note.startsWith("Not published")).length;
console.log(`Local links: export of ${lastModified}; published ${counts.join(", ")} of ${Object.keys(places).length} places; ${failed} links failed the check.`);
