import type { APIRoute } from "astro";
import constituencies from "../../../data/registry/constituencies.json";
import { renderOgCard } from "../../../lib/og";
import { buildOg } from "../../../lib/og-flag";
import { placesByGss } from "../../../lib/place-records";
import { resolveConstituencyRegion } from "../../../lib/regions";

export const prerender = true;

type Constituency = {
  slug: string;
  name: string;
  region: string | null;
  ladCodes: string[];
  result: { winnerParty: string | null };
};

// One card per constituency: name, region, its local authorities and the 2024
// winning party (the MP is named on the page, not repeated here). Gated on BUILD_OG=1.
export function getStaticPaths() {
  if (!buildOg) return [];
  return Object.values(constituencies).map((constituency) => ({ params: { slug: constituency.slug }, props: { slug: constituency.slug } }));
}

export const GET: APIRoute = async ({ props }) => {
  const constituency = (constituencies as Record<string, Constituency>)[props.slug as string];
  const region = resolveConstituencyRegion(constituency.region, constituency.ladCodes);
  const authorities = constituency.ladCodes.map((gss) => placesByGss[gss]?.name ?? gss);
  const authorityText = authorities.length > 3
    ? `${authorities.slice(0, 3).join(", ")} and ${authorities.length - 3} more`
    : authorities.length > 1 ? `${authorities.slice(0, -1).join(", ")} and ${authorities.at(-1)}` : authorities[0];
  const lines = [
    ...(authorityText ? [{ label: authorities.length > 1 ? "Local authorities" : "Local authority", value: authorityText }] : []),
    ...(constituency.result.winnerParty ? [{ label: "2024 winner", value: constituency.result.winnerParty }] : []),
  ];
  const png = await renderOgCard({
    heading: constituency.name,
    eyebrow: region ? `Parliamentary constituency · ${region.name}` : "Parliamentary constituency",
    lines,
    path: `/constituencies/${constituency.slug}/`,
  });
  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
