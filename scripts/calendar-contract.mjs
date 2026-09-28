import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { cardContent } from './calendar-display.mjs';
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export function validateFeed(manifest, bytes) {
 if(manifest.schemaVersion !== 1 || sha256(bytes) !== manifest.sha256 || bytes.length !== manifest.bytes) throw Error('Calendar snapshot integrity failed');
 const feed = JSON.parse(bytes);
 if(feed.schemaVersion !== 1 || !feed.currentYear || !feed.inputSha256 || !feed.authorities) throw Error('Unsupported calendar contract');
 for(const [gss,row] of Object.entries(feed.authorities)) {
  if(gss !== row.gss || !/^[ENSW][0-9]{8}$/.test(gss)) throw Error('Invalid authority identity');
  if(new URL(row.url).origin !== 'https://ukschoolholidaydates.co.uk') throw Error('Unapproved calendar destination');
  for(const [ay,y] of Object.entries(row.years)) {
   if(row.scope !== 'authority' || !['current','future_only'].includes(row.status)) throw Error('Unpublished calendar');
   if(row.publicationHolds.some(h => h.academic_year === ay)) throw Error('Held calendar');
   if(ay !== y.academicYear || !y.evidenceSha256.length || y.evidenceSha256.some(h=>!/^[a-f0-9]{64}$/.test(h))) throw Error('Missing calendar evidence');
   if(!/^https?:$/.test(new URL(y.sourceUrl).protocol)) throw Error('Invalid source URL');
   for(const e of y.breaks) if(!/^\d{4}-\d{2}-\d{2}$/.test(e.start) || !/^\d{4}-\d{2}-\d{2}$/.test(e.end) || e.start>e.end) throw Error('Invalid break range');
  }
 }
 return feed;
}
export function readFeed(directory) {
 const manifest=JSON.parse(fs.readFileSync(path.join(directory,'manifest.json'),'utf8'));
 if(manifest.file !== `calendar-${manifest.sha256}.json`) throw Error('Invalid snapshot filename');
 const bytes=fs.readFileSync(path.join(directory,manifest.file));
 return {manifest,bytes,feed:validateFeed(manifest,bytes)};
}
export function selectCalendar(feed, place) {
 // A district uses its explicit education parent, never a name or proximity join.
 const row=feed.authorities[place.parentGss || place.gss];
 if(!row || row.scope !== 'authority') return null;
 const year=row.years[feed.currentYear];
 if(!year) return null;
 return {authority:row,year,snapshotDate:feed.snapshotDate};
}

// The date each education authority's card last changed on UK Places, keyed by the
// authority GSS code and pinned to a hash of cardContent(). A new snapshot moves the
// date only for authorities whose card would read differently; the rest keep theirs.
export const CARD_DATES_FILE = 'card-dates.json';
export const cardSha256 = (content) => sha256(JSON.stringify(content));
export function selectableAuthorities(feed) {
 return Object.values(feed.authorities)
  .map((authority) => selectCalendar(feed, { gss: authority.gss, parentGss: null }))
  .filter(Boolean);
}
export function buildCardDates(feed, previous, date) {
 const next = {};
 for (const selection of selectableAuthorities(feed).sort((a, b) => a.authority.gss.localeCompare(b.authority.gss))) {
  const hash = cardSha256(cardContent(selection));
  const kept = previous[selection.authority.gss];
  next[selection.authority.gss] = { sha256: hash, since: kept?.sha256 === hash ? kept.since : date };
 }
 return next;
}
export function readCardDates(directory, feed) {
 const dates = JSON.parse(fs.readFileSync(path.join(directory, CARD_DATES_FILE), 'utf8'));
 const selectable = selectableAuthorities(feed);
 if (Object.keys(dates).length !== selectable.length) throw Error('Card date ledger does not match the snapshot; rerun the importer');
 for (const selection of selectable) {
  const entry = dates[selection.authority.gss];
  if (!entry || entry.sha256 !== cardSha256(cardContent(selection)) || !/^\d{4}-\d{2}-\d{2}$/.test(entry.since)) throw Error(`Card date ledger is stale for ${selection.authority.gss}; rerun the importer`);
 }
 return dates;
}
// The card for a place and the date its content last changed, or null.
export function calendarCardFor(feed, dates, place) {
 const selection = selectCalendar(feed, place);
 if (!selection) return null;
 return { content: cardContent(selection), contentDate: dates[selection.authority.gss].since };
}
