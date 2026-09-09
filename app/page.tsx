import {
  ArrowUpRight,
  BookOpenText,
  Check,
  Layers3,
  Search,
} from "lucide-react";

import { PlaceFinder } from "./place-finder";

const burnleyProjects = [
  {
    name: "UK Elections",
    focus: "Latest council result",
    stat: "11 / 45",
    statLabel: "Reform UK seats",
    headline: "Reform UK is the largest group, but Burnley remains under no overall control.",
    description: "The 7 May 2026 result left Reform 12 seats short of the 23 needed to run the council.",
    facts: [
      ["13 / 15", "ward winners called"],
      ["7 May 2026", "latest council vote"],
    ],
    source: "UK Elections · declared result and model audit",
    href: "https://ukelections.co.uk/seats/burnley/",
    theme: "elections",
    logo: "/brands/ukelections.svg",
    index: "01",
  },
  {
    name: "UK Demographics",
    focus: "Crime and community context",
    stat: "107.4",
    statLabel: "recorded crimes per 1,000",
    headline: "Burnley’s police-recorded crime rate sits above most local areas.",
    description: "The latest published rate is down 3.7% year-on-year. Explore the categories, local pressures and the data caveats behind it.",
    facts: [
      ["43.1", "violent crimes per 1,000"],
      ["84th", "national percentile"],
    ],
    source: "UK Demographics · Home Office data, year ending Mar 2024",
    href: "https://ukdemographics.co.uk/places/burnley/",
    theme: "demographics",
    logo: "/brands/ukdemographics.svg",
    index: "02",
  },
  {
    name: "AI DOGE",
    focus: "Public money",
    stat: "£38.1m",
    statLabel: "published payments held",
    headline: "See where Burnley Borough Council’s published payments went in 2025/26.",
    description: "4,489 transactions over £500 are available to search, with every total linked back to the council’s published files.",
    facts: [
      ["843", "suppliers in the record"],
      ["6 Sep 2026", "last source refresh"],
    ],
    source: "AI DOGE · 2025/26 published payment records",
    href: "https://aidoge.co.uk/councils/burnley/",
    theme: "doge",
    logo: "/brands/aidoge.svg",
    index: "03",
  },
  {
    name: "Asylum Stats",
    focus: "Asylum support",
    stat: "471",
    statLabel: "people on asylum support",
    headline: "Burnley’s published asylum-support rate is 46.66 per 10,000 residents.",
    description: "Follow the local trend, accommodation split and the official data behind one of the country’s highest per-head support rates.",
    facts: [
      ["466", "in dispersal accommodation"],
      ["30 Jun 2026", "latest source update"],
    ],
    source: "Asylum Stats · Home Office local data",
    href: "https://asylumstats.co.uk/places/burnley/",
    theme: "asylum",
    logo: "/brands/asylumstats.svg",
    index: "04",
  },
];

const siteUrl = "https://ukplaces.tom-pickup-2333.chatgpt.site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "UK Places",
      description: "A source-led index for useful local intelligence.",
      inLanguage: "en-GB",
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/#burnley`,
      url: `${siteUrl}/#burnley`,
      name: "Burnley: source routes for public life",
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: burnleyProjects.length,
        itemListElement: burnleyProjects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${project.name}: ${project.focus}`,
          url: project.href,
        })),
      },
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="UK Places home">
          <img src="/uk-places-mark.svg" width="38" height="38" alt="" />
          <span>
            <strong>UK Places</strong>
            <small>PUBLIC LIFE, IN CONTEXT</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#find">Find a place</a>
          <a href="#burnley">Featured profile</a>
          <a href="#about">About the index</a>
        </nav>
        <a className="header-action" href="#find"><Search size={15} aria-hidden="true" /> Find a place</a>
      </header>

      <section className="masthead" id="top">
        <div className="masthead-copy">
          <p className="eyebrow"><Layers3 size={15} aria-hidden="true" /> A place index for public life</p>
          <h1>Know the place you call home.</h1>
          <p className="masthead-lede">
            UK Places gives the work around a community one clear starting point.
            Elections, population, public money and everyday services, linked directly
            to the specialists behind the data.
          </p>
        </div>
        <div className="masthead-tools">
          <PlaceFinder />
          <div className="masthead-note">
            <BookOpenText size={18} aria-hidden="true" />
            <p><strong>One place, several useful routes.</strong> UK Places does not reproduce the data. It helps you arrive at the source that does the work.</p>
          </div>
        </div>
      </section>

      <section className="featured-place" id="burnley" aria-labelledby="burnley-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="number-chip">01</span> Featured place · Lancashire</p>
            <h2 id="burnley-title">Burnley, seen from more than one angle.</h2>
          </div>
          <p>
            This is the useful layer: real local signals, a clear source and a direct
            route into the fuller work behind each one.
          </p>
        </div>

        <div className="place-ledger" aria-label="Burnley profile coverage">
          <div><span>Profile coverage</span><strong>04 source routes</strong></div>
          <div><span>Core lenses</span><strong>People · money · democracy</strong></div>
          <div><span>Index principle</span><strong>Evidence before expansion</strong></div>
        </div>

        <div className="project-grid">
          {burnleyProjects.map((project) => (
            <a
              className={`project-card project-card--${project.theme}`}
              href={project.href}
              key={project.name}
              rel="noreferrer"
              target="_blank"
            >
              <div className="project-card-head">
                <div className="project-logo-wrap">
                  <img src={project.logo} alt="" />
                  {project.theme === "asylum" && <span>asylumstats</span>}
                  {project.theme === "doge" && <span>AI DOGE</span>}
                </div>
                <span className="card-index">{project.index}</span>
              </div>
              <p className="project-focus">{project.focus}</p>
              <h3>{project.name}</h3>
              <div className="project-stat" aria-label={`${project.stat} ${project.statLabel}`}>
                <strong>{project.stat}</strong>
                <span>{project.statLabel}</span>
              </div>
              <p className="project-headline">{project.headline}</p>
              <p className="project-description">{project.description}</p>
              <dl className="project-facts">
                {project.facts.map(([value, label]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <span className="project-source">{project.source}</span>
              <span className="project-route">Read the full analysis <ArrowUpRight size={14} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="profile-blueprint" id="about" aria-labelledby="blueprint-title">
        <div className="blueprint-intro">
          <p className="eyebrow">What makes a place page worth finding</p>
          <h2 id="blueprint-title">The useful parts of local life, held together.</h2>
          <p>
            A place is not a single statistic. Each UK Places profile starts with the
            headline a reader needs to know, then puts the source, time period and fuller
            analysis one click away.
          </p>
        </div>
        <div className="lens-list">
          <article>
            <span>01</span>
            <h3>People &amp; change</h3>
            <p>Population, homes, community pressures and the local indicators that give a place its shape.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Safety &amp; everyday life</h3>
            <p>Crime context, food hygiene and the public information people need close to home.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Public money &amp; power</h3>
            <p>Who represents an area, what public bodies spend and where to check the underlying record.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Asylum &amp; local context</h3>
            <p>Careful local routes into national asylum data, framed with its source and limitations intact.</p>
          </article>
        </div>
      </section>

      <section className="search-standard" aria-labelledby="search-standard-title">
        <div>
          <p className="eyebrow">The UK Places standard</p>
          <h2 id="search-standard-title">Built to earn the search, not chase it.</h2>
          <p>
            The best local pages answer a real question, show their working and make the
            next step obvious. UK Places will only index a profile when it can do all three.
          </p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div><h3>A specific local question</h3><p>Each page is built around the geography and topics that genuinely have current coverage.</p></div>
          </li>
          <li>
            <span>02</span>
            <div><h3>A verifiable snapshot</h3><p>Every useful fact carries a source, time period and context, never a copied or invented table.</p></div>
          </li>
          <li>
            <span>03</span>
            <div><h3>A better onward route</h3><p>Readers can continue directly into Elections, Demographics, AI DOGE or Asylum Stats.</p></div>
          </li>
        </ol>
      </section>

      <section className="index-promise" aria-label="UK Places publishing promise">
        <Check size={21} aria-hidden="true" />
        <p><strong>No copied tables. No filler profiles.</strong> Every new place earns its page with a genuinely useful local fact and a clear path to the source work.</p>
      </section>

      <footer>
        <a className="brand brand--footer" href="#top">
          <img src="/uk-places-mark.svg" width="35" height="35" alt="" />
          <span><strong>UK Places</strong></span>
        </a>
        <p>A source-led index for useful local intelligence.</p>
        <a href="#burnley">Browse Burnley</a>
      </footer>
    </main>
  );
}
