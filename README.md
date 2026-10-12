# Academic website

Source for [igor.khokhlov.org](https://igor.khokhlov.org): research, teaching, publications, projects and CV for Igor Khokhlov, in English and Ukrainian. It also hosts a hardware monitoring dashboard at `/terminal`.

## Application guide

| Path | Purpose |
| --- | --- |
| [src/data/](src/data/) | All site content: `publications.ts`, `teaching.ts`, `research.ts`, `projects.ts`, `profile.ts`, and interface text in `ui.ts`. Edit these files to update the site. |
| [src/views/](src/views/) | Page layouts shared by both languages (home, publications, teaching, CV). |
| [src/components/](src/components/) | Header with mobile menu, theme toggle, citations, contact form, and the two research graphics. |
| [src/app/](src/app/) | Next.js routes. English pages live at the root and Ukrainian pages under `/uk`. |
| [src/middleware.ts](src/middleware.ts) | Sets the page language so `<html lang>` matches the content. |
| [src/app/api/contact/route.ts](src/app/api/contact/route.ts) | Contact-form POST handler using the Gmail API, with input validation, a honeypot field and rate limiting. |
| [src/app/terminal/page.tsx](src/app/terminal/page.tsx) | Monitoring dashboard that polls `/system-stats.json`. |
| [public/](public/) | Portrait, social card, CV PDF and the JSON file used by the monitoring page. |

### Updating content

Publications are kept in one structured list in `src/data/publications.ts` (id, title, authors, year, venue, type, status, DOI and optional links). Mark up to six entries `featured: true` and list them in `featuredOrder` to show them on the homepage. Titles are never translated.

The downloadable `public/Igor_Khokhlov_CV.pdf` is a print of the `/cv` page. After changing content, regenerate it by opening `/cv` in Chrome and printing to PDF (Letter, default margins, headers and footers off), or with any headless browser.

## Tech stack

- Next.js 14 with the App Router and React 18.
- TypeScript and Tailwind CSS.
- Hand-written CSS with design tokens in `globals.css` (light and dark themes, reduced-motion support). Tailwind remains available and is used by the dashboard page.
- IBM Plex Sans and Literata through `next/font`.
- `googleapis` for the server-side Gmail integration.

## Local development

Use a Node.js environment compatible with the declared Next.js version. The repository contains `package-lock.json` and the standard Next.js development, build, start, and lint scripts.

```bash
git clone https://github.com/i-xoxol/cv-website.git
cd cv-website
npm ci
npm run dev
```

Open the local development URL printed by Next.js. This setup is derived from the repository's manifest and has not been run as part of the documentation review.

## Contact-form configuration

The server-side contact route loads `credentials.json` and `token.json` from the directory specified by `GOOGLE_AUTH_PATH`, defaulting to `./auth`. Its credential loader expects the `installed` OAuth-client shape.

The repository does not contain a credential-generation or authorization helper. Configure the Gmail API and authorized OAuth credentials separately if you intend to use the contact form. The recipient is currently set in the route source; review it when adapting the project.

Keep credential files outside public assets and version control. The portfolio pages can be explored separately from contact-form delivery.

## Monitoring page

The terminal route polls `/system-stats.json` every 30 seconds. The repository includes that JSON asset, but does not include its external collection/update pipeline. Data freshness depends on how that file is maintained.

## Automatic deployment

Pushes to `main` run GitHub checks and publish a tested build as a GitHub
release. Lenovo fetches successful releases automatically, stages the build,
and updates the existing PM2 website with health checks and rollback. Visitor
analytics, server logs and contact credentials stay outside the release files.
See [the deployment guide](deploy/README.md) for status, pause and rollback commands.

## License

The repository includes the [MIT License](LICENSE).
