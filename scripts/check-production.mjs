const monitorUrl = process.env.UKPLACES_MONITOR_URL ?? "https://ukplaces.co.uk";
const siteUrl = new URL(monitorUrl);

if (siteUrl.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(siteUrl.hostname)) {
  throw new Error("UKPLACES_MONITOR_URL must use HTTPS outside local verification.");
}

const checks = [
  { path: "/", contentType: "text/html", text: "<title>UK Places</title>" },
  { path: "/places/burnley/", contentType: "text/html", text: "Burnley" },
  { path: "/constituencies/burnley/", contentType: "text/html", text: "Burnley" },
  { path: "/sitemap.xml", contentType: "xml", text: "<urlset" },
  { path: "/robots.txt", contentType: "text/plain", text: "Sitemap: https://ukplaces.co.uk/sitemap.xml" },
];

for (const check of checks) {
  const url = new URL(check.path, siteUrl);
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  const body = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}.`);
  if (!contentType.includes(check.contentType)) {
    throw new Error(`${url} returned ${contentType || "no content type"}, expected ${check.contentType}.`);
  }
  if (!body.includes(check.text)) throw new Error(`${url} does not contain its expected site marker.`);

  console.log(`Production check passed: ${url}`);
}
