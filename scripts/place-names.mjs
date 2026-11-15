// Display and search names derived from the ONS name, never typed by hand.
//
// ONS lists a few authorities in inverted form so they sort under their own name:
// "Bristol, City of" is the City of Bristol. Only a trailing ", City of" or
// ", County of" is an inversion; "Newry, Mourne and Down" is a list and stays as it is.
// The registry keeps the source name except for evidenced short-name corrections.
const ONS_INVERTED = /^(.+), (City|County) of$/;

export const shortNameCorrections = {
  E07000112: {
    sourceName: "Shepway",
    name: "Folkestone and Hythe",
    publisher: "Folkestone and Hythe District Council",
    title: "Extraordinary meeting, Council, 17 January 2018: Proposal to change the name of the district, item 75",
    date: "2018-01-17",
    effectiveDate: "2018-04-01",
    url: "https://folkestone-hythe.moderngov.co.uk/ieListDocuments.aspx?CId=122&MeetingId=4420",
  },
};

export function shortNameFor(gss, sourceName) {
  const correction = shortNameCorrections[gss];
  if (!correction) return sourceName;
  if (![correction.sourceName, correction.name].includes(sourceName)) {
    throw new Error(`Unexpected short name for ${gss}; review the council evidence.`);
  }
  return correction.name;
}

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
