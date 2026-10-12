import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve('dist/release');
const manifest = JSON.parse(await readFile(`${root}/deployment.json`, 'utf8'));
const port = Number(process.env.SMOKE_PORT || 13005);
const base = `http://127.0.0.1:${port}`;
let output = '';
const child = spawn(process.execPath, ['server.js'], {
  cwd: root,
  env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1', NODE_ENV: 'production', DEPLOYMENT_COMMIT: manifest.commit },
  stdio: ['ignore', 'pipe', 'pipe'],
});
child.stdout.on('data', b => { output += b; });
child.stderr.on('data', b => { output += b; });

async function get(path) {
  return fetch(`${base}${path}`, { signal: AbortSignal.timeout(10000) });
}

try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) throw new Error(`Server exited: ${output}`);
    try { ready = (await get('/api/deployment')).ok; } catch {}
    if (ready) break;
    await delay(500);
  }
  assert.ok(ready, `Server did not start: ${output}`);
  const health = await get('/api/deployment');
  assert.equal((await health.json()).commit, manifest.commit);
  assert.equal(health.headers.get('cache-control'), 'no-store');
  const home = await get('/');
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.match(html, /Dr\. Igor Khokhlov/);
  const assets = [...new Set([...html.matchAll(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+)"/g)].map(m => m[1]))];
  assert.ok(assets.length >= 3, 'Expected bundled scripts and styles');
  for (const path of assets) assert.equal((await get(path)).status, 200, path);
  assert.match(html, /<html lang="en"/);
  assert.match(html, /10\.5220\/0014610100004061/, 'Featured G.H.O.S.T. citation is rendered');
  for (const path of ['/publications', '/teaching', '/cv', '/uk', '/uk/publications', '/uk/teaching', '/uk/cv', '/sitemap.xml', '/robots.txt']) {
    assert.equal((await get(path)).status, 200, path);
  }
  assert.match(await (await get('/uk')).text(), /<html lang="uk"/);
  const pdf = await get('/Igor_Khokhlov_CV.pdf');
  assert.equal(pdf.status, 200);
  assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 4).toString(), '%PDF');
  assert.equal((await get('/terminal')).status, 200);
  const stats = await get('/system-stats.json');
  assert.equal(stats.status, 200);
  assert.ok((await stats.json()).timestamp);
  // An invalid submission exercises the handler without sending email.
  const contact = await fetch(`${base}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(10000),
  });
  assert.equal(contact.status, 400);
  assert.deepEqual(await contact.json(), { error: 'Missing fields' });
  console.log(`Smoke checks passed for ${manifest.commit}: homepage, subpages in both languages, ${assets.length} assets, CV, dashboard, health, contact validation.`);
} finally {
  child.kill();
  await Promise.race([new Promise(r => child.once('exit', r)), delay(5000)]);
  if (child.exitCode === null) child.kill('SIGKILL');
}
