import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, CircleHelp, FileText, MapPinned } from "lucide-react";
import Link from "next/link";

import { burnley, burnleyStructuredData } from "../../data";
import { SiteFooter, SiteHeader } from "../../site-shell";

export const metadata: Metadata = {
  title: "Burnley local data: elections, crime, council payments and asylum support",
  description: "Burnley local authority data: council representation, recorded crime, published council payments and asylum support. Every figure includes its period, definition and source link.",
  alternates: { canonical: "/places/burnley/" },
  openGraph: { url: "/places/burnley/", title: "Burnley local data", description: "Council representation, recorded crime, published payments and asylum support—with dates, definitions and source links.", images: [] },
  twitter: { images: [] },
};

export default function BurnleyPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(burnleyStructuredData) }} />
        <article>
          <section className="profile-hero">
            <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">UK Places</Link><span>/</span><Link href="/places/">Places</Link><span>/</span><span aria-current="page">Burnley</span></nav>
            <div className="profile-hero-grid">
              <div>
                <p className="eyebrow"><MapPinned size={15} aria-hidden="true" /> Burnley · Lancashire · North West England</p>
                <h1>Burnley local data.</h1>
                <p className="profile-lede">A clear starting point for Burnley’s council representation, recorded crime, published council payments and asylum support.</p>
                <div className="profile-actions"><a className="button button--primary" href="#latest-figures">See the latest figures <ArrowRight size={16} aria-hidden="true" /></a><a className="text-link" href="#sources">Check every source</a></div>
              </div>
              <aside className="profile-status">
                <span className="status-label"><CheckCircle2 size={15} aria-hidden="true" /> Profile reviewed</span>
                <strong>{burnley.profileReviewed}</strong>
                <dl><div><dt>Geography</dt><dd>Local authority area</dd></div><div><dt>Records included</dt><dd>4 source routes</dd></div></dl>
                <p>Each record has its own reference date. Read the date beside a figure before comparing it with another subject.</p>
              </aside>
            </div>
          </section>

          <section className="profile-navigation" aria-label="Burnley profile navigation">
            <div><span>On this page</span><a href="#latest-figures">Latest figures</a><a href="#local-record">The local record</a><a href="#sources">Source ledger</a></div>
            <p><CalendarDays size={15} aria-hidden="true" /> Reference dates vary by subject; each is shown beside its figure.</p>
          </section>

          <section className="profile-snapshot" id="latest-figures" aria-labelledby="snapshot-title">
            <div className="profile-section-heading"><p className="eyebrow"><span className="number-chip">01</span> Latest figures</p><h2 id="snapshot-title">Four local records, kept separate.</h2><p>These figures answer different questions. Their source date and definition are part of the result—not small print.</p></div>
            <div className="profile-stat-grid">
              {burnley.topics.map((topic) => <a className={`profile-stat profile-stat--${topic.theme}`} href={`#${topic.id}`} key={topic.id}><span>{topic.source}</span><strong>{topic.value}</strong><b>{topic.valueLabel}</b><small>{topic.dataDate}</small><ArrowRight size={16} aria-hidden="true" /></a>)}
            </div>
          </section>

          <section className="comparison-note"><CircleHelp size={21} aria-hidden="true" /><div><strong>Do not turn this page into a league table.</strong><p>Representation, recorded crime, payment records and asylum support use different systems and periods. They are useful side by side, but they do not add up to one judgement about Burnley.</p></div></section>

          <section className="local-record-section" id="local-record" aria-labelledby="record-title">
            <div className="profile-section-heading"><p className="eyebrow"><span className="number-chip">02</span> The local record</p><h2 id="record-title">What each source says about Burnley.</h2><p>Open the detailed record for current tables, trends, downloads and methodology.</p></div>
            <div className="profile-content-layout">
              <aside className="profile-rail"><span>Burnley data</span><a href="#representation">Representation</a><a href="#crime">Crime</a><a href="#payments">Public money</a><a href="#asylum-support">Asylum support</a></aside>
              <div className="profile-topic-list">
                {burnley.topics.map((topic) => (
                  <section className={`profile-topic profile-topic--${topic.theme}`} id={topic.id} key={topic.id}>
                    <div className="topic-head"><span>{topic.number}</span><p>{topic.source}</p></div>
                    <div className="topic-main"><p className="topic-question">{topic.label}</p><h3>{topic.headline}</h3><p>{topic.summary}</p><a href={topic.href} rel="noreferrer" target="_blank">Open the full {topic.source} record <ArrowUpRight size={16} aria-hidden="true" /></a></div>
                    <dl className="topic-metrics">{topic.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                    <div className="topic-definition"><FileText size={16} aria-hidden="true" /><p><strong>What this covers:</strong> {topic.definition}</p></div>
                  </section>
                ))}
              </div>
            </div>
          </section>

          <section className="source-ledger-v2" id="sources" aria-labelledby="sources-title">
            <div className="ledger-v2-intro"><p className="eyebrow"><span className="number-chip">03</span> Source ledger</p><h2 id="sources-title">See exactly where the figures come from.</h2><p>UK Places summarises a local signal; the linked specialist project owns the detailed data, update schedule and methodology.</p></div>
            <div className="source-ledger-list">{burnley.topics.map((topic) => <a href={topic.href} key={topic.id} rel="noreferrer" target="_blank"><span>{topic.label}</span><strong>{topic.source}</strong><small>{topic.dataDate}</small><ArrowUpRight size={17} aria-hidden="true" /></a>)}</div>
          </section>

          <section className="profile-next">
            <div><p className="eyebrow">Next step</p><h2>Use the detailed record when the decision needs more detail.</h2></div>
            <div><Link href="/places/">Browse published places <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/methodology/">Read how the figures are selected <ArrowRight size={17} aria-hidden="true" /></Link></div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
