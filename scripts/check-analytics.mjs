import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Presence, not permission: with PUBLIC_CF_BEACON_TOKEN set, every page in dist
// carries exactly one Cloudflare beacon with exactly that token; with it unset,
// no page carries one and the privacy page says there are no analytics.
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(siteRoot, "dist");
const token = process.env.PUBLIC_CF_BEACON_TOKEN?.trim() || null;

function* htmlFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(entryPath);
    else if (entry.name.endsWith(".html")) yield entryPath;
  }
}

let pages = 0;
for (const filePath of htmlFiles(distRoot)) {
  pages += 1;
  const html = fs.readFileSync(filePath, "utf8");
  const beacons = [...html.matchAll(/data-cf-beacon="([^"]*)"/g)].map(([, value]) => JSON.parse(value.replace(/&quot;/g, "\"")));
  const page = path.relative(distRoot, filePath);
  if (token) {
    assert.equal(beacons.length, 1, `${page} carries exactly one analytics beacon`);
    assert.equal(beacons[0].token, token, `${page} beacon carries this site's token`);
  } else {
    assert.equal(beacons.length, 0, `${page} carries no analytics beacon without a token`);
  }
}

const privacy = fs.readFileSync(path.join(distRoot, "privacy", "index.html"), "utf8");
assert.ok(privacy.includes(token ? "Cloudflare Web Analytics" : "does not currently run any analytics"), "the privacy page matches the analytics state");
console.log(token
  ? `Analytics check passed: one beacon with this site's token on each of ${pages} pages.`
  : `Analytics check passed: no token set, so no beacon on any of ${pages} pages and the privacy page says so.`);
