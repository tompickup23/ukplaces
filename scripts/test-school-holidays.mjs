import assert from 'node:assert/strict';
import {readFeed,selectCalendar,validateFeed,sha256,buildCardDates,readCardDates,calendarCardFor} from './calendar-contract.mjs';
import {formatBreakRange,formatLongDate,nextBreak,describeBreak} from './calendar-display.mjs';
const {feed,manifest,bytes}=readFeed('data/school-holidays');
const burnley=selectCalendar(feed,{gss:'E07000117',parentGss:'E10000017'});
assert.equal(burnley.authority.gss,'E10000017');
assert.equal(selectCalendar(feed,{gss:'N09000003',parentGss:null}),null);
assert.equal(selectCalendar(feed,{gss:'E09000010',parentGss:null}),null);
assert.equal(selectCalendar(feed,{gss:'E00000000',parentGss:null}),null);
assert.throws(()=>validateFeed(manifest,Buffer.from('changed')));
const mutated=structuredClone(feed);mutated.authorities.E10000017.publicationHolds.push({academic_year:feed.currentYear});
const raw=Buffer.from(JSON.stringify(mutated));
assert.throws(()=>validateFeed({...manifest,sha256:sha256(raw),bytes:raw.length},raw));
assert.ok(bytes.length>0);console.log('Calendar integrity, hold, advisory, unknown and parent-join tests passed');

assert.equal(feed.authorities.W06000016.url,'https://ukschoolholidaydates.co.uk/wales/rhondda-cynon-taf/');

// Card dates: lastmod moves only when what the card shows changes.
const dates=readCardDates('data/school-holidays',feed);
assert.deepEqual(buildCardDates(feed,dates,'2099-01-01'),dates,'an unchanged snapshot moves no card date');
const hidden=structuredClone(feed);hidden.snapshotDate='2099-01-01';hidden.authorities.E10000017.years[feed.currentYear].lastChecked='2099-01-01';hidden.authorities.E10000017.years[feed.currentYear].evidenceSha256=['0'.repeat(64)];
assert.deepEqual(buildCardDates(hidden,dates,'2099-01-01'),dates,'a snapshot date or an undisplayed field moves no card date');
const shown=structuredClone(feed);shown.authorities.E10000017.years[feed.currentYear].breaks[0].end='2026-10-31';
const moved=buildCardDates(shown,dates,'2099-01-01');
assert.equal(moved.E10000017.since,'2099-01-01','a changed break moves that card date');
assert.equal(Object.keys(moved).filter((gss)=>moved[gss].since!==dates[gss].since).length,1,'and no other');
assert.throws(()=>readCardDates('data/school-holidays',shown),/stale/,'a stale ledger fails the build');
assert.equal(calendarCardFor(feed,dates,{gss:'E07000117',parentGss:'E10000017'}).contentDate,dates.E10000017.since);

// British dates and the next break, picked from the date the page is read.
assert.equal(formatLongDate('2026-08-31'),'31 August 2026');
assert.equal(formatBreakRange({start:'2026-10-26',end:'2026-10-30'}),'26 to 30 October 2026');
assert.equal(formatBreakRange({start:'2027-03-26',end:'2027-04-09'}),'26 March to 9 April 2027');
assert.equal(formatBreakRange({start:'2026-12-21',end:'2027-01-01'}),'21 December 2026 to 1 January 2027');
const breaks=burnley.year.breaks;
assert.equal(nextBreak(breaks,'2026-09-28').label,'October half term');
assert.equal(describeBreak(nextBreak(breaks,'2026-09-28'),'2026-09-28'),'Next recorded break: October half term, 26 to 30 October 2026.');
assert.equal(describeBreak(nextBreak(breaks,'2026-10-30'),'2026-10-30'),'Current break: October half term, 26 to 30 October 2026.');
assert.equal(nextBreak(breaks,'2026-10-31').label,'Christmas holidays');
assert.equal(nextBreak(breaks,'2027-06-05'),null);
console.log('Card date, date format and next-break tests passed');
