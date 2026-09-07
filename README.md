# Can–Ozan

Yusuf Can Ozan's Next.js portfolio, exported for **https://can-ozan.github.io/**. The existing typography, red/dark/cream palette, responsive sections, GSAP/Lenis scrolling and Framer Motion project previews are preserved.

## Local development

Use **Node.js 22**, also recorded in `.nvmrc`.

```sh
npm ci
npm run dev
```

To check the production site:

```sh
npm run lint
npm run build
npm run verify:export
npm start
```

The build generates `out/`. `npm start` serves these static files at http://127.0.0.1:3000; this local preview server is not deployed. GitHub Pages only receives the exported files. `npm run typecheck` is also available.

## Real GitHub data

`src/lib/github/client.ts` fetches the profile, repositories and language byte totals during each build. React `cache()` deduplicates calls during the render. There is no persistent fetch cache or runtime refresh. Actions uses a fresh checkout and caches only npm downloads. Data refreshes on main pushes, manual runs and daily builds.

Optional `GITHUB_TOKEN` can go in ignored `.env.local` locally. Actions supplies its built-in token only to the build step. The `server-only` boundary keeps requests and credentials out of browser JavaScript. Public data does not require a personal token. Never prefix this variable with `NEXT_PUBLIC_`.

Requests validate response shapes, paginate repositories, time out after 10 seconds and limit concurrent language calls to four. Failures emit sanitized warnings and unavailable content, without invented values or fallback repositories. Incomplete language requests do not produce percentages.

`src/lib/github/helpers.ts` selects up to four featured nonempty original repositories, excluding forks, archived repos and the profile README. Learning exercises are deprioritized. The editorial list includes all active original public repositories. Profile statistics come from GitHub; total stars sums returned public repositories, language percentages use actual bytes, and “Currently building” uses the newest `pushed_at`. Tiny positive language shares display as `<0.1%`.

Project covers are decorative CSS interface studies. Descriptions, dates, topics, source links and valid homepage links come from GitHub. Native dialogs support focus containment, Escape and close/background dismissal. Touch and reduced-motion behavior remain supported.

## Deployment and SEO

Follow [DEPLOYMENT.md](DEPLOYMENT.md) to create `Can-Ozan.github.io` and choose GitHub Actions in Pages settings. `.github/workflows/deploy.yml` installs with `npm ci`, lints, builds, validates `out/` and deploys. Only the deploy job gets Pages write/OIDC permissions.

`next.config.ts` enables static export, unoptimized images and trailing slashes, with no repository prefix. The workflow rejects other repository names. `src/data/profile.ts` owns the production URL and verified contact links. Canonical, OpenGraph, robots and sitemap use the final domain. `public/og-image.png` is a static social card; no runtime image endpoint is required. Fonts are bundled by Next.js at build time.

The existing `.openai/hosting.json` retains the earlier Sites project association for compatibility. This workflow deploys to GitHub Pages.

The GitHub mark comes from Primer Octicons; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
