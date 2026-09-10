# Adding a source

Each source is connected to a place record through three inputs: a manifest entry, a GSS-keyed signal feed, and registry coverage.

## 1. Add the manifest entry

Add one object to `src/data/sources.json`. Match the existing fields:

- `id` — the stable source identifier.
- `name`, `accent`, and `topic` — the source label and presentation metadata.
- `levels` — the supported geography level.
- `feedPath` — the corresponding file under `src/data/signals/`.
- `schemaVersion` and `siteUrl` — the source feed contract and source site.

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
