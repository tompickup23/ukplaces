// Cloudflare Web Analytics. The beacon token is public (it ships in every page),
// minted per site in the Cloudflare dashboard and supplied at build time through
// the CF_BEACON_TOKEN repository variable. With no token the site builds with no
// beacon at all, and scripts/check-analytics.mjs checks both states.
export const beaconToken: string | null = import.meta.env.PROD ? import.meta.env.PUBLIC_CF_BEACON_TOKEN?.trim() || null : null;
