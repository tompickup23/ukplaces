import { ArrowRight, CheckCircle2, Landmark, MapPinned, ShieldCheck } from "lucide-react";

import { burnley, siteUrl, sources } from "./data";
import { PlaceFinder } from "./place-finder";
import { SiteFooter, SiteHeader } from "./site-shell";

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "UK Places",
      description: "Clear, dated local data with direct links to the public records behind it.",
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

const topicDescriptions = [
  ["Representation", "Who holds local seats, what changed at the last election and where to read the full record.", "elections"],
  ["Crime and community", "Police-recorded crime in context, with dates, rates and the limits of each measure.", "demographics"],
  ["Public money", "Published council payments, suppliers and source files—without confusing them with a whole budget.", "doge"],
  ["Asylum support", "Home Office support data with the reporting period, local rate and a clear definition of what it covers.", "asylum"],
] as const;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }} />

        <section className="home-hero-v2" id="find-a-place">
          <div className="home-hero-copy-v2">
            <p className="eyebrow"><MapPinned size={15} aria-hidden="true" /> UK local data directory</p>
            <h1>Know your area. Follow the evidence.</h1>
            <p className="hero-lede-v2">UK Places brings together the public records that help explain an area—then shows the date, definition and detailed source behind every figure.</p>
            <PlaceFinder />
            <p className="finder-caption"><MapPinned size={15} aria-hidden="true" /> Burnley is the first published profile. New places are added when their local source coverage has been checked.</p>
          </div>

          <aside className="hero-proof-card" aria-labelledby="proof-title">
            <p className="eyebrow">What you get</p>
            <h2 id="proof-title">Useful before you click away.</h2>
            <ul>
              <li><span>01</span><div><strong>A clear local geography</strong><p>See whether a figure covers a council area, constituency or another defined boundary.</p></div></li>
              <li><span>02</span><div><strong>Dates beside the data</strong><p>Different sources update at different times. We keep that visible.</p></div></li>
              <li><span>03</span><div><strong>The full record in one click</strong><p>Every profile sends you to the specialist project that holds the detailed evidence.</p></div></li>
            </ul>
            <a href="/methodology/">How UK Places works <ArrowRight size={16} aria-hidden="true" /></a>
          </aside>
        </section>

        <section className="home-featured" aria-labelledby="featured-title">
          <div className="section-kicker"><span>Published profile</span><p>Each place page is reviewed by source, rather than filled with a generic national description.</p></div>
          <div className="featured-profile-grid">
            <div>
              <p className="eyebrow"><Landmark size={15} aria-hidden="true" /> Burnley · Lancashire</p>
              <h2 id="featured-title">The first full local profile.</h2>
              <p>{burnley.description}</p>
              <a className="button button--primary" href="/places/burnley/">Read the Burnley profile <ArrowRight size={16} aria-hidden="true" /></a>
            </div>
            <dl className="feature-metric-grid">
              {burnley.topics.map((topic) => <div className={`feature-metric feature-metric--${topic.theme}`} key={topic.id}><dt>{topic.label}</dt><dd>{topic.value}</dd><small>{topic.valueLabel}</small><span>{topic.dataDate}</span></div>)}
            </dl>
          </div>
        </section>

        <section className="topic-section" id="topics" aria-labelledby="topics-title">
          <div className="topic-intro"><p className="eyebrow"><ShieldCheck size={15} aria-hidden="true" /> Data topics</p><h2 id="topics-title">Different questions need different records.</h2><p>UK Places keeps local records distinct. A crime rate, election result, payment file and support count should not be rolled into one score.</p></div>
          <div className="topic-grid">
            {topicDescriptions.map(([name, description, theme], index) => (
              <a className={`topic-card topic-card--${theme}`} href="/places/burnley/" key={name}>
                <span>0{index + 1}</span><h3>{name}</h3><p>{description}</p><strong>See a local example <ArrowRight size={16} aria-hidden="true" /></strong>
              </a>
            ))}
          </div>
        </section>

        <section className="source-network-v2" aria-labelledby="network-title">
          <div><p className="eyebrow">The detailed records</p><h2 id="network-title">Start here. Go deeper there.</h2><p>UK Places is the practical starting point. The specialist projects below hold the complete data, methods and source files for each subject.</p><a className="text-link text-link--light" href="/sources/">See the source directory <ArrowRight size={15} aria-hidden="true" /></a></div>
          <div className="source-link-list">
            {sources.map((source) => <a className={`source-link source-link--${source.theme}`} href={source.href} key={source.key} rel="noreferrer" target="_blank"><span>{source.name}</span><small>{source.topic}</small><ArrowRight size={17} aria-hidden="true" /></a>)}
          </div>
        </section>

        <section className="home-standards" aria-labelledby="standards-title">
          <div><p className="eyebrow"><CheckCircle2 size={15} aria-hidden="true" /> Publishing standard</p><h2 id="standards-title">Useful beats exhaustive.</h2></div>
          <div className="standards-copy"><p>We publish a profile only when it can answer real local questions with current, attributable evidence. If a source does not cover an area, we say so rather than use a placeholder.</p><a href="/places/">Browse published places <ArrowRight size={16} aria-hidden="true" /></a></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
