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
export function londonToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
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
