import { join } from "node:path";
import { calendarCardFor, readCardDates, readFeed } from "../../scripts/calendar-contract.mjs";
import gssPredecessors from "../data/registry/gss-predecessors.json";
const directory = join(process.cwd(), "data/school-holidays");
const { feed } = readFeed(directory);
const dates = readCardDates(directory, feed);
export function calendarFor(place: { gss: string; parentGss: string | null }) {
 return calendarCardFor(feed, dates, place, gssPredecessors.predecessors);
}
