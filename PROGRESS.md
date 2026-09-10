# UK Places progress

Baseline `git rev-parse HEAD`: `2685f4f19c42c2d0d4be14fff4c3d40763408ee4`

## Steps

- [x] 0. Create PROGRESS.md with this checklist, the baseline revision, and the Blocked and Log sections.
- [x] 1. Apply the stopgap fixes to the current vinext site.
- [x] 2. Scaffold the Astro site in `site/`.
- [x] 3. Build registry v1 for all 361 local authorities.
- [x] 4. Create the source manifest and signal feeds.
- [x] 5. Build the generated place page.
- [x] 6. Build the directory, static pages, sitemap, and robots file.
- [x] 7. Build the home page and postcode door.
- [x] 8. Implement the header, footer, and type scale.
- [x] 9. Check parity against the current vinext site.
- [x] 10. Retire vinext and make Astro the root site.
- [ ] 11. Add constituencies and regions.
- [ ] 12. Integrate the registry with sister sites on review branches.
- [ ] 13. Document and test adding a source.
- [ ] 14. Write the release checklist for Tom only.

## Blocked

## Log

- 2026-09-10 — Step 0: created the progress checklist with baseline `2685f4f19c42c2d0d4be14fff4c3d40763408ee4`; verified the baseline, checklist, Blocked, and Log sections with `rg` and whitespace with `git diff --check`; next: step 1.
- 2026-09-10 — Step 1: enabled trailing-slash routing, corrected per-page canonical and social metadata, fixed the Burnley breadcrumb target, and added the branded no-index 404; verified with `npm run build`, a local Wrangler server, `/usr/bin/curl` status/redirect checks, and generated-page metadata/link assertions; this commit is what Tom should deploy to the current host if the migration takes more than a few days; next: step 2.
- 2026-09-10 — Step 2: created the static Astro scaffold in `site/`, with the neutral shared-token mapping, self-hosted identity assets, and the shared layout, site library, and components structure; verified `npm --prefix site run build` produces `site/dist/index.html`, assets are present, and the Astro configuration has the required static, trailing-slash, and canonical-site settings without a UI framework or Tailwind; next: step 3.
- 2026-09-10 — Step 3: generated the GSS-keyed registry for all 361 local authorities, with source-confirmed coverage links, county relationships, neutral nulls for unverified identifiers, and the Lancashire reorganisation record from the local decision data; verified regeneration, 361-entry/unique URL/GSS/slug tests, an Astro build, exact Burnley coverage, and ten randomly selected live coverage URLs returning 200; next: step 4.
- 2026-09-10 — Step 4: added the four-source manifest and regenerated six-field signal feeds from the sister datasets, leaving unavailable source records null; verified every feed has 361 entries and exactly six fields per signal, Burnley matches the required signals, and the Astro build passes; next: step 5.
- 2026-09-10 — Step 5: generated the 361 data-driven place pages with geography, source coverage, dates, metadata and structured data, plus source-confirmed constituency membership; verified all 361 pages render, ten random titles/descriptions are unique, Burnley matches the supplied board and structured-data checks, and text-size and contrast scripts pass; next: step 6.
- 2026-09-10 — Step 6: added the full country/region directory with a no-JavaScript list and browser-verified client filter, recreated the static explanatory routes, generated updates, and added branded 404, sitemap and robots files; verified the sitemap has 361 place URLs plus five static URLs, all trailing-slash paths exist in dist, and text-size/contrast checks pass; next: step 7.
- 2026-09-10 — Step 7: replaced the temporary home page with an accessible postcode and name finder, source-question cards, and a place-record overview; verified BB11 1PD resolves to Burnley through the live postcode service, invalid postcodes announce an error, a Tab/type/Enter path works, desktop and mobile captures are saved, and the production build, sitemap, text-size and contrast checks pass; next: step 8.
- 2026-09-10 — Step 8: added neutral shared header/footer chrome, a responsive native mobile menu, visible focus states, and the required type-scale floor across every page; verified the production build, sitemap, text-size and contrast checks, reviewed Burnley at 1440px and 375px, and measured the mobile menu at 44px high; next: step 9.
- 2026-09-10 — Step 9: built and served both implementations, then verified every one of the six original sitemap routes has a trailing-slash Astro output path and compared title, description and canonical metadata. Canonicals match on all six; Methodology, Sources and Updates metadata is unchanged. Intentional differences: the home title now uses the concise brand name; Places now describes the full local-authority directory; and Burnley now has neutral geography-record metadata rather than the prior topic-led local-data metadata. Next: step 10.
- 2026-09-10 — Step 10: moved the Astro site to the repository root, removed vinext, Next, UI-library and formatter artefacts, added the GitHub Pages deploy and site-check workflows plus CNAME, and added a retained legacy-route parity check. The existing hosting configuration was left untouched; the formatter configuration was removed because no root script uses it. Verified a clean clone with `npm ci`, build, lint, contrast, text-size, sitemap and parity checks; next: step 11.
