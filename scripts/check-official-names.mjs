import assert from "node:assert/strict";
import fs from "node:fs";
import { readOfficialNameInputs, validateOfficialNames } from "./official-names.mjs";

validateOfficialNames(readOfficialNameInputs());
for (const name of ["places", "official-names"]) {
  assert.equal(
    fs.readFileSync(new URL(`../public/data/registry/${name}.json`, import.meta.url), "utf8"),
    fs.readFileSync(new URL(`../src/data/registry/${name}.json`, import.meta.url), "utf8"),
    `published ${name} must match its source`,
  );
}
console.log("Official name sources verified for 361 places and 21 county councils.");
