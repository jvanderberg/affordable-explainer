import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://affordability.yesoakpark.org"),
  title: "How Oak Park Makes Housing Affordable",
  description: "A visual explainer about housing supply, filtering and affordability in Oak Park, Illinois.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Today’s “luxury” housing is tomorrow’s affordable housing.",
    description: "Oak Park’s own history shows how housing becomes affordable and how decades of anti-development sentiment have broken the cycle.",
    url: "/",
    siteName: "Oak Park, Explained",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Today’s “luxury” housing is tomorrow’s affordable housing." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Today’s “luxury” housing is tomorrow’s affordable housing.",
    description: "Oak Park’s own history shows how housing becomes affordable and how decades of anti-development sentiment have broken the cycle.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
