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
const DESCRIPTION_END = "Sources and dates on the record.";

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

// Rows with a value, in manifest order, each "label value (period)", joined with
// semicolons. Rows are added in order while the description stays within the
// maximum; the full list is always on the page.
export function describePlace(
  place: { name: string; type: string; region: string; country: string; gss: string },
  signals: Signal[],
): string {
  const parts: string[] = [];
  for (const signal of signals.filter((item) => item.value !== null)) {
    const candidate = `${place.name}: ${[...parts, describeSignal(signal)].join("; ")}. ${DESCRIPTION_END}`;
    if (candidate.length > DESCRIPTION_MAX) break;
    parts.push(describeSignal(signal));
  }
  const area = place.region === place.country ? place.country : `${place.region}, ${place.country}`;
  if (parts.length === 0) {
    return `${place.name}: ${place.type.toLowerCase()} in ${area}, GSS code ${place.gss}. ${DESCRIPTION_END}`;
  }
  const description = `${place.name}: ${parts.join("; ")}. ${DESCRIPTION_END}`;
  if (description.length >= DESCRIPTION_MIN) return description;
  return `${place.name}, ${place.type.toLowerCase()} in ${area}: ${parts.join("; ")}. ${DESCRIPTION_END}`;
}

// The long pattern claims public money and representation, so it is used only
// where both of those sources cover the place as well as at least one other.
export function placeTitle(name: string, coveredSourceIds: string[]): string {
  const hasMoneyAndRepresentation = coveredSourceIds.includes("aidoge") && coveredSourceIds.includes("ukelections");
  return coveredSourceIds.length >= 3 && hasMoneyAndRepresentation
    ? `${name}: local data, public money and representation`
    : `${name}: local data and sources`;
}
