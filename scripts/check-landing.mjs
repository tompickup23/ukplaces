import { parse } from "parse5";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const dash = /[\u2013\u2014]|&(?:mdash|ndash|#8211|#8212|#x2013|#x2014);/i;
function* files(root) {
  for (const item of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, item.name);
    if (item.isDirectory()) yield* files(file);
    else yield file;
  }
}
function visibleText(node) {
  if (node.tagName === "script" || node.tagName === "style") return "";
  if (node.nodeName === "#text") return node.value;
  return (node.childNodes ?? []).map(visibleText).join(" ");
}
let pages = 0;
for (const file of [...files("src"), ...[...files("dist")].filter(file => file.endsWith(".html"))]) {
  const text = fs.readFileSync(file, "utf8");
  assert.ok(!dash.test(text), `${file} contains a prohibited dash`);
  if (file.endsWith(".html")) {
    pages++;
    const visible = visibleText(parse(text));
    assert.ok(!visible.includes(" \u002d "), `${file} contains a visible pseudo-dash`);
  }
}
const registry = JSON.parse(fs.readFileSync("src/data/registry/places.json", "utf8"));
for (const place of Object.values(registry)) {
  const html = fs.readFileSync(`dist/places/${place.slug}/index.html`, "utf8");
  assert.ok(!/<meta\b[^>]*\bname="robots"[^>]*\bcontent="[^"]*noindex/i.test(html), `${place.slug} is indexable`);
  if (place.coverage.ukfoodhygiene.hasPage) {
    const panel = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(([s]) => s).find(s => s.includes("UK Food Hygiene"));
    assert.ok(panel?.includes('href="https://ukfoodhygiene.co.uk/'), `${place.slug} links to Food Hygiene`);
    assert.ok(panel.includes("Food Standards Agency (FSA)"), `${place.slug} names FSA provenance`);
  }
}
const privacy = fs.readFileSync("dist/privacy/index.html", "utf8");
const hasBeacon = privacy.includes("static.cloudflareinsights.com/beacon.min.js");
assert.equal(privacy.includes("Cloudflare Web Analytics"), hasBeacon, "privacy names analytics only when loaded");
console.log(`Landing checks passed: dash sweep of src and ${pages} HTML pages; all ${Object.keys(registry).length} places indexable with linked FSA provenance; privacy matches analytics.`);
