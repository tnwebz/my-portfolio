import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import ClientShell from "@/components/ui/client-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nithish.dev"),
  title: "Nithish — S S | Senior Developer & Architect",
  description:
    "Portfolio of Nithish S S — Senior Developer, Architect, and UI/UX Developer crafting premium digital experiences with cutting-edge technology.",
  keywords: [
    "Nithish",
    "Senior Developer",
    "Architect",
    "UI/UX Developer",
    "Portfolio",
    "React",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Nithish S S" }],
  openGraph: {
    title: "Nithish — S S | Senior Developer & Architect",
    description:
      "Portfolio of Nithish S S — Senior Developer, Architect, and UI/UX Developer crafting premium digital experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nithish — S S",
    description: "Senior Developer · Architect · UI/UX Developer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@700&display=swap"
          rel="stylesheet"
        />

        {/* Clash Display — Hero display font */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://db.onlinewebfonts.com" />
        
        {/* Helvetica Neue ME — Hero marquee font */}
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME"
        />
      </head>
      <body className="bg-bg-primary text-text-primary font-geist antialiased noise-overlay">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
