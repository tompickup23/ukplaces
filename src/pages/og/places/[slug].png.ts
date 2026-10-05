import type { APIRoute } from "astro";
import { renderOgCard } from "../../../lib/og";
import { buildOg } from "../../../lib/og-flag";
import { formatSignalValue } from "../../../lib/place-meta";
import { getCoverageRows, placesByGss } from "../../../lib/place-records";

export const prerender = true;

// One card per place: name, type and region, then each source signal with a
// value as label and value on one line. Gated on BUILD_OG=1 through
// getStaticPaths, so an iteration build renders nothing.
export function getStaticPaths() {
  if (!buildOg) return [];
  return Object.values(placesByGss).map((place) => ({ params: { slug: place.slug }, props: { gss: place.gss } }));
}

export const GET: APIRoute = async ({ props }) => {
  const place = placesByGss[props.gss as string];
  const lines = getCoverageRows(place.gss)
    .filter(({ signal }) => signal.value !== null && signal.label)
    .map(({ source, signal }) => ({ label: signal.label as string, value: formatSignalValue(signal), accent: source.accent }));
  const png = await renderOgCard({
    heading: place.displayName,
    eyebrow: place.region === place.country ? `${place.type} · ${place.country}` : `${place.type} · ${place.region}`,
    lines,
    path: `/places/${place.slug}/`,
  });
  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
