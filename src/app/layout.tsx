import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});
const description =
  "Portfolio of Yusuf Can Ozan, a web developer focused on modern, high-performance and interactive web experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: "Yusuf Can Ozan — Web Developer",
  description,
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    title: "Yusuf Can Ozan — Web Developer",
    description,
    type: "website",
    locale: "en_US",
    url: profile.siteUrl,
    siteName: "Can–Ozan",
  },
  twitter: {
    card: "summary",
    title: "Yusuf Can Ozan — Web Developer",
    description,
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#f04b32" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#work">
          Skip to selected work
        </a>
        {children}
      </body>
    </html>
  );
}
