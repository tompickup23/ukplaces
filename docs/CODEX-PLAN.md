# UK Places: build plan for Codex

Written 10 September 2026 after a full audit of https://ukplaces.co.uk and the four
sister repos. Work through the STEPS section in a loop. This file is the single source
of truth; PROGRESS.md (created in step 0) is the running log.

## How to loop

1. Read PROGRESS.md. Pick the first step that is neither ticked nor blocked.
2. Do the step fully. Run its verification. Do not skip verification.
3. Commit on the current branch with a message naming the step number.
4. Tick the step in PROGRESS.md and append a dated line: what was done, what was
   verified and how, what is next.
5. If blocked, write the blocker under "Blocked" in PROGRESS.md and move to the next
   step that does not depend on it.
6. Stop only when every step is ticked or blocked. Never push to any remote and never
   deploy; both are Tom's decision (see step 14).

## Decisions (final, do not reopen)

D1. Page per place is allowed, but only as a GEOGRAPHY RECORD with a coverage panel.
    The estate brand decisions doc
    (/Users/tompickup/clawd/briefings/uk-network-brand/BRAND-DECISIONS-2026-08-23.md)
    said "one tool, not a page per place" to avoid cannibalising sister sites. This
    plan honours the reason: each source contributes exactly ONE headline signal
    (value, unit, label, period, snapshot date, deep link). No second figure per
    source, no charts, no restated tables. The page's substance is the registry:
    codes, council, constituency, wards, region, county, reorganisation status, and
    which sources cover the place. That content exists nowhere else in the estate.

D2. Platform: migrate UK Places to Astro static output, matching UK Elections,
    UK Demographics and Asylum Stats (all Astro on GitHub Pages via
    actions/deploy-pages). Reasons: vinext 1.0.0-beta.5 shipped a production-only
    bug (clicking a `next/link` does nothing and throws "TypeError: e is not a
    function" in _next/static/chunks/link-*.js); the site needs no server runtime;
    it ships ~130KB gzipped JS for a `<details>` menu; the estate's shared token
    pipeline (clawd/briefings/uk-network-design-system/shared/apply.py) targets
    src/styles/global.css in Astro repos. Every public URL must stay identical.
    The vinext site stays live until Tom switches DNS; step 1 patches it meanwhile.

D3. URL convention: trailing slash everywhere, matching the sister sites.

D4. Design: adopt the estate's neutral shared tokens
    (clawd/briefings/uk-network-design-system/shared/tokens.css.tmpl and
    sites.json). UK Places has no accent of its own; destination-site accents are
    used only on elements that route to that site (wayfinding, not decoration).
    Fonts stay Source Serif 4 (display) and Source Sans 3 (UI), self-hosted.

D5. First geography level: the 361 UK local authorities (matches Asylum Stats
    coverage, the widest of the four). Constituencies (650) and regions follow in
    step 11. Wards later, not in this plan.

D6. UK Food Hygiene is private. Never add it to the manifest, registry, links, copy
    or docs.
    REVERSED 27 September 2026 (docs/OPUS-PLAN-2026-09-27.md): UK Food Hygiene
    (https://ukfoodhygiene.co.uk) is now public, crawlable and carries 364 council
    pages, so the reason for keeping it out no longer holds. It becomes the fifth
    source. The original decision above is kept for the record.

D7. Deployment target after migration: GitHub Pages with custom domain
    ukplaces.co.uk, same workflow shape as ukdemographics. Codex prepares the
    workflow and verifies the build; Tom does DNS and the OpenAI Sites shutdown.

## Facts to use (verified 10 September 2026)

- GSS/ONS code is the only place key shared by all four sister sites.
  Burnley = E07000117.
- Existing crosswalk to build on:
  /Users/tompickup/aidoge-site/data/shared/council_crosswalk.json (975 bodies,
  snake_case ids, ons_code, uke_slug with provenance) and
  /Users/tompickup/aidoge-site/data/sister-links.json. Its derived ukd_slug is
  wrong for names containing "&" (it emits barking-dagenham; UK Demographics
  builds /places/barking-and-dagenham/).
- ukelections: data/identity/council-slug-to-lad24.json (156 slugs; "surrey" is
  wrongly matched to Surrey Heath; 10 county councils unmatched) and
  data/identity/pcons-ge-next.json (650 seats keyed on pcon24cd, with lad24cds[]).
- ukdemographics: src/data/live/ethnic-projections.json areas keyed on GSS, 318
  LAs, England and Wales only; slug derived from name at build (slugifyAreaName in
  src/lib/site.ts).
- asylumstats: src/data/live/local-route-latest.json, 361 LAs, per-row
  snapshotDate; same slug derivation as ukdemographics.
- aidoge-site: data/summaries/<id>.json per body with coverage.last_refresh and
  ons_code.
- Sister URL patterns (all trailing slash): UKE /seats/<council>/ and
  /seats/parliament/<pcon>/; UKD /places/<slug>/ and /constituencies/<slug>/;
  AI DOGE /councils/<id>/; AS /places/<slug>/.
- Burnley council after 7 May 2026 (UKE): Reform UK 11, Labour 10,
  Independent/Other 10, Lib Dem 6, Conservative 5, Green 3; 45 seats; 23 for a
  majority; no overall control; next election TBC under reorganisation.
- Lancashire reorganisation: ministerial decision 16 July 2026; four unitaries
  replace 15 councils; shadow elections May 2027; vesting April 2028. Confirm which
  unitary includes Burnley from the decision document before publishing. Do not
  guess.
- The ONS Community Safety Partnership crime dataset used by UK Demographics was
  discontinued after year ending March 2024; newer figures are in the Police Force
  Area tables. Label the UKD crime signal "latest held by source".
- Burnley signals to match exactly: UKE Reform 11 of 45, NOC; UKD total crime
  107.4 per 1,000, year ending March 2024; AI DOGE £38,056,787 in 2025/26, last
  checked 2026-09-06; AS 471 on support, 46.66 per 10,000, 30 June 2026.
- Current live faults on the vinext site: every canonical, sitemap and internal
  URL uses a trailing slash but the deploy 308-redirects to the slash-less form;
  og:url and og:title on /places/, /methodology/, /sources/, /updates/ inherit the
  homepage values; Burnley has no og image; the Burnley BreadcrumbList item 2
  points to /#places; the 404 is the unbranded Next default with two <title> tags
  and both noindex and index,follow; about 40 dead CSS classes in app/globals.css;
  about 60 unused shadcn files in components/ui and unused deps; the mobile menu
  summary is 19px tall; the Burnley page has 55 text elements under 12px; the
  homepage "finder" is a link styled as a search box pointing at /places/, and
  /places/ links to itself twice.
- Design boards already drawn for this site: clawd/briefings/uk-network-design-
  system/{Place,PlaceMobile,Places,PlacesMobile,YourArea}.dc.html. Use them as the
  layout reference.

## Steps

- [ ] 0. Create PROGRESS.md containing this step list, the baseline
      `git rev-parse HEAD`, and empty "Blocked" and "Log" sections.

- [ ] 1. Stopgap on the live vinext site (small, so the current deploy stops
      redirecting its own canonicals). Set `trailingSlash: true` in
      next.config.ts. Fix og url/title per page, breadcrumb item 2 to /places/,
      add app/not-found.tsx with one title and noindex only. Verify: `npm run
      build`, `npx wrangler dev --config dist/server/wrangler.json --port 3124`,
      curl /, /places/, /places/burnley/ return 200 and /places returns 308 to
      /places/; canonical, og:url and every internal href end with a slash. Commit.
      Note in PROGRESS.md that this commit is what Tom should deploy to the
      current host if the migration takes more than a few days.

- [ ] 2. Scaffold Astro. In a new top-level directory `site/` create an Astro
      project with `output: "static"`, `trailingSlash: "always"`,
      `site: "https://ukplaces.co.uk"`, no UI framework, no Tailwind. Copy
      public/fonts, public/brands, favicon, og.png, uk-places-mark.svg. Create
      src/styles/global.css from the shared token template with the D4 mapping.
      Mirror the sister repos' structure (src/layouts/BaseLayout.astro,
      src/lib/site.ts, src/components/). Verify: `npm run build` in site/ produces
      dist/ with index.html.

- [ ] 3. Registry v1. Create site/src/data/registry/places.json keyed on GSS for
      all 361 UK local authorities. Fields: gss, slug (kebab-case from official
      name with a manual override map in registry/slug-overrides.json), name,
      officialName, type (E06/E07/E08/E09/S12/W06/N09 class label), country,
      region, county (ceremonial, England only, from asylumstats
      lad-to-county.json), parentGss (county council for two-tier districts),
      wikidata (null unless read from a source file; never invent),
      reorganisation {status, note, sourceUrl, sourceDate} or null,
      coverage {ukelections:{hasPage,slug,url}, ukdemographics:{...},
      aidoge:{...}, asylumstats:{...}}. Build coverage by READING the four repos'
      own identity files listed above, never by deriving slugs from names; if a
      site's slug cannot be confirmed from its own data, hasPage false and url
      null. Write site/scripts/build-registry.mjs that regenerates the file and
      prints a coverage table. Add a JSON schema and a test: every url unique,
      every gss once, every slug unique. Verify: script runs clean; Burnley shows
      all four true with the exact live URLs; curl ten random coverage URLs and
      confirm 200.

- [ ] 4. Source manifest and signal feeds. Create site/src/data/sources.json:
      id, name, accent (from sites.json; AI DOGE #18718a), topic, levels,
      feedPath, schemaVersion, siteUrl. Create site/src/data/signals/<id>.json
      keyed on GSS with exactly one signal per place: {value, unit, label,
      period, snapshotDate, url}. Generate with site/scripts/build-signals.mjs
      from the sister repos' data files: UKE control status and largest-party
      seats; UKD total crime per 1,000 with period "latest held by source: year
      ending March 2024"; AI DOGE published payments total and year; AS people on
      support and rate. Where a source lacks a per-place stamp use the dataset
      generatedAt and say so in the period text. Verify: every signal has all six
      fields; Burnley matches the figures in Facts.

- [ ] 5. The place page. src/pages/places/[slug].astro generated from the
      registry. Order: breadcrumb (UK Places / Places / Name); H1 name with type
      and region; Geography module (GSS code, council name and type, parent
      county if two-tier, constituency or constituencies with link to the UKE
      parliament page, region, ceremonial county, reorganisation status when
      present); Coverage panel (one row per source with hasPage true: source
      label in its accent, the single signal, period, deep link); "What this
      record is" boundary note (e.g. borough vs town, where the registry has one);
      Sources and dates. Metadata, canonical, og (reuse /og.png until per-place
      images exist), BreadcrumbList, AdministrativeArea with identifier
      PropertyValue for the GSS code and sameAs when wikidata is set, all derived
      from data. No hand-typed dates: "last reviewed" = max snapshotDate across
      that place's signals. /places/burnley/ keeps its URL. Verify: build renders
      361 pages; ten random pages have unique title and description; Burnley
      reviewed against the Place.dc.html board; no text under 12px (script it);
      every text/background pair at least 4.5:1 (script it).

- [ ] 6. Directory, static pages and sitemap. /places/ lists all places grouped
      by country then region, with a client-side name filter over the registry
      (real filtering, plain JS, works without JS as a full list). Recreate
      /methodology/, /sources/, /updates/ in Astro with the same URLs; rewrite
      /updates/ to be generated from a dated changelog file. Branded 404.html
      with noindex. Sitemap from @astrojs/sitemap or a custom endpoint listing
      places plus static pages. robots.txt pointing at it. Verify: sitemap has
      361 place URLs plus static pages, all trailing slash, all present in dist/.

- [ ] 7. Home page and postcode door. Home = one tool first: a form with a
      postcode or place-name input. Postcode: client-side GET
      https://api.postcodes.io/postcodes/<pc>, read codes.admin_district,
      codes.parliamentary_constituency, codes.admin_ward, resolve admin_district
      against the registry and navigate to /places/<slug>/; if not in the
      registry, say so. Name: filter the registry. State on the page that the
      postcode is sent to postcodes.io and not stored. Real <form>, <label>,
      aria-live status, keyboard usable. Below the tool: the four sources with
      their accents and what each answers, and a short "what a place record
      contains" block. Remove the manifesto sections, the four identical topic
      cards and the "featured profile" block. Verify in headless Chrome: BB11 1PD
      resolves to /places/burnley/; an invalid postcode shows the message;
      keyboard-only path works; 1440 and 375 screenshots saved.

- [ ] 8. Header, footer, type scale. Neutral chrome. Nav: Places, Constituencies
      (after step 11), Sources, Methodology. Footer "Sister sites" block listing
      members only, no umbrella name. h1 clamp(2.4rem, 4vw, 3.6rem), h2
      clamp(1.7rem, 2.6vw, 2.4rem), section padding at most 64px, no body text
      under 0.8rem, mobile menu button at least 44px tall, visible focus states.
      Verify: contrast and text-size scripts pass on every page; screenshots
      reviewed at 1440 and 375.

- [ ] 9. Parity check against the vinext site. Build a list of every URL in the
      old public/sitemap.xml and confirm each exists in site/dist with a
      trailing-slash path. Diff <title>, description and canonical between old
      (from a wrangler-served build of the old app) and new for the six existing
      pages; differences must be intentional and noted in PROGRESS.md.

- [ ] 10. Retire vinext. Move the Astro project to the repo root (or make the
      root package the Astro site), delete app/, components/, hooks/, lib/,
      next.config.ts, next-env.d.ts, vite.config.ts, .vinext, .next, dist,
      .wrangler, and the vinext/shadcn/recharts/embla/cmdk/base-ui dependencies.
      Keep .openai/hosting.json and .oxfmtrc.json only if still used; note either
      way. Add .github/workflows/deploy.yml modelled on
      /Users/tompickup/ukdemographics/.github/workflows (build, upload-pages-
      artifact, deploy-pages) and a CNAME file containing ukplaces.co.uk. Add a
      site-checks workflow running the contrast, text-size, sitemap and parity
      scripts. Verify: clean clone builds from scratch with `npm ci && npm run
      build`; lint passes.

- [ ] 11. Constituencies and regions. src/data/registry/constituencies.json
      (650, pcon24cd, from ukelections pcons-ge-next.json; UKD slug only where
      UKD's pcon-dataset.json confirms a page). /constituencies/[slug]/ using the
      same page component with the Geography module adapted (constituent local
      authorities from lad24cds, MP and result link to UKE). /places/regions/
      [slug]/ listing that region's places. Extend sitemap and the directory
      filter. Verify as in step 5.

- [ ] 12. Sister-site integration. Publish the registry as
      /data/registry/places.json and /data/registry/constituencies.json on UK
      Places. In each sister repo, on a new branch, no push: replace derived
      sister-site slugs with registry lookups; add a "Place record on UK Places"
      link on each place page that has a registry entry; in ukelections and
      ukdemographics add a per-place snapshotDate to the data the signals are
      built from. Verify: each sister repo builds; each Burnley page shows the UK
      Places link; the Barking and Dagenham cross-link from aidoge now resolves.
      List the four branch names in PROGRESS.md for Tom to review.

- [ ] 13. Adding a source. Write docs/ADDING-A-SOURCE.md: a new source (for
      example UK SHD when live) needs one entry in sources.json, one signal feed
      keyed on GSS, and a coverage block in build-registry.mjs. Prove it: add a
      dummy source in a test, confirm a place page renders the extra coverage row
      with no template change, remove the dummy. Verify: test passes and is kept.

- [ ] 14. Release checklist (write only, do not execute). In PROGRESS.md list for
      Tom: push branch, open PR, enable GitHub Pages on the repo with custom
      domain, DNS change from the OpenAI Sites host to GitHub Pages, verify HTTPS,
      submit sitemap in Search Console (the domain is already verified), then
      shut down the OpenAI Sites project. Stop.

## Rules

- Read a file before changing it. One step per commit.
- Never write a figure you did not read from a source file or a live sister page.
  Leave a field null and note it rather than estimate.
- Never show more than one figure per source on a place page.
- All internal links are plain `<a>` with trailing slashes.
- Keep UK Food Hygiene and ukfoodhygiene.co.uk out of every file. (Superseded by the
  D6 reversal of 27 September 2026.)
- Do not touch DNS, .openai/hosting.json contents, or any remote.
- Do not rename or remove any public URL that exists today.
