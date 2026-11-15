import { createHash } from "node:crypto";

export const EXPORT_URL = "https://local-links-manager.publishing.service.gov.uk/data/links_to_services_provided_by_local_authorities.csv";
export const EXPORT_COLUMNS = ["Authority Name", "GSS", "Description", "LGSL", "LGIL", "URL", "Title", "Supported by GOV.UK"];
const USER_AGENT = "UKPlacesLinkCheck/1.0 (+https://ukplaces.co.uk/methodology/)";

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { cell += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else cell += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") { row.push(cell); cell = ""; }
    else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += character;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((cells) => cells.length > 1);
}

export async function fetchLocalLinksExport() {
  const response = await fetch(EXPORT_URL, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`Local Links Manager export returned HTTP ${response.status}`);
  const lastModified = response.headers.get("last-modified");
  if (!lastModified || !Number.isFinite(Date.parse(lastModified))) throw new Error("Export has no valid last-modified header");
  const bytes = Buffer.from(await response.arrayBuffer());
  const [header, ...rows] = parseCsv(bytes.toString("utf8"));
  if (header?.join() !== EXPORT_COLUMNS.join()) throw new Error(`Unexpected export columns: ${header?.join()}`);
  if (!rows.length || rows.some((row) => row.length !== EXPORT_COLUMNS.length)) throw new Error("Invalid export rows");
  return {
    source: {
      name: "GOV.UK Local Links Manager",
      url: EXPORT_URL,
      lastModified,
      retrievedOn: new Date().toISOString().slice(0, 10),
      sha256: createHash("sha256").update(bytes).digest("hex"),
      licence: "Open Government Licence v3.0",
      columns: EXPORT_COLUMNS,
      rowNumbering: "CSV record number, with the header as row 1",
      totalRows: rows.length,
    },
    rows,
  };
}
