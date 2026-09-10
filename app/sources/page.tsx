import type { Metadata } from "next";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Image from "next/image";

import { sources } from "../data";
import { SiteFooter, SiteHeader } from "../site-shell";

export const metadata: Metadata = {
  title: "Sources",
  description: "The specialist UK data projects linked by UK Places and the subjects each one covers.",
  alternates: { canonical: "/sources/" },
  openGraph: {
    title: "Sources | UK Places",
    description: "The specialist UK data projects linked by UK Places and the subjects each one covers.",
    url: "/sources/",
  },
};

export default function SourcesPage() {
  return (
    <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content"><section className="editorial-hero"><p className="eyebrow"><BookOpen size={15} aria-hidden="true" /> Sources</p><h1>The projects behind the profile.</h1><p>UK Places is an index and explainer. The source projects below hold the detailed records, data provenance and specialist methodology.</p></section>
      <section className="source-directory" aria-label="Source directory">{sources.map((source, index) => <a className={`source-directory-card source-directory-card--${source.theme}`} href={source.href} key={source.key} rel="noreferrer" target="_blank"><span>0{index + 1}</span><Image src={source.logo} alt="" width={178} height={35} /><h2>{source.name}</h2><p>{source.topic}</p><strong>Open source <ArrowUpRight size={15} aria-hidden="true" /></strong></a>)}</section>
    </main><SiteFooter /></>
  );
}
