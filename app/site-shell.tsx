import { MapPinned, Menu } from "lucide-react";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="UK Places home">
        <Image src="/uk-places-mark.svg" width={38} height={38} alt="" priority />
        <span>
          <strong>UK Places</strong>
          <small>LOCAL DATA, CLEARLY SOURCED</small>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/places/">Places</a>
        <a href="/#topics">Data topics</a>
        <a href="/methodology/">How we work</a>
      </nav>
      <a className="header-action" href="/places/">Browse places <MapPinned size={15} aria-hidden="true" /></a>
      <details className="mobile-nav">
        <summary><Menu size={19} aria-hidden="true" /><span>Menu</span></summary>
        <nav aria-label="Mobile navigation">
          <a href="/places/">Browse places</a>
          <a href="/#topics">Data topics</a>
          <a href="/methodology/">How we work</a>
          <a href="/sources/">Sources</a>
        </nav>
      </details>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <a className="brand brand--footer" href="/" aria-label="UK Places home">
          <Image src="/uk-places-mark.svg" width={35} height={35} alt="" />
          <span><strong>UK Places</strong><small>LOCAL DATA, CLEARLY SOURCED</small></span>
        </a>
        <p>Local data profiles with a clear geography, a source date and a route to the full record.</p>
      </div>
      <div className="footer-links">
        <a href="/places/">Browse places</a>
        <a href="/places/burnley/">Burnley profile</a>
        <a href="/methodology/">Methodology</a>
        <a href="/sources/">Sources</a>
        <a href="/updates/">Updates</a>
      </div>
      <p className="footer-note">Data is reviewed by source. Check the linked specialist record before relying on a figure.</p>
    </footer>
  );
}
