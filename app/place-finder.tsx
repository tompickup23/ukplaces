"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { publishedPlaces } from "./data";

type PlaceFinderProps = {
  compact?: boolean;
};

export function PlaceFinder({ compact = false }: PlaceFinderProps) {
  const [query, setQuery] = useState("");
  const cleanQuery = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!cleanQuery) return [];

    return publishedPlaces.filter((place) =>
      [place.name, place.label, ...place.aliases].some((term) =>
        term.toLowerCase().includes(cleanQuery),
      ),
    );
  }, [cleanQuery]);

  return (
    <div className={`place-finder${compact ? " place-finder--compact" : ""}`}>
      <label className="sr-only" htmlFor="place-search">Search published UK Places profiles</label>
      <div className="place-finder-input">
        <Search size={18} aria-hidden="true" />
        <input
          id="place-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a place or council area"
          autoComplete="off"
        />
      </div>
      {cleanQuery ? (
        <div className="place-search-results" aria-live="polite">
          {matches.length ? matches.map((place) => (
            <Link href={place.href} key={place.slug}>
              <span><strong>{place.name}</strong><small>{place.label} · {place.region}</small></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          )) : <p>No published profile matches that search yet. Coverage is added only when the local data has been checked.</p>}
        </div>
      ) : null}
    </div>
  );
}
