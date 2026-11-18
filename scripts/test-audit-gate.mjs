import assert from "node:assert/strict";
import { advisories, evaluate } from "./audit-gate.mjs";

// Fixtures in the shape of `npm audit --json` (lockfile version 2 and later).
const picomatch = { source: 1, name: "picomatch", dependency: "picomatch", title: "picomatch ReDoS", url: "https://github.com/advisories/GHSA-fc5q-39xc-vjpf", severity: "high", range: "<=4.0.7" };
const report = (...extra) => ({
  vulnerabilities: {
    picomatch: { name: "picomatch", severity: "high", via: [picomatch] },
    // Severity inherited from a dependency only: not an advisory of its own.
    vite: { name: "vite", severity: "high", via: ["picomatch", "tinyglobby"] },
    fflate: { name: "fflate", severity: "moderate", via: [{ source: 2, name: "fflate", title: "fflate loop", url: "https://github.com/advisories/GHSA-px8p-9vwx-vf98", severity: "moderate", range: "<0.7.5" }] },
    ...Object.fromEntries(extra.map((via) => [via.name, { name: via.name, severity: via.severity, via: [via] }])),
  },
});
const exception = { advisory: "GHSA-fc5q-39xc-vjpf", package: "picomatch", expires: "2026-12-18", decided: "Tom Pickup, 18 November 2026", reason: "build time only" };

// Advisories are collected once each, ignoring inherited entries.
assert.deepEqual(advisories(report()).map((item) => item.id).sort(), ["GHSA-fc5q-39xc-vjpf", "GHSA-px8p-9vwx-vf98"]);

// Without an exception the high advisory blocks; the moderate one never does.
assert.equal(evaluate(report(), [], "2026-11-18").failures.length, 1);

// With an exception it passes through the expiry date, inclusive.
for (const today of ["2026-11-18", "2026-12-18"]) {
  const result = evaluate(report(), [exception], today);
  assert.deepEqual(result.failures, [], `passes on ${today}`);
  assert.equal(result.excepted.length, 1);
}

// The day after expiry it blocks again.
const expired = evaluate(report(), [exception], "2026-12-19");
assert.equal(expired.failures.length, 1);
assert.match(expired.failures[0], /expired on 2026-12-18/);

// Another high or critical advisory still blocks while the exception stands.
const other = { source: 3, name: "undici", title: "other", url: "https://github.com/advisories/GHSA-xjj6-f33q-929c", severity: "critical", range: "<8.12.3" };
assert.equal(evaluate(report(other), [exception], "2026-11-18").failures.length, 1);

// An exception names one package: the same advisory id in another package is not covered.
const elsewhere = { ...picomatch, name: "other-glob" };
assert.equal(evaluate(report(elsewhere), [exception], "2026-11-18").failures.length, 1);

// Once picomatch is patched the exception is reported as removable, not as a failure.
const patched = evaluate({ vulnerabilities: {} }, [exception], "2026-11-18");
assert.deepEqual(patched.failures, []);
assert.equal(patched.notes.length, 1);

// An exception without a reason, a decision or a valid date is refused.
assert.throws(() => evaluate(report(), [{ ...exception, reason: "" }], "2026-11-18"), /no reason/);
assert.throws(() => evaluate(report(), [{ ...exception, decided: undefined }], "2026-11-18"), /no decided/);
assert.throws(() => evaluate(report(), [{ ...exception, expires: "18 Dec 2026" }], "2026-11-18"), /YYYY-MM-DD/);

console.log("Audit gate tests passed: dated exceptions, expiry, other advisories, package scope, removal notes and field checks.");
