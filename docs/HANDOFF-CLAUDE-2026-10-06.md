# UK Places handover to Claude, 6 October 2026

## Start here

Tom asked Codex to prepare this handover and archive the chat. This handover records state; it does not authorise new release actions beyond Tom's instructions. Work only in `/Users/tompickup/ukplaces`. No other repository or VPS was changed. Read `/Users/tompickup/.claude/CLAUDE.md`, `PROGRESS.md` and `docs/ROUND-2-LANDING-2026-10-06.md`. This checkout had no root CLAUDE.md or AGENTS.md when checked. If either now exists, read it first.

Original task: `/Users/tompickup/Documents/Reports/UK_Places_Landing_ChatGPT_Prompt_2026-10-05.md`. Tom authorised the Round 2 merge and Pages deployment only after every step 3 gate passed, with a stop and report on failure. He subsequently said to resolve the initial blockers. Do not write secrets, invent figures, bypass hooks, use blanket git add, or work in another repository. Preserve plain British English and the dash rule.

## Release state

Round 2 is merged and live:

* PR: https://github.com/tompickup23/ukplaces/pull/26
* Merge commit and current remote main: `5b79c16850304033a14f9d816525325e40b562ce`.
* Verified PR head: `cb441748f0ec737837c93d9d874b965897514c3b`.
* The original 23 commits were preserved by a merge commit. No squash or rebase was used.
* Tom explicitly approved temporarily disabling only required linear history for this merge. The exception is finished. Every original branch-protection setting was restored immediately and verified, including linear history, administrator enforcement, conversation resolution, and the required validate and CodeQL checks. No continuing protection exception is authorised.

Pages workflow https://github.com/tompickup23/ukplaces/actions/runs/37387196060 completed with a successful build and successful deploy, but its final IndexNow job failed:

`HTTP 403: SiteVerificationNotCompleted`

The response said site verification was not completed and to wait before trying again. Codex stopped further release actions, did not retry the job, and did not close the remaining superseded PRs. This is the outstanding release blocker, not a failed Pages deployment. The job had passed its own live key-file check before reaching the IndexNow response.

## Repairs already landed

`b1a3262` added Git-backed constituency record dates, fixing 12 missing sitemap lastmod values without inventing MP snapshot dates. Each of the 650 records has a content hash, provenance revision and date in `src/data/registry/constituency-content-dates.json`. `npm run build:constituency-dates` regenerates that ledger after committed registry changes using full Git history. The constituency test checks hashes; sitemap and structured data use the later of the content date and MP snapshot.

Other repairs: explicit development analytics suppression even with a token; FSA provenance on Food Hygiene panels; display-only punctuation normalisation for party labels; a generated HTML landing check in both workflows; a GOV.UK service-link refresh using the 5 October export, publishing 299 Council Tax and 248 bin links; compatible transitive updates to devalue 5.9.4 and http-cache-semantics 4.3.0 to remove high-severity production audit findings.

The first CodeQL run flagged regex-based HTML text extraction in the new checker. `cb44174` replaced that code with parse5 tree traversal. The three alerts cleared on the final PR head. No alerts were suppressed.

## Verification

All pre-merge gates passed: npm ci; all eight project test scripts; lint with zero errors or warnings; ordinary build; metadata, sitemap, analytics, parity, contrast, text-size and landing checks. The production audit passed its high-severity threshold, with two moderate production advisories remaining through satori and fflate.

All 1,030 sitemap routes returned HTTP 200 with non-empty page content locally. All 1,031 generated HTML pages passed the dash checks. All 361 place pages remained indexable and carried linked FSA provenance. Browser checks on home, Burnley and privacy emitted no analytics requests in development with a test token provided. No source figures were changed.

Final GitHub checks passed on cb44174:

* Site checks: https://github.com/tompickup23/ukplaces/actions/runs/37386835484
* CodeQL analysis: https://github.com/tompickup23/ukplaces/actions/runs/37386835478
* The separate required CodeQL result also passed.

CI built all share cards. A local generated Belfast East card was visually checked; the slow duplicate local share-card run was then cancelled. Ordinary local build and checks were rerun after the parser fix. The current local dist is therefore an ordinary build, not the production share-card build.

Live checks at 00:15 BST on 6 October (23:15 UTC on 5 October) all returned 200 and showed the new elements:

* `/`
* `/places/burnley/`, including Food Hygiene link and FSA provenance, council services and school holidays
* `/places/reading/`
* `/constituencies/burnley/`
* `/privacy/`, correctly reporting no analytics
* `/og/places/burnley.png`, valid PNG, 1200 by 630
* `/sitemap.xml`, all 1,030 URLs dated

There are no parish or town-specific routes. Reading was checked as a town-named local-authority record, not misrepresented as a settlement or parish page.

## PR state and remaining work

All content PRs #15 to #23 are contained in the landing branch; the full tree-comparison table is in the landing report. GitHub automatically marked #15 merged when #26 landed. #16 to #23 remain open. No supersession comments were posted after the IndexNow failure. Once Tom resumes the stopped work and IndexNow is resolved, close the superseded PRs with a comment naming merge commit 5b79c16850304033a14f9d816525325e40b562ce. Add the same explanatory comment to #15 if useful, without trying to merge it again.

Dependabot #24 and #25 were initially conflicting after the main merge. They changed again while this chat was ending. At handover both are OPEN and report BLOCKED, not the earlier DIRTY state:

* #24 now targets @types/node 26.6.4; head `f5f30c7fd2fb4fe06a17be0387a40fb51f4bcd22`.
* #25 targets Astro 7.3.5; head `7f79b7ce534a2e20d90ccf6b435bf9afb19eb141`.

Re-read their current diffs and checks. Do not rely on their old green 1 October checks or the earlier conflict diagnosis. Tom's instruction was to merge them only with green CI after the main landing, otherwise leave them. Older Dependabot PRs #2, #3, #4, #6, #7 and #13 were compared but not authorised for merging in this task.

Possible next step after Tom resumes: inspect IndexNow's current verification state and rerun only the failed job if appropriate, retaining the original submitted URL plan. Do not rerun the entire deployment merely to retry submission, since planning against the already-updated live sitemap could produce no changed URLs. Do not hide the failure or weaken checks.

## Local checkout and files to preserve

The checkout remains on `feat/local-links` at cb44174, matching origin/feat/local-links. Remote main is the merge commit. Local main was not advanced. Do not reset or clean the checkout.

Uncommitted Codex documentation:

* `PROGRESS.md`: final merge, protection restoration, live checks, IndexNow stop and open decisions appended.
* `docs/ROUND-2-LANDING-2026-10-06.md`: same outcome appended after the committed preparation record.
* This new `docs/HANDOFF-CLAUDE-2026-10-06.md` file.

Two files predate this session and were deliberately untouched and excluded from commits:

* `data/school-holidays/calendar-819e824d3e4cbf3b904d5a9a5264721119e3c1a3b14d9e1fc45900b97a3b1704.json`: not selected by the manifest.
* `docs/DETAILED-SOURCE-INTEGRATION-PLAN.md`: proposed follow-on scope, not part of this landing.

Ignored evidence is in `work/round2-landing/`: live-checks.json, check-live.mjs and browser-evidence. The task's browser session and development server were stopped. No task build process remains running. Temporary command logs under /tmp are disposable; do not rely on them for the handover.

## Decisions for Tom

Whether UK Places should stay out of council-name searches, with UK Councils as the front door, remains open. No place noindex was introduced. The analytics token also remains open: CF_BEACON_TOKEN was absent and no token was created, copied or written. Current production is intentionally analytics-free.
