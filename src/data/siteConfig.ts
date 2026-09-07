import { profile } from "./profile";

export const siteConfig = {
  availabilityStatus: "OPEN TO GOOD CONVERSATIONS",
  location: "Türkiye",
  timezone: "Europe/Istanbul",
  email: profile.email,
  socials: { github: profile.github, linkedin: profile.linkedin, x: profile.x },
  // Set only when this portfolio's source repository is published.
  sourceUrl: null as string | null,
};

export const chapters = [
  { id: "top", number: "01", label: "Intro" },
  { id: "work", number: "02", label: "Work" },
  { id: "tools", number: "03", label: "Tools" },
  { id: "about", number: "04", label: "About" },
  { id: "github", number: "05", label: "GitHub" },
  { id: "contact", number: "06", label: "Contact" },
] as const;
