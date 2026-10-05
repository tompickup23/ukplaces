# Round 2 landing review

## Route

Compared the fetched PR base and head trees with origin/feat/local-links at 5ca78c5eea0cccb3f99325aa21291d39f40f751f. All nine content PR heads are ancestors of the landing branch. Files subsequently changed by later commits were compared as part of the review. Dependency PRs remain separate.

| PR | Title | Contained | Files not contained |
| --- | --- | --- | --- |
| #2 | build(deps): bump actions/checkout from 5.1.0 to 7.0.1 | No | .github/workflows/codeql.yml, .github/workflows/deploy.yml, .github/workflows/production-monitor.yml, .github/workflows/site-checks.yml |
| #3 | build(deps): bump actions/deploy-pages from 4.0.5 to 5.0.1 | No | .github/workflows/deploy.yml |
| #4 | build(deps-dev): bump typescript from 5.9.3 to 7.0.2 | No | package-lock.json, package.json |
| #6 | build(deps): bump actions/setup-node from 5.0.0 to 7.0.0 | No | .github/workflows/deploy.yml, .github/workflows/production-monitor.yml, .github/workflows/site-checks.yml |
| #7 | build(deps): bump actions/upload-pages-artifact from 4.0.0 to 5.0.0 | No | .github/workflows/deploy.yml |
| #13 | build(deps): bump github/codeql-action/analyze from 4.38.0 to 4.38.1 | No | .github/workflows/codeql.yml |
| #15 | Round 2 group 1: metadata, sitemap dates and structured data (steps 0 to 2) | Yes | None |
| #16 | Round 2 group 2: UK Food Hygiene as the fifth source (step 3) | Yes | None |
| #17 | Round 2 group 3: internal linking and home copy (steps 5 and 6) | Yes | None |
| #18 | Round 2 group 4: per-record share cards (step 7) | Yes | None |
| #19 | Round 2 group 5: close, and analytics blocked on a token (steps 8 and 9) | Yes | None |
| #20 | Round 2 follow-up A: ONS codes and current local authorities for every constituency | Yes | None |
| #21 | Round 2 follow-up B: place introductions, internal linking, copy and monitoring | Yes | None |
| #22 | Round 2 step 8: analytics behind a token, privacy page | Yes | None |
| #23 | Follow-ups D to F: school holiday card, display names, introduction fix | Yes | None |
| #24 | build(deps-dev): bump @types/node from 25.9.6 to 26.6.3 | No | package-lock.json, package.json |
| #25 | build(deps): bump astro from 7.3.2 to 7.3.5 | No | package-lock.json, package.json |

## Original 23 commits

```text
f178e6c 0: open Round 2, reverse D6, add the house-style dash test
b00086e 1: titles and descriptions from the signals, metadata gate
45e3ba8 2: sitemap lastmod, JSON-LD dates, region and Wikidata links
f61cd54 3: UK Food Hygiene as the fifth source
f7dfcf6 5: region links, county council names and sibling places
967d907 6: home copy, source site links, font preloads, dark accent contrast
ded5144 7: per-record share cards
7c6c67c 7: log share cards in PROGRESS
b5415d8 9: playbook and operations match the pages; step 8 recorded as blocked
ba089d2 9: final Round 2 log line with the open PRs
5204fb8 Constituencies: ONS codes and current local authorities for every seat
bf07719 Content and linking: place introductions, region breadcrumbs, seat links
62165ae Log follow-up PR numbers
a66f1a1 8: analytics built in behind a token, privacy page
f5013d9 Log PR #22 in the merge order
2c4b5ea Place introductions: no repeated "in" where there is no ceremonial county
0293abb School holiday card from a verified UK School Holiday Dates snapshot
1aa9d5b Display and search names from the ONS naming rule
4af36c2 PROGRESS: log follow-ups D to F and the landing plan
e29843d School holiday card: fixes from code review
92a60cc IndexNow: submit only the URLs whose sitemap lastmod changed
661a014 Council service links pilot from GOV.UK Local Links Manager
5ca78c5 School holidays: join old feed codes through ONS predecessors, fail on an ended year
```

## Local files excluded

The untracked calendar-819e824d3e4cbf3b904d5a9a5264721119e3c1a3b14d9e1fc45900b97a3b1704.json is not selected by the calendar manifest. The untracked DETAILED-SOURCE-INTEGRATION-PLAN.md describes follow-on work outside this landing. Both remain untouched and uncommitted.

## Release checks

Local gates passed: npm ci; production dependency audit at the high threshold; registry, signals, constituencies, source onboarding, house style, school holidays, IndexNow and local links tests; Astro lint (zero errors or warnings); npm run build; metadata, contrast, text size and parity checks.

All 1,030 sitemap URLs carry lastmod and returned HTTP 200 with non-empty page content from a local server. The generated HTML sweep passed for all 1,031 pages. All 361 place pages remain indexable, link to UK Food Hygiene and carry FSA provenance. The privacy page matches the absent production token. Browser checks across home, Burnley and privacy emitted no beacon or analytics requests in development with a test token supplied.

The 12 previously undated constituencies now have record-change dates derived from this repository's Git history, with per-record hashes and provenance revisions. MP source dates were not invented or changed. Two high-severity transitive dependency issues were removed by compatible lockfile updates; the audit still reports two moderate production advisories.

The GOV.UK service-link refresh uses the 5 October export and publishes 299 Council Tax links and 248 bin collection links. Failed destinations are omitted under the existing collector rules.

The local share-card build and required GitHub checks are pending. Main requires linear history, which conflicts with the requested merge commit; that protection has not been changed.

## Open decisions

Tom still needs to decide whether UK Places should stay out of council-name searches, with UK Councils as the front door. No place noindex is introduced here. The CF_BEACON_TOKEN repository variable is absent, so production remains free of analytics until Tom supplies it.

There are no parish or town-specific routes in this registry. A town-named local-authority record can be checked, but must not be presented as a parish or settlement page.
