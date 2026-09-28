import assert from 'node:assert/strict';
import {readFeed,selectCalendar,validateFeed,sha256,buildCardDates,readCardDates,calendarCardFor,selectableAuthorities} from './calendar-contract.mjs';
import {formatBreakRange,formatLongDate,nextBreak,describeBreak,describeNoBreak,londonToday} from './calendar-display.mjs';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
assert.equal(describeNoBreak('2026/27'),'No further break is listed here for 2026/27. The full calendar below has the latest published dates.');
assert.equal(londonToday(new Date('2026-06-30T23:30:00Z')),'2026-07-01','today is the UK date in summer time');
assert.equal(londonToday(new Date('2026-12-31T23:30:00Z')),'2026-12-31','and in winter');

// Every calendar the snapshot can show reaches a place, except the two the publisher
// still keys under pre-2024 codes (Barnsley E08000016, Sheffield E08000019; UK Places
// uses E08000038 and E08000039). Fix those in the export, then empty this list.
const registry=Object.values(JSON.parse(fs.readFileSync('src/data/registry/places.json','utf8')));
const reached=new Set(registry.map((place)=>selectCalendar(feed,place)?.authority.gss).filter(Boolean));
assert.deepEqual(selectableAuthorities(feed).map((selection)=>selection.authority.gss).filter((gss)=>!reached.has(gss)).sort(),['E08000016','E08000019'],'no other calendar misses its place');

// The importer never moves a card date backwards.
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ukplaces-calendar-'));
fs.mkdirSync(path.join(temp,'data/school-holidays'),{recursive:true});
const stale=structuredClone(dates);stale.E10000017={...stale.E10000017,sha256:'0'.repeat(64),since:'2099-01-01'};
fs.writeFileSync(path.join(temp,'data/school-holidays/card-dates.json'),JSON.stringify(stale));
const importer=path.resolve('scripts/import-school-holidays.mjs'),exportDir=path.resolve('data/school-holidays');
assert.throws(()=>execFileSync('node',[importer,exportDir],{cwd:temp,stdio:'pipe'}),'a snapshot dated before the latest card date is refused');
execFileSync('node',[importer,exportDir,'--date','2099-02-01'],{cwd:temp,stdio:'pipe'});
const imported=JSON.parse(fs.readFileSync(path.join(temp,'data/school-holidays/card-dates.json'),'utf8'));
assert.equal(imported.E10000017.since,'2099-02-01','a changed card takes the --date');
assert.equal(imported.E06000001.since,dates.E06000001.since,'an unchanged card keeps its date');
fs.rmSync(temp,{recursive:true,force:true});
console.log('Card date, date format, next-break, coverage and importer tests passed');
