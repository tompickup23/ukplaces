export const SITE_NAME = "UK Places";
export const SITE_URL = "https://ukplaces.co.uk";
export const DEFAULT_DESCRIPTION =
  "UK Places brings together source-led local data, explains what each figure measures and links to the full specialist record.";
export const DEFAULT_SOCIAL_IMAGE_PATH = "/og.png";

export function normalisePageTitle(title: string): string {
  return title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
}
