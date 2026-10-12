# Website development and deployment

Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:deployment`,
`npm run build`, `npm run package:release`, and `npm run test:smoke` before pushing.
Deployment tests require Python 3; use the Python executable available locally.

Pushes to `main` run `.github/workflows/release.yml`. After all checks pass,
GitHub publishes an immutable build artifact in a `deploy-*` release. Lenovo
polls every two minutes and stages that exact tested build before switching PM2.
Pull requests run the same checks without publishing a release.

Credentials, visitor statistics, proxy/tunnel configuration, and persistent
server files remain outside release packages. Never add credentials or visitor
records to this public repository. Preserve existing analytics integrations
when editing the application. See `deploy/README.md` for deployment operations.
