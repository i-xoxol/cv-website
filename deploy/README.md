# Automatic deployment on a VPS

Push a change to `main` or manually run **Website checks and release** on `main`.
GitHub-hosted runners run lint, TypeScript checks, deployment validation and
rollback tests, a production build, and HTTP smoke checks. Only a successful
build is published as a `deploy-RUN-ATTEMPT-COMMIT` release. PRs only run checks.
The published artifact is built with Node 22 for Linux x64.

The production server's timer checks GitHub every two minutes over an outgoing HTTPS
connection. It downloads the complete release, verifies its SHA-256 checksum,
manifest, and successful workflow run, rejects unsafe archives, and checks a
staging instance on loopback port 13005. It then replaces only the `cv-website`
PM2 process on the existing port 3005. Production health failure restores the
previous process and marks the failed release so it is not repeatedly deployed.

The controller is installed separately from release content under the service
account's `~/apps/cv-website-deploy`. Its `releases/` directory holds the tested
builds, `current` points to the active build, `shared/environment.json` contains
server configuration, and `state.json` records the active and previous versions.
Changes to the controller or timer require copying the reviewed files to the server;
they do not automatically replace the running deployment controller.

The production deployment uses a separate, unprivileged website account. Contact
credentials live in `shared/google-contact`, outside the release tree, and are
referenced through `shared/environment.json` and `GOOGLE_AUTH_PATH`. OAuth tokens
are not copied into or overwritten by releases. PM2 logs remain outside release
content. The public hostname and domain-level external analytics remain the same;
moving the origin does not require replacing an analytics property or its history.
Visitor statistics are separate from `/system-stats.json`, which is the
repository's hardware dashboard example and has no collection pipeline here.

Nginx terminates HTTPS and proxies to the website on `127.0.0.1:3005`. The
controller's `state.json` sets `"listen_host": "127.0.0.1"` for this arrangement.
Omitting that setting retains the old LAN listener (`0.0.0.0`) for existing
installations. The process needs Node 22 and PM2; builds still happen in GitHub
Actions, so the server does not need to run `npm ci` or compile the site on each
update. The production PM2 service and release timer start automatically at boot.

## Operations on the production VPS

Use an authorized administrator for the system service commands. Run controller
and PM2 commands as the website account (`cvsite` in this installation), with
`HOME=/home/cvsite` and `PM2_HOME=/home/cvsite/.pm2`. Do not run the controller as
root or mix it with another application's PM2 account.

```bash
sudo systemctl status pm2-cvsite.service cv-website-deploy.timer
sudo journalctl -u cv-website-deploy.service -n 50 --no-pager
sudo -u cvsite env HOME=/home/cvsite PM2_HOME=/home/cvsite/.pm2 \
  python3 /home/cvsite/apps/cv-website-deploy/deploy.py --status
sudo systemctl start cv-website-deploy.service
```

Pause deployment by creating `PAUSED` in the controller's directory as the
website account; remove that file to resume. To roll back, pause first and run:

```bash
sudo -u cvsite env HOME=/home/cvsite PM2_HOME=/home/cvsite/.pm2 \
  python3 /home/cvsite/apps/cv-website-deploy/deploy.py --rollback
```

Manual rollback blocks immediate redeployment of that release. Publish a new
tested commit for the next deployment. Release directories are retained for
recovery; remove older inactive versions only after checking `state.json`.

`GET /api/deployment` reports the live commit and release without exposing
credentials. Staging and CI checks validate the contact handler using an empty
submission, which returns 400 and does not send email.

## Moving to another server

1. Keep the old website serving traffic while preparing the new host. Install
   Node 22 and the validated PM2 version under a dedicated nonadministrator account.
2. Preserve current/previous release metadata and privately back up credentials,
   controller configuration and proxy/TLS configuration. Never put those backups
   in this public repository. Obtain the existing current and previous build
   artifacts from their GitHub releases and verify the same checksums, manifest
   and successful main-branch workflow used by `deploy.py`.
3. Stage the copied builds on loopback, then run the selected current release
   under the new account's PM2 daemon. Configure loopback listening, the separate
   release-check timer, HTTPS proxy and certificate renewal. Adapt service users
   and paths rather than copying the old machine's entire home or PM2 dump.
4. Test English/Ukrainian routes, bundled assets, the downloadable CV, deployment
   metadata and contact validation. Verify Gmail credential refresh separately;
   these checks do not send a test email. Preserve the domain's existing external
   analytics. `/system-stats.json` remains an example unless a collector is
   explicitly installed.
5. Verify HTTPS on the new origin before changing only the intended hostname's
   DNS record. Retain the old site as a fallback, stop its deployment timer after
   cutover, and confirm the next successful main release is automatically deployed
   by the new host. Keep all unrelated server services and DNS records unchanged.

The original Lenovo installation is retained as a fallback, with its old user
deployment timer disabled after migration. Its historical service/paths still
use `systemctl --user` and `/home/igorx/apps/cv-website-deploy`; do not enable it
as a second production updater during normal operation.
