import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(siteRoot, "dist");
const sitemap = fs.readFileSync(path.join(distRoot, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
assert.equal(urls.length, 366, "sitemap has 361 places plus five static routes");

for (const url of urls) {
  const pathname = new URL(url).pathname;
  assert.ok(pathname.endsWith("/"), `${url} has a trailing slash`);
  const filePath = pathname === "/"
    ? path.join(distRoot, "index.html")
    : path.join(distRoot, pathname, "index.html");
  assert.ok(fs.existsSync(filePath), `${pathname} is present in dist`);
}

assert.ok(fs.existsSync(path.join(distRoot, "404.html")), "branded 404 is present");
assert.ok(fs.existsSync(path.join(distRoot, "robots.txt")), "robots.txt is present");
console.log(`Sitemap check passed for ${urls.length} trailing-slash URLs.`);
