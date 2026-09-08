# Final security audit — 8 September 2026

Scope: current checkout, available Git refs/reflogs, installed dependency graph, GitHub Actions, all generated `out/` files, and attempts to inspect both known deployment URLs. Existing security fixes were preserved. This security continuation made no design changes.

## Findings

| Severity | Issue and affected file | Why it matters | Resolution / manual action |
| --- | --- | --- | --- |
| CRITICAL | None confirmed | — | None |
| HIGH | None confirmed | No exposed credential or vulnerable high-severity production dependency found | No credential rotation indicated by these checks |
| MODERATE | None confirmed | — | None |
| LOW | Unhandled file-stream errors in `scripts/serve.mjs` | Missing output during rebuild could terminate the local preview process; GitHub Pages is unaffected | Fixed with `pipeline` error handling and HEAD handling. Isolated missing-404 regression passed. No manual action |
| INFORMATIONAL — hardening | Incomplete artifact scan in `scripts/verify-export.mjs` | The earlier check covered JS markers, not all public bytes or credential patterns | Added `scripts/security-check.mjs`, all-file/known-value scans and a CI gate before artifact upload. Positive detection fixtures passed |
| INFORMATIONAL — hardening | Private-key ignore patterns absent in `.gitignore` | Future accidental key files could be staged | Added PEM/KEY/P12/PFX patterns. No key files were found. No manual action |
| INFORMATIONAL — hardening | Large-account work in `src/lib/github/client.ts` | Extra requests after a failed language batch had no useful result | Stop on first failed batch, cap language work at60 repositories, cap displayed lists at60 with a full GitHub link, reject redirects. Full repository statistics are preserved |
| INFORMATIONAL — hardening | Shortcut edge cases in `CommandPalette.tsx` | IME confirmation or held Enter could activate a command unexpectedly | Added composition/repeat guards; shortcuts ignore typing, modifiers and other open dialogs. Single-letter shortcuts require opt-in |
| INFORMATIONAL — hosting limitation | GitHub Pages HTTP headers | Next runtime `headers()` cannot apply to static export | Static referrer metadata added. CSP/frame-ancestors/Permissions-Policy need a separately tested host/proxy policy; no ineffective configuration added |
| INFORMATIONAL — verification blocker | Existing live deployments inaccessible | Prior deployed portfolio bytes cannot be inspected through error pages | GitHub Pages returned404 at14:10UTC; previous Sites URL returned401 at14:12UTC. Supply an accessible deployment or the exact previously deployed artifact to finish this check |

## Executed checks

- `npm audit --json`: PASS, zero vulnerabilities across all severities.
- `npm audit --omit=dev`: PASS, zero production vulnerabilities.
- `npm run lint`: PASS, exit0.
- `npm run build`: PASS, exit0; TypeScript completed and all routes statically exported.
- `npm run verify:export`: PASS;42 files,20 local links/assets, expected metadata/fonts/routes.
- `npm run security:check -- --history`: PASS; current source plus4 available commits /127 historical blobs and42 production files. Known environment values were compared without being printed.
- `out/index.html` exists. No production source maps, environment files, key files, archives, debug logs or local filesystem paths in `out/`.
-16 isolated scanner cases, preview stream-error regression, GitHub limit/failure cases and URL/escaping checks passed. Fixtures used synthetic values only.

Requested case-insensitive output search:

| Marker | Occurrences in final local `out/` |
| --- | ---: |
| GITHUB_TOKEN | 0 |
| github_pat_ | 0 |
| ghp_ | 0 |
| Authorization | 0 |
| Bearer | 0 |
| API_KEY | 0 |
| SECRET | 0 |
| PASSWORD | 159 — public project metadata, artwork/CSS names, URL validation/polyfill properties and framework input-type handling; no password value |

## Trust boundaries and configuration

- `process.env.GITHUB_TOKEN`: BUILD ONLY in a module importing `server-only`; optional authorization header to fixed `https://api.github.com`, never URL/props/public JSON/browser fetch. Redirects are rejected. No sensitive `NEXT_PUBLIC_*` variable found.
- `process.env.PORT`: local preview only. Security-check environment enumeration is a local/CI audit tool and is not bundled into the website.
- `.env`, `.env.local`, production/local variants are ignored; no sensitive env file tracked. `.env.example` has only an empty `GITHUB_TOKEN=` placeholder. `public/` contains only `.nojekyll`, `grain.svg`, `og-image.png`.
- Actions use official immutable SHAs, `npm ci`, `contents: read` for build, `pages: write` and `id-token: write` only for deploy. Checkout credentials are not persisted. The built-in token is restricted to the build/immediate scan step; only `out/` is uploaded. No PR-target execution, untrusted shell interpolation, token echo or environment dump.
- Lockfile v3 preserved. Registry entries use npm's official registry and integrity values. All production dependencies are used. The reviewed install hook is development `unrs-resolver` / `napi-postinstall` native-binding preparation; no project postinstall or remote shell installer.
- External GitHub data is parsed and rendered as escaped React text. Repository URLs and avatar host are validated; homepage URLs require credential-free HTTP(S). Curated notes are local source. No deep merge of arbitrary API objects; language-map keys use safe property definition.
-36 rendered HTML anchors /22 external links checked; all19 new-tab links have `noopener noreferrer`. Popups use trusted configured URLs with `noopener,noreferrer`.14 isolated homepage-validation cases passed, including hostile protocols and userinfo.
- No application `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval` or `new Function`. Framework internals are distinguished from application use. No lint/type-check bypass was added and no forced dependency upgrade was run.
- Browser storage contains only the intro session flag. No auth, credential storage, cookies, contact backend, custom API/CORS endpoint, query-driven redirect, blob download, iframe or service worker. These server/form/PWA categories are not applicable.
- Scripts and fonts are bundled locally. No third-party browser script, analytics or CDN script requiring SRI. Canonical/OpenGraph origin is trusted `https://can-ozan.github.io/`. Public contacts are configured email, GitHub, LinkedIn and the X URL verified from the public profile.

## Live verification and verdict

[GitHub Pages](https://can-ozan.github.io/) returned GitHub's404 missing-site page. [Previous Sites deployment](https://can-ozan-portfolio.ozanyusufcan33.chatgpt.site/) returned401 Unauthorized. Neither response supplied portfolio assets, so their headers and zero token matches cannot certify the deployed portfolio. No authentication bypass or deployment was attempted.

SOURCE CODE SECRET SCAN = PASS  
GIT HISTORY SECRET SCAN = PASS  
BUILD OUTPUT SECRET SCAN = PASS  
GITHUB ACTIONS SECURITY = PASS  
API KEYS EXPOSED = NO in checked source/history/local output  
GITHUB_TOKEN CLIENT-VISIBLE = NO in checked local output  
SECRETS PRESENT IN DEPLOYED OUTPUT = UNVERIFIED

**NOT READY TO DEPLOY under the requested complete-verification gate.** No known local security blocker remains; the outstanding blocker is verification of the previously deployed portfolio bytes. An accessible deployment or exact prior deployment artifact is needed to close it. The new local output has not been published by this audit.
