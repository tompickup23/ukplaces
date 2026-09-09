"use client";

import { type FormEvent, useState } from "react";
import { ArrowUpRight, MapPin, Search } from "lucide-react";

export function PlaceFinder() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const hasBurnleyMatch = query.trim().toLowerCase().includes("burnley");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="place-finder" id="find" aria-labelledby="finder-title">
      <div className="finder-topline">
        <p id="finder-title">Find your area</p>
        <span>Burnley is ready</span>
      </div>
      <form className="finder-form" onSubmit={handleSubmit}>
        <MapPin size={20} aria-hidden="true" />
        <input
          className="finder-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Town, constituency or local authority"
          aria-label="Find a place"
        />
        <button className="finder-button" type="submit">
          <Search aria-hidden="true" />
          Search
        </button>
      </form>
      <div className="finder-result" aria-live="polite">
        {!submitted && <p>Search Burnley now. More places are being added.</p>}
        {submitted && hasBurnleyMatch && (
          <a href="#burnley">
            <span><strong>Burnley</strong><small>Lancashire · four linked sources</small></span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        )}
        {submitted && !hasBurnleyMatch && (
          <p>Burnley is available now. More places are being added.</p>
        )}
      </div>
    </section>
  );
}
