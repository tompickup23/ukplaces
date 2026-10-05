import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// D8 house style: no em dash or en dash anywhere in the site source or its generators.
// The characters are written as escapes so this file does not flag itself.
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scanRoots = ["src", "scripts"];
const dashPattern = /[\u2013\u2014]|&(?:mdash|ndash|#8211|#8212|#x2013|#x2014);/gi;

function* walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(entryPath);
    else if (entry.isFile()) yield entryPath;
  }
}

const offenders = [];
let fileCount = 0;
for (const root of scanRoots) {
  for (const filePath of walk(path.join(siteRoot, root))) {
    fileCount += 1;
    const lines = fs.readFileSync(filePath, "utf8").split("\n");
    lines.forEach((line, index) => {
      if (line.match(dashPattern)) offenders.push(`${path.relative(siteRoot, filePath)}:${index + 1}: ${line.trim().slice(0, 120)}`);
    });
  }
}

assert.equal(offenders.length, 0, `dash characters found:\n${offenders.join("\n")}`);
console.log(`House-style check passed: no dash characters in ${fileCount} files under ${scanRoots.join(" and ")}.`);
