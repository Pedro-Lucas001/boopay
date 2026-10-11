import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';
import { signRequest } from '../src/security/signed-request';

test('assinatura PHP e Node usam o mesmo vetor de bytes', () => {
  const body = '{"merchant_id":1,"items":[],"texto":"ação"}';
  const args = ['synthetic-secret', '1791633600', '0123456789abcdef0123456789abcdef', body];
  const php = execFileSync(process.env.PHP_BINARY || 'php', ['tests/php-signature.php', ...args], { encoding: 'utf8' });
  assert.equal(php, signRequest(args[0], 'POST', '/v1/admin/catalog/sync', args[1], args[2], Buffer.from(body)));
});

test('HTTP assinado: autenticação, corpo/tempo/vínculo, replay e isolamento de SKU', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'boopay-signature-'));
  const file = join(dir, 'test.db');
  writeFileSync(file, '');
  const url = 'file:' + file.replace(/\\/g, '/');
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'],
    { env: { ...process.env, DATABASE_URL: url }, stdio: 'pipe' });
  const db = new PrismaClient({ datasources: { db: { url } } });
  const clock = new Date('2026-10-10T12:00:00Z');
  const { app, credentials } = buildApp({ db, credentialKey: '1'.repeat(64), adminToken: 'a'.repeat(40), now: () => clock });
  try {
    const createMerchant = (label: string) => db.merchant.create({ data: { nome: label, razao_social: 'Sintética',
      email: label + '@example.invalid', consumer_key: 'fixture', consumer_secretHash: 'fixture' } });
    const a = await createMerchant('store-a'), b = await createMerchant('store-b');
    const code = await credentials.issueCode('tenant-a', a.id, 'https://store.example');
    const identity = await credentials.exchange(code.code, 'https://store.example');
    const body = JSON.stringify({ merchant_id: a.id, items: [] });
    const make = (payload = body, overrides: Record<string, string> = {}) => {
      const timestamp = String(Math.floor(clock.getTime() / 1000)), nonce = randomBytes(16).toString('hex');
      return { method: 'POST' as const, url: '/v1/admin/catalog/sync', payload,
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + identity.token,
          'x-boopay-tenant': identity.tenant_id, 'x-boopay-integration': identity.integration_id,
          'x-boopay-timestamp': timestamp, 'x-boopay-nonce': nonce,
          'x-boopay-signature': signRequest(identity.signing_secret, 'POST', '/v1/admin/catalog/sync', timestamp, nonce, Buffer.from(payload)),
          ...overrides
        } };
    };
    assert.equal((await app.inject({ method: 'POST', url: '/v1/admin/catalog/sync',
      payload: { merchant_id: a.id, items: [] } })).statusCode, 401);
    assert.equal((await app.inject(make())).statusCode, 200);
    const tampered = make(); tampered.payload = JSON.stringify({ merchant_id: b.id, items: [] });
    assert.equal((await app.inject(tampered)).statusCode, 401);
    assert.equal((await app.inject(make(body, { authorization: 'Bearer invalid' }))).statusCode, 401);
    assert.equal((await app.inject(make(body, { 'x-boopay-tenant': 'tenant-b' }))).statusCode, 403);
    assert.equal((await app.inject(make(body, { 'x-boopay-integration': 'other' }))).statusCode, 403);
    assert.equal((await app.inject(make(body, { 'x-boopay-timestamp': '1000000000' }))).statusCode, 401);
    const replay = make();
    assert.equal((await app.inject(replay)).statusCode, 200);
    assert.equal((await app.inject(replay)).statusCode, 409);
    const collision = make();
    const concurrent = await Promise.all([app.inject(collision), app.inject(collision)]);
    assert.deepEqual(concurrent.map(r => r.statusCode).sort(), [200, 409]);
    assert.equal((await app.inject(make(JSON.stringify({ merchant_id: b.id, items: [] })))).statusCode, 403);
    await db.product.create({ data: { sku_woocommerce: 'FOREIGN-SKU', nome: 'Loja B', preco: 10,
      estoque: 1, url_loja_origem: 'https://b.example', merchant_id: b.id } });
    for (const action of ['upsert', 'delete']) {
      assert.equal((await app.inject(make(JSON.stringify({ merchant_id: a.id,
        items: [{ action, sku_woocommerce: 'FOREIGN-SKU', nome: 'changed' }] })))).statusCode, 403);
    }
    const foreign = await db.product.findUniqueOrThrow({ where: { sku_woocommerce: 'FOREIGN-SKU' } });
    assert.equal(foreign.nome, 'Loja B'); assert.equal(foreign.status, 'ativo');
    assert.equal((await app.inject(make(JSON.stringify({ merchant_id: a.id,
      items: [{ action: 'upsert', sku_woocommerce: 'OWN-SKU', nome: 'Próprio', preco: 12, estoque: 3 }] })))).statusCode, 200);
    assert.equal((await db.product.findUniqueOrThrow({ where: { sku_woocommerce: 'OWN-SKU' } })).merchant_id, a.id);
    assert.equal((await app.inject(make('{bad-json'))).statusCode, 400);
    assert.equal((await app.inject(make('x'.repeat(1024 * 1024 + 1)))).statusCode, 413);
    await credentials.revoke(identity.token);
    assert.equal((await app.inject(make())).statusCode, 401);
  } finally { await app.close(); await db.$disconnect(); rmSync(dir, { recursive: true, force: true }); }
});
