# Interactive CV and Portfolio

A Next.js portfolio with an academic timeline, project details, a contact form, and a terminal-styled hardware monitoring dashboard.

## Application guide

| Path | Purpose |
| --- | --- |
| [src/app/page.tsx](src/app/page.tsx) | Portfolio page, timeline, project details, and contact form. |
| [src/app/terminal/page.tsx](src/app/terminal/page.tsx) | Monitoring dashboard that polls `/system-stats.json`. |
| [src/app/api/contact/route.ts](src/app/api/contact/route.ts) | Contact-form POST handler using the Gmail API. |
| [src/app/globals.css](src/app/globals.css) | Global styles and CSS animations. |
| [public/](public/) | Portfolio assets and the JSON file used by the monitoring page. |
| [package.json](package.json) | Dependencies and project scripts. |

The terminal page is a dashboard that displays system statistics.

## Tech stack

- Next.js 14 with the App Router and React 18.
- TypeScript and Tailwind CSS.
- CSS animations.
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
