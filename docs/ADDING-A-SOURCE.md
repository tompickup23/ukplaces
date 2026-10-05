# Adding a source

Each source is connected to a place record through three inputs: a manifest entry, a GSS-keyed signal feed, and registry coverage.

## 1. Add the manifest entry

Add one object to `src/data/sources.json`. Match the existing fields:

- `id`: the stable source identifier.
- `name`, `accent`, and `topic`: the source label and presentation metadata.
- `levels`: the supported geography level.
- `feedPath`: the corresponding file under `src/data/signals/`.
- `schemaVersion` and `siteUrl`: the source feed contract and source site.

The `id` must match the signal feed filename and the coverage key.

## 2. Add registry coverage

In `scripts/build-registry.mjs`, add a coverage block for the new source inside each place record. A confirmed place page uses `hasPage: true` with its confirmed `slug` and trailing-slash `url`. When a place page has not been confirmed, retain `hasPage: false` and use `null` for both `slug` and `url`.

## 3. Add the signal feed

Create `src/data/signals/<source-id>.json`, keyed by GSS code. The signal object has these six fields:

- `value`
- `unit`
- `label`
- `period`
- `snapshotDate`
- `url`

Use `null` for every field where the source data does not confirm a current signal. Do not infer a value or date. Update the source-feed build path when the new feed is generated from a sister dataset.

## Worked example: UK Food Hygiene (the fifth source, 27 September 2026)

- Manifest: `ukfoodhygiene`, accent `#1f5c4a`, site `https://ukfoodhygiene.co.uk`. Add the brand mark to `public/brands/<id>.svg` and the `logos` map in `src/pages/sources.astro`.
- Coverage: `scripts/build-registry.mjs` reads the food hygiene repo's committed `etl/la_map.csv` (FSA authority to GSS code and `council_slug`) and moves its two LAD24 codes to the current code only through that repo's committed `etl/current_lad25_crosswalk.csv` (Barnsley, Sheffield). The two port health authorities have no GSS code and are skipped. All 361 places are covered; the page URL is `https://ukfoodhygiene.co.uk/councils/<council_slug>/`.
- Signal: `scripts/build-signals.mjs` reads `site/src/data/councils.json` and `meta.json` (gitignored ETL output). The value is `pct_five` to one decimal with a percent sign, labelled "Businesses rated 5 out of <rated_count> rated", period "Official register as at <data_date>.". A council with `pct_five` null or `rated_count` 0 gets a blank signal; the 32 Scottish councils run the pass/improvement scheme and are blank for that reason. Never use `avg_rating`, `pct_awaiting_inspection` or anything from the leagues pages.
- Freshness: the build refuses a `meta.json` whose `data_date` is more than seven days old. The copy the live site is built from is `vps-main:/root/ukfoodhygiene-release/site/src/data/`; copy `councils.json` and `meta.json` from there into the local checkout first.

## Not a source: the school holiday card (UK School Holiday Dates)

The school holiday card on place pages is a reference module, not a sixth source, and it stays out of `src/data/sources.json`. That manifest drives the footer's sister-site list, the home source cards, the sources page, the "all five sources" count in each introduction, the title rule, the description and the share card, and each of those assumes one six-field figure per GSS code from a sister site. The calendar is different in kind: a set of dated breaks, the education authority's published calendar that UK School Holiday Dates records, joined to a district through its county council (`parentGss`), and present on 339 of 361 places.

Its contract lives beside the data instead:

- `data/school-holidays/manifest.json` names one snapshot, `calendar-<sha256>.json`, with its byte count; `scripts/calendar-contract.mjs` refuses a snapshot whose hash, size, schema, destination origin, evidence hashes, break dates or publication holds do not check out.
- A place shows a card only where its own GSS code, or its county council's, has a calendar for the snapshot's current academic year. Where the feed still uses an authority's old code, its ONS same-name predecessor (`src/data/registry/gss-predecessors.json`) joins it, as for Barnsley and Sheffield. Nothing is joined by name or proximity. Northern Ireland, held calendars and authorities with no single calendar show none.
- `scripts/calendar-display.mjs` defines what the card shows (`cardContent`). `data/school-holidays/card-dates.json` records, per education authority, a hash of that content and the date it last changed; the sitemap `lastmod` and the page's "Last reviewed" date use that date, never the snapshot date. The build fails if the file does not match the snapshot.
- The next break is picked in the reader's browser, so the built page does not go stale between deploys.

To refresh it, see `docs/OPERATIONS.md`. A future reference module should follow the same pattern: its own verified snapshot and content-date file, no entry in the source manifest.

The council service links (GOV.UK Local Links Manager) are a second reference module on the same pattern: `src/data/local-links.json`, dated per place when its links change, outside the source manifest and the footer.

## 4. Verify the integration

Run the registry and signal checks, the source-onboarding regression test, and a production build:

```sh
npm run build:registry
npm run test:registry
npm run build:signals
npm run test:signals
npm run test:source-onboarding
npm run build
```

`test:source-onboarding` temporarily adds a dummy source and coverage record, confirms that the existing place template renders the extra coverage row, then restores the data and checks the restored build. Keep this test when adding future sources.
