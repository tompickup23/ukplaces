import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you requested is not available.</p>
      <a href="/">Return to UK Places</a>
    </main>
  );
}
