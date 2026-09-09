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
        <p id="finder-title">Find a place</p>
        <span>Launch profile available</span>
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
        {!submitted && <p>Start with Burnley or use a place name to see what is being added next.</p>}
        {submitted && hasBurnleyMatch && (
          <a href="#burnley">
            <span><strong>Burnley</strong><small>Lancashire, England · five linked sources</small></span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        )}
        {submitted && !hasBurnleyMatch && (
          <p>Burnley is the full launch profile. More verified place routes are being added next.</p>
        )}
      </div>
    </section>
  );
}
