# Council official names

Decision D1 of 9 November 2026 uses the Authority Name column of the
[GOV.UK Local Links Manager export](https://local-links-manager.publishing.service.gov.uk/data/links_to_services_provided_by_local_authorities.csv),
under the Open Government Licence v3.0. Join by exact GSS code and copy the
name verbatim. No name matching, punctuation changes or short-name fallback.

`src/data/registry/official-names.json` holds the registry source block and
the first matching export row for each relevant code. The source block pins
the HTTP last-modified header, retrieval date and SHA-256 of the original
response bytes. The hash identifies the complete export, not the extracted
JSON. Row numbers count CSV records with the header as row 1. Identical names
repeat across service rows; the refresh checks every relevant row and stops
if any code has two different names. Rows outside the registry and its six
authorised, mapped predecessors are ignored.

Both the source block and the place records are copied byte for byte to
`public/data/registry/` so the evidence travels with the published registry.
The 21 county council records retain their existing contract, where `name`
holds the full council name. Their names receive the same exact-code check.

Run `npm run build:official-names` to fetch and review a new edition. This
shares the downloader and CSV reader with `npm run build:local-links`; it
does not refresh service URLs or contact council websites. It updates only
place `officialName`, its optional `officialNameVia`, county council `name`
and the pinned evidence. Review every changed value against its export row.
The ordinary site build is offline and does not refresh the edition.

The eight authorised predecessor candidates are Barnsley E08000038 via
E08000016, Sheffield E08000039 via E08000019, North Yorkshire E06000065 via
E10000023, Somerset E06000066 via E10000027, Fife S12000047 via S12000015,
Perth and Kinross S12000048 via S12000024, Glasgow City S12000049 via
S12000046 and North Lanarkshire S12000050 via S12000044. Each predecessor
join must also exist in `gss-predecessors.json` and records `officialNameVia`.
The two county predecessors do not exist there. North Yorkshire therefore
keeps `North Yorkshire Council` and Somerset keeps `Somerset Council`.
These are the only permitted kept values.

`npm run build` checks every place and county name before Astro starts.
Missing evidence, conflicting names, an unlisted predecessor, a changed kept
value or a mismatch between source and published copies stops the build.
`npm run test:registry` includes the same checks and exercises the failure
cases. The broader registry generator also reads the pinned names and checks
them before writing output, so AI DOGE display names cannot replace them on
a later registry refresh.

This change leaves all other place fields intact, including `name`, `slug`,
`county` and `reorganisation`. The Lancashire reorganisation note remains
withdrawn and held on both tax sites; this name refresh does not change it.
