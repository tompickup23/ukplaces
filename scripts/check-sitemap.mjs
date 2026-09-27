import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(siteRoot, "dist");
const sitemap = fs.readFileSync(path.join(distRoot, "sitemap.xml"), "utf8");
const entries = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)]
  .map(([, url, lastmod]) => ({ url, lastmod: lastmod ?? null }));
const urls = entries.map(({ url }) => url);
assert.equal(urls.length, [...sitemap.matchAll(/<loc>/g)].length, "every sitemap URL entry parses");
const places = Object.values(JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "registry", "places.json"), "utf8")));
const constituencies = Object.values(JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "registry", "constituencies.json"), "utf8")));
const regionSlugs = new Set(places.map((place) => place.region.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")));
const expectedUrlCount = 7 + places.length + constituencies.length + regionSlugs.size;
assert.equal(urls.length, expectedUrlCount, "sitemap has static, place, constituency and region routes");

for (const url of urls) {
  const pathname = new URL(url).pathname;
  assert.ok(pathname.endsWith("/"), `${url} has a trailing slash`);
  const filePath = pathname === "/"
    ? path.join(distRoot, "index.html")
    : path.join(distRoot, pathname, "index.html");
  assert.ok(fs.existsSync(filePath), `${pathname} is present in dist`);
}

// lastmod: places from the latest signal snapshotDate on the record, constituencies
// from the MP record snapshot, static pages from the latest changelog date.
const readData = (...parts) => JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", ...parts), "utf8"));
const sources = readData("sources.json");
const feeds = Object.fromEntries(sources.map((source) => [source.id, readData("signals", `${source.id}.json`)]));
const latest = (dates) => dates.filter(Boolean).sort().at(-1) ?? null;
const expectedLastmod = new Map([
  ...["/", "/places/", "/constituencies/", "/methodology/", "/sources/", "/updates/", "/privacy/"]
    .map((pathname) => [pathname, latest(readData("changelog.json").map((entry) => entry.date))]),
  ...places.map((place) => [
    `/places/${place.slug}/`,
    latest(sources.filter((source) => place.coverage[source.id]?.hasPage).map((source) => feeds[source.id][place.gss]?.snapshotDate)),
  ]),
  ...constituencies.map((constituency) => [`/constituencies/${constituency.slug}/`, constituency.mp?.snapshotDate ?? null]),
]);
const today = new Date().toISOString().slice(0, 10);
let datedCount = 0;
for (const { url, lastmod } of entries) {
  const pathname = new URL(url).pathname;
  if (lastmod !== null) {
    datedCount += 1;
    assert.match(lastmod, /^\d{4}-\d{2}-\d{2}$/, `${pathname} lastmod is a date`);
    assert.ok(lastmod <= today, `${pathname} lastmod is not in the future`);
  }
  if (expectedLastmod.has(pathname)) assert.equal(lastmod, expectedLastmod.get(pathname), `${pathname} lastmod matches its source date`);
  else assert.ok(pathname.startsWith("/places/regions/") && lastmod !== null, `${pathname} region lastmod is present`);
}
assert.ok(places.every((place) => expectedLastmod.get(`/places/${place.slug}/`) !== null), "every place has a lastmod");

assert.ok(fs.existsSync(path.join(distRoot, "404.html")), "branded 404 is present");
assert.ok(fs.existsSync(path.join(distRoot, "robots.txt")), "robots.txt is present");
console.log(`Sitemap check passed for ${urls.length} trailing-slash URLs, ${datedCount} with a source-derived lastmod.`);
