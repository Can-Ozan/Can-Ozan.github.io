# Deploy to GitHub Pages

Target: **https://can-ozan.github.io/** · Account: **Can-Ozan** · Repository: **Can-Ozan.github.io**

## First deployment

1. In the Can-Ozan account, create a public repository named **Can-Ozan.github.io**, or rename the existing portfolio repository to this name. For a new empty repository, do not add a README or other initial files.
2. Push the source to **main**. Run these commands from the project directory:

   ```sh
   git remote -v
   git add .
   git commit -m "Prepare portfolio for GitHub Pages"
   git remote add origin https://github.com/Can-Ozan/Can-Ozan.github.io.git
   git push -u origin main
   ```

   This checkout currently uses `main` and had no configured remotes when prepared. Add `origin` only if it is still absent. If a remote exists, inspect it first; use it if correct, or deliberately update its URL after confirming the destination. Do not force-push over an existing repository history.

3. Open **Repository → Settings → Pages**. Under **Build and deployment**, set **Source → GitHub Actions**. No branch/folder publishing setting or custom domain is needed.
4. Open **Actions → Deploy to GitHub Pages**. Run the workflow manually if the initial push ran before Pages was enabled. Verify both **build** and **deploy** jobs succeed.
5. Open **https://can-ozan.github.io/** after the successful deployment. A local build alone does not publish the site.

## Manual and automatic updates

- Every push to `main` rebuilds and deploys.
- Manual refresh: **Actions → Deploy to GitHub Pages → Run workflow → Branch: main → Run workflow**.
- The daily schedule is `03:00 UTC` (`06:00` in Türkiye). Each build fetches fresh GitHub data. GitHub can delay scheduled runs; this is not an exact-time guarantee.
- Public repository schedules are disabled after 60 days without repository activity. Re-enable the workflow in Actions when necessary. See [GitHub's workflow documentation](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows).

The workflow supplies its built-in `GITHUB_TOKEN`; no personal access token or custom secret is required. Permissions are `contents: read` for the build and `pages: write` / `id-token: write` only for deployment. Do not commit environment files or tokens. A GitHub API outage produces build warnings and unavailable sections rather than invented data; rerun when the API recovers.

## Check before pushing

Use Node.js 22:

```sh
npm install
npm run lint
npm run build
npm run verify:export
npm start
```

Confirm `out/index.html`, `out/robots.txt`, `out/sitemap.xml`, `out/og-image.png`, `out/.nojekyll`, and `out/_next/static/` exist. Preview at http://127.0.0.1:3000. Actions installs with `npm ci` against the committed lockfile. Do not commit `out/`, `.next/`, `node_modules/` or secrets.

## Why the repository name matters

`Can-Ozan.github.io` is a user site served from `/`; the configuration intentionally has no `basePath` or `assetPrefix`.

A differently named repository would be a project site at `https://can-ozan.github.io/REPOSITORY-NAME/`. This workflow stops on that mismatch instead of publishing broken paths. Use the recommended user-site name. Supporting a project site requires changing the guard, setting Next.js `basePath: "/REPOSITORY-NAME"` (bundles are prefixed automatically; no separate `assetPrefix` is needed), prefixing public asset URLs including the OG image, and updating the production URL, canonical, sitemap, robots and export checks together.

## Official action versions

The workflow pins immutable commits for [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), [setup-node v7.0.0](https://github.com/actions/setup-node/releases/tag/v7.0.0), [configure-pages v6.0.0](https://github.com/actions/configure-pages/releases/tag/v6.0.0), [upload-pages-artifact v5.0.0](https://github.com/actions/upload-pages-artifact/releases/tag/v5.0.0), and [deploy-pages v5.0.1](https://github.com/actions/deploy-pages/releases/tag/v5.0.1). Hidden files are included to retain `.nojekyll`. Only `out/` is uploaded.
