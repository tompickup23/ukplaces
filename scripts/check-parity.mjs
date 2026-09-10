import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacyRoutes = ["/", "/places/", "/places/burnley/", "/methodology/", "/sources/", "/updates/"];

for (const route of legacyRoutes) {
  if (!route.endsWith("/")) throw new Error(`Legacy route is not trailing-slash: ${route}`);
  const outputPath = route === "/"
    ? path.join(projectRoot, "dist", "index.html")
    : path.join(projectRoot, "dist", route, "index.html");
  await access(outputPath);
}

console.log(`Parity check passed for ${legacyRoutes.length} legacy public routes.`);
