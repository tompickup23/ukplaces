import { ArrowRight, Check, Layers3, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { siteUrl, sources } from "./data";
import { SiteFooter, SiteHeader } from "./site-shell";

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "UK Places",
      description: "Source-led local data, explained clearly.",
      inLanguage: "en-GB",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "UK Places",
      url: siteUrl,
      logo: `${siteUrl}/uk-places-mark.svg`,
    },
  ],
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }} />
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="eyebrow"><Layers3 size={15} aria-hidden="true" /> UK place profiles</p>
            <h1>Local data, clearly sourced.</h1>
            <p className="hero-lede">
              UK Places brings together the local figures that matter, explains what they
              measure and links to the specialist record behind each one.
            </p>
            <div className="hero-actions">
              <Link className="button button--primary" href="/places/burnley/">Explore Burnley <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link className="text-link" href="/methodology/">How we select a place</Link>
            </div>
          </div>
          <aside className="hero-index-card" aria-labelledby="index-card-title">
            <div className="hero-index-head"><p id="index-card-title">The index</p><span>Profile coverage</span></div>
            <div className="index-count"><strong>01</strong><span>complete place profile</span></div>
            <Link className="index-place" href="/places/burnley/">
              <span className="index-place-icon"><MapPin size={18} aria-hidden="true" /></span>
              <span><strong>Burnley</strong><small>Lancashire · four source-led topics</small></span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <p className="index-note">More places are added only when each figure can be dated, defined and linked to its full source.</p>
          </aside>
        </section>

        <section className="directory-section" id="places" aria-labelledby="places-title">
          <div className="section-heading section-heading--compact">
            <div><p className="eyebrow"><span className="number-chip">01</span> Places</p><h2 id="places-title">A growing index, not a fake search box.</h2></div>
            <p>Burnley is the first full profile. It is live because the sources, dates and definitions are all in place.</p>
          </div>
          <Link className="place-directory-card" href="/places/burnley/">
            <div className="place-directory-main"><span className="place-directory-number">01</span><div><p>Burnley · Lancashire</p><h3>Four local records, one clearer starting point.</h3></div></div>
            <dl className="place-directory-stats">
              <div><dt>Representation</dt><dd>11 / 45 seats</dd></div>
              <div><dt>Recorded crime</dt><dd>107.4 / 1,000</dd></div>
              <div><dt>Published payments</dt><dd>£38.1m</dd></div>
              <div><dt>Asylum support</dt><dd>471 people</dd></div>
            </dl>
            <span className="place-directory-cta">Open Burnley profile <ArrowRight size={17} aria-hidden="true" /></span>
          </Link>
        </section>

        <section className="source-network" aria-labelledby="network-title">
          <div className="network-intro"><p className="eyebrow">Source network</p><h2 id="network-title">The hub explains. The specialists go deeper.</h2><p>UK Places does not pretend one number tells the whole story. Each profile gives context first, then sends you to the data project built for that subject.</p></div>
          <div className="source-list">
            {sources.map((source, index) => (
              <a className={`source-row source-row--${source.theme}`} href={source.href} key={source.key} rel="noreferrer" target="_blank">
                <span className="source-number">0{index + 1}</span><Image src={source.logo} alt="" width={116} height={30} /><span className="source-topic">{source.topic}</span><ArrowRight size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="standards-section" aria-labelledby="standards-title">
          <div><p className="eyebrow"><ShieldCheck size={15} aria-hidden="true" /> Publishing standards</p><h2 id="standards-title">Every number must earn its place.</h2></div>
          <ol className="standard-list">
            <li><span>01</span><div><h3>A named source</h3><p>We link to the specialist project and the underlying public record where it is available.</p></div></li>
            <li><span>02</span><div><h3>A clear date</h3><p>Figures from different systems are never presented as if they were measured on the same day.</p></div></li>
            <li><span>03</span><div><h3>A useful definition</h3><p>We explain what a figure includes, and just as importantly, what it does not.</p></div></li>
          </ol>
        </section>

        <section className="home-promise" aria-label="UK Places promise"><Check size={21} aria-hidden="true" /><p><strong>Less noise. Better context.</strong> UK Places helps you find the source, understand the measure and decide what to read next.</p></section>
      </main>
      <SiteFooter />
    </>
  );
}
