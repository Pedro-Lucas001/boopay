import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';
import { signRequest } from '../src/security/signed-request';

test('catálogo transacional: ordem, tombstone, variações, concorrência, tenants e eventos', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'boopay-ingest-'));
  const url = 'file:' + join(dir, 'test.db').replace(/\\/g, '/');
  writeFileSync(join(dir, 'test.db'), '');
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'],
    { env: { ...process.env, DATABASE_URL: url }, stdio: 'pipe' });
  const db = new PrismaClient({ datasources: { db: { url } } });
  const { app, credentials } = buildApp({ db, credentialKey: '1'.repeat(64), adminToken: 'a'.repeat(40) });
  try {
    const merchant = await db.merchant.create({ data: { nome: 'Sintética', razao_social: 'Fixture',
      email: 'fixture@example.invalid', consumer_key: 'fixture', consumer_secretHash: 'fixture' } });
    const identity = await credentials.exchange((await credentials.issueCode('tenant-a', merchant.id, 'https://store.example')).code, 'https://store.example');
    const send = async (path: string, input: unknown, who = identity) => {
      const payload = JSON.stringify(input), timestamp = String(Math.floor(Date.now() / 1000)), nonce = randomBytes(16).toString('hex');
      return app.inject({ method: 'POST', url: path, payload, headers: { 'content-type': 'application/json',
        authorization: 'Bearer ' + who.token, 'x-boopay-tenant': who.tenant_id, 'x-boopay-integration': who.integration_id,
        'x-boopay-timestamp': timestamp, 'x-boopay-nonce': nonce,
        'x-boopay-signature': signRequest(who.signing_secret, 'POST', path, timestamp, nonce, Buffer.from(payload)) } });
    };
    const product = { action: 'upsert', source_id: 1, revision: 1, sku: '', name: 'Teste', type: 'variable',
      price: '10.50', stock: null, in_stock: true, url: 'https://store.example/product/1', images: [], variations: [
        { source_id: 2, sku: '', price: '11', stock: 2, in_stock: true, attributes: { cor: 'azul' } }] };
    const batch = (items: unknown[]) => ({ version: 1, event_id: randomUUID(), merchant_id: merchant.id, items });
    const sync = (input: unknown, who = identity) => send('/v1/admin/catalog/sync', input, who);
    const first = batch([product]);
    assert.equal((await sync(first)).statusCode, 200);
    assert.equal((await sync(first)).json().duplicate, true);
    assert.equal((await sync({ ...first, items: [] })).statusCode, 409);
    const concurrent = batch([{ ...product, revision: 2, variations: [] }]);
    const responses = await Promise.all([sync(concurrent), sync(concurrent)]);
    assert.ok(responses.every(r => r.statusCode === 200));
    assert.equal((await db.catalogItem.count()), 1);
    assert.deepEqual(JSON.parse((await db.catalogItem.findFirstOrThrow()).snapshot).variations, []);
    assert.equal((await sync(batch([{ action: 'delete', source_id: 1, revision: 4 }]))).statusCode, 200);
    assert.equal((await sync(batch([{ ...product, revision: 3 }]))).json().ignored, 1);
    assert.equal((await db.catalogItem.findFirstOrThrow()).deleted, true);
    const count = await db.catalogReceipt.count();
    assert.equal((await sync(batch([{ ...product, source_id: 3 }, { ...product, source_id: 4, price: '-1' }]))).statusCode, 400);
    assert.equal(await db.catalogItem.count({ where: { sourceId: 3 } }), 0);
    assert.equal(await db.catalogReceipt.count(), count);
    const secondMerchant = await db.merchant.create({ data: { nome: 'Outra loja', razao_social: 'Fixture',
      email: 'other@example.invalid', consumer_key: 'fixture', consumer_secretHash: 'fixture' } });
    const second = await credentials.exchange((await credentials.issueCode('tenant-b', secondMerchant.id, 'https://other.example')).code, 'https://other.example');
    assert.equal((await sync({ ...batch([product]), merchant_id: secondMerchant.id }, second)).statusCode, 200);
    assert.equal(await db.catalogItem.count(), 2);
    const event = { version: 1, event_id: randomUUID(), kind: 'view', session_hash: 'a'.repeat(64),
      product_id: 1, occurred_at: new Date().toISOString(), consent: true };
    assert.equal((await send('/v1/events', event)).statusCode, 200);
    assert.equal((await send('/v1/events', event)).json().duplicate, true);
    assert.equal((await send('/v1/events', { ...event, email: 'personal@example.invalid' })).statusCode, 400);
    assert.equal((await send('/v1/events', { ...event, consent: false })).statusCode, 400);
    const health = (await send('/v1/integrations/health', {})).json();
    assert.equal(health.catalog_count, 0); assert.equal(health.last_event.eventId, event.event_id);
    assert.equal((await send('/v1/integrations/health', {}, second)).json().last_event, null);
    await credentials.revoke(identity.token);
    assert.equal((await send('/v1/events', event)).statusCode, 401);
  } finally { await app.close(); await db.$disconnect(); rmSync(dir, { recursive: true, force: true }); }
});
