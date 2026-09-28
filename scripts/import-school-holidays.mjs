import fs from 'node:fs';
import path from 'node:path';
import {readFeed,buildCardDates,CARD_DATES_FILE} from './calendar-contract.mjs';
// node scripts/import-school-holidays.mjs <export directory> [--date YYYY-MM-DD]
// A card whose content changes is dated with the snapshot date, or with --date when
// the change comes from UK Places code rather than a new snapshot (pass the day it
// ships). Card dates never move backwards.
const [source,flag,flagDate]=process.argv.slice(2);
if(!source)throw Error('Pass the directory containing the verified manifest and snapshot');
if(flag!==undefined&&(flag!=='--date'||!/^\d{4}-\d{2}-\d{2}$/.test(flagDate??'')))throw Error('The only option is --date YYYY-MM-DD');
const {manifest,bytes,feed}=readFeed(source);
const date=flagDate??manifest.snapshotDate;
const dest=path.join(process.cwd(),'data/school-holidays');fs.mkdirSync(dest,{recursive:true});
const datesPath=path.join(dest,CARD_DATES_FILE);
const previous=fs.existsSync(datesPath)?JSON.parse(fs.readFileSync(datesPath,'utf8')):{};
const latestSince=Object.values(previous).map((entry)=>entry.since).sort().at(-1);
if(latestSince&&date<latestSince)throw Error(`Refusing to date changed cards ${date}, before the latest card date ${latestSince}; pass --date`);
const dates=buildCardDates(feed,previous,date);
fs.writeFileSync(path.join(dest,manifest.file),bytes);
fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(datesPath,JSON.stringify(dates,null,2)+'\n');
const moved=Object.entries(dates).filter(([gss,entry])=>previous[gss]?.since!==entry.since).length;
console.log(`Imported verified calendar snapshot ${manifest.sha256}; ${moved} of ${Object.keys(dates).length} card dates moved to ${date}`);
