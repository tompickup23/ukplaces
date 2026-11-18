import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "./audit-gate.mjs";

// npm audit of production dependencies at the high threshold, with the dated
// exceptions in data/audit-exceptions.json. npm exits non-zero whenever any
// advisory exists, so the JSON report decides, not npm's exit code.
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { exceptions } = JSON.parse(fs.readFileSync(path.join(siteRoot, "data", "audit-exceptions.json"), "utf8"));

const run = spawnSync("npm", ["audit", "--omit=dev", "--json"], { cwd: siteRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
let report;
try {
  report = JSON.parse(run.stdout);
} catch {
  console.error("npm audit did not return a JSON report.");
  console.error(run.stderr.trim());
  process.exit(1);
}
if (report.error) {
  console.error(`npm audit failed: ${report.error.summary ?? JSON.stringify(report.error)}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const { failures, excepted, notes } = evaluate(report, exceptions, today);

for (const line of excepted) console.log(`Excepted: ${line}`);
for (const line of notes) console.log(`Note: ${line}`);
if (failures.length) {
  console.error(`Production audit failed on ${failures.length} high or critical advisories:`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`Production audit passed at the high threshold on ${today}${excepted.length ? ` with ${excepted.length} dated exception${excepted.length === 1 ? "" : "s"}` : ""}.`);
