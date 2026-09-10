import type { Metadata } from "next";
import { ArrowUpRight, Check, Info, MoveRight } from "lucide-react";
import Link from "next/link";

import { burnley, burnleyStructuredData } from "../../data";
import { SiteFooter, SiteHeader } from "../../site-shell";

export const metadata: Metadata = {
  title: "Burnley local data: elections, crime, payments and asylum support",
  description: "Burnley local data, clearly sourced: council representation, recorded crime, published council payments and asylum support, with dates and definitions.",
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
          <section className="place-hero">
            <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">UK Places</Link><span>/</span><Link href="/#places">Places</Link><span>/</span><span aria-current="page">Burnley</span></nav>
            <div className="place-hero-grid">
              <div>
                <p className="eyebrow">Burnley · Lancashire</p>
                <h1>Burnley local data.</h1>
                <p className="place-lede">{burnley.description}</p>
              </div>
              <aside className="review-card">
                <span>Profile reviewed</span><strong>{burnley.profileReviewed}</strong>
                <p>Each source has its own reference date. Use the date beside a figure before comparing it with another topic.</p>
              </aside>
            </div>
          </section>

          <nav className="topic-nav" aria-label="Burnley profile topics">
            {burnley.topics.map((topic) => <a href={`#${topic.id}`} key={topic.id}><span>{topic.number}</span>{topic.label}</a>)}
          </nav>

          <section className="snapshot-section" aria-labelledby="snapshot-title">
            <div className="section-heading section-heading--compact"><div><p className="eyebrow"><span className="number-chip">01</span> Latest available figures</p><h2 id="snapshot-title">Start with the measure, not the claim.</h2></div><p>These four records answer different questions. Their source dates are deliberately kept visible.</p></div>
            <div className="snapshot-grid">
              {burnley.topics.map((topic) => <a className={`snapshot-card snapshot-card--${topic.theme}`} href={`#${topic.id}`} key={topic.id}><span className="snapshot-source">{topic.source}</span><strong>{topic.value}</strong><span className="snapshot-label">{topic.valueLabel}</span><small>{topic.dataDate}</small></a>)}
            </div>
          </section>

          <aside className="reading-note"><Info size={20} aria-hidden="true" /><div><strong>Read this profile with care.</strong><p>Representation, recorded crime, payment records and asylum support are not a single league table. They use different systems, periods and definitions.</p></div></aside>

          <section className="evidence-section" aria-labelledby="evidence-title">
            <div className="evidence-intro"><p className="eyebrow"><span className="number-chip">02</span> Evidence by subject</p><h2 id="evidence-title">What the figures say—and what they do not.</h2></div>
            <div className="evidence-list">
              {burnley.topics.map((topic) => (
                <article className={`evidence-card evidence-card--${topic.theme}`} id={topic.id} key={topic.id}>
                  <div className="evidence-marker"><span>{topic.number}</span><p>{topic.source}</p></div>
                  <div className="evidence-copy"><p className="evidence-topic">{topic.label}</p><h3>{topic.headline}</h3><p>{topic.summary}</p><a href={topic.href} rel="noreferrer" target="_blank">Open the {topic.source} record <ArrowUpRight size={15} aria-hidden="true" /></a></div>
                  <dl className="evidence-metrics">
                    {topic.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                  </dl>
                  <div className="evidence-definition"><Info size={16} aria-hidden="true" /><p><strong>What this covers:</strong> {topic.definition}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section className="source-ledger" aria-labelledby="ledger-title">
            <div className="ledger-intro"><p className="eyebrow"><span className="number-chip">03</span> Source ledger</p><h2 id="ledger-title">Where each figure comes from.</h2><p>The full methodology, update cadence and data download remain with the specialist project that owns the subject.</p></div>
            <div className="ledger-table-wrap"><table><thead><tr><th>Subject</th><th>Source and period</th><th>What this profile uses</th><th><span className="sr-only">Source link</span></th></tr></thead><tbody>
              {burnley.topics.map((topic) => <tr key={topic.id}><th scope="row">{topic.label}</th><td>{topic.source}<small>{topic.dataDate}</small></td><td>{topic.value} · {topic.valueLabel}</td><td><a href={topic.href} rel="noreferrer" target="_blank" aria-label={`Open ${topic.source} record for ${topic.label}`}><ArrowUpRight size={17} aria-hidden="true" /></a></td></tr>)}
            </tbody></table></div>
          </section>

          <section className="next-read" aria-labelledby="next-read-title"><div><p className="eyebrow">Keep reading</p><h2 id="next-read-title">Understand the method before drawing a conclusion.</h2></div><div><Link href="/methodology/">How UK Places selects and explains data <MoveRight size={18} aria-hidden="true" /></Link><Link href="/sources/">See every source in the network <MoveRight size={18} aria-hidden="true" /></Link></div></section>

          <section className="profile-promise" aria-label="Profile promise"><Check size={21} aria-hidden="true" /><p><strong>Clear context, not a verdict.</strong> For the current detail, trends and methodology, use the specialist source linked in every section.</p></section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
