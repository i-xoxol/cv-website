# Automatic deployment on Lenovo

Push a change to `main` or manually run **Website checks and release** on `main`.
GitHub-hosted runners run lint, TypeScript checks, deployment validation and
rollback tests, a production build, and HTTP smoke checks. Only a successful
build is published as a `deploy-RUN-ATTEMPT-COMMIT` release. PRs only run checks.
The published artifact is built with Node 22 for Linux x64.

Lenovo's user timer checks GitHub every two minutes over an outgoing HTTPS
connection. It downloads the complete release, verifies its SHA-256 checksum,
manifest, and successful workflow run, rejects unsafe archives, and checks a
staging instance on loopback port 13005. It then replaces only the `cv-website`
PM2 process on the existing port 3005. Production health failure restores the
previous process and marks the failed release so it is not repeatedly deployed.

The controller is installed separately from release content under
`/home/igorx/apps/cv-website-deploy`. Its `releases/` directory holds the tested
builds, `current` points to the active build, `shared/environment.json` contains
server configuration, and `state.json` records the active and previous versions.
Changes to the controller or timer require copying the reviewed files to Lenovo;
they do not automatically replace the running deployment controller.

The original `/home/igorx/cv-website` is retained for initial rollback. Its
`secrets/` directory remains the contact form's credential store through
`GOOGLE_AUTH_PATH`. OAuth tokens are not copied into or overwritten by releases.
The PM2 log paths are retained. The domain, Cloudflare tunnel, proxy setup and
external analytics are not changed, so their history and collection continue.
Visitor statistics are separate from `/system-stats.json`, which is the
repository's hardware dashboard example and has no collection pipeline here.

## Operations on Lenovo

```bash
systemctl --user status cv-website-deploy.timer
journalctl --user -u cv-website-deploy.service -n 50 --no-pager
python3 /home/igorx/apps/cv-website-deploy/deploy.py --status
systemctl --user start cv-website-deploy.service
```

Pause deployment with `touch /home/igorx/apps/cv-website-deploy/PAUSED`; resume
with `rm /home/igorx/apps/cv-website-deploy/PAUSED`. To roll back, pause first
and run:

```bash
python3 /home/igorx/apps/cv-website-deploy/deploy.py --rollback
```

Manual rollback blocks immediate redeployment of that release. Publish a new
tested commit for the next deployment. Release directories are retained for
recovery; remove older inactive versions only after checking `state.json`.

`GET /api/deployment` reports the live commit and release without exposing
credentials. Staging and CI checks validate the contact handler using an empty
submission, which returns 400 and does not send email.
