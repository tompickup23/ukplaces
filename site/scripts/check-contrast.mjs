import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(siteRoot, "src", "styles", "global.css"), "utf8");
const sources = JSON.parse(fs.readFileSync(path.join(siteRoot, "src", "data", "sources.json"), "utf8"));

const rootBlocks = [...css.matchAll(/:root\s*\{([\s\S]*?)\}/g)].map((match) => match[1]);
const values = (block) => Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(([, name, value]) => [name, value]));
const light = values(rootBlocks[0]);
const dark = { ...light, ...values(rootBlocks[1]) };

const luminance = (hex) => {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255).map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};
const ratio = (foreground, background) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
};
const pairs = (tokens) => [
  [tokens["--text"], tokens["--bg"]],
  [tokens["--text"], tokens["--bg-subtle"]],
  [tokens["--text"], tokens["--bg-card"]],
  [tokens["--text-muted"], tokens["--bg"]],
  [tokens["--text-muted"], tokens["--bg-subtle"]],
  [tokens["--text-muted"], tokens["--bg-card"]],
  [tokens["--text-faint"], tokens["--bg"]],
  [tokens["--text-faint"], tokens["--bg-subtle"]],
  [tokens["--ground-ink"], tokens["--ground"]],
  [tokens["--ground-muted"], tokens["--ground"]],
];

const checks = [...pairs(light), ...pairs(dark), ...sources.map((source) => [source.accent, light["--bg-card"]])];
const failures = checks.filter(([foreground, background]) => ratio(foreground, background) < 4.5);
if (failures.length) throw new Error(`Contrast below 4.5:1: ${failures.map(([foreground, background]) => `${foreground} on ${background}`).join(", ")}`);
console.log(`Contrast check passed for ${checks.length} declared text/background pairs.`);
