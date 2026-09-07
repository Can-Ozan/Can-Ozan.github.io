# Can-Ozan Portfolio

A modern, interactive developer portfolio built to showcase my projects, technical interests, and GitHub activity through a strong editorial design system.

The goal of this project is not to be a traditional résumé-style portfolio. Instead, it combines **real project data**, **motion design**, **developer-focused interactions**, and a **minimal editorial visual language** to create a more personal and technical representation of my work.

---

## Overview

This portfolio belongs to **Yusuf Can Ozan (Can-Ozan)**, a web developer focused on building modern web applications, developer tools, security-related projects, and interactive digital experiences.

The website is designed around three main ideas:

- **Real work over placeholder content**
- **Interaction without sacrificing usability**
- **Strong visual identity with production-quality engineering**

Projects and selected statistics are connected to my real GitHub profile rather than being maintained as fake static portfolio data.

**GitHub:** [github.com/Can-Ozan](https://github.com/Can-Ozan)

---

## Key Features

### Real GitHub Integration

The portfolio uses GitHub data to present real repositories and project information.

Depending on the available repository data, the interface can display:

- Public repositories
- Repository descriptions
- Primary languages
- Stars
- Forks
- Topics
- Last updated dates
- Live project links
- GitHub profile statistics
- Recently active projects

The site is designed to fail gracefully if GitHub data is temporarily unavailable rather than displaying fabricated statistics.

### Selected Work

Featured projects are presented as large editorial compositions instead of standard card grids.

Each project can include:

- Project title
- Short description
- Technology information
- GitHub repository
- Live demo
- Repository statistics
- Project detail / case-study view

The layout is intentionally visual and asymmetric to give each project its own identity.

### Project Case Studies

Selected projects can be expanded into a focused project view containing information such as:

- The problem or motivation behind the project
- Technical approach
- Technology stack
- What I learned while building it
- Source code
- Live deployment

GitHub metrics remain API-driven, while project storytelling can be maintained separately as curated metadata.

### Interactive Hero

The hero section uses layered project posters and subtle depth interactions to immediately introduce the work.

Desktop interactions can include:

- Pointer-based movement
- Layered parallax
- Subtle perspective transforms
- Scroll-driven transitions

Touch devices receive a simplified version of the experience to preserve usability and performance.

### Motion & Microinteractions

The portfolio uses motion as part of the interface rather than as decoration.

Examples include:

- Scroll-based section reveals
- Project preview transitions
- Animated typography
- Magnetic CTA interactions
- Custom cursor states
- Hover previews
- Section transitions
- Navigation feedback

Motion is reduced or disabled when the user enables `prefers-reduced-motion`.

### Developer Command Palette

A developer-inspired command palette provides quick navigation and actions.

Typical actions include:

- Navigate to Work
- Navigate to About
- Navigate to GitHub
- Navigate to Contact
- Open GitHub
- Copy email
- Return to the top

Keyboard navigation and accessibility are considered part of the interaction design.

### Responsive Experience

The mobile version is not simply a scaled-down desktop layout.

Desktop-only interactions such as custom cursors, mouse parallax, and hover previews are reduced or removed on touch devices.

The responsive implementation focuses on:

- Readable typography
- Stable layouts
- Large touch targets
- Reduced animation complexity
- No accidental horizontal overflow
- Clear project navigation

---

## Tech Stack

### Core

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Motion & Interaction

- **GSAP**
- **ScrollTrigger**
- **Framer Motion**
- **Lenis**

### Data

- **GitHub REST API**

### Deployment

- **GitHub Actions**
- **GitHub Pages**

---

## Design Direction

The visual identity is based around a limited **red / near-black / cream** color system, oversized typography, strong spacing, and editorial layouts.

The site intentionally avoids common portfolio patterns such as:

- Skill percentage bars
- Generic Bootstrap-style project cards
- Excessive neon effects
- Large particle systems
- Fake experience statistics
- Decorative 3D elements with no purpose

Instead, the design focuses on:

- Typography
- Composition
- Project storytelling
- Real technical data
- Interaction consistency
- Subtle motion

---

## Project Architecture

The exact structure may evolve, but the project follows a modular Next.js architecture similar to:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   ├── sections/
│   ├── github/
│   └── ui/
│
├── data/
│   ├── projectCaseStudies.ts
│   └── siteConfig.ts
│
├── hooks/
│
└── lib/
    ├── github/
    │   ├── client.ts
    │   ├── helpers.ts
    │   └── types.ts
    │
    └── utils.ts
```

The project aims to keep data fetching, UI components, animations, and curated project content separated rather than placing the entire portfolio in one large component.

---

## Getting Started

### Requirements

Make sure you have:

- Node.js 20+ recommended
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Can-Ozan/Can-Ozan.github.io.git
```

Enter the project directory:

```bash
cd Can-Ozan.github.io
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Variables

The portfolio can access public GitHub data without authentication, but an optional GitHub token can be used during builds to improve API reliability and rate limits.

Create:

```text
.env.local
```

and add:

```env
GITHUB_TOKEN=your_github_token
```

> Never expose this token with a `NEXT_PUBLIC_` prefix.

The token must remain server/build-side only.

---

## Available Scripts

```bash
npm run dev
```

Runs the local development server.

```bash
npm run lint
```

Runs the configured lint checks.

```bash
npm run build
```

Creates a production build.

When configured for GitHub Pages static export, the production build generates the deployable output in:

```text
out/
```

---

## GitHub Pages Deployment

The portfolio is designed to be deployable as a GitHub user site.

Repository:

```text
Can-Ozan.github.io
```

Production URL:

```text
https://can-ozan.github.io/
```

Deployment is handled through **GitHub Actions**.

The deployment workflow can rebuild the website when:

- Code is pushed to `main`
- A workflow is triggered manually
- A scheduled refresh runs

Scheduled builds allow GitHub-powered portfolio data to stay reasonably up to date even when the portfolio source itself has not changed.

---

## Static Export Notes

GitHub Pages is static hosting, so the project should not depend on a continuously running Next.js server in production.

The production configuration therefore uses a static-export-compatible architecture.

Typical configuration:

```ts
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};
```

GitHub data can be fetched during the build process and embedded into the generated static site.

Sensitive tokens are never sent to browser JavaScript.

---

## Performance

The project is designed with performance in mind.

Main principles include:

- Prefer CSS transforms for visual movement
- Avoid unnecessary client components
- Avoid unnecessary React state during pointer movement
- Clean up GSAP / ScrollTrigger instances correctly
- Reduce animation complexity on mobile
- Avoid unnecessary WebGL
- Optimize images
- Limit high-frequency event work
- Avoid permanent `will-change` usage
- Reuse GitHub API data rather than making redundant requests

---

## Accessibility

Interactive design should remain usable regardless of input method.

The project includes or aims to maintain:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Reduced-motion support
- Accessible modal behavior
- `ESC` support for overlays
- Proper external-link semantics
- Touch-friendly controls
- Decorative image handling
- Reasonable color contrast

Animations should never be required to understand or navigate the content.

---

## Project Philosophy

This portfolio follows a simple principle:

> **Build. Break. Learn. Ship.**

Most of my projects begin with curiosity — finding a problem, experimenting with an idea, learning how the underlying technology works, and turning the result into something usable.

The portfolio is intended to evolve alongside those projects.

---

## Roadmap

Possible future improvements include:

- More complete project case studies
- Better project screenshots and visual previews
- Additional GitHub activity insights
- More detailed project metadata
- Improved Open Graph previews
- Continuous accessibility and performance audits

The goal is to improve the experience without turning the website into an over-animated showcase.

---

## Author

**Yusuf Can Ozan**  
Web Developer

GitHub: [@Can-Ozan](https://github.com/Can-Ozan)

---

## License

This repository contains the source code and visual design for my personal portfolio.

Unless a separate license is added, the source code should not be assumed to be licensed for unrestricted reuse.

If you would like to use a specific part of the project, please contact me first.
