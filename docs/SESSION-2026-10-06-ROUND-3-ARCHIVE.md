# Session archive: UK Places Round 3 plan, 6 October 2026

Archive this session. Do not continue coding from it without Tom's D11 line.

## Outcome

- Round 2 is live on `main` (PR #26, merge `5b79c16`, 5 October 2026).
- This session wrote Round 3 as the new source of truth: `docs/ROUND-3-PLAN.md`.
- Draft PR: https://github.com/tompickup23/ukplaces/pull/27 on
  `cursor/round-3-plan-3014` (commit `d1784eb`). Docs only. Step 0 done.
- Codex and Opus plans are historical. Playbook positioning follows D11.

## Default decision waiting on Tom

D11: UK Places is the GSS geography spine and civic hub. UK Councils
(`https://ukcouncils.co.uk`) is the council-tax / "my council" front door for
England. Place pages stay indexable. No Band D on UK Places. No sixth source.
Reject D11 in one line if wrong; silence was treated as the default for the
written plan only, not as merge approval.

## Do not redo

- Do not re-audit Round 1 or Round 2 product code from scratch.
- Do not reopen stacked Round 2 PRs; they landed via #26.
- Do not invent a newer Claude brand brief. Full brand files live under
  `briefings/uk-network-brand/` on the clawd machine and were not readable
  from Drive in this environment. Memories used:
  `uk_network_brand_plan`, `estate_brand_system`.
- Do not mix the failing `npm run audit:prod` high `source-map-js` advisory
  into the plan PR. It is the lockfile on `main`, not the Round 3 docs diff.

## Next session, in order

1. Tom confirms or rejects D11.
2. Land #27 (rebase and merge). Fix or waive the audit gate separately.
3. Steps 1 to 3 in `docs/ROUND-3-PLAN.md`: UK Councils coverage link, reverse
   link in that repo, metadata guard against "council tax" in titles.
4. Step 5: paste Search Console "not indexed" counts before any new module
   (D15). Analytics token and `www` are optional.

## Out of scope until after measurement

Parish/town routes, county-council pages on UK Places, more LGSL services,
shared postcode-door extraction, mark redraw, DETAILED-SOURCE plan recovery.
