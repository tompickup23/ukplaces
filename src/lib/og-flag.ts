// True only when the build asked for share cards (BUILD_OG=1). Kept apart from
// og.ts so pages can read it without loading Satori on an ordinary build.
export const buildOg = process.env.BUILD_OG === "1";

export const placeOgPath = (slug: string) => `/og/places/${slug}.png`;
export const constituencyOgPath = (slug: string) => `/og/constituencies/${slug}.png`;
