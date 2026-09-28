import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Every indexable page in dist has a unique title and description, the description
// is between 70 and 300 characters, and neither carries a dash character (D8).
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(siteRoot, "dist");
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 300;
const dashPattern = /[\u2013\u2014]/;
// Templated prose must not repeat a word, as "a unitary authority in in the ... region"
// once did on 65 place introductions.
const doubledWord = /\b(\w+)\s+\1\b/i;

const entities = { amp: "&", lt: "<", gt: ">", quot: "\"", "#39": "'", "#x27": "'", apos: "'" };
const decode = (text) => text
  .replace(/&(amp|lt|gt|quot|#39|#x27|apos);/g, (_, name) => entities[name])
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));

function* htmlFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(entryPath);
    else if (entry.name.endsWith(".html")) yield entryPath;
  }
}

const pages = [];
const doubled = [];
let cardCount = 0;
for (const filePath of htmlFiles(distRoot)) {
  const html = fs.readFileSync(filePath, "utf8");
  const page = path.relative(distRoot, filePath);
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
  if (robots.includes("noindex")) continue;
  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)];
  assert.equal(titles.length, 1, `${page} has exactly one title`);
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  assert.ok(description !== undefined, `${page} has a meta description`);
  pages.push({ page, title: decode(titles[0][1]), description: decode(description) });
  const introduction = html.match(/<p class="place-hero__intro">([^<]*)<\/p>/)?.[1];
  if (introduction && doubledWord.test(decode(introduction))) doubled.push(`${page}: repeated word in the introduction`);
  // An advertised share image must exist in the build (per-place cards exist only when BUILD_OG=1).
  const image = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
  assert.ok(image, `${page} has an og:image`);
  const imageUrl = new URL(decode(image));
  if (imageUrl.hostname === "ukplaces.co.uk") {
    assert.ok(fs.existsSync(path.join(distRoot, decodeURIComponent(imageUrl.pathname))), `${page} og:image ${imageUrl.pathname} exists in dist`);
    if (imageUrl.pathname.startsWith("/og/")) cardCount += 1;
  }
}

const failures = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
for (const { page, title, description } of pages) {
  if (seenTitles.has(title)) failures.push(`${page}: title repeats ${seenTitles.get(title)}: ${title}`);
  seenTitles.set(title, page);
  if (seenDescriptions.has(description)) failures.push(`${page}: description repeats ${seenDescriptions.get(description)}`);
  seenDescriptions.set(description, page);
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    failures.push(`${page}: description is ${description.length} characters: ${description}`);
  }
  if (dashPattern.test(title) || dashPattern.test(description)) failures.push(`${page}: dash character in title or description`);
  if (doubledWord.test(title) || doubledWord.test(description)) failures.push(`${page}: repeated word in title or description`);
}

failures.push(...doubled);
assert.equal(failures.length, 0, `metadata failures:\n${failures.slice(0, 40).join("\n")}${failures.length > 40 ? `\n...and ${failures.length - 40} more` : ""}`);
const lengths = pages.map(({ description }) => description.length).sort((a, b) => a - b);
console.log(`Metadata check passed for ${pages.length} indexable pages: titles and descriptions unique, descriptions ${lengths[0]} to ${lengths.at(-1)} characters, every og:image present (${cardCount} per-record cards).`);
