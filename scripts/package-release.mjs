import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const commit = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const root = resolve('dist/release');
await rm(root, { recursive: true, force: true });
await mkdir(root, { recursive: true });
await cp('.next/standalone', root, { recursive: true, dereference: true });
await cp('.next/static', `${root}/.next/static`, { recursive: true, dereference: true });
await cp('public', `${root}/public`, { recursive: true, dereference: true });
const manifest = {
  schema: 1,
  repository: 'i-xoxol/cv-website',
  commit,
  run_id: process.env.GITHUB_RUN_ID || 'local',
  run_attempt: process.env.GITHUB_RUN_ATTEMPT || '1',
  node_major: 22,
  build_id: (await readFile('.next/BUILD_ID', 'utf8')).trim(),
};
await writeFile(`${root}/deployment.json`, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Packaged ${commit} in ${root}`);
