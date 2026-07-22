import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/affordable-explainer" : "";

export const metadata: Metadata = {
  title: "How Oak Park Makes Housing Affordable",
  description: "A visual explainer about housing supply, filtering and affordability in Oak Park, Illinois.",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
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
