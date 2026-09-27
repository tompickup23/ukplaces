import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

/**
 * The 1200x630 share card for a place or constituency record.
 *
 * Satori needs static-weight TTFs: the variable woff2 files fail on their fvar
 * tables inside Satori's font parser. The three faces in data/fonts are the
 * static instances Google Fonts serves for Source Serif 4 600 and Source Sans 3
 * 400 and 600, the same faces the site self-hosts (SIL Open Font Licence).
 *
 * Rendering a thousand cards costs real time, so every OG route gates its
 * getStaticPaths on BUILD_OG=1 and returns nothing otherwise. Iteration builds
 * skip the pass; the deploy and site-check workflows set the variable.
 */

const FONT_DIR = join(process.cwd(), "data", "fonts");
const MARK_PATH = join(process.cwd(), "public", "uk-places-mark.svg");

// The site's own ground tokens (src/styles/global.css). UK Places has no accent
// of its own (D4); source accents appear only as the bar beside each source line.
const GROUND = "#0f1317";
const GROUND_2 = "#171c21";
const INK = "#f4f6f7";
const MUTED = "#98a3ac";
const RULE = "#3d464e";

type Font = { name: string; data: Buffer; weight: 400 | 600; style: "normal" };
let fontCache: Font[] | null = null;
let markCache: string | null = null;

function fonts(): Font[] {
  fontCache ??= [
    { name: "Source Serif 4", data: readFileSync(join(FONT_DIR, "SourceSerif4-SemiBold.ttf")), weight: 600, style: "normal" },
    { name: "Source Sans 3", data: readFileSync(join(FONT_DIR, "SourceSans3-Regular.ttf")), weight: 400, style: "normal" },
    { name: "Source Sans 3", data: readFileSync(join(FONT_DIR, "SourceSans3-SemiBold.ttf")), weight: 600, style: "normal" },
  ];
  return fontCache;
}

function mark(): string {
  markCache ??= `data:image/svg+xml;base64,${readFileSync(MARK_PATH).toString("base64")}`;
  return markCache;
}

export type OgLine = { label: string; value: string; accent?: string };

export interface OgCard {
  /** The record name. */
  heading: string;
  /** Type and region, above the heading. */
  eyebrow: string;
  /** One line each: at most one per source, label then value. */
  lines: OgLine[];
  /** Page path, printed beside the site mark so the dates travel with the figures. */
  path: string;
}

/** Satori takes a React-element-shaped object; building it by hand avoids JSX in a .ts file. */
function h(type: string, props: Record<string, unknown>, ...children: unknown[]) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
}

function layout(card: OgCard) {
  const lines = card.lines.slice(0, 5);
  const lineSize = lines.length > 3 ? 26 : 30;

  return h(
    "div",
    {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px 48px",
        backgroundImage: `linear-gradient(135deg, ${GROUND} 0%, ${GROUND_2} 100%)`,
        fontFamily: "Source Sans 3",
        color: INK,
      },
    },
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "10px" } },
      h("div", { style: { display: "flex", fontSize: "22px", fontWeight: 600, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase" } }, card.eyebrow),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Source Serif 4",
            fontSize: card.heading.length > 30 ? "58px" : "72px",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: "1070px",
          },
        },
        card.heading,
      ),
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: lines.length > 3 ? "10px" : "14px" } },
      ...lines.map((line) =>
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "18px", fontSize: `${lineSize}px` } },
          h("div", { style: { display: "flex", width: "6px", height: `${lineSize + 6}px`, background: line.accent ?? RULE, borderRadius: "3px" } }),
          h("div", { style: { color: MUTED, display: "flex" } }, line.label),
          h("div", { style: { fontWeight: 600, display: "flex" } }, line.value),
        ),
      ),
    ),
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "16px", borderTop: `1px solid ${RULE}`, paddingTop: "22px" } },
      h("img", { src: mark(), width: 44, height: 44 }),
      h("div", { style: { display: "flex", fontFamily: "Source Serif 4", fontSize: "26px", fontWeight: 600 } }, "UK Places"),
      h("div", { style: { fontSize: "20px", color: MUTED, display: "flex" } }, `Sources and dates on the record: ukplaces.co.uk${card.path}`),
    ),
  );
}

export async function renderOgCard(card: OgCard): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await satori(layout(card) as never, { width: 1200, height: 630, fonts: fonts() });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  // Astro rejects a Buffer in a getStaticPaths-served Response body; copy into a
  // fresh Uint8Array backed by a plain ArrayBuffer.
  const out = new Uint8Array(new ArrayBuffer(png.byteLength));
  out.set(png);
  return out;
}
