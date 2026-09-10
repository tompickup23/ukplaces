import type { Metadata } from "next";

import { siteUrl } from "./data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "UK Places | Local data, clearly sourced", template: "%s | UK Places" },
  description: "UK Places brings together source-led local data, explains what each figure measures and links to the full specialist record.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title: "UK Places | Local data, clearly sourced",
    description: "Source-led local data, explained clearly. Start with Burnley’s election, crime, published payment and asylum support records.",
    url: siteUrl,
    siteName: "UK Places",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "UK Places — Local data, clearly sourced." }],
  },
  twitter: { card: "summary_large_image", title: "UK Places | Local data, clearly sourced", description: "Source-led local data, explained clearly.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
