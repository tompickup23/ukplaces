# UK Places: Round 4 plan (proposed)

Written 11 November 2026. A proposal for Tom: nothing here is built, merged or
deployed, and no other repository was changed. It refines `docs/ROUND-3-PLAN.md`
(on `main`) against the estate research in Reports (`Website_Audits/`,
`Traffic/seo/`), the Estate Kit (`~/estate-kit`, 0.4.0 on `main`) and live checks
made on 11 November 2026.

Short codes: **R n** is a row in Reports `Website_Audits/roadmap.csv`; **D n** a
decision in the Round 3 plan; **Q n** a question for Tom in section 8.

## 1. Where the site stands

Checked on 11 November 2026 unless a date is given.

| Area | State | Evidence |
|---|---|---|
| Build | 1,030 sitemap URLs: 361 authority records, 12 regions, 650 constituencies, static pages. CI green; last deploy 11 November (service links refresh, PR 49) | Live sitemap; `gh run list` |
| County errors (R430) | Fixed and live: Luton reads Bedfordshire, Wandsworth reads Greater London. "london borough" still prints without a capital | Live pages; PR 39 |
| Search | 2 clicks on 4,650 impressions, average position 21, 4 to 31 October 2026. 970 pages indexed, 60 discovered and not indexed. Page one with no clicks for "e07000068" (position 9.1), "what region is luton in" (8.0), "what county is wandsworth in" (8.8) | Search Console, read by hand 2 November 2026, in Reports `Traffic/seo/audits/ukplaces.co.uk.md` |
| Titles and descriptions (R435) | Unchanged. Home title is "UK Places"; place titles read "Luton: local data and sources"; descriptions are statistic lists of about 300 characters | Live pages |
| Measurement (R431) | None. No beacon on any page, no `CF_BEACON_TOKEN` variable, Search Console read by hand, `www` still answers from one.com | Live pages; `gh variable list` |
| Missing routes | `/codes/`, `/about/`, `/contact/`, `/corrections/`, `/llms.txt` and a feed all return 404 | Live |
| Design | Scored 4.7, Weak: "No visual anywhere; grey cards of names". The mark sits outside the estate palette | Reports `Design_Audit_2026-11-04.md` |
| Estate Kit | Not adopted. UK Places has no entry in the kit's `tokens/tokens.json`, so no accent, skin or alias file exists for it | `~/estate-kit/generated/` |
| Round 3 | Step 0 done. Steps 1 to 6 (the UK Councils link, the reverse link, the query guard, token provenance, the Search Console paste, close) are unticked | `PROGRESS.md` on `main` |
| Rulings not yet applied | Tier rule decided 4 November as written: signed sites do not link tier C, a source may be named in text. AI DOGE decided public, with its brand out of tier A and B footers and no new cross-links. The live Burnley record still links Asylum Stats and AI DOGE, both in the body and the footer | Reports `Decisions_Sitting_2026-11-08.md` lines 147 and 169; live page |
| Reverse links | UK Demographics, UK Food Hygiene, Asylum Stats, UK Council Tax and AI DOGE link the Burnley record. UK Elections' seat page, UK Councils' council page (it links only the registry JSON) and UK School Holiday Dates do not | Live Burnley pages on each site; one place checked, not all |
| Local checkout | `~/ukplaces` is on `feat/local-links` at the 6 October head with uncommitted edits to `PROGRESS.md` and the landing note. `main` has moved 14 commits past it | `git status`, `git log origin/main` |

Estate standing: Reports `ACTIVE.md` lists "Site rounds: UK Places PRs" under
Parked. A build session needs Tom to name it there first (Q1).

## 2. What is wrong with the plan as it stands

1. **Round 3 is a holding plan.** D15 stops all new work until Tom pastes Search
   Console counts. Those counts exist (2 November) and say indexing is healthy
   and the fault is the listing. D15 is met; it should be closed, not waited on.
2. **The goal and the rules contradict each other.** The register's goal is "the
   one page for any place in England". The plan's Never list bars town and
   settlement routes. The site's own impressions are for towns ("luton county",
   "what county is wandsworth in"). A registry of 361 authorities cannot be the
   page for any place. This is the largest single decision for traffic (Q3).
3. **D13 is overtaken.** It lets UK Places link all five sources and names no
   publisher. The tier ruling of 4 November says the opposite on both points.
4. **"No charts" has been read as "no visuals".** The design audit says D1 to D5
   do not forbid a map or tiles, and makes the locator map and signal grid the
   site's signature (R439, R575, freed 4 November). The plan should say so.
5. **The no-download rule is already broken in practice.** The registry is
   public at `/data/registry/places.json` and seven sites read it. It has no
   page, licence line or documentation, so it earns no links. The audit's
   rivals (doogal, mySociety, Find that Postcode) win on exactly this.
6. **Signals are refreshed by hand** (R441) and the school calendar test fails
   on 31 August 2027 with no owner (R442).

## 3. Search: what will bring traffic

No search volume is estimated here. The only measured ground is the Search
Console read above. Lanes are ordered by evidence, then by cost.

| Order | Lane | Why | What to build | Row |
|---|---|---|---|---|
| 1 | Listing | Already on page one with no clicks; titles name no task | Home: "Find your local authority: GSS code, county and region". Place: "Luton (E06000032): county, region and council". Answer-first descriptions of about 155 characters: type, county, region, code. `WebSite` and `Organization` JSON-LD on home; region links on home | R435 |
| 2 | GSS codes | The largest query group; no rival names Brentwood for its code; ONS retired its page per code on 31 March 2025 (ONS Digital blog, 24 February 2025, logged in Reports `inspirations.csv`) | `/codes/` listing every code with name, type, county and region. The code on every card. Per record: predecessor codes with their orders (the ONS Code History data is already in the repo), active-since date, links to Wikidata, OpenStreetMap and MapIt. Constituency and region codes on the same page | R436 |
| 3 | "What county is X in", "which councils are in Y" | Measured impressions; Wikipedia owns it but mixes historic, ceremonial and administrative counties | A page per ceremonial county and per county council area listing its authorities with codes; a page per authority type (unitary authorities, London boroughs, metropolitan boroughs, districts). Each record states ceremonial county, county council and region, labelled | New |
| 4 | "Which council am I in" | The postcode door exists but returns one link | Make the result a full answer: council, county council, ward, constituency and region (postcodes.io returns all of these), each linked to its record and to the matching page on every sister site | New |
| 5 | Towns and settlements | The goal says any place; the impressions are for towns | Q3. If yes: a pilot from an official ONS built-up area to local authority lookup, one page per town with council, county, region and constituency, never a population or score. Count and edition taken from the file, not estimated | Decision |
| 6 | Reorganisation | A dated public question for every two-tier area; the registry already holds the Lancashire record | A "changes to this authority" line on each record from official orders only: predecessors, successors, dates. No forecast and no opinion; link the government decision | New, with R436 |
| 7 | Constituencies | 650 pages of about 111 words (2 November audit); most of the 60 unindexed pages are probably here, not confirmed | Add what is already held: share of each authority by postcode count, neighbouring seats, region, code history. If the 5 December read still shows them unindexed, take them out of the sitemap | R438 |
| 8 | The registry as a linkable asset | Developers link data, not pages | `/data/` page documenting the registry files, fields, editions and the Open Government Licence attribution; `Dataset` JSON-LD there only | Q4 |
| 9 | Answer engines | Cheap | `llms.txt`, a feed and a what-changed page from the review dates. Reports' 11 November research found most such files receive no requests, so spend nothing more | R440 |

Measure each step: titles first, then read Search Console 28 days later before
changing them again. The read date for step 1 is the gate for step 7.

## 4. Useful: what a visitor gets that no rival gives

Keep the model: one record per place, one dated figure per source, the link to
the full record. Build out three things.

- **The first screen answers.** Name, code, type, county, county council and
  region across the full width, with the locator map beside it. The audit found
  the place page is a run of text cards.
- **"Your area" from a postcode** (lane 4). This is the single most useful
  thing the site can do and needs no new page type.
- **Every figure dated and current.** Signals on a schedule (section 7), with
  the source's own date printed, as now.

Still refused: ranks, scores, a second figure per source, council tax figures,
forecasts, anything estimated.

## 5. Looks great: what the Estate Kit and estate design work give

| Estate upgrade | Fits UK Places? | Notes |
|---|---|---|
| Tokens, skin and alias files | Yes, after a kit change | Add `ukplaces` to the kit's `tokens.json` in the record register with no accent of its own (D12). The site's neutrals already match the brand ramp, so the splice should change no colour. This closes Round 3 step 4 |
| Base layer (kit PR 7, open) | Yes | Fluid type, numerals, tables, focus, prefetch, icons, the 404 page. The codes table and county lists need exactly this |
| LocatorMap | Yes, as the signature (R439) | Boundaries are held in `~/ukdemographics/data/geography/`. The kit map shades a rate by rule; UK Places needs a plain locator with no shading, which is a small kit change, not a site fork. Check before building |
| StatTile as the signal grid (R575) | Yes | One tile per source from the existing signal feeds, recast as kit figure records so each carries its source line. A money figure needs a perspective clause or a stated waiver (AI DOGE payments) |
| Card package | Yes | Replaces the site's own Satori cards and removes the two moderate advisories the audit step still reports |
| Mark sheet v1 | Yes | The new UK Places mark and favicon set are built in clawd (PR 1161, R560). A favicon shows beside every mobile result |
| Page gate, catalogue checks | Partly | UK Places already runs stricter metadata and sitemap checks and is a donor to the kit here |
| PositionStrip, Hemicycle, ZeroBar, Line, Waffle | No | They rank, compare or chart; D1 and "no party bars" forbid them |
| `/design-check` skill | Yes | Run before every site PR from now on |
| Search Console service account, weekly traffic note | Yes | Estate plumbing; UK Places appears only as "unmeasured" today |

Three things block kit adoption and none is in this repo: kit PRs 7 and 9 are
open; the kit has no tag after `v0.3.0` and its vendor command refuses an
untagged commit; the kit's CI is refused by GitHub for a billing reason. And
one risk: `ukplaces` is a public repository and the kit is private by decision
(a public kit could tie the anonymous site to the rest). Vendoring must copy
only the UK Places token block, and the copied files need reading for other
sites' names and marks before they are committed (Q5).

So the order is: search and trust work first on the current stylesheet, kit
adoption once a tagged kit with the vendor command exists.

## 6. Linking: the spine for every project

The registry is the estate's place key. The plan is to make every link in both
directions come from it, confirmed, never derived from a name.

1. **One coverage block per site in the registry**, `hasPage` true only where
   that site's own sitemap or data confirms the URL. Add UK Councils (Round 3
   step 1), UK Council Tax and UK School Holiday Dates now; UK Public
   Contracts, UK Government and UK Democracy when each has stable place routes.
   These are reference links, not sources, so the one-figure rule is untouched.
2. **Reverse links.** UK Elections seat and council pages, UK Councils council
   pages and UK School Holiday Dates do not link the record. Each is a small PR
   in that repo under its own rules (Round 3 step 2 covers only UK Councils).
3. **Apply the tier ruling** (Q2): name Asylum Stats and AI DOGE as sources in
   text without a link, and take both out of the footer and the home cards'
   links, or record why not.
4. **AI DOGE links** currently point at council body pages the audit found
   noindex; point at the budgets page where that is so (R437).
5. **Home page** links the 12 regions and the new county and code pages, not
   seven URLs.
6. **The engine.** ukskynet's shared bodies table (Gate 0, 14 and 15 November)
   and R010 name this registry as the live GSS spine. Publish the registry
   schema and edition in `/data/` so the engine reads a documented file.
7. **tompickup.co.uk** is the hub for all projects; UK Places is tier A, so an
   about page naming the publisher links there (Q2).

## 7. Order of work

Each phase is one branch and one PR; Tom merges; a merge deploys.

**Phase 0, housekeeping (Claude, small).** Bring the local checkout to `main`
without losing its uncommitted documents (the 6 October landing outcome and
handover, which are not on `main`; carry them onto a branch first, and ask
before deleting anything). Close or merge
Dependabot PRs 47, 48 and 4 on green checks. Mark Round 3 D15 met with the
2 November counts. Update register rows R430, R432, R443 to done.

**Phase 1, listing and trust (Claude, about one session). Due 25 November.**
R435 titles, descriptions and home JSON-LD; capital on "London borough"; the
"council tax" query guard (Round 3 step 3); about, contact and corrections
pages (R437); the tier ruling applied (Q2); `llms.txt`. Verify with
`check:metadata`, a doctored-page failure, `/design-check` and `/fact-check`
on the new copy.

**Phase 1b, measurement (Tom, about 20 minutes).** Create the Cloudflare Web
Analytics site and set `CF_BEACON_TOKEN`; verify the site in Bing Webmaster
Tools so IndexNow stops returning 403 (confirm the 11 November deploy's
IndexNow job result first); remove or repoint the one.com `www` record; add
the Search Console service account.

**Phase 2, codes and geography pages (Claude). Due 9 December.** `/codes/`,
code history per record, county, county council and type pages, home region
links, UK Councils and other coverage blocks, the fuller postcode answer.
Sources: the ONS Code History Database and the Lieutenancies Act 1997
Schedule 1, both already cited in the repo.

**Phase 3, reverse links (Codex, one small PR per sister repo).** UK Elections,
UK Councils, UK School Holiday Dates.

**Read, on or after 23 December.** Search Console 28 days after phase 1 lands.
Decide constituencies (lane 7) and whether titles need a second pass. This is
also the date of the next whole-site audit (R447, due on or after 16 December).

**Phase 4, the look (Claude, after a tagged kit).** Kit tokens and base layer,
the mark and favicons, locator map, signal grid, kit cards.

**Phase 5, by decision.** Towns pilot (Q3), the `/data/` page (Q4), the
reorganisation line, a scheduled signal refresh in place of the hand run
(R441), and an owner for the school calendar snapshot before 31 August 2027
(R442).

## 8. Questions for Tom

| Q | Question | Recommended |
|---|---|---|
| Q1 | Name a UK Places round in `ACTIVE.md` (it is Parked), or run phases 0 and 1 as a time-boxed exception? | Exception for phases 0 to 2; they are small and the site is live with a known fault in its listing |
| Q2 | The tier ruling on this site: unlink Asylum Stats and AI DOGE (named as sources in text), and name the publisher on an about page? This reverses D13 | Yes to both, as the 4 November ruling reads |
| Q3 | Towns and settlements: keep the bar, or allow a sourced pilot? | Allow a pilot after the December read, from an official ONS lookup only; it is the one move that matches the stated goal |
| Q4 | Document the registry as open data at `/data/`? It is already public | Yes |
| Q5 | Kit route for a public repository: vendor a scoped copy, or keep UK Places on its own stylesheet and take only tokens? | Vendor, scoped to UK Places, after reading the copied files |

## 9. Rules carried forward

D1 to D5, D7, D8, D10, D11, D12 and D14 stand. D13 changes if Q2 is yes. D15 is
closed as met. The Never list stands except the town and settlement line, which
waits on Q3. No figure is estimated, carried forward or derived; a missing
value stays blank with a note. Every new figure names its publisher, document,
table and edition.

## 10. Not checked

- Reverse links were checked on Burnley pages only.
- Which 60 URLs are unindexed is not known; the list was never exported.
- Search Console has not been read since 2 November 2026.
- Whether the 11 November deploy's IndexNow job passed.
- Whether the kit's LocatorMap can draw an unshaded locator today.
- The count and edition of the ONS built-up area lookup for Q3.
- The local `PROGRESS.md` edits against `main` line by line.
