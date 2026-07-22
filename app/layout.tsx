import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How Oak Park Makes Housing Affordable",
  description: "A visual explainer about housing supply, filtering and affordability in Oak Park, Illinois.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
