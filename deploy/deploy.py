#!/usr/bin/env python3
"""Pull tested GitHub releases, stage them, and deploy only cv-website."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import tarfile
import tempfile
import time
import urllib.error
import urllib.request

REPOSITORY = 'i-xoxol/cv-website'
ARCHIVE = 'cv-website-linux-x64.tar.gz'
TAG_PATTERN = re.compile(r'^deploy-(\d+)-(\d+)-([a-f0-9]{12})$')
MAX_DOWNLOAD = 512 * 1024 * 1024
MAX_EXTRACTED = 2 * 1024 * 1024 * 1024


def json_request(url):
    request = urllib.request.Request(url, headers={
        'User-Agent': 'cv-website-release-deployer',
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    })
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def write_json(path, value):
    temp = path.with_suffix(path.suffix + '.tmp')
    temp.write_text(json.dumps(value, indent=2) + '\n')
    temp.chmod(0o600)
    temp.replace(path)


def validate_manifest(manifest, tag):
    match = TAG_PATTERN.fullmatch(tag)
    if not match:
        raise ValueError('Not an automated deployment tag')
    if manifest.get('schema') != 1 or manifest.get('repository') != REPOSITORY:
        raise ValueError('Unexpected deployment manifest')
    commit = manifest.get('commit', '')
    if not re.fullmatch(r'[a-f0-9]{40}', commit) or not commit.startswith(match[3]):
        raise ValueError('Commit does not match release tag')
    if str(manifest.get('run_id')) != match[1] or str(manifest.get('run_attempt')) != match[2]:
        raise ValueError('Workflow run does not match release tag')
    if manifest.get('node_major') != 22:
        raise ValueError('Release requires an unsupported Node version')


def safe_extract(archive, destination):
    """Accept regular files/directories only; reject escapes and secret files."""
    with tarfile.open(archive, 'r:gz') as bundle:
        members = bundle.getmembers()
        if len(members) > 100000 or sum(m.size for m in members) > MAX_EXTRACTED:
            raise ValueError('Release exceeds extraction limits')
        seen = set()
        for member in members:
            path = PurePosixPath(member.name)
            if path == PurePosixPath('.') and member.isdir():
                continue
            if path.is_absolute() or '..' in path.parts or '\\' in member.name or ':' in member.name:
                raise ValueError('Unsafe archive path')
            if not (member.isfile() or member.isdir()):
                raise ValueError('Archive links and special files are not allowed')
            if path in seen:
                raise ValueError('Duplicate archive path')
            seen.add(path)
            if path.name in {'credentials.json', 'token.json'} or path.parts[0] in {'auth', 'secrets'} or path.parts[0].startswith('.env'):
                raise ValueError('Credential files are not allowed in releases')
            target = destination.joinpath(*path.parts)
            if not target.resolve().is_relative_to(destination.resolve()):
                raise ValueError('Archive path leaves staging directory')
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with bundle.extractfile(member) as source, target.open('wb') as output:
                    shutil.copyfileobj(source, output)
                target.chmod(0o755 if member.mode & 0o111 else 0o644)
    for required in ('server.js', 'deployment.json', '.next/BUILD_ID', 'public/Igor_Khokhlov_CV.pdf'):
        if not (destination / required).is_file():
            raise ValueError(f'Release is missing {required}')


def validate_run(run, manifest):
    if (run.get('conclusion') != 'success' or run.get('head_sha') != manifest['commit']
        or run.get('path') != '.github/workflows/release.yml' or run.get('event') not in {'push', 'workflow_dispatch'}
        or run.get('head_branch') != 'main'):
        raise ValueError('Release has no successful main-branch test workflow')


class Deployer:
    def __init__(self, base):
        self.base = base.resolve()
        self.state_path = self.base / 'state.json'
        self.state = json.loads(self.state_path.read_text())
        self.environment = json.loads((self.base / 'shared/environment.json').read_text())

    def save(self):
        write_json(self.state_path, self.state)

    def environment_for(self, target, port, hostname):
        return {**os.environ, **self.environment, 'PORT': str(port), 'HOSTNAME': hostname,
                'NODE_ENV': 'production', 'DEPLOYMENT_COMMIT': target.get('commit', 'legacy'),
                'DEPLOYMENT_RELEASE': target['tag']}

    def point_current(self, target):
        path = Path(target['directory']).resolve()
        if not (path.is_relative_to(self.base / 'releases') or (target.get('legacy') and path == Path(self.state['legacy_directory']).resolve())):
            raise ValueError('Deployment directory is outside managed releases')
        temp = self.base / 'current.next'
        temp.unlink(missing_ok=True)
        temp.symlink_to(path, target_is_directory=True)
        temp.replace(self.base / 'current')

    def restart(self, target):
        root = Path(target['directory']).resolve()
        process = {
            'name': 'cv-website', 'cwd': str(root), 'exec_mode': 'fork', 'instances': 1,
            'env': {k: v for k, v in self.environment_for(target, 3005, '0.0.0.0').items()
                    if k in self.environment or k in {'PORT', 'HOSTNAME', 'NODE_ENV', 'DEPLOYMENT_COMMIT', 'DEPLOYMENT_RELEASE'}},
            'out_file': str(Path.home() / '.pm2/logs/cv-website-out.log'),
            'error_file': str(Path.home() / '.pm2/logs/cv-website-error.log'),
            'kill_timeout': 5000, 'autorestart': True,
        }
        if target.get('legacy'):
            process.update(script='/usr/bin/bash', args=['-c', 'npm start -- -p 3005'], interpreter='none')
        else:
            process.update(script=str(root / 'server.js'), interpreter='/usr/bin/node')
        config = self.base / 'process.json'
        write_json(config, {'apps': [process]})
        # Restrict every PM2 operation to this one website.
        subprocess.run(['/usr/bin/pm2', 'delete', 'cv-website'], check=False,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=20)
        subprocess.run(['/usr/bin/pm2', 'start', str(config), '--only', 'cv-website', '--update-env'],
                       check=True, stdout=subprocess.DEVNULL, timeout=30)

    def save_pm2(self):
        subprocess.run(['/usr/bin/pm2', 'save'], check=True, stdout=subprocess.DEVNULL, timeout=20)

    def health(self, target, port=3005):
        base = f'http://127.0.0.1:{port}'
        last_error = None
        for _ in range(40):
            try:
                with urllib.request.urlopen(base + '/', timeout=5) as response:
                    if response.status != 200 or b'Dr. Igor Khokhlov' not in response.read():
                        raise ValueError('Homepage health check failed')
                with urllib.request.urlopen(base + '/Igor_Khokhlov_CV.pdf', timeout=5) as response:
                    if response.read(4) != b'%PDF':
                        raise ValueError('CV health check failed')
                if not target.get('legacy'):
                    with urllib.request.urlopen(base + '/api/deployment', timeout=5) as response:
                        version = json.load(response)
                    if version.get('commit') != target['commit'] or version.get('release') != target['tag']:
                        raise ValueError('Running version does not match tested release')
                return
            except Exception as error:
                last_error = error
                time.sleep(0.5)
        raise RuntimeError(f'Health checks failed: {last_error}')

    def stage(self, target):
        with (self.base / 'staging.log').open('ab') as log:
            process = subprocess.Popen(['/usr/bin/node', 'server.js'], cwd=target['directory'],
                env=self.environment_for(target, 13005, '127.0.0.1'),
                stdin=subprocess.DEVNULL, stdout=log, stderr=log)
            try:
                self.health(target, 13005)
                if process.poll() is not None:
                    raise RuntimeError('Staging process exited unexpectedly')
            finally:
                process.terminate()
                try:
                    process.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=10)

    def activate(self, target):
        previous = self.state['current']
        self.stage(target)
        try:
            self.point_current(target)
            self.restart(target)
            self.health(target)
            self.save_pm2()
        except Exception:
            self.point_current(previous)
            self.restart(previous)
            self.health(previous)
            self.save_pm2()
            raise
        self.state.update(current=target, previous=previous, deployed_at=time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()))
        self.save()
        print(f"Deployed {target['tag']} ({target['commit']})", flush=True)

    def download(self, asset, destination, limit=MAX_DOWNLOAD):
        url = asset['browser_download_url']
        if not url.startswith(f'https://github.com/{REPOSITORY}/releases/download/'):
            raise ValueError('Release asset URL does not belong to this repository')
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'cv-website-release-deployer'}), timeout=60) as response, destination.open('wb') as output:
            total = 0
            while data := response.read(1024 * 1024):
                total += len(data)
                if total > limit:
                    raise ValueError('Download exceeds size limit')
                output.write(data)
        digest = asset.get('digest')
        if digest and digest != 'sha256:' + hashlib.sha256(destination.read_bytes()).hexdigest():
            raise ValueError('Asset digest does not match GitHub')

    def prepare(self, release, assets, run):
        tag = release['tag_name']
        with tempfile.TemporaryDirectory(prefix='download-', dir=self.base) as temp:
            download = Path(temp)
            self.download(assets[ARCHIVE], download / ARCHIVE)
            self.download(assets[ARCHIVE + '.sha256'], download / 'checksum', limit=4096)
            checksum = (download / 'checksum').read_text().split()
            actual = hashlib.sha256((download / ARCHIVE).read_bytes()).hexdigest()
            if checksum != [actual, ARCHIVE]:
                raise ValueError('Release checksum is invalid')
            staging = self.base / 'releases' / (tag + '.staging')
            final = self.base / 'releases' / tag
            if staging.exists() or final.exists():
                raise ValueError('Release directory already exists; inspect before retrying')
            staging.mkdir()
            safe_extract(download / ARCHIVE, staging)
            manifest = json.loads((staging / 'deployment.json').read_text())
            validate_manifest(manifest, tag)
            if release['target_commitish'] != manifest['commit']:
                raise ValueError('Release target does not match manifest')
            validate_run(run, manifest)
            staging.replace(final)
            return {'tag': tag, 'commit': manifest['commit'], 'directory': str(final)}

    def check(self):
        if (self.base / 'PAUSED').exists():
            print('Automatic deployment is paused')
            return
        releases = json_request(f'https://api.github.com/repos/{REPOSITORY}/releases?per_page=10')
        for release in releases:
            tag = release['tag_name']
            if release['draft'] or release['prerelease'] or not TAG_PATTERN.fullmatch(tag):
                continue
            assets = {a['name']: a for a in release['assets'] if a.get('state') == 'uploaded'}
            if ARCHIVE not in assets or ARCHIVE + '.sha256' not in assets:
                continue
            if tag == self.state['current']['tag']:
                print(f'Already running {tag}')
                return
            if tag in self.state.get('failed_releases', {}):
                print(f'Skipping previously failed or rolled back release {tag}')
                return
            # Publishing assets happens before the workflow completes; wait for its success.
            match = TAG_PATTERN.fullmatch(tag)
            run = json_request(f'https://api.github.com/repos/{REPOSITORY}/actions/runs/{match[1]}/attempts/{match[2]}')
            if run.get('status') != 'completed':
                print(f'Waiting for release workflow {tag}')
                return
            if run.get('conclusion') != 'success':
                print(f'Skipping unsuccessful release workflow {tag}')
                return
            try:
                target = self.prepare(release, assets, run)
                self.activate(target)
            except urllib.error.URLError:
                # Temporary connectivity/rate-limit failures retry on the next timer tick.
                # Downloads occur before extraction, so a network retry leaves no staging directory.
                raise
            except Exception as error:
                self.state.setdefault('failed_releases', {})[tag] = str(error)
                self.save()
                raise
            return
        print('No complete automated release is available')

    def rollback(self):
        previous = self.state.get('previous')
        if not previous:
            raise ValueError('No previous deployment is recorded')
        current = self.state['current']
        try:
            self.point_current(previous)
            self.restart(previous)
            self.health(previous)
            self.save_pm2()
        except Exception:
            self.point_current(current)
            self.restart(current)
            self.health(current)
            self.save_pm2()
            raise
        self.state.update(current=previous, previous=current)
        self.state.setdefault('failed_releases', {})[current['tag']] = 'Manual rollback'
        self.save()
        print(f"Rolled back to {previous['tag']}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', type=Path, default=Path.home() / 'apps/cv-website-deploy')
    actions = parser.add_mutually_exclusive_group(required=True)
    actions.add_argument('--check', action='store_true')
    actions.add_argument('--rollback', action='store_true')
    actions.add_argument('--status', action='store_true')
    args = parser.parse_args()
    import fcntl  # Linux only; validation tests also run on developer computers.
    with (args.base / 'deploy.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            print('Another deployment is already running')
            return
        deployer = Deployer(args.base)
        if args.check:
            deployer.check()
        elif args.rollback:
            deployer.rollback()
        else:
            print(json.dumps(deployer.state, indent=2))


if __name__ == '__main__':
    main()
