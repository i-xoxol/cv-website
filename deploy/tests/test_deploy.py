import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch
import urllib.error

spec = importlib.util.spec_from_file_location('website_deploy', Path(__file__).parents[1] / 'deploy.py')
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)

COMMIT = 'a' * 40
TAG = 'deploy-123-1-' + COMMIT[:12]
MANIFEST = dict(schema=1, repository=deploy.REPOSITORY, commit=COMMIT, run_id='123', run_attempt='1', node_major=22)


class PackageTests(unittest.TestCase):
    def archive(self, path, extra=None):
        with tarfile.open(path, 'w:gz') as bundle:
            files = {'server.js': b'example', 'deployment.json': json.dumps(MANIFEST).encode(),
                     '.next/BUILD_ID': b'build', 'public/Igor_Khokhlov_CV.pdf': b'%PDF'}
            for name, data in files.items():
                info = tarfile.TarInfo(name)
                info.size = len(data)
                bundle.addfile(info, io.BytesIO(data))
            if extra:
                bundle.addfile(extra, io.BytesIO(b'x' * extra.size) if extra.isfile() else None)

    def test_valid_manifest(self):
        deploy.validate_manifest(MANIFEST, TAG)

    def test_successful_main_workflow_is_required(self):
        run = dict(conclusion='success', head_sha=COMMIT, path='.github/workflows/release.yml', event='push', head_branch='main')
        deploy.validate_run(run, MANIFEST)
        for update in ({'conclusion': 'failure'}, {'head_sha': 'b' * 40}, {'event': 'pull_request'}, {'head_branch': 'other'}, {'path': 'other.yml'}):
            with self.subTest(update=update), self.assertRaises(ValueError):
                deploy.validate_run({**run, **update}, MANIFEST)

    def test_wrong_commit_or_run_is_rejected(self):
        for update in ({'commit': 'b' * 40}, {'run_id': '124'}, {'node_major': 24}, {'repository': 'other/repo'}):
            with self.subTest(update=update), self.assertRaises(ValueError):
                deploy.validate_manifest({**MANIFEST, **update}, TAG)

    def test_regular_package_extracts(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.archive(root / 'build.tar.gz')
            deploy.safe_extract(root / 'build.tar.gz', root / 'out')
            self.assertEqual((root / 'out/server.js').read_bytes(), b'example')

    def test_path_escape_and_credentials_are_rejected(self):
        for name in ('../outside', '/tmp/outside', 'auth/key', 'token.json', '.env.production', 'folder\\escape'):
            with self.subTest(name=name), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                info = tarfile.TarInfo(name)
                info.size = 1
                self.archive(root / 'build.tar.gz', info)
                with self.assertRaises(ValueError):
                    deploy.safe_extract(root / 'build.tar.gz', root / 'out')

    def test_symlinks_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            info = tarfile.TarInfo('link')
            info.type = tarfile.SYMTYPE
            info.linkname = '/etc/passwd'
            self.archive(root / 'build.tar.gz', info)
            with self.assertRaises(ValueError):
                deploy.safe_extract(root / 'build.tar.gz', root / 'out')


class FakeDeployer(deploy.Deployer):
    def __init__(self, fail_stage=False, fail_production=False):
        self.state = {'current': {'tag': 'old'}, 'previous': None}
        self.calls = []
        self.fail_stage = fail_stage
        self.fail_production = fail_production

    def stage(self, target):
        self.calls.append(('stage', target['tag']))
        if self.fail_stage:
            raise RuntimeError('staging failed')

    def point_current(self, target):
        self.calls.append(('point', target['tag']))

    def restart(self, target):
        self.calls.append(('restart', target['tag']))

    def health(self, target, port=3005):
        self.calls.append(('health', target['tag']))
        if self.fail_production and target['tag'] == 'new':
            raise RuntimeError('production failed')

    def save_pm2(self):
        self.calls.append(('save_pm2', None))

    def save(self):
        self.calls.append(('save_state', None))


class RollbackTests(unittest.TestCase):
    def test_network_failure_does_not_permanently_block_release(self):
        controller = FakeDeployer()
        release = dict(tag_name=TAG, draft=False, prerelease=False, assets=[
            {'name': deploy.ARCHIVE, 'state': 'uploaded'},
            {'name': deploy.ARCHIVE + '.sha256', 'state': 'uploaded'},
        ])
        with tempfile.TemporaryDirectory() as directory:
            controller.base = Path(directory)
            with patch.object(deploy, 'json_request', side_effect=[[release], {'status': 'completed', 'conclusion': 'success'}]), \
                 patch.object(controller, 'prepare', side_effect=urllib.error.URLError('temporary outage')):
                with self.assertRaises(urllib.error.URLError):
                    controller.check()
            self.assertNotIn(TAG, controller.state.get('failed_releases', {}))

    def test_stage_failure_never_changes_live_process(self):
        controller = FakeDeployer(fail_stage=True)
        with self.assertRaises(RuntimeError):
            controller.activate({'tag': 'new', 'commit': COMMIT})
        self.assertEqual(controller.calls, [('stage', 'new')])
        self.assertEqual(controller.state['current']['tag'], 'old')

    def test_production_failure_restores_previous_version(self):
        controller = FakeDeployer(fail_production=True)
        with self.assertRaises(RuntimeError):
            controller.activate({'tag': 'new', 'commit': COMMIT})
        self.assertIn(('restart', 'old'), controller.calls)
        self.assertIn(('health', 'old'), controller.calls)
        self.assertEqual(controller.state['current']['tag'], 'old')
        self.assertNotIn(('save_state', None), controller.calls)

    def test_success_records_previous_version(self):
        controller = FakeDeployer()
        controller.activate({'tag': 'new', 'commit': COMMIT})
        self.assertEqual(controller.state['current']['tag'], 'new')
        self.assertEqual(controller.state['previous']['tag'], 'old')

    def test_manual_rollback_blocks_immediate_redeployment(self):
        controller = FakeDeployer()
        controller.state.update(current={'tag': 'new'}, previous={'tag': 'old'})
        controller.rollback()
        self.assertEqual(controller.state['current']['tag'], 'old')
        self.assertEqual(controller.state['failed_releases']['new'], 'Manual rollback')


if __name__ == '__main__':
    unittest.main()
