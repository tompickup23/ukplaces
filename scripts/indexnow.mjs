import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// IndexNow tells participating search engines which pages changed, and only those.
//   plan    in the build job, before the deploy: compare dist/sitemap.xml with the live
//           sitemap and write the changed URLs to the job output (or print them).
//   submit  after the deploy: confirm the key file is live, then POST the URLs.
// The key is public by design: it is the one public/<32 hex>.txt file, served at the
// site root as the protocol requires (https://www.indexnow.org/documentation).
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const host = fs.readFileSync(path.join(siteRoot, "public", "CNAME"), "utf8").trim();
const siteUrl = `https://${host}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS_PER_POST = 10000;

export function readKey() {
  const keys = fs.readdirSync(path.join(siteRoot, "public")).filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
  if (keys.length !== 1) throw new Error(`Expected one IndexNow key file in public/, found ${keys.length}`);
  const key = keys[0].slice(0, -4);
  if (fs.readFileSync(path.join(siteRoot, "public", keys[0]), "utf8").trim() !== key) throw new Error("The IndexNow key file must contain its own name");
  return key;
}

export function parseSitemap(xml) {
  return new Map([...xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)].map(([, loc, lastmod]) => [loc, lastmod ?? null]));
}

// A URL is submitted when it is new, when its lastmod differs from the live one, or when
// it has gone (so engines drop it). A URL with no lastmod that is already live gives no
// evidence of change and is left out.
export function changedUrls(next, live) {
  const changed = [...next].filter(([loc, lastmod]) => !live.has(loc) || (lastmod !== null && lastmod !== live.get(loc))).map(([loc]) => loc);
  const removed = [...live.keys()].filter((loc) => !next.has(loc));
  return [...changed, ...removed].filter((loc) => new URL(loc).host === host);
}

async function plan() {
  const next = parseSitemap(fs.readFileSync(path.join(siteRoot, "dist", "sitemap.xml"), "utf8"));
  let urls = [];
  try {
    const response = await fetch(`${siteUrl}/sitemap.xml`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    urls = changedUrls(next, parseSitemap(await response.text()));
  } catch (error) {
    // Never fall back to submitting everything: without the live sitemap there is no diff.
    console.log(`::warning::IndexNow: live sitemap unreadable (${error.message}); nothing will be submitted`);
  }
  console.log(`IndexNow plan: ${urls.length} of ${next.size} sitemap URLs changed`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `urls=${JSON.stringify(urls)}\n`);
  else console.log(JSON.stringify(urls, null, 2));
}

async function submit() {
  const urls = JSON.parse(process.env.INDEXNOW_URLS || "[]");
  if (!Array.isArray(urls) || urls.some((url) => typeof url !== "string" || new URL(url).host !== host)) throw new Error("INDEXNOW_URLS must be a JSON list of this site's URLs");
  if (urls.length === 0) {
    console.log("IndexNow: no changed URLs, nothing submitted");
    return;
  }
  const key = readKey();
  const keyLocation = `${siteUrl}/${key}.txt`;
  // The deploy has finished, but give the CDN a moment before the engines fetch the key.
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(keyLocation, { cache: "no-store" });
    if (response.ok && (await response.text()).trim() === key) break;
    if (attempt === 6) throw new Error(`IndexNow key file is not live at ${keyLocation} (HTTP ${response.status})`);
    await new Promise((resolve) => setTimeout(resolve, 20000));
  }
  for (let start = 0; start < urls.length; start += MAX_URLS_PER_POST) {
    const urlList = urls.slice(start, start + MAX_URLS_PER_POST);
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    });
    // 200 received; 202 received, key validation pending. Anything else fails the job.
    if (response.status !== 200 && response.status !== 202) throw new Error(`IndexNow returned HTTP ${response.status}: ${await response.text()}`);
    console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${response.status})`);
  }
}

const command = process.argv[2];
if (command === "plan") await plan();
else if (command === "submit") await submit();
else if (command !== undefined) throw new Error("Usage: node scripts/indexnow.mjs plan|submit");
