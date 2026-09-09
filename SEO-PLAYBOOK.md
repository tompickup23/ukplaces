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

1. **People & change** — population, homes, health, schools and relevant local
   context, routed to UK Demographics.
2. **Safety & everyday life** — crime context and food hygiene where a verified
   local route is available.
3. **Public money & power** — representation, elections and public spending,
   routed to UK Elections and AI DOGE.
4. **Asylum & local context** — local asylum information with a visible source,
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

Before publishing, a page needs all of the following:

- A distinct geography and a clear explanation of its boundary.
- At least three useful, source-backed local routes or original analysis.
- A short editorial introduction that explains what is notable about this
  place, without repeating the same wording used elsewhere.
- A visible "last checked" date and data-period labels beside time-sensitive
  material.
- Direct links to the exact UKE, UKD, AI DOGE, Asylum Stats and/or UK Food
  Hygiene page, not merely to a generic homepage.
- A canonical URL, `WebPage`/`Place` structured data, breadcrumbs, a unique
  title and description, and a place-specific social image only when there is
  a real primary visual.

Pages that fail the checklist remain unlinked and `noindex` until the coverage
exists. Include only complete canonical profiles in the sitemap.

## Content that can earn search demand

The strongest search-led content is the material that answers a local question
with evidence and context. Build it from verified profiles, not keyword lists:

- *How [place] is changing* — a concise population, housing and community
  briefing with dated sources.
- *Public money in [place]* — a transparent route into the relevant public
  bodies and spending records.
- *Crime and safety in [place]* — only where a current, properly attributed
  local source and comparison context is available.
- *Asylum in [place]* — only where the data is precise enough to report and the
  explanatory context is meaningful.
- *The local record for [place]* — a durable election/representation guide
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

When `ukplaces.co.uk` has completed DNS verification and is made public:

- Replace the temporary Sites URL in `app/layout.tsx` and `app/page.tsx` with
  `https://ukplaces.co.uk` for metadata and structured data.
- Add `robots.ts` and `sitemap.ts` containing only public, complete profiles.
- Verify the domain in Google Search Console and submit the sitemap.
- Test canonical tags, rich-result structured data, social previews and the
  first mobile viewport before inviting indexing.
