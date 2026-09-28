import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const registry = read("src/data/registry/places.json");
const data = read("src/data/local-links.json");
const { source, predecessors } = read("src/data/registry/gss-predecessors.json");

// Predecessors: ONS same-name recodes only, each with its order.
assert.match(source, /^Office for National Statistics, Code History Database \(.+\) for the UK, Changes table$/);
const recodes = { E08000038: "E08000016", E08000039: "E08000019", S12000047: "S12000015", S12000048: "S12000024", S12000049: "S12000046", S12000050: "S12000044" };
for (const [gss, old] of Object.entries(recodes)) {
  assert.ok(predecessors[gss]?.some((entry) => entry.gss === old), `${gss} has its ONS predecessor ${old}`);
}
for (const [gss, entries] of Object.entries(predecessors)) {
  assert.ok(registry[gss], `${gss} is a registry code`);
  for (const entry of entries) {
    assert.equal(entry.name, registry[gss].name, `${gss} predecessor ${entry.gss} has the same ONS name`);
    assert.match(entry.order, /\(SI .+\)$/, `${gss} predecessor cites its order`);
  }
}
assert.equal(predecessors.E06000065, undefined, "North Yorkshire (a new unitary in 2023) has no same-name predecessor");
assert.equal(predecessors.E06000066, undefined, "nor does Somerset");

// Links: one record per place, only checked web addresses, dated when they last changed.
assert.equal(data.source.url, "https://local-links-manager.publishing.service.gov.uk/data/links_to_services_provided_by_local_authorities.csv");
assert.equal(data.source.licence, "Open Government Licence v3.0");
assert.match(data.source.exportDate, /^\d{4}-\d{2}-\d{2}$/);
assert.match(data.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
assert.deepEqual(data.services.map(({ id, lgsl, lgil, title }) => [id, lgsl, lgil, title]), [
  ["councilTax", 57, 8, "Pay your Council Tax"],
  ["bins", 524, 8, "Find out your rubbish collection day"],
], "service codes and titles as GOV.UK publishes them");
assert.deepEqual(Object.keys(data.places).sort(), Object.keys(registry).sort(), "one record per place");
for (const [gss, record] of Object.entries(data.places)) {
  for (const [service, url] of Object.entries(record.links)) {
    const definition = data.services.find(({ id }) => id === service);
    assert.ok(definition.countries.includes(registry[gss].country), `${gss} ${service} applies in ${registry[gss].country}`);
    assert.match(url, /^https?:\/\/[^\s]+$/, `${gss} ${service} is a web address`);
    assert.ok(!record.notes[service]?.startsWith("Not published"), `${gss} ${service} passed the check`);
  }
  assert.equal(record.sha256, createHash("sha256").update(JSON.stringify(record.links)).digest("hex"), `${gss} hash matches its links`);
  assert.equal(record.since === null, Object.keys(record.links).length === 0, `${gss} is dated only when it has links`);
  if (record.since) assert.ok(record.since <= data.checkedOn, `${gss} date is not after the check`);
}
assert.ok(Object.values(data.places).every((record, index) => !Object.keys(data.places)[index].startsWith("N09") || !record.links.councilTax), "no council tax link in Northern Ireland");
const count = (service) => Object.values(data.places).filter((record) => record.links[service]).length;
assert.ok(count("councilTax") >= 250 && count("bins") >= 200, `coverage has not collapsed (council tax ${count("councilTax")}, bins ${count("bins")})`);
console.log(`Local links checks passed: ${count("councilTax")} council tax and ${count("bins")} bin collection links, ${Object.keys(predecessors).length} ONS predecessor codes.`);
