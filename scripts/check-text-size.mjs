import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(siteRoot, "dist");
const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else files.push(filePath);
  }
};
walk(distRoot);

const fontSizes = [];
for (const filePath of files.filter((file) => file.endsWith(".css") || file.endsWith(".html"))) {
  const text = fs.readFileSync(filePath, "utf8");
  for (const match of text.matchAll(/font-size\s*:\s*([^;}]+)/g)) fontSizes.push({ filePath, value: match[1].trim() });
}

const minimumPixels = (value) => {
  const values = [...value.matchAll(/([0-9.]+)(px|rem)/g)].map(([, amount, unit]) => Number(amount) * (unit === "rem" ? 16 : 1));
  return values.length ? Math.min(...values) : null;
};

const failures = fontSizes.filter(({ value }) => {
  const size = minimumPixels(value);
  return size !== null && size < 12;
});
if (failures.length) throw new Error(`Text below 12px: ${failures.map(({ filePath, value }) => `${filePath}: ${value}`).join("; ")}`);
console.log(`Text-size check passed across ${files.filter((file) => file.endsWith(".html")).length} rendered pages.`);
