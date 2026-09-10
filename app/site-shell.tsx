import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="UK Places home">
        <Image src="/uk-places-mark.svg" width={38} height={38} alt="" priority />
        <span>
          <strong>UK Places</strong>
          <small>LOCAL DATA, CLEARLY SOURCED</small>
        </span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/places/burnley/">Places</Link>
        <Link href="/methodology/">How we work</Link>
        <Link href="/sources/">Sources</Link>
      </nav>
      <Link className="header-action" href="/places/burnley/">Browse Burnley <ArrowUpRight size={15} aria-hidden="true" /></Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="brand brand--footer" href="/" aria-label="UK Places home">
          <Image src="/uk-places-mark.svg" width={35} height={35} alt="" />
          <span><strong>UK Places</strong><small>LOCAL DATA, CLEARLY SOURCED</small></span>
        </Link>
        <p>Source-led place profiles. Every figure has a date, definition and route to the full record.</p>
      </div>
      <div className="footer-links">
        <Link href="/places/burnley/">Burnley profile</Link>
        <Link href="/methodology/">Methodology</Link>
        <Link href="/sources/">Sources</Link>
        <Link href="/updates/">Updates</Link>
      </div>
      <p className="footer-note">Data is reviewed by source. Check the linked specialist record before relying on a figure.</p>
    </footer>
  );
}
