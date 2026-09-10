import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcesPath = path.join(siteRoot, "src", "data", "sources.json");
const registryPath = path.join(siteRoot, "src", "data", "registry", "places.json");
const placeTemplatePath = path.join(siteRoot, "src", "pages", "places", "[slug].astro");
const dummyId = "source-onboarding-test";
const dummyName = "Source onboarding test";
const dummyUrl = "https://ukplaces.co.uk/source-onboarding-test/";
const dummyFeedPath = path.join(siteRoot, "src", "data", "signals", `${dummyId}.json`);
const burnleyOutputPath = path.join(siteRoot, "dist", "places", "burnley", "index.html");
const astroCliPath = path.join(siteRoot, "node_modules", "astro", "bin", "astro.mjs");

const originals = {
  sources: fs.readFileSync(sourcesPath),
  registry: fs.readFileSync(registryPath),
  templateHash: crypto.createHash("sha256").update(fs.readFileSync(placeTemplatePath)).digest("hex"),
};

function runBuild(label) {
  const result = spawnSync(process.execPath, [astroCliPath, "build"], {
    cwd: siteRoot,
    stdio: "inherit",
  });
  assert.equal(result.status, 0, `${label} build passes`);
}

try {
  const sources = JSON.parse(originals.sources);
  const registry = JSON.parse(originals.registry);

  sources.push({
    id: dummyId,
    name: dummyName,
    accent: "#4338ca",
    topic: "Template coverage test",
    levels: ["local-authority"],
    feedPath: `/data/signals/${dummyId}.json`,
    schemaVersion: "signals-v1",
    siteUrl: "https://ukplaces.co.uk",
  });
  registry.E07000117.coverage[dummyId] = {
    hasPage: true,
    slug: dummyId,
    url: dummyUrl,
  };

  fs.writeFileSync(sourcesPath, `${JSON.stringify(sources, null, 2)}\n`);
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  fs.writeFileSync(dummyFeedPath, `${JSON.stringify({
    E07000117: { value: null, unit: null, label: null, period: null, snapshotDate: null, url: null },
  }, null, 2)}\n`);

  runBuild("dummy-source");

  const burnley = fs.readFileSync(burnleyOutputPath, "utf8");
  assert.match(burnley, new RegExp(dummyName));
  assert.match(burnley, new RegExp(dummyUrl));
  assert.equal(
    crypto.createHash("sha256").update(fs.readFileSync(placeTemplatePath)).digest("hex"),
    originals.templateHash,
    "the place template is unchanged while the extra coverage row renders",
  );
} finally {
  fs.writeFileSync(sourcesPath, originals.sources);
  fs.writeFileSync(registryPath, originals.registry);
  fs.unlinkSync(dummyFeedPath);
}

runBuild("restored-data");
const restoredBurnley = fs.readFileSync(burnleyOutputPath, "utf8");
assert.ok(!restoredBurnley.includes(dummyName), "the dummy coverage row is removed after the test");
assert.equal(fs.existsSync(dummyFeedPath), false, "the dummy signal feed is removed after the test");
assert.equal(fs.readFileSync(sourcesPath).equals(originals.sources), true, "the source manifest is restored after the test");
assert.equal(fs.readFileSync(registryPath).equals(originals.registry), true, "the registry is restored after the test");

console.log("Source onboarding test passed: the existing template renders and then removes a dummy coverage row.");
