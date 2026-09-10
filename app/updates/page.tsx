import type { Metadata } from "next";
import { Clock3 } from "lucide-react";

import { SiteFooter, SiteHeader } from "../site-shell";

export const metadata: Metadata = {
  title: "Updates",
  description: "A concise record of material UK Places profile updates and source-review dates.",
  alternates: { canonical: "/updates/" },
  openGraph: {
    title: "Updates | UK Places",
    description: "A concise record of material UK Places profile updates and source-review dates.",
    url: "/updates/",
  },
};

export default function UpdatesPage() {
  return (
    <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><main id="main-content"><section className="editorial-hero"><p className="eyebrow"><Clock3 size={15} aria-hidden="true" /> Updates</p><h1>Profile update record.</h1><p>Source dates sit beside the figures on each profile. This page records material changes to UK Places itself.</p></section>
      <section className="update-list" aria-label="UK Places updates"><article><time dateTime="2026-09-10">10 September 2026</time><div><h2>Burnley profile reviewed and rebuilt.</h2><p>Added a standalone source-led Burnley route, clear data definitions, source ledger and methodology links. Figures retain their individual source dates.</p></div></article><article><time dateTime="2026-09-06">6 September 2026</time><div><h2>Burnley published-payment record refreshed.</h2><p>AI DOGE source refresh noted on the Burnley profile. The profile shows the 2025/26 published payment record, not total council spending.</p></div></article></section>
    </main><SiteFooter /></>
  );
}
