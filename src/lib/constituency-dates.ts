import dates from "../data/registry/constituency-content-dates.json";

// Page metadata uses the last recorded content change as well as the MP snapshot.
// The MP's displayed source date remains unchanged.
export function constituencyLastModified(record: { slug: string; mp: { snapshotDate: string | null } | null }): string {
  const content = (dates as Record<string, { date: string }>)[record.slug];
  if (!content) throw new Error(`Missing constituency content date: ${record.slug}`);
  return [content.date, record.mp?.snapshotDate].filter((date): date is string => Boolean(date)).sort().at(-1)!;
}
