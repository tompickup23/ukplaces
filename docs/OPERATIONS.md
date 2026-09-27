# Operations

## Production monitoring

`.github/workflows/production-monitor.yml` runs the production check every Monday and can be run manually. It requests the configured public site over HTTPS and verifies the home page, the Burnley place and constituency routes, the sitemap, and robots file. It also runs the production dependency audit. Until the GitHub repository and Pages deployment in the release checklist exist, the workflow is present but cannot run there.

For a local deployment check, start the built site and point the command at the local server:

```sh
UKPLACES_MONITOR_URL=http://127.0.0.1:4321 npm run check:production
```

## Weekly source refresh

The weekly refresh automation works from the sibling source repositories named in the build scripts. It only regenerates the local registry, signals, and constituency data from those source files; it must leave unconfirmed fields as `null` and never infer a value, date, URL, or coverage record.

UK Food Hygiene is the one source whose signal input is not committed anywhere: `councils.json` and `meta.json` are gitignored ETL output. Before a refresh, copy both from `vps-main:/root/ukfoodhygiene-release/site/src/data/` (the checkout the live site is built from each night; `/root/ukfoodhygiene` is not refreshed) into `/Users/tompickup/ukfoodhygiene/site/src/data/`. `npm run build:signals` stops with an error when `data_date` is more than seven days old rather than publish a stale figure.

```sh
scp vps-main:/root/ukfoodhygiene-release/site/src/data/councils.json vps-main:/root/ukfoodhygiene-release/site/src/data/meta.json /Users/tompickup/ukfoodhygiene/site/src/data/
```

When a source snapshot changes, run these commands in order:

```sh
npm run build:registry
npm run build:signals
npm run build:constituencies
npm run build:place-constituencies
npm run test:registry
npm run test:signals
npm run test:constituencies
npm run test:source-onboarding
npm run test:house-style
npm run lint
BUILD_OG=1 npm run build
npm run check:text-size
npm run check:contrast
npm run check:sitemap
npm run check:metadata
npm run check:parity
npm run audit:prod
```

Review the generated JSON diff before committing. The refresh routine must not push, deploy, alter DNS, or modify a source repository.

## Build checks added in Round 2 (27 September 2026)

- `npm run test:house-style` fails on any em or en dash, literal or entity, under `src/` and `scripts/`.
- `npm run check:metadata` reads every indexable page in `dist/` and fails on a repeated title or description, a description outside 70 to 300 characters, a dash character in either, or an `og:image` that is not in `dist/`. Run it after the build.
- `npm run check:sitemap` also asserts every `lastmod` against its source date.
- `npm run check:contrast` also fails when text set in a source accent has no dark-mode ink override.

All four run in `site-checks.yml` and `deploy.yml`.

## Share cards

`BUILD_OG=1 npm run build` renders 361 place and 650 constituency cards under `dist/og/`; both workflows set it in an `env:` block, which is why their timeout is 30 minutes. A build without it renders no cards and every page falls back to `/og.png`, so iteration builds stay fast. After editing `src/lib/og.ts` or an endpoint under `src/pages/og/`, delete `.astro/` and `node_modules/.vite/` before rebuilding, or Astro serves the cached endpoint.

## Wikidata identifiers

`src/data/registry/wikidata-by-gss.json` is committed output of `node scripts/build-wikidata-lookup.mjs`, which queries Wikidata SPARQL on P836 (GSS code) and keeps only codes carried by exactly one item. Rerun it by hand after a GSS recode, review the diff, update the pinned count in `scripts/test-registry.mjs`, then run `npm run build:registry`. The registry build never calls Wikidata itself.

## Published registry

`npm run build:registry` writes `src/data/registry/places.json` and the copy sister sites read at `public/data/registry/places.json`; `npm run test:registry` fails if the two differ. It also writes `src/data/registry/county-councils.json` from the AI DOGE crosswalk.

## Constituency geography

`npm run build:constituencies` fills the PCON code UK Elections leaves null (77 seats in Scotland and Northern Ireland) by an exact, unique match on the official ONS name in `ukelections/data/geography/pcon24-simplified.geojson`; it stops if that match disagrees with any code UK Elections does carry. Each seat's current local authorities (`ladCodes`) come from `ukelections/data/ons-pcon24-lad25-postcode-crosswalk.json` (ONS Postcode Directory), counting a pair only where at least 10 live postcodes fall in both. `lad24cds` keeps the UK Elections list unchanged. Run `build:place-constituencies` after it, because place membership is built from the constituency registry.

