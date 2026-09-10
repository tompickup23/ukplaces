import registry from "../data/registry/places.json";
import constituencies from "../data/registry/constituencies.json";
import { getRegionGroups } from "../lib/regions";

export const prerender = true;

const siteUrl = "https://ukplaces.co.uk";
const staticPaths = ["/", "/places/", "/constituencies/", "/methodology/", "/sources/", "/updates/"];

export function GET() {
  const paths = [
    ...staticPaths,
    ...Object.values(registry).map((place) => `/places/${place.slug}/`),
    ...Object.values(constituencies).map((constituency) => `/constituencies/${constituency.slug}/`),
    ...getRegionGroups().map((region) => `/places/regions/${region.slug}/`),
  ];
  const urls = paths.map((pathname) => `<url><loc>${siteUrl}${pathname}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml" },
  });
}
