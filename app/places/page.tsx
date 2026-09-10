import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, MapPinned } from "lucide-react";
import Link from "next/link";

import { PlaceFinder } from "../place-finder";
import { publishedPlaces } from "../data";
import { SiteFooter, SiteHeader } from "../site-shell";

export const metadata: Metadata = {
  title: "Browse places",
  description: "Browse published UK Places local-data profiles. Each profile makes its geography, source dates and coverage clear.",
  alternates: { canonical: "/places/" },
};

export default function PlacesPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <section className="directory-hero">
          <div>
            <p className="eyebrow"><MapPinned size={15} aria-hidden="true" /> Place directory</p>
            <h1>Find a local data profile.</h1>
            <p>Search the profiles that have been checked against their source records. The national directory is growing deliberately, not by filling every place with the same generic text.</p>
          </div>
          <PlaceFinder compact />
        </section>
        <section className="published-places" aria-labelledby="published-places-title">
          <div className="section-kicker"><span>Published now</span><p>Each profile has a defined geography, dated figures and direct source links.</p></div>
          <h2 id="published-places-title">Profiles ready to read.</h2>
          <div className="place-grid">
            {publishedPlaces.map((place) => (
              <Link className="place-tile" href={place.href} key={place.slug}>
                <div><span className="place-tile-type">{place.boundary}</span><h3>{place.name}</h3><p>{place.region}</p></div>
                <ul>{place.coverage.map((topic) => <li key={topic}><CheckCircle2 size={14} aria-hidden="true" /> {topic}</li>)}</ul>
                <strong>Open profile <ArrowRight size={16} aria-hidden="true" /></strong>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
