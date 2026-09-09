import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ukplaces.tom-pickup-2333.chatgpt.site"),
  title: "UK Places | The context around every place",
  description:
    "A considered starting point for independent UK data projects, organised around the places they illuminate.",
  openGraph: {
    title: "UK Places | The context around every place",
    description:
      "Independent UK data projects, brought together around the places they illuminate.",
    url: "https://ukplaces.tom-pickup-2333.chatgpt.site",
    siteName: "UK Places",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "UK Places: The context around every place.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Places | The context around every place",
    description:
      "Independent UK data projects, brought together around the places they illuminate.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
