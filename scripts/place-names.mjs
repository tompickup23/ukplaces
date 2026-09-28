// Display and search names derived from the ONS name, never typed by hand.
//
// ONS lists a few authorities in inverted form so they sort under their own name:
// "Bristol, City of" is the City of Bristol. Only a trailing ", City of" or
// ", County of" is an inversion; "Newry, Mourne and Down" is a list and stays as it is.
// The registry keeps `name` exactly as ONS publishes it, and lists sort on it.
const ONS_INVERTED = /^(.+), (City|County) of$/;

export function displayNameFor(onsName) {
  const match = onsName.match(ONS_INVERTED);
  return match ? `${match[2]} of ${match[1]}` : onsName;
}

// The display name, the name without its status, and the ONS form, in that order.
export function searchNamesFor(onsName) {
  const match = onsName.match(ONS_INVERTED);
  return match ? [displayNameFor(onsName), match[1], onsName] : [onsName];
}

// Lower case, apostrophes dropped, every other run of punctuation or space one space.
// The two finder scripts carry an exact copy of this line; test:registry checks it.
export const normaliseSearchText = (text) => text.toLocaleLowerCase("en-GB").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

// One string per place that a query matches only at the start of a word, so "hull"
// finds Kingston upon Hull and not Solihull. Names are kept apart by " | ", which a
// normalised query cannot contain.
export function searchKey(names) {
  return ` ${[...new Set(names.map(normaliseSearchText))].join(" | ")}`;
}

export function matchesQuery(key, query) {
  const normalised = normaliseSearchText(query);
  return normalised.length > 0 && key.includes(` ${normalised}`);
}
