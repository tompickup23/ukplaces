# UK Places SEO & audience plan

## Positioning

UK Places is the front door to source-led local intelligence. It should earn
organic traffic by making a place genuinely easier to understand, then send
readers to the specialist projects that contain the underlying evidence.

The goal is not to manufacture a page for every settlement. A profile exists
only when it offers a useful, current briefing for that particular geography.

## The profile model

Use one canonical profile per supported place:

`/places/[place-slug]/`

Each profile should include only the lenses that have current source coverage:

1. **People & change**: population, homes, health, schools and relevant local
   context, routed to UK Demographics.
2. **Safety & everyday life**: crime context and food hygiene where a verified
   local route is available.
3. **Public money & power**: representation, elections and public spending,
   routed to UK Elections and AI DOGE.
4. **Asylum & local context**: local asylum information with a visible source,
   period and caveat, routed to Asylum Stats.

Every module must state the source, the period it describes and the exact route
to the specialist page. If a source does not support a place or a lens is not
current, omit the module rather than filling it with a generic paragraph.

Each source module opens with one reportable local signal, not an abstract
description of the partner project. Pair that signal with a precise label, a
source date, a short context sentence and a clear route to the full analysis.
The page must distinguish observed data, models and estimates in the module
itself. This makes the rendered page useful to readers and gives search engines
substantive, attributable local content to understand.

## What makes a profile indexable

Updated 27 September 2026 to match what the pages do. Each item names the file or
check that enforces it.

- **A distinct geography.** One record per local authority, keyed on its GSS code,
  with a "What this record is" boundary note (`src/pages/places/[slug].astro`).
- **At least two sources on every record.** Asylum Stats and UK Food Hygiene cover
  all 361 local authorities, so no place page is thin and none carries `noindex`
  (Round 2 decision D10). `npm run test:registry` asserts two or more sources on
  every record. One signal per source, never a second figure from the same source.
- **Dates beside the figures.** Every signal prints its period, the page shows a
  "Last reviewed" date (the latest source snapshot on the record) and a Sources
  and dates list. No date is hand-typed.
- **Direct links** to the exact UK Elections, UK Demographics, AI DOGE, Asylum
  Stats and UK Food Hygiene page, only where the source's own data confirms the
  page (`scripts/build-registry.mjs`).
- **Internal links.** The region is linked to its region page, the county council
  is named (from the AI DOGE crosswalk) and linked to AI DOGE, and up to 20 other
  places in the same ceremonial county or region are listed.
- **Unique title and description built from the signals.** Titles use
  `<Name>: local data, public money and representation | UK Places` only where AI
  DOGE and UK Elections both cover the place alongside a third source, and
  `<Name>: local data and sources | UK Places` otherwise. The description lists
  each signal as label, value and period in manifest order, within 300
  characters. `npm run check:metadata` fails the build on a repeated title or
  description, a description outside 70 to 300 characters, a dash character, or
  an `og:image` missing from `dist`.
- **Structured data.** A `WebPage` with `dateModified`, a `BreadcrumbList`, and an
  `AdministrativeArea` with the GSS code as a `PropertyValue`, `containedInPlace`
  (region, then country) and `sameAs` its Wikidata item where exactly one item
  carries the GSS code (328 of 361).
- **Sitemap dates.** Every place URL carries `lastmod` from its own latest source
  date; `npm run check:sitemap` asserts each one.
- **A per-record social image.** A 1200x630 share card per place and
  constituency, rendered at deploy with `BUILD_OG=1`.

Constituency and region pages follow the same rules where they apply: unique
metadata, breadcrumbs, a linked region, and for constituencies `dateModified` and
`lastmod` from the MP record snapshot.

## Content that can earn search demand

The strongest search-led content is the material that answers a local question
with evidence and context. Build it from verified profiles, not keyword lists:

- *How [place] is changing*: a concise population, housing and community
  briefing with dated sources.
- *Public money in [place]*: a transparent route into the relevant public
  bodies and spending records.
- *Crime and safety in [place]*: only where a current, properly attributed
  local source and comparison context is available.
- *Asylum in [place]*: only where the data is precise enough to report and the
  explanatory context is meaningful.
- *The local record for [place]*: a durable election/representation guide
  linked to the relevant UKE page.

These are editorial modules inside a profile or individually researched support
pages. Do not produce near-identical town pages that simply swap place names.

## Distribution and measurement

1. Launch a small number of complete profiles, starting with Burnley, and make
   the supporting projects link back to the matching UK Places profile where it
   genuinely helps readers.
2. Publish a short, source-led update when one of the underlying datasets
   changes materially; link to the relevant profile rather than making a
   generic announcement.
3. Use Google Search Console after the public domain is live to monitor
   impressions, query groups, click-through rate, index coverage and pages with
   weak engagement. Expand topics only where a real question and source
   coverage meet.
4. Keep title tags factual and specific. A useful pattern is
   `[Place]: local data, public money and representation | UK Places`.

## Public-launch checklist

Done on 10 September 2026: the Astro site is live on GitHub Pages at
`https://ukplaces.co.uk`, the sitemap is submitted in Search Console, and robots,
canonicals and structured data are generated from the registry. The measure of
the Round 2 work is the Search Console Pages report: the counts under "Crawled,
currently not indexed" and "Discovered, currently not indexed" before and four
weeks after the metadata PR merges.
