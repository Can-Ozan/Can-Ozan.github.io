import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";
import "./github-portfolio.css";
import "./interactions.css";

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
  "Web developer portfolio of Yusuf Can Ozan featuring web applications, developer tools, security projects and software experiments.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: "Yusuf Can Ozan — Web Developer",
  description,
  referrer: "strict-origin-when-cross-origin",
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    title: "Yusuf Can Ozan — Web Developer",
    description,
    type: "website",
    locale: "en_US",
    url: profile.siteUrl,
    siteName: "Can–Ozan",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Can–Ozan — Web Developer. Build. Learn. Ship.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yusuf Can Ozan — Web Developer",
    description,
    images: ["/og-image.png"],
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
