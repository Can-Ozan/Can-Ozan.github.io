export type ProjectVisual =
  "converter" | "readme" | "automation" | "fullstack" | "experimental";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  overview: string;
  technologies: string[];
  image: string | null;
  visual: ProjectVisual;
  github: string;
  demo: string | null;
  featured: boolean;
  status: "Concept project" | "Released";
}

// Replace these concept projects with your own work. A supplied image replaces the CSS preview.
export const projects: Project[] = [
  {
    id: "fileshift",
    title: "FileShift",
    category: "File converter platform",
    description: "Different formats. One smooth workflow.",
    overview:
      "A concept for a focused file conversion platform. An approachable upload flow, clear conversion states, and thoughtful batch actions turn a routine task into a smooth experience.",
    technologies: ["Next.js", "TypeScript", "Node.js"],
    image: null,
    visual: "converter",
    github: "https://github.com/Can-Ozan?tab=repositories",
    demo: null,
    featured: true,
    status: "Concept project",
  },
  {
    id: "readme-studio",
    title: "README.studio",
    category: "README generator",
    description: "Good code deserves a great introduction.",
    overview:
      "A concept for a README editor that makes project documentation feel less like a chore. Compose sections, preview Markdown, and give every repository a considered first impression.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    image: null,
    visual: "readme",
    github: "https://github.com/Can-Ozan?tab=repositories",
    demo: null,
    featured: true,
    status: "Concept project",
  },
  {
    id: "autopilot",
    title: "Autopilot",
    category: "Developer automation tool",
    description: "Less repetition. More room to build.",
    overview:
      "A concept for a developer workflow companion. Chain everyday tasks, see what is running, and keep the feedback clear, from the first command to the final build.",
    technologies: ["Node.js", "TypeScript", "Docker"],
    image: null,
    visual: "automation",
    github: "https://github.com/Can-Ozan?tab=repositories",
    demo: null,
    featured: true,
    status: "Concept project",
  },
  {
    id: "common-ground",
    title: "Common Ground",
    category: "Full-stack web application",
    description: "A little structure for your next big idea.",
    overview:
      "A concept for a collaborative workspace that brings projects, ideas, and progress together. A calm interface explores how a full-stack product can make complex information feel simple.",
    technologies: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    image: null,
    visual: "fullstack",
    github: "https://github.com/Can-Ozan?tab=repositories",
    demo: null,
    featured: false,
    status: "Concept project",
  },
  {
    id: "sandbox",
    title: "Sandbox",
    category: "Experimental developer tool",
    description: "An open space for the what-ifs.",
    overview:
      "An experimental tool concept for exploring the space between code and visual expression. A place for small interactions, unexpected combinations, and ideas that are still taking shape.",
    technologies: ["React", "JavaScript", "GSAP"],
    image: null,
    visual: "experimental",
    github: "https://github.com/Can-Ozan?tab=repositories",
    demo: null,
    featured: false,
    status: "Concept project",
  },
];
