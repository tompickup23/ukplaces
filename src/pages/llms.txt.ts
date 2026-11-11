import constituencies from "../data/registry/constituencies.json";
import { placesByGss } from "../lib/place-records";
import { getRegionGroups } from "../lib/regions";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/site";

export const prerender = true;

// A plain guide to the site for language model crawlers. Counts are read from the registry.
export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${DEFAULT_DESCRIPTION}`,
    "",
    `${SITE_NAME} holds one record for each of the ${Object.keys(placesByGss).length} local authorities in the United Kingdom, a page for each of ${Object.keys(constituencies).length} Westminster constituencies and ${getRegionGroups().length} nation and region pages. A record is for a local authority, not for a town with the same name.`,
    "",
    "## Records",
    "",
    `- [All local authorities](${SITE_URL}/places/): every record by nation and region`,
    `- [All constituencies](${SITE_URL}/constituencies/): every Westminster constituency with its local authorities`,
    `- Record address pattern: ${SITE_URL}/places/<slug>/, for example ${SITE_URL}/places/burnley/`,
    "",
    "## About the data",
    "",
    `- [Methodology](${SITE_URL}/methodology/): the rules for geography and figures`,
    `- [Sources](${SITE_URL}/sources/): the specialist sources behind the dated figures`,
    `- [Corrections](${SITE_URL}/corrections/): how errors are checked and fixed`,
    `- [About](${SITE_URL}/about/): who publishes the site`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
