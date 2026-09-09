import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ukplaces.tom-pickup-2333.chatgpt.site"),
  title: "Burnley local data: elections, crime, spending and asylum | UK Places",
  description:
    "Current Burnley snapshots on council election results, crime, published spending and asylum support, with direct routes to the source analysis.",
  openGraph: {
    title: "Burnley local data: elections, crime, spending and asylum | UK Places",
    description:
      "Current Burnley snapshots on council election results, crime, published spending and asylum support, with direct routes to the source analysis.",
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
    title: "Burnley local data: elections, crime, spending and asylum | UK Places",
    description:
      "Current Burnley snapshots on council election results, crime, published spending and asylum support, with direct routes to the source analysis.",
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
