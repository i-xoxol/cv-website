const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const routePath = resolve(__dirname, '../src/app/api/contact/route.ts');
const compiled = ts.transpileModule(readFileSync(routePath, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText;
const WINDOW_MS = 10 * 60 * 1000;

// Exercise the real route in isolation: fake time, credentials and Gmail, with
// no network access or credential files. Inspect its private history in the VM
// to catch memory regressions without adding test-only production exports.
function loadRoute() {
  let now = 1000000;
  const sent = [];
  const credentialReads = [];
  const context = vm.createContext({
    exports: {},
    process: { env: {} },
    Buffer,
    Date: { now: () => now },
    console,
    require(id) {
      switch (id) {
        case 'next/server':
          return { NextResponse: { json: (body, options) => Response.json(body, options) } };
        case 'node:fs/promises':
          return { readFile: async (file) => {
            credentialReads.push(file);
            return JSON.stringify(file.endsWith('credentials.json')
              ? { installed: { client_id: 'test', client_secret: 'test', redirect_uris: ['http://localhost'] } }
              : { access_token: 'test' });
          } };
        case 'node:path':
          return require('node:path');
        case 'googleapis':
          return { google: {
            auth: { OAuth2: class { setCredentials() {} } },
            gmail: () => ({ users: { messages: { send: async (message) => { sent.push(message); } } } }),
          } };
        default:
          throw new Error(`Unexpected dependency: ${id}`);
      }
    },
  });
  vm.runInContext(compiled, context, { filename: routePath });
  const rateLimited = vm.runInContext('rateLimited', context);
  const recent = vm.runInContext('recent', context);
  return {
    rateLimited, recent, sent, credentialReads,
    advance: (ms) => { now += ms; },
    post: (client) => context.exports.POST(new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': client },
      body: JSON.stringify({ name: 'Test Visitor', email: 'visitor@example.test', message: 'A test message.' }),
    })),
  };
}

test('allows five legitimate submissions and rejects the sixth before accessing Gmail', async () => {
  const route = loadRoute();
  for (let i = 0; i < 5; i++) {
    const response = await route.post('client');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
  }
  const reads = route.credentialReads.length;
  for (let i = 0; i < 20; i++) {
    const response = await route.post('client');
    assert.equal(response.status, 429);
    assert.deepEqual(await response.json(), { error: 'Too many messages. Please try again later.' });
  }
  assert.equal(route.sent.length, 5);
  assert.equal(route.credentialReads.length, reads);
  assert.equal(route.recent.get('client').length, 5);
});

test('100,000 rejected attempts keep a five-timestamp history and bounded filtering work', () => {
  const route = loadRoute();
  for (let i = 0; i < 5; i++) assert.equal(route.rateLimited('client'), false);
  const accepted = Array.from(route.recent.get('client'));
  let timestampsExamined = 0;
  // Instrument the history arrays directly; a growing replacement array in the
  // old implementation is also caught by the per-attempt history assertion.
  const history = route.recent.get('client');
  history.filter = function (predicate) {
    timestampsExamined += this.length;
    return Array.prototype.filter.call(this, predicate);
  };
  for (let i = 0; i < 100000; i++) {
    assert.equal(route.rateLimited('client'), true);
    assert.equal(route.recent.get('client').length, 5);
  }
  assert.deepEqual(Array.from(route.recent.get('client')), accepted);
  assert.equal(timestampsExamined, 5 * 100000);
});

test('rejections near expiry do not extend the window; exactly ten minutes frees all slots', async () => {
  const route = loadRoute();
  for (let i = 0; i < 5; i++) assert.equal(route.rateLimited('client'), false);
  route.advance(WINDOW_MS - 1);
  for (let i = 0; i < 100; i++) assert.equal(route.rateLimited('client'), true);
  route.advance(1);
  assert.equal((await route.post('client')).status, 200);
  assert.equal(route.sent.length, 1);
  assert.equal(route.recent.get('client').length, 1);
  for (let i = 0; i < 4; i++) assert.equal(route.rateLimited('client'), false);
  assert.equal(route.rateLimited('client'), true);
});

test('staggered timestamps expire individually and only free the available slots', () => {
  const route = loadRoute();
  for (let i = 0; i < 5; i++) {
    assert.equal(route.rateLimited('client'), false);
    if (i < 4) route.advance(1000);
  }
  assert.equal(route.rateLimited('client'), true);
  route.advance(WINDOW_MS - 4000);
  assert.equal(route.rateLimited('client'), false);
  assert.equal(route.recent.get('client').length, 5);
  assert.equal(route.rateLimited('client'), true);
  route.advance(1000);
  assert.equal(route.rateLimited('client'), false);
  assert.equal(route.rateLimited('client'), true);
});

test('a rejected client does not consume another client\'s quota', () => {
  const route = loadRoute();
  for (let i = 0; i < 5; i++) assert.equal(route.rateLimited('first'), false);
  assert.equal(route.rateLimited('first'), true);
  for (let i = 0; i < 5; i++) assert.equal(route.rateLimited('second'), false);
  assert.equal(route.rateLimited('second'), true);
  assert.equal(route.recent.size, 2);
});

test('expired histories are still cleaned up when the existing map threshold is crossed', () => {
  const route = loadRoute();
  for (let i = 0; i < 5000; i++) assert.equal(route.rateLimited(`client-${i}`), false);
  assert.equal(route.recent.size, 5000);
  route.advance(WINDOW_MS);
  assert.equal(route.rateLimited('new-client'), false);
  assert.equal(route.recent.size, 1);
  assert.equal(route.recent.has('new-client'), true);
});
