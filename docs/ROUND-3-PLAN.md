# UK Places: Round 3 plan

Written 6 October 2026 after Round 2 landed on `main` as PR #26 (merge
`5b79c16`) and a review of the live site, UK Councils, the Codex and Opus
plans, `SEO-PLAYBOOK.md`, and the estate brand memories that those plans only
cited. This file is the source of truth for the next session. Codex
(`docs/CODEX-PLAN.md`) and Opus (`docs/OPUS-PLAN-2026-09-27.md`) are
historical. `PROGRESS.md` is the running log.

Round 1 built the geography record. Round 2 made the records indexable and
added food hygiene, school holidays, Local Links and IndexNow. Round 3 stops
adding modules until the estate role is written down and measured.

## Read first, in this order

1. This file.
2. `PROGRESS.md` (what is live, including the Round 2 landing note).
3. `SEO-PLAYBOOK.md` (indexability rules that still stand).
4. `docs/ADDING-A-SOURCE.md` and `docs/OPERATIONS.md`.
5. Estate brand pack, if the clawd tree is on the machine:
   `briefings/uk-network-brand/BRAND-DECISIONS-2026-08-23.md`,
   `briefings/uk-network-brand/BRAND-SYSTEM-2026-08-23.md`,
   `briefings/uk-network-brand/ECOSYSTEM-TRAFFIC-PLAN-2026-08-23.md`,
   `briefings/uk-network-brand/UK-NETWORK-PRODUCTS-AND-BRAND-2026-08-21.md`.
   Those files are not in this repo and were not readable from Drive on
   6 October 2026. The decisions they already forced are restated below.
   Do not invent a later Claude brief. If a newer brand file exists, read it
   before changing D11 to D15 and record the date and filename here.

## How to loop

1. Read `PROGRESS.md`. Pick the first step below that is neither ticked nor
   blocked.
2. Do the step fully. Run its verification. Do not skip verification.
3. Commit on one tip branch named for the work. Do not open a stack of PRs.
4. Tick the step here and append a dated log line to `PROGRESS.md`.
5. If blocked, write the blocker under Blocked in `PROGRESS.md` and move on.
6. Stop when every step is ticked or blocked.

## Decisions that still stand

D1 to D5 and D7 in `docs/CODEX-PLAN.md` stand: one signal per source, no
charts, no second figure, no rank, no guessed value, date, slug or URL.
Geography record first. Neutral tokens. Trailing slashes. 361 local
authorities as the first level.

D6 stays reversed (27 September 2026): UK Food Hygiene is a public source.

D8 house style stands: no em dash or en dash, no " - " pseudo-dash, British
English, `n/a` as the null cell, declarative voice, titles use a pipe.

D10 stands: every place page stays indexable. Do not add `noindex` unless
Tom reverses this in writing.

## New decisions (final for this session)

D11. Role. UK Places is the GSS geography spine and civic hub. It is not the
     council-tax or "my council" front door. That door for England is UK
     Councils (`https://ukcouncils.co.uk`), which already builds its council
     list from the published UK Places registry. Place pages stay indexable
     (D10). They must not compete for "council tax in [place]" queries: no
     Band D figure, no "council tax" title language, no extra billing
     modules. Link to the UK Councils page where that site confirms one.

D12. Brand. UK Places stays accent-less (D4). Destination-site accents are
     wayfinding only. The estate brand system covers five consumer or civic
     products (food hygiene, demographics, elections, asylum, school
     holidays): one neutral ramp, Source Serif 4 and Source Sans 3,
     dark social ground `#0f1317`, 64-unit solid-fill marks. UK Places is
     not a sixth accent triple. When `briefings/uk-network-design-system`
     is reachable, generate the token block with `apply.py` and `sites.json`
     rather than hand-editing it. Do not redraw the UK Places mark in this
     round; a later brand session can bring it onto the 64-unit language.

D13. Clusters. Consumer sites (food hygiene, school holidays) link UK
     Elections and UK Demographics and never Asylum Stats. Civic-data sites
     (UK Elections, UK Demographics, Asylum Stats) interlink without that
     restriction. UK Places is civic: it may link all five sources. Labour
     Tracker stays out of the sister-sites block. There is no named
     publisher or umbrella brand on the page.

D14. Shipping. One tip branch, one PR, rebase and merge onto `main`. Do not
     open stacked PR groups. `main` requires linear history. Tom merges.
     Do not push to `main`, change DNS, or touch Search Console.

D15. Measure before adding another module. The Round 2 success metric
     (Search Console Pages: "Crawled, currently not indexed" and
     "Discovered, currently not indexed") is still open. IndexNow, Local
     Links and school holidays shipped without it. No new reference module
     until that paste exists or Tom writes that the metric is abandoned.

## Brand research this plan absorbs

The Codex plan cited `BRAND-DECISIONS-2026-08-23.md` once, to justify D1
against "one tool, not a page per place". Opus never re-read the pack.
Round 2 then shipped an indexable directory and left the UK Councils
question in a landing note.

What the August 2026 brand work actually said, from the estate memories
(`uk_network_brand_plan`, `estate_brand_system`) and the Codex citation:

- `ukplaces` was bought as umbrella insurance, not as a 1,029-page traffic
  product.
- "One tool, not a page per place" was a cannibalisation guard, not a
  layout preference. D1 honoured the reason (one signal, geography first)
  and still published a page per local authority.
- The visual system varies only hue and glyph across five sites. UK Places
  has no accent of its own.
- The traffic spine is the geography crosswalk, a shared postcode door, and
  the consumer versus civic linking rule.
- New domains exist only when the query term is the domain or the decision
  is emotive. Food hygiene and school holiday dates were the consumer
  builds. Councillors, GPs and crime were to stay sections of existing
  civic sites, not new domains.

What arrived after that pack, and must now sit beside it:

- UK Councils is live. It answers "council tax in [place]" for 296 English
  billing authorities, uses the UK Places registry for names and addresses,
  and already repeats AI DOGE spend, UK Places reorganisation notes and
  school-holiday dates on a council page.
- UK Places production (6 October 2026) is the Round 2 site: unique titles,
  five sources, school holidays, Local Links, IndexNow key live.

D11 is the written reconciliation: keep the geography pages, cede the
billing query, cross-link, measure.

If a newer Claude brand brief reverses any line above, stop and rewrite
D11 to D15 before coding.

## Facts verified 6 October 2026

- `origin/main` is `5b79c16` (PR #26, 5 October 2026). Round 2 content is
  on production.
- Live home H1 is "Find your local authority". Five source cards match the
  manifest. Postcode door still uses postcodes.io and says so.
- Live Burnley title is "Burnley: local data, public money and
  representation | UK Places". All five sources print a figure. School
  holidays and two council-service links are on the page. The county
  council is named and linked to AI DOGE. The page is indexable.
- `SEO-PLAYBOOK.md` called UK Places "the front door to source-led local
  intelligence" until step 0 of this round. It now follows D11.
- UK Councils home and `/councils/burnley/` answer 2026/27 council tax by
  band, with MHCLG tables beside every figure. `/sources/` says the council
  list comes from the UK Places registry (check last run 27 September
  2026). URL pattern: `https://ukcouncils.co.uk/councils/<slug>/`.
- UK Places does not link UK Councils. The footer sister-sites list is
  exactly `src/data/sources.json` (five specialists).
- Analytics code is built and off. `CF_BEACON_TOKEN` is still unset.
- `www.ukplaces.co.uk` was a Tom-only DNS item in Round 2. Recheck before
  treating it as open.
- County councils still have no UK Places page. Parish and town routes do
  not exist. `DETAILED-SOURCE-INTEGRATION-PLAN.md` was never committed.
- Brand briefs live only on the clawd machine. This repo holds marks that
  cite `BRAND-SYSTEM-2026-08-23.md` (see `public/brands/ukelections.svg`)
  and hand-written neutrals in `src/styles/global.css` that already match
  the published ramp (`#ffffff`, `#f5f6f7`, `#dbdfe3`, `#171b1f`,
  `#545c63`, `#616970`, ground `#0f1317`). Radius is 10px / 6px, one of
  three values the spec left open.
- The UK Places mark (`public/uk-places-mark.svg`) is a terracotta and
  cream 2x2 grid. It is not in the five-site accent triples and was not
  generated by the estate brand builder.

## Steps

- [x] 0. Open a "Round 3" section in `PROGRESS.md` with the baseline
      `git rev-parse HEAD`, this step list, and empty Blocked and Log
      sections. Point the Codex and Opus plans at this file. Rewrite the
      playbook positioning so it matches D11 (geography spine, not the
      council-tax front door). Verify: `rg` finds the Round 3 heading;
      playbook no longer calls UK Places an unqualified "front door";
      `npm run test:house-style`.

- [ ] 1. UK Councils as a confirmed coverage link, not a sixth source.
      Do not add it to `src/data/sources.json`. Do not print a Band D or
      any other council-tax figure. In `scripts/build-registry.mjs` write a
      coverage block (or a sibling file) keyed on GSS: `hasPage` true only
      where UK Councils' own data or live sitemap confirms
      `/councils/<slug>/`, using the UK Places slug from the registry,
      never a name-derived slug. On the place page, add one link in
      Geography or Council services: "Council tax record (UK Councils)",
      only when `hasPage` is true. Scotland, Wales, Northern Ireland and
      any English authority without a billing page stay unlinked. Update
      `docs/ADDING-A-SOURCE.md` to say why this is a reference link and
      not a source. Verify: `npm run test:registry` asserts no sixth
      manifest source, every `hasPage` URL returns 200 on a sample of ten
      including Burnley, and no place title or description contains
      "council tax".

- [ ] 2. Reverse link. On a branch in the UK Councils repo, after reading
      that repo's own rules, confirm Burnley and two other councils already
      link "Place record on UK Places" at the published registry URL. If
      they do not, add that link from the registry slug, never a derived
      one. Do not change UK Councils' council-tax copy. Verify with that
      repo's own checks and a 200 on the three UK Places hrefs.

- [ ] 3. Query-language guard. Extend `scripts/check-metadata.mjs` so
      indexable titles and descriptions fail if they contain "council tax"
      or "council tax bands". Keep the existing unique-title and length
      rules. Verify: the check fails on a doctored Burnley description and
      passes on the real build.

- [ ] 4. Token provenance. If the design-system `apply.py` and `sites.json`
      are reachable, generate the UK Places token block between the estate
      sentinels and commit the result only if the visual tokens are
      unchanged. If they are not reachable, add a short note to
      `docs/OPERATIONS.md` listing the hand-written neutrals against the
      brand ramp (already matched on 6 October) and leave the CSS alone.
      Verify: contrast and text-size checks still pass; no accent of UK
      Places' own is introduced.

- [ ] 5. Measurement close. This step is Tom's paste, not a code change.
      Record in `PROGRESS.md` the Search Console Pages counts named in D15,
      and whether `www.ukplaces.co.uk` now redirects to the apex. Until
      those numbers exist, do not start a new reference module. Ship
      without the token and without the www fix.

- [ ] 6. Close. Update `SEO-PLAYBOOK.md` so the indexability list names
      the UK Councils link and the query-language guard. Update
      `docs/OPERATIONS.md` for the coverage refresh. Write the final
      `PROGRESS.md` log line with the single PR number.

## Shipping

One PR, rebased on current `main`. Body states D11 in one paragraph.
Every PR: `npm run lint`, `npm run build`, all `check:*` and `test:*`
scripts green in CI before asking Tom to merge.

If step 2 needs the UK Councils repo, that is a second PR in that repo,
not a second stacked PR here.

## Never

- Never estimate, apportion, carry forward or default a figure.
- Never copy a rank, league position or comparison from any source.
- Never derive a sister-site slug from a name.
- Never add a second figure from the same source to a place page.
- Never add a council-tax figure, Band D, or parish precept to UK Places.
- Never add `noindex` to a place page unless Tom reverses D10.
- Never put Labour Tracker in the sister-sites block.
- Never add parish, town or settlement routes.
- Never push to `main`, change DNS, or merge a PR.

## Tom only

- Paste the Search Console Pages counts for D15 (step 5).
- Create the Cloudflare Web Analytics site for ukplaces.co.uk and set
  `CF_BEACON_TOKEN` if measurement of visits is wanted. The build already
  ships without it.
- Confirm or reject D11 in one line if the default is wrong. Silence means
  the default stands for this round.
- Merge the single Round 3 PR.
- If a newer Claude brand brief exists, put it on the machine or in this
  repo so the next session can read it.

## Out of scope

- County-council pages on UK Places (link to AI DOGE and, where it
  exists, the UK Councils billing page for the district).
- Shared postcode-door extraction into an estate component. Both sites
  already use postcodes.io; do not unify the code in this round.
- Recovering `DETAILED-SOURCE-INTEGRATION-PLAN.md`.
- UK School Holiday Dates remote, nightly harvest, or a sixth source
  entry. The card and the fail-on-ended-year guard already ship.
- Planning, care, crime or HMO domains.
- Wards.
- Redrawing the UK Places mark.
