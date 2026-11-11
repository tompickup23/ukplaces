// Leaf module: page metadata built from the registry and signal feeds. It imports
// nothing from the site so the page, the OG endpoint and the scripts can share it.

export type Signal = {
  value: string | number | null;
  unit: string | null;
  label: string | null;
  period: string | null;
  snapshotDate: string | null;
  url: string | null;
};

export const DESCRIPTION_MIN = 70;
export const DESCRIPTION_MAX = 300;
// Search results cut a description at about this length, so the answer comes first
// and optional clauses are added only while the text stays inside it.
export const PLACE_DESCRIPTION_TARGET = 160;

// Only the first clause of a unit or period: the feeds put a second clause after a
// semicolon (a rate, a dataset date), and the description list is semicolon-joined.
const firstClause = (text: string) => text.split(";")[0].trim().replace(/\.$/, "");

export function formatSignalValue(signal: Signal): string {
  if (signal.value === null) return "";
  const value = Number.isInteger(signal.value) ? (signal.value as number).toLocaleString("en-GB") : String(signal.value);
  return signal.unit === "GBP" || signal.unit === "%" || !signal.unit ? value : `${value} ${firstClause(signal.unit)}`;
}

export function describeSignal(signal: Signal): string {
  const period = signal.period ? ` (${firstClause(signal.period)})` : "";
  return `${signal.label} ${formatSignalValue(signal)}${period}`;
}

type PlaceGeography = {
  displayName: string;
  type: string;
  region: string;
  country: string;
  county: string | null;
  gss: string;
  officialName: string;
};

// An authority type inside a sentence: lower case, except that London keeps its capital.
export function typePhrase(type: string): string {
  return type.toLowerCase().replace(/\blondon\b/g, "London").replace(/\bnorthern ireland\b/g, "Northern Ireland").replace(/\bwelsh\b/g, "Welsh");
}

// The type as it reads before "in <country>": "Northern Ireland local government
// district in Northern Ireland" and "Welsh principal area in Wales" name the country twice.
export function typeInSentence(place: Pick<PlaceGeography, "type" | "region" | "country">): string {
  const phrase = typePhrase(place.type);
  return place.region === place.country ? phrase.replace(/^(Northern Ireland|Welsh) /, "") : phrase;
}

// Where a place is, from the registry alone. Scotland, Wales and Northern Ireland
// have region equal to country, so the country is named once.
export function whereText(place: Pick<PlaceGeography, "region" | "country" | "county">): string {
  if (place.region === place.country) return `in ${place.country}`;
  return `${place.county ? `in the ceremonial county of ${place.county}, ` : ""}in the ${place.region} region of ${place.country}`;
}

// The geography answer first: type, county, region and code. The council's official
// name and the county council follow only while the text stays within the target.
export function describePlace(place: PlaceGeography, countyCouncilName: string | null): string {
  let description = `${place.displayName} is a ${typeInSentence(place)} ${whereText(place)}. GSS code ${place.gss}.`;
  const extras = [
    countyCouncilName ? `County council: ${countyCouncilName}.` : null,
    place.officialName !== place.displayName ? `Council: ${place.officialName}.` : null,
    "Council, constituencies and dated sources on the record.",
  ];
  for (const extra of extras) {
    if (extra && `${description} ${extra}`.length <= PLACE_DESCRIPTION_TARGET) description = `${description} ${extra}`;
  }
  return description;
}

// The title names the code and what the page answers. It promises a county only
// where the registry holds one.
export function placeTitle(place: Pick<PlaceGeography, "displayName" | "gss" | "region" | "country" | "county">): string {
  const answers = place.region === place.country
    ? "country, council and codes"
    : place.county ? "county, region and council" : "region, council and codes";
  return `${place.displayName} (${place.gss}): ${answers}`;
}
