#!/usr/bin/env python3
"""Install the release controller while retaining the original site and logs."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import time


def save_json(path, content):
    path.write_text(json.dumps(content, indent=2) + '\n')
    path.chmod(0o600)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', type=Path, default=Path.home() / 'apps/cv-website-deploy')
    parser.add_argument('--legacy', type=Path, default=Path.home() / 'cv-website')
    args = parser.parse_args()
    base, legacy = args.base.resolve(), args.legacy.resolve()
    if not (legacy / '.next/BUILD_ID').is_file():
        raise RuntimeError('Original built site is missing')
    for folder in (base, base / 'shared', base / 'backups', base / 'releases'):
        folder.mkdir(parents=True, exist_ok=True)
        folder.chmod(0o700)
    source = Path(__file__).resolve().parent
    for name in ('deploy.py',):
        shutil.copy2(source / name, base / name)
        (base / name).chmod(0o700)
    if not (base / 'state.json').exists():
        processes = json.loads(subprocess.check_output(['/usr/bin/pm2', 'jlist']))
        process = next(p for p in processes if p['name'] == 'cv-website')
        env = process['pm2_env']
        auth_path = env.get('GOOGLE_AUTH_PATH') or env.get('env', {}).get('GOOGLE_AUTH_PATH') or str(legacy / 'secrets')
        if not all((Path(auth_path) / name).is_file() for name in ('credentials.json', 'token.json')):
            raise RuntimeError('Existing contact credentials could not be located')
        save_json(base / 'shared/environment.json', {'GOOGLE_AUTH_PATH': auth_path})
        save_json(base / 'backups/original-cv-process.json', {
            key: env.get(key) for key in ('name', 'pm_cwd', 'pm_exec_path', 'args', 'interpreter', 'exec_mode')
        })
        dump = Path.home() / '.pm2/dump.pm2'
        if dump.exists():
            shutil.copy2(dump, base / 'backups/original-pm2-dump.json')
            (base / 'backups/original-pm2-dump.json').chmod(0o600)
        inventory = {}
        for folder in ('src', 'public'):
            for path in (legacy / folder).rglob('*'):
                if path.is_file():
                    inventory[path.relative_to(legacy).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
        save_json(base / 'backups/original-site-files.json', inventory)
        current = {'tag': 'legacy', 'directory': str(legacy), 'legacy': True}
        save_json(base / 'state.json', {'current': current, 'previous': None,
            'legacy_directory': str(legacy), 'installed_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'failed_releases': {}})
        (base / 'current').symlink_to(legacy, target_is_directory=True)
    units = Path.home() / '.config/systemd/user'
    units.mkdir(parents=True, exist_ok=True)
    for name in ('cv-website-deploy.service', 'cv-website-deploy.timer'):
        shutil.copy2(source / name, units / name)
    subprocess.run(['systemctl', '--user', 'daemon-reload'], check=True)
    print(f'Controller installed under {base}. Original website, credentials, logs and analytics are retained.')
    print('Timer is not enabled by this installer; enable it after checking the first tested release.')


if __name__ == '__main__':
    main()
