// What the school holiday card shows, with no Node imports so the browser script
// can use it too. The card renders only from cardContent(), and the sitemap date
// hashes the same object, so lastmod moves only when the card would read differently.

export function cardContent(selection) {
  const { authority, year } = selection;
  return {
    authorityName: authority.name,
    authorityUrl: authority.url,
    academicYear: year.academicYear,
    sourceUrl: year.sourceUrl,
    // Some rows carry a full timestamp; the card shows the day only.
    retrievedAt: /^\d{4}-\d{2}-\d{2}/.test(year.retrievedAt ?? "") ? year.retrievedAt.slice(0, 10) : null,
    breaks: year.breaks.map(({ label, start, end }) => ({ label, start, end })),
  };
}

// Today's date in the UK as YYYY-MM-DD, read in the browser, never at build time.
// Built from the parts rather than a locale pattern, which browsers have changed.
export function londonToday(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(now).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

// The break under way today, else the next one to start, else null.
export function nextBreak(breaks, today) {
  const upcoming = breaks.filter((item) => item.end >= today).sort((left, right) => left.start.localeCompare(right.start));
  return upcoming[0] ?? null;
}

const parse = (iso) => new Date(`${iso}T00:00:00Z`);
const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
const dayMonthYear = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function formatLongDate(iso) {
  return dayMonthYear.format(parse(iso));
}

// "26 to 30 October 2026", "26 March to 9 April 2027", "21 December 2026 to 1 January 2027".
export function formatBreakRange({ start, end }) {
  if (start === end) return formatLongDate(start);
  if (start.slice(0, 4) !== end.slice(0, 4)) return `${formatLongDate(start)} to ${formatLongDate(end)}`;
  if (start.slice(0, 7) === end.slice(0, 7)) return `${parse(start).getUTCDate()} to ${formatLongDate(end)}`;
  return `${dayMonth.format(parse(start))} to ${formatLongDate(end)}`;
}

export function describeBreak(item, today) {
  const lead = item.start <= today ? "Current break" : "Next recorded break";
  return `${lead}: ${item.label}, ${formatBreakRange(item)}.`;
}

// Most calendars stop before the summer holidays, so after the last recorded break
// the card points to the full calendar rather than implying there is no holiday.
export function describeNoBreak(academicYear) {
  return `No further break is listed here for ${academicYear}. The full calendar below has the latest published dates.`;
}
