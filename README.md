# Can–Ozan

Yusuf Can Ozan’s creative developer portfolio. Built with Next.js 16 App Router, React, TypeScript, Tailwind CSS 4, GSAP/ScrollTrigger, Lenis, Framer Motion, and Lucide.

## Development

Use Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run typecheck
npm run build
```

`npm run build` creates a static production site in `out/`. `npm start` serves it locally on port 3000 (`PORT` can override this). `npm run format` formats the source.

## Content

- `src/data/projects.ts`: the five clearly labeled concept projects, descriptions, technology lists, image paths, GitHub URLs, and optional live demos. The sample GitHub buttons lead to Can–Ozan’s repositories. Replace them with specific repository URLs when adding real projects. Set `image` to a local `/projects/example.webp` path to use the responsive, lazy-loaded `next/image` component. Put the file in `public/projects/`. Omit the image to retain the CSS artwork.
- `src/data/profile.ts`: name, email, GitHub, LinkedIn, optional X URL, and site origin. X is hidden until its URL is provided.
- `src/components/sections/`: independent page sections.
- `src/app/globals.css`: palette, typography, hero, and project artwork.
- `src/app/sections.css`: work, toolkit, editorial sections, dialogs, and their responsive styles.
- `src/lib/animations.ts`: GSAP reveals, desktop hero transition, and Lenis synchronization.

The GitHub section accepts a typed `GithubProfile` prop with optional activity entries. An API data source can supply this later; the site does not invent contribution counts or fetch GitHub data on every page view.

## Interaction and accessibility

- Project previews and titles open native modal dialogs, with Escape dismissal, keyboard focus containment and return, and optional external demo links.
- Desktop uses Lenis driven by GSAP’s ticker; touch devices keep native scrolling. Native anchor/history behavior is retained through Lenis anchor support.
- Toolkit rows respond to pointer, keyboard focus, and taps.
- Motion honors `prefers-reduced-motion`, including changes while the page is open. The custom cursor is restricted to fine mouse pointers and is disabled for reduced motion.
- Core content is statically rendered and stays visible if animation scripts cannot load.

The five visual project mockups are decorative concept artwork, not functional versions of the described apps.

## Deployment

`.openai/hosting.json` identifies the private Sites deployment and the static output directory. The same `out/` directory can be hosted on any static hosting provider. To use Next.js server features later, remove `output: "export"` and choose a compatible server host. The current CSS visuals require no external images or image optimization service.

The GitHub mark is from GitHub’s MIT-licensed Primer Octicons. See `THIRD_PARTY_NOTICES.md`.
