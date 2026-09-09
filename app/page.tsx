import { ArrowUpRight, Compass, MapPin } from "lucide-react";

const burnleyProjects = [
  {
    name: "UK Elections",
    focus: "Representation & results",
    description: "The political picture around Burnley, from constituency detail to local elections.",
    href: "https://ukelections.co.uk/seats/burnley/",
    theme: "elections",
    logo: "/brands/ukelections.svg",
  },
  {
    name: "UK Demographics",
    focus: "Population & change",
    description: "Population, housing, schools and health, brought together at local-authority level.",
    href: "https://ukdemographics.co.uk/places/burnley/",
    theme: "demographics",
    logo: "/brands/ukdemographics.svg",
  },
  {
    name: "AI DOGE",
    focus: "Public money",
    description: "What public bodies publish about the money they spend, with the source files in view.",
    href: "https://aidoge.co.uk/councils/burnley/",
    theme: "doge",
    logo: "/brands/aidoge.svg",
  },
  {
    name: "Asylum Stats",
    focus: "Asylum & local context",
    description: "Official asylum information in a local context, alongside the wider evidence.",
    href: "https://asylumstats.co.uk/places/burnley/",
    theme: "asylum",
    logo: "/brands/asylumstats.svg",
  },
  {
    name: "UK Food Hygiene",
    focus: "Food & places",
    description: "Food hygiene ratings and the local register for Burnley businesses.",
    href: "https://ukfoodhygiene.co.uk/towns/burnley/",
    theme: "food",
    logo: "/brands/ukfoodhygiene.svg",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="UK Places home">
          <img src="/uk-places-mark.svg" width="42" height="42" alt="" />
          <span>
            <strong>UK Places</strong>
            <small>THE CONTEXT AROUND A PLACE</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#burnley">Featured place</a>
          <a href="#about">What this is</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><Compass size={15} aria-hidden="true" /> An independent place index</p>
          <h1>The context around every place.</h1>
          <p className="hero-intro">
            UK Places brings together the independent tools that explain a community,
            then takes you straight to the detail that matters.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#burnley">Explore Burnley <ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="quiet-link" href="#about">How it works</a>
          </div>
        </div>

        <aside className="place-preview" aria-label="Featured place: Burnley">
          <div className="preview-topline">
            <span>PLACE IN VIEW</span>
            <span>01 / 01</span>
          </div>
          <div className="place-coordinates" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <div className="place-preview-title">
            <p><MapPin size={17} aria-hidden="true" /> Lancashire, England</p>
            <h2>Burnley</h2>
            <span>One place, five useful ways in.</span>
          </div>
        </aside>
      </section>

      <section className="featured-place" id="burnley" aria-labelledby="burnley-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured place</p>
            <h2 id="burnley-title">Burnley, seen from more than one angle.</h2>
          </div>
          <p>
            Each route below keeps the source project’s identity intact. UK Places is
            the considered starting point, not a substitute for the specialist work.
          </p>
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
                  {project.theme === "food" && <span>UK Food Hygiene</span>}
                </div>
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
              <p className="project-focus">{project.focus}</p>
              <h3>{project.name}</h3>
              <p className="project-description">{project.description}</p>
              <span className="project-route">Open source project <ArrowUpRight size={14} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="about-strip" id="about">
        <p className="eyebrow">Designed for connection</p>
        <p>
          From elections to public money, a place is more useful when its information is
          easy to find, easy to compare and always linked back to the project doing the work.
        </p>
      </section>

      <footer>
        <a className="brand brand--footer" href="#top">
          <img src="/uk-places-mark.svg" width="35" height="35" alt="" />
          <span><strong>UK Places</strong></span>
        </a>
        <p>A growing index of independent UK data projects.</p>
        <a href="mailto:ukplaces@tompickup.co.uk">Get in touch</a>
      </footer>
    </main>
  );
}
