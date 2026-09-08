export type ProjectFilter = "web" | "tools" | "security" | "experiments";
export interface ProjectCaseStudy {
  category: ProjectFilter;
  type: string;
  problem?: string;
  approach?: string;
  stack?: string[];
  learned?: string;
  evidence?: string;
  verifiedHomepage?: string;
}

// Curated from the linked implementation, not generated from repository descriptions.
// Personal reflections are deliberately optional: only add the author's own account.
export const projectCaseStudies: Record<string, ProjectCaseStudy> = {
  "can-ozan/can-ozan.github.io": {
    category: "web",
    type: "Personal developer portfolio",
    problem:
      "Bring real projects, technical interests and work in progress into one personal space.",
    approach:
      "Fetch public GitHub data at build time, combine it with curated project notes, and export a static Next.js site with accessible motion and keyboard navigation.",
    stack: ["Next.js", "React", "TypeScript", "GSAP", "Framer Motion", "Lenis"],
    evidence:
      "https://github.com/Can-Ozan/Can-Ozan.github.io/blob/main/src/app/page.tsx",
  },
  "can-ozan/devportfolio": {
    category: "web",
    type: "Portfolio generator",
    problem: "Turn a GitHub profile into a browsable developer portfolio.",
    approach:
      "Fetch profile and repository data, render a themed portfolio with search and filters, and optionally enrich descriptions with Gemini.",
    stack: ["React", "JavaScript", "Vite", "Tailwind CSS", "GitHub API"],
    evidence: "https://github.com/Can-Ozan/Devportfolio/blob/main/src/App.jsx",
    verifiedHomepage: "https://can-ozan.github.io/Devportfolio/",
  },
  "can-ozan/password-strength-checker": {
    category: "security",
    type: "Browser utility",
    problem: "Make password weaknesses visible while typing.",
    approach:
      "Evaluate length, character variety and common patterns locally, then translate the results into a strength meter and suggestions.",
    stack: ["TypeScript", "Vite", "HTML", "CSS"],
    evidence:
      "https://github.com/Can-Ozan/Password-Strength-Checker/blob/main/src/PasswordChecker.ts",
    verifiedHomepage: "https://can-ozan.github.io/Password-Strength-Checker/",
  },
  "can-ozan/api-security-scanner": {
    category: "security",
    type: "Command-line tool",
    problem: "Surface common API configuration problems in a repeatable audit.",
    approach:
      "Run modular checks for headers, CORS, TLS, methods, cookies and endpoints. Collect findings with timeout and cancellation support, then export HTML or JSON reports.",
    stack: ["Go", "Cobra", "YAML", "net/http"],
    evidence:
      "https://github.com/Can-Ozan/api-security-scanner/blob/main/internal/scanner/engine.go",
  },
  "can-ozan/youtube-downloader-pro-v6.0": {
    category: "tools",
    type: "Desktop utility",
    problem:
      "Manage video downloads and format choices through a desktop interface.",
    approach:
      "Connect a Tkinter queue to background workers and yt-dlp, with progress, cancellation, quality settings and FFmpeg integration.",
    stack: ["Python", "Tkinter", "yt-dlp", "FFmpeg"],
    evidence:
      "https://github.com/Can-Ozan/Youtube-Downloader-Pro-v6.0/blob/main/youtube_indirici.py",
  },
  "can-ozan/weather-dashboard-js": {
    category: "web",
    type: "Weather dashboard",
    problem: "Bring current conditions and forecasts into one searchable view.",
    approach:
      "Fetch OpenWeatherMap data by city, render current conditions and forecasts, and adjust the visual theme to the weather.",
    stack: ["JavaScript", "HTML", "CSS", "OpenWeatherMap"],
    evidence:
      "https://github.com/Can-Ozan/Weather-Dashboard-JS/blob/main/script.js",
  },
  "can-ozan/clock-calender-widget": {
    category: "tools",
    type: "Time & calendar widget",
    problem:
      "Combine live time, date information and calendar navigation in a compact interface.",
    approach:
      "Separate clock, calendar and date utilities into TypeScript modules. Update once per second and persist the theme preference.",
    stack: ["TypeScript", "Vite", "HTML", "CSS"],
    evidence: "https://github.com/Can-Ozan/Clock-Calender-Widget/tree/main/src",
  },
  "can-ozan/30-days-of-javascript": {
    category: "experiments",
    type: "JavaScript learning collection",
    problem: "Practice JavaScript through a sequence of small applications.",
    approach:
      "Organize daily code and notes around calculators, forms, games and data tools.",
    stack: ["JavaScript", "HTML", "CSS"],
    evidence: "https://github.com/Can-Ozan/30-days-of-Javascript",
  },
};

export function getCaseStudy(fullName: string) {
  return Object.hasOwn(projectCaseStudies, fullName.toLowerCase())
    ? projectCaseStudies[fullName.toLowerCase()]
    : undefined;
}
