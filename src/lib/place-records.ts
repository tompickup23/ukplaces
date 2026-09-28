import { calendarFor } from "./school-holidays";
import registry from "../data/registry/places.json";
import sources from "../data/sources.json";
import changelog from "../data/changelog.json";
import type { Signal } from "./place-meta";

type Coverage = { hasPage: boolean; slug: string | null; url: string | null };
export type Source = (typeof sources)[number];
export type Place = {
  gss: string;
  slug: string;
  name: string;
  displayName: string;
  searchNames: string[];
  officialName: string;
  type: string;
  country: string;
  region: string;
  county: string | null;
  parentGss: string | null;
  wikidata: string | null;
  reorganisation: { note: string; sourceUrl: string } | null;
  coverage: Record<string, Coverage>;
};

export const placesByGss = registry as Record<string, Place>;

const signalModules = import.meta.glob("../data/signals/*.json", { eager: true });
const feedsBySource = Object.fromEntries(
  Object.entries(signalModules).map(([filePath, module]) => [
    filePath.split("/").at(-1)?.replace(/\.json$/, ""),
    (module as { default: Record<string, Signal> }).default,
  ]),
) as Record<string, Record<string, Signal>>;
const blankSignal: Signal = { value: null, unit: null, label: null, period: null, snapshotDate: null, url: null };

// One row per source in manifest order, only where the registry confirms a page.
export function getCoverageRows(gss: string): { source: Source; signal: Signal }[] {
  const place = placesByGss[gss];
  return sources
    .filter((source) => place.coverage[source.id]?.hasPage)
    .map((source) => ({ source, signal: feedsBySource[source.id]?.[gss] ?? blankSignal }));
}

const latestDate = (dates: (string | null | undefined)[]) => dates
  .filter((date): date is string => typeof date === "string")
  .sort()
  .at(-1) ?? null;

// The latest snapshot date across a place's signals, or null when none carries one.
export function getSignalsLastModified(gss: string): string | null {
  return latestDate(getCoverageRows(gss).map(({ signal }) => signal.snapshotDate));
}

// The place page also shows its school holiday card, so it moves when the card does.
export function getLastModified(gss: string): string | null {
  return latestDate([getSignalsLastModified(gss), calendarFor(placesByGss[gss])?.contentDate]);
}

export function getLatestChangelogDate(): string | null {
  return changelog.map((entry) => entry.date).sort().at(-1) ?? null;
}
