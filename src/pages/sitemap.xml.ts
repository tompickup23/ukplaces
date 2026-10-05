import { constituencyLastModified } from "../lib/constituency-dates";
import constituencies from "../data/registry/constituencies.json";
import { getLastModified, getLatestChangelogDate, getSignalsLastModified, placesByGss } from "../lib/place-records";
import { getRegionGroups } from "../lib/regions";

export const prerender = true;

const siteUrl = "https://ukplaces.co.uk";
const staticPaths = ["/", "/places/", "/constituencies/", "/methodology/", "/sources/", "/updates/", "/privacy/"];

type Entry = { pathname: string; lastmod: string | null };

export function GET() {
  const staticDate = getLatestChangelogDate();
  const entries: Entry[] = [
    ...staticPaths.map((pathname) => ({ pathname, lastmod: staticDate })),
    ...Object.values(placesByGss).map((place) => ({ pathname: `/places/${place.slug}/`, lastmod: getLastModified(place.gss) })),
    ...Object.values(constituencies).map((constituency) => ({
      pathname: `/constituencies/${constituency.slug}/`,
      lastmod: constituencyLastModified(constituency),
    })),
    // A region page changes when the signals of one of its places do. It shows no
    // school holiday card, so a calendar change does not move it.
    ...getRegionGroups().map((region) => ({
      pathname: `/places/regions/${region.slug}/`,
      lastmod: region.places.map((place) => getSignalsLastModified(place.gss)).filter((date): date is string => date !== null).sort().at(-1) ?? null,
    })),
  ];
  const urls = entries
    .map(({ pathname, lastmod }) => `<url><loc>${siteUrl}${pathname}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`)
    .join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml" },
  });
}
