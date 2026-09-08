# Security

The maintained version is the current source on `main`. The production site is a static Next.js export hosted on GitHub Pages.

Report suspected vulnerabilities privately to **yusufcanozan9@gmail.com**. Do not open public issues containing credentials or exploit details. Include the affected page, reproducible steps and expected impact; redact personal information and tokens.

## Before deployment

Run `npm audit`, `npm run lint`, `npm run build` and `npm run verify:export`. The export check runs `npm run security:check`, which checks source, all public output bytes, forbidden artifacts, environment-file ignore rules and any available sensitive environment values. It prints filenames and rule names only. Pattern scans reduce accidental exposure; they cannot prove the absence of every possible secret.

Use `npm run security:check -- --history` to also inspect blobs reachable from locally available Git refs and reflogs. This does not fetch deleted remote history or change any Git history.

`GITHUB_TOKEN` is optional locally, must stay in an ignored environment file, and is consumed only by the build module marked `server-only`. CI provides the built-in read-only token to the build and immediate security scan. Never use a `NEXT_PUBLIC_` prefix for credentials. Never publish `.next/`, repository archives, source maps or environment files; only validated `out/` belongs in the Pages artifact.

If a credential is ever committed, revoke/rotate it and replace it first. Removing the current file does not remove history. Coordinate history removal separately; this project does not rewrite history automatically.

## Hosting limits

The static site has no application API, authentication, cookies, contact backend, iframe or service worker. CORS for an application server is therefore not applicable. Source and bundled browser JavaScript are public by design; they must contain no secrets.

GitHub Pages does not run Next.js `headers()`. The site includes a static-compatible `Referrer-Policy` meta value (`strict-origin-when-cross-origin`). `Permissions-Policy`, `X-Content-Type-Options` and CSP `frame-ancestors` require control of HTTP response headers through another host or proxy; this project does not claim to set them on Pages. The local preview's response headers apply only to that local server.

A strict CSP needs a separate tested rollout: Next.js emits inline bootstrap/RSC scripts and GSAP/Framer/Lenis update styles. A build-generated hash policy could authorize the exact inline scripts; any change requires regenerating those hashes. A meta CSP cannot provide `frame-ancestors` or reporting parity with response headers. Do not add blanket `unsafe-eval`, a fixed nonce or a blocking meta policy just to satisfy a checklist. Fonts and scripts are bundled locally, so third-party script SRI is not needed.

References: [Next.js static export limitations](https://nextjs.org/docs/app/guides/static-exports#unsupported-features), [CSP behavior and directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy).

Dependencies and official GitHub Actions are still supply-chain trust boundaries. The lockfile, `npm ci`, immutable action SHAs and minimal token permissions reduce exposure without eliminating it.
