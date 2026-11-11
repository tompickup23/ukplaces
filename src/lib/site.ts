export const SITE_NAME = "UK Places";
export const SITE_URL = "https://ukplaces.co.uk";
export const DEFAULT_DESCRIPTION =
  "Find any UK local authority by postcode or name: its GSS code, ceremonial county, region, council and Westminster constituencies, on one sourced record.";
export const HOME_TITLE = "Find your local authority: GSS code, county and region";
export const PUBLISHER_NAME = "Tom Pickup";
export const PUBLISHER_URL = "https://tompickup.co.uk";
// No public mailbox is confirmed for this site yet. Set the address here once it
// is; the contact and corrections pages change their wording to match.
export const CONTACT_EMAIL: string | null = null;
export const DEFAULT_SOCIAL_IMAGE_PATH = "/og.png";

export function normalisePageTitle(title: string): string {
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
}
