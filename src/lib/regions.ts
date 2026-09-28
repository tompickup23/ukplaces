import registry from "../data/registry/places.json";

type Place = {
  gss: string;
  slug: string;
  name: string;
  displayName: string;
  type: string;
  country: string;
  region: string;
};

export type RegionGroup = {
  slug: string;
  name: string;
  country: string;
  places: Place[];
};

export function regionSlug(region: string): string {
  return region.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getRegionGroups(): RegionGroup[] {
  const groups = new Map<string, RegionGroup>();

  for (const place of Object.values(registry) as Place[]) {
    const key = `${place.country}:${place.region}`;
    const current = groups.get(key);
    if (current) {
      current.places.push(place);
      continue;
    }
    groups.set(key, {
      slug: regionSlug(place.region),
      name: place.region,
      country: place.country,
      places: [place],
    });
  }

  return [...groups.values()]
    .map((group) => ({ ...group, places: group.places.sort((left, right) => left.name.localeCompare(right.name)) }))
    .sort((left, right) => left.country.localeCompare(right.country) || left.name.localeCompare(right.name));
}

const normaliseRegionKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const registryRegionNames = new Map(
  (Object.values(registry) as Place[]).map((place) => [normaliseRegionKey(place.region), place.region]),
);

// "east_of_england" to "East of England", for a key that matches no registry region.
export function titleCaseRegion(key: string): string {
  return key
    .split(/[_\s]+/)
    .map((word, index) => (index > 0 && ["of", "and", "the"].includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

// A constituency's region as a registry region with a page: the one region all its
// known local authorities share, else the source's region key where it names a
// registry region exactly. Anything else is shown as text with no link.
export function resolveConstituencyRegion(
  regionKey: string | null,
  ladCodes: string[],
): { name: string; slug: string | null } | null {
  const places = registry as Record<string, Place>;
  const authorityRegions = new Set(ladCodes.filter((gss) => places[gss]).map((gss) => places[gss].region));
  const name = authorityRegions.size === 1
    ? [...authorityRegions][0]
    : regionKey ? registryRegionNames.get(normaliseRegionKey(regionKey)) ?? null : null;
  if (name) return { name, slug: regionSlug(name) };
  return regionKey ? { name: titleCaseRegion(regionKey), slug: null } : null;
}
