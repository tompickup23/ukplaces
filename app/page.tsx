import {
  ArrowUpRight,
  Check,
  Layers3,
  Search,
} from "lucide-react";

import { PlaceFinder } from "./place-finder";

const burnleyProjects = [
  {
    name: "UK Elections",
    focus: "Council election result",
    stat: "11 / 45",
    statLabel: "Reform UK seats",
    headline: "Reform is the largest party. No overall control.",
    description: "The 7 May 2026 result left Reform 12 seats short of the 23 needed to lead the council.",
    facts: [
      ["13 / 15", "ward winners called"],
      ["7 May 2026", "latest council vote"],
    ],
    source: "UK Elections · 7 May 2026 result",
    cta: "See council result",
    href: "https://ukelections.co.uk/seats/burnley/",
    theme: "elections",
    logo: "/brands/ukelections.svg",
    index: "01",
  },
  {
    name: "UK Demographics",
    focus: "Crime",
    stat: "107.4",
    statLabel: "recorded crimes per 1,000",
    headline: "Crime is higher than in most local areas.",
    description: "The rate is down 3.7% on the previous year. See offence types and the limits of police-recorded crime data.",
    facts: [
      ["43.1", "violent crimes per 1,000"],
      ["84th", "national percentile"],
    ],
    source: "UK Demographics · Home Office · year ending Mar 2024",
    cta: "See crime data",
    href: "https://ukdemographics.co.uk/places/burnley/",
    theme: "demographics",
    logo: "/brands/ukdemographics.svg",
    index: "02",
  },
  {
    name: "AI DOGE",
    focus: "Council spending",
    stat: "£38.1m",
    statLabel: "payments in 2025/26",
    headline: "£38.1m in published council payments.",
    description: "Search 4,489 payments over £500 and open the original files behind the total.",
    facts: [
      ["843", "suppliers in the record"],
      ["6 Sep 2026", "last source refresh"],
    ],
    source: "AI DOGE · council files · 2025/26",
    cta: "See spending record",
    href: "https://aidoge.co.uk/councils/burnley/",
    theme: "doge",
    logo: "/brands/aidoge.svg",
    index: "03",
  },
  {
    name: "Asylum Stats",
    focus: "Asylum data",
    stat: "471",
    statLabel: "people on asylum support",
    headline: "46.66 people on support per 10,000 residents.",
    description: "See the local trend and accommodation split in the latest Home Office data.",
    facts: [
      ["466", "in dispersal accommodation"],
      ["30 Jun 2026", "latest source update"],
    ],
    source: "Asylum Stats · Home Office · 30 Jun 2026",
    cta: "See asylum data",
    href: "https://asylumstats.co.uk/places/burnley/",
    theme: "asylum",
    logo: "/brands/asylumstats.svg",
    index: "04",
  },
];

const burnleySignals = burnleyProjects.map((project) => ({
  value: project.stat,
  label: project.statLabel,
  theme: project.theme,
}));

const siteUrl = "https://ukplaces.tom-pickup-2333.chatgpt.site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "UK Places",
      description: "Clear local facts with links to the full source.",
      inLanguage: "en-GB",
    },
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/#burnley`,
      url: `${siteUrl}/#burnley`,
      name: "Burnley local data",
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
            <small>LOCAL FACTS, CLEARLY LINKED</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#find">Find a place</a>
          <a href="#burnley">Burnley</a>
          <a href="#about">How it works</a>
        </nav>
        <a className="header-action" href="#find"><Search size={15} aria-hidden="true" /> Search</a>
      </header>

      <section className="masthead" id="top">
        <div className="masthead-copy">
          <p className="eyebrow"><Layers3 size={15} aria-hidden="true" /> Local facts, in one place</p>
          <h1>The facts about where you live.</h1>
          <p className="masthead-lede">
            Elections, crime, council spending and asylum data. Start with the headline,
            then go straight to the full source.
          </p>
          <p className="masthead-status">Burnley is the first full profile.</p>
        </div>
        <div className="masthead-tools">
          <PlaceFinder />
          <section className="signal-brief" aria-labelledby="signal-brief-title">
            <div className="signal-brief-head">
              <p id="signal-brief-title">Burnley now</p>
              <span>Latest source snapshots</span>
            </div>
            <dl className="signal-grid">
              {burnleySignals.map((signal) => (
                <div className={`signal signal--${signal.theme}`} key={signal.label}>
                  <dt>{signal.label}</dt>
                  <dd>{signal.value}</dd>
                </div>
              ))}
            </dl>
            <a className="signal-link" href="#burnley">See all Burnley facts <ArrowUpRight size={15} aria-hidden="true" /></a>
          </section>
        </div>
      </section>

      <section className="featured-place" id="burnley" aria-labelledby="burnley-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="number-chip">01</span> Burnley, Lancashire</p>
            <h2 id="burnley-title">Burnley at a glance.</h2>
          </div>
          <p>Four current facts. Four links to the full record.</p>
        </div>

        <div className="place-ledger" aria-label="Burnley profile coverage">
          <div><span>Available now</span><strong>04 source pages</strong></div>
          <div><span>Topics</span><strong>Votes · crime · money · asylum</strong></div>
          <div><span>Data</span><strong>Source dates on every card</strong></div>
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
              <span className="project-route">{project.cta} <ArrowUpRight size={14} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="burnley-briefing" id="burnley-briefing" aria-labelledby="briefing-title">
        <div className="briefing-heading">
          <div>
            <p className="eyebrow"><span className="number-chip">02</span> Burnley briefing</p>
            <h2 id="briefing-title">The detail behind the headlines.</h2>
          </div>
          <p>
            Key figures, what they mean and the date they cover. For the full picture,
            open the source beside each section.
          </p>
        </div>

        <nav className="briefing-nav" aria-label="Burnley briefing sections">
          <a href="#council-seats">Council seats <span>01</span></a>
          <a href="#recorded-crime">Recorded crime <span>02</span></a>
          <a href="#council-spending">Council spending <span>03</span></a>
          <a href="#asylum-support">Asylum support <span>04</span></a>
        </nav>

        <div className="brief-list">
          <article className="brief-card brief-card--elections" id="council-seats">
            <div className="brief-label">
              <span>01</span>
              <p>UK Elections</p>
            </div>
            <div className="brief-copy">
              <p className="brief-topic">Council election result</p>
              <h3>No party controls Burnley Council.</h3>
              <p>
                Reform has 11 of the council&apos;s 45 seats. A majority needs 23, so the
                result on 7 May 2026 left the council under no overall control.
              </p>
              <a href="https://ukelections.co.uk/seats/burnley/" rel="noreferrer" target="_blank">
                Read the council result <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <dl className="brief-metrics" aria-label="Burnley Council election figures">
              <div><dt>Reform seats</dt><dd>11</dd></div>
              <div><dt>Total seats</dt><dd>45</dd></div>
              <div><dt>For a majority</dt><dd>23</dd></div>
              <div><dt>Election date</dt><dd>7 May 2026</dd></div>
            </dl>
            <p className="brief-source">Source: UK Elections. Burnley Council result, 7 May 2026.</p>
          </article>

          <article className="brief-card brief-card--demographics" id="recorded-crime">
            <div className="brief-label">
              <span>02</span>
              <p>UK Demographics</p>
            </div>
            <div className="brief-copy">
              <p className="brief-topic">Crime</p>
              <h3>107.4 recorded crimes per 1,000 residents.</h3>
              <p>
                The rate was down 3.7% on the previous year. These are police-recorded
                incidents, so reporting and recording practices affect the figures.
              </p>
              <a href="https://ukdemographics.co.uk/places/burnley/" rel="noreferrer" target="_blank">
                Explore Burnley crime data <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <dl className="brief-metrics" aria-label="Burnley recorded crime rates per 1,000 residents">
              <div><dt>Total crime</dt><dd>107.4</dd></div>
              <div><dt>Violent crime</dt><dd>43.1</dd></div>
              <div><dt>Theft</dt><dd>35.3</dd></div>
              <div><dt>Anti-social behaviour</dt><dd>45.7</dd></div>
            </dl>
            <p className="brief-source">Source: Home Office police-recorded crime. Year ending March 2024, via UK Demographics.</p>
          </article>

          <article className="brief-card brief-card--doge" id="council-spending">
            <div className="brief-label">
              <span>03</span>
              <p>AI DOGE</p>
            </div>
            <div className="brief-copy">
              <p className="brief-topic">Council spending</p>
              <h3>£38.1m in payments published for 2025/26.</h3>
              <p>
                The record contains 4,489 payments over £500 and 843 suppliers. It is a
                transparency record of published payments, not the council&apos;s complete budget.
              </p>
              <a href="https://aidoge.co.uk/councils/burnley/" rel="noreferrer" target="_blank">
                Search the payment record <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <dl className="brief-metrics" aria-label="Burnley Council published payment figures">
              <div><dt>Published payments</dt><dd>£38.1m</dd></div>
              <div><dt>Payments over £500</dt><dd>4,489</dd></div>
              <div><dt>Suppliers</dt><dd>843</dd></div>
              <div><dt>Last refresh</dt><dd>6 Sep 2026</dd></div>
            </dl>
            <p className="brief-source">Source: Burnley Council published payment files, 2025/26, via AI DOGE.</p>
          </article>

          <article className="brief-card brief-card--asylum" id="asylum-support">
            <div className="brief-label">
              <span>04</span>
              <p>Asylum Stats</p>
            </div>
            <div className="brief-copy">
              <p className="brief-topic">Asylum support</p>
              <h3>471 people receiving asylum support in Burnley.</h3>
              <p>
                That is 46.66 people per 10,000 residents. The latest snapshot records
                466 people in dispersal accommodation in the borough.
              </p>
              <a href="https://asylumstats.co.uk/places/burnley/" rel="noreferrer" target="_blank">
                See the local trend <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <dl className="brief-metrics" aria-label="Burnley asylum support figures">
              <div><dt>On asylum support</dt><dd>471</dd></div>
              <div><dt>Per 10,000 residents</dt><dd>46.66</dd></div>
              <div><dt>In dispersal accommodation</dt><dd>466</dd></div>
              <div><dt>Latest data</dt><dd>30 Jun 2026</dd></div>
            </dl>
            <p className="brief-source">Source: Home Office asylum and resettlement data, 30 June 2026, via Asylum Stats.</p>
          </article>
        </div>
      </section>

      <section className="profile-blueprint" id="about" aria-labelledby="blueprint-title">
        <div className="blueprint-intro">
          <p className="eyebrow">What you can check</p>
          <h2 id="blueprint-title">A quick answer. Then the full record.</h2>
          <p>
            Each card gives you one useful fact, the source date and a direct link to
            more detail.
          </p>
        </div>
        <div className="lens-list">
          <article>
            <span>01</span>
            <h3>Votes &amp; representation</h3>
            <p>Election results, council seats and ward-by-ward detail.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Crime &amp; community</h3>
            <p>Crime rates, population and local change.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Council spending</h3>
            <p>Published payments, suppliers and the original files.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Asylum support</h3>
            <p>Local Home Office figures, trends and accommodation data.</p>
          </article>
        </div>
      </section>

      <section className="search-standard" aria-labelledby="search-standard-title">
        <div>
          <p className="eyebrow">How UK Places works</p>
          <h2 id="search-standard-title">Useful facts. Proper sources.</h2>
          <p>
            Every page starts with a fact worth knowing. Then it shows where it came from
            and sends you to the full work.
          </p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div><h3>A useful local figure</h3><p>We only add a topic when there is current data for that place.</p></div>
          </li>
          <li>
            <span>02</span>
            <div><h3>A date and a source</h3><p>Every figure tells you what it covers and where it came from.</p></div>
          </li>
          <li>
            <span>03</span>
            <div><h3>The full record</h3><p>Each card links straight to the specialist project with the full data.</p></div>
          </li>
        </ol>
      </section>

      <section className="index-promise" aria-label="UK Places publishing promise">
        <Check size={21} aria-hidden="true" />
        <p><strong>No filler. No copied data.</strong> Every place page starts with useful facts and links to the original work.</p>
      </section>

      <footer>
        <a className="brand brand--footer" href="#top">
          <img src="/uk-places-mark.svg" width="35" height="35" alt="" />
          <span><strong>UK Places</strong></span>
        </a>
        <p>Local facts. Full sources.</p>
        <a href="#burnley">Browse Burnley</a>
      </footer>
    </main>
  );
}
