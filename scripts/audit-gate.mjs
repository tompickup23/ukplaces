// The decision behind audit:prod, kept apart from npm so it can be tested on fixtures.
// A high or critical advisory blocks unless an exception names that advisory and that
// package and its expiry date (inclusive, UTC) has not passed.

const BLOCKING = new Set(["high", "critical"]);

export function advisoryId(via) {
  const match = /GHSA(?:-[23456789cfghjmpqrvwx]{4}){3}/i.exec(via.url ?? "");
  return match ? match[0] : String(via.source ?? via.title ?? "unknown");
}

// Every advisory in an `npm audit --json` report, once each. Package entries whose
// severity only comes from a dependency (string items in `via`) are not advisories.
export function advisories(report) {
  const found = new Map();
  for (const entry of Object.values(report?.vulnerabilities ?? {})) {
    for (const via of entry.via ?? []) {
      if (typeof via !== "object" || via === null) continue;
      const id = advisoryId(via);
      const key = `${id} ${via.name}`;
      if (!found.has(key)) found.set(key, { id, packageName: via.name, severity: via.severity, title: via.title ?? "", range: via.range ?? "" });
    }
  }
  return [...found.values()];
}

export function evaluate(report, exceptions, today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error(`today must be YYYY-MM-DD, got ${today}`);
  for (const exception of exceptions) {
    for (const field of ["advisory", "package", "expires", "decided", "reason"]) {
      if (!exception[field]) throw new Error(`audit exception ${exception.advisory ?? "(unnamed)"} has no ${field}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(exception.expires)) throw new Error(`audit exception ${exception.advisory} expiry must be YYYY-MM-DD`);
  }

  const failures = [];
  const excepted = [];
  const notes = [];
  const used = new Set();

  for (const advisory of advisories(report)) {
    if (!BLOCKING.has(advisory.severity)) continue;
    const exception = exceptions.find((item) => item.advisory.toLowerCase() === advisory.id.toLowerCase() && item.package === advisory.packageName);
    if (!exception) {
      failures.push(`${advisory.severity} ${advisory.id} in ${advisory.packageName} (${advisory.range}): ${advisory.title}`);
      continue;
    }
    used.add(exception);
    if (today > exception.expires) {
      failures.push(`${advisory.severity} ${advisory.id} in ${advisory.packageName}: its exception expired on ${exception.expires}`);
    } else {
      excepted.push(`${advisory.severity} ${advisory.id} in ${advisory.packageName}, excepted until ${exception.expires} (${exception.decided})`);
    }
  }

  for (const exception of exceptions) {
    if (!used.has(exception)) notes.push(`exception for ${exception.advisory} in ${exception.package} no longer matches any advisory and can be removed`);
  }

  return { failures, excepted, notes };
}
