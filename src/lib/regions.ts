import registry from "../data/registry/places.json";

type Place = {
  gss: string;
  slug: string;
  name: string;
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
