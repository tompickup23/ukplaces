import assert from "node:assert/strict";
import { changedUrls, parseSitemap, readKey } from "./indexnow.mjs";

assert.match(readKey(), /^[0-9a-f]{32}$/, "one self-hosted key file whose content is its name");

const site = "https://ukplaces.co.uk";
const live = parseSitemap(`<urlset><url><loc>${site}/</loc><lastmod>2026-09-10</lastmod></url><url><loc>${site}/places/burnley/</loc><lastmod>2026-09-20</lastmod></url><url><loc>${site}/places/gone/</loc></url><url><loc>${site}/constituencies/burnley/</loc></url><url><loc>${site}/places/same/</loc><lastmod>2026-09-27</lastmod></url></urlset>`);
const next = parseSitemap(`<urlset><url><loc>${site}/</loc><lastmod>2026-09-10</lastmod></url><url><loc>${site}/places/burnley/</loc><lastmod>2026-09-27</lastmod></url><url><loc>${site}/constituencies/burnley/</loc></url><url><loc>${site}/places/same/</loc><lastmod>2026-09-27</lastmod></url><url><loc>${site}/privacy/</loc><lastmod>2026-09-27</lastmod></url><url><loc>https://example.com/other/</loc></url></urlset>`);
assert.equal(next.get(`${site}/constituencies/burnley/`), null, "a URL with no lastmod parses");
assert.deepEqual(changedUrls(next, live), [
  `${site}/places/burnley/`,
  `${site}/privacy/`,
  `${site}/places/gone/`,
], "changed lastmod, new and removed URLs only; unchanged, undated and other hosts left out");

// Today's live sitemap has no lastmod, so the first deploy of dated pages submits them all.
const undatedLive = parseSitemap(`<urlset><url><loc>${site}/places/burnley/</loc></url></urlset>`);
assert.deepEqual(changedUrls(parseSitemap(`<urlset><url><loc>${site}/places/burnley/</loc><lastmod>2026-09-27</lastmod></url></urlset>`), undatedLive), [`${site}/places/burnley/`]);
assert.deepEqual(changedUrls(next, next), [], "an unchanged sitemap submits nothing");
console.log("IndexNow checks passed: key file, sitemap diff, new, changed, removed and unchanged URLs.");
