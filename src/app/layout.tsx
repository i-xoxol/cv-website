import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono, Unbounded } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://igor.khokhlov.org"),
  title: "Dr. Igor Khokhlov | Cybersecurity, Sacred Heart University",
  description: "Assistant Professor of Cybersecurity at Sacred Heart University.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = headers().get("x-site-lang") === "uk" ? "uk" : "en";
  return (
    <html lang={lang} className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="site">{children}</body>
    </html>
  );
}
