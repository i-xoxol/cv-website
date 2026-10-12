import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Literata } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://igor.khokhlov.org"),
  title: "Dr. Igor Khokhlov | Cybersecurity, Sacred Heart University",
  description: "Assistant Professor of Cybersecurity at Sacred Heart University.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1520" },
  ],
};

// Applies a saved theme choice before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = headers().get("x-site-lang") === "uk" ? "uk" : "en";
  return (
    <html lang={lang} className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="site">{children}</body>
    </html>
  );
}
