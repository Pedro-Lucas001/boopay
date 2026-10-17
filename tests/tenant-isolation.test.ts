import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, cpSync, mkdirSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';
import { hashToken, CredentialService } from '../src/security/credentials';
import { signRequest } from '../src/security/signed-request';

const migrate = (url: string, schema?: string) => {
  if (!existsSync(url.slice(5))) writeFileSync(url.slice(5), '');
  return execFileSync(process.execPath,
  [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy', ...(schema ? ['--schema', schema] : [])],
  { env: { ...process.env, DATABASE_URL: url }, stdio: 'pipe' });
};

test('multiloja: vínculo fixo, permissões, contexto, dados repetidos, replay, revogação e reinício', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'boopay-tenants-'));
  const url = 'file:' + join(dir, 'test.db').replace(/\\/g, '/');
  migrate(url);
  const db = new PrismaClient({ datasources: { db: { url } } });
  const admin = 'a'.repeat(40);
  let logs = '';
  const { app, credentials, tenantAccess } = buildApp({ db, credentialKey: '1'.repeat(64), adminToken: admin,
    logger: true, logStream: { write(message) { logs += message; } } });
  try {
    const surface = await app.inject('/operator');
    assert.equal(surface.statusCode, 200); assert.match(surface.headers['content-security-policy'] as string, /frame-ancestors 'none'/);
    assert.equal(surface.headers['cache-control'], 'no-store');
    assert.equal((await app.inject('/operator/assets/client.js')).statusCode, 200);
    assert.equal((await app.inject('/operator/assets/../../prisma/schema.prisma')).statusCode, 404);
    const merchant = (name: string) => db.merchant.create({ data: { nome: name, razao_social: 'Sintética',
      email: name + '@example.invalid', consumer_key: 'unused', consumer_secretHash: 'unused' } });
    const a = await merchant('store-a'), b = await merchant('store-b');
    const ia = await credentials.exchange((await credentials.issueCode('tenant-a', a.id, 'https://a.example')).code, 'https://a.example');
    const ib = await credentials.exchange((await credentials.issueCode('tenant-b', b.id, 'https://b.example')).code, 'https://b.example');
    await assert.rejects(credentials.issueCode('tenant-b', a.id, 'https://a.example'), { code: 'merchant_tenant_mismatch' });
    const api = (token: string, path: string, payload?: unknown) => app.inject({ method: payload === undefined ? 'GET' : 'POST', url: path,
      headers: { authorization: 'Bearer ' + token }, ...(payload === undefined ? {} : { payload }) });
    const provision = async (name: string, grants: { merchant_id: number; role: string }[]) => {
      const response = await api(admin, '/v1/admin/operators', { display_name: name, grants });
      assert.equal(response.statusCode, 200); assert.equal(response.headers['cache-control'], 'no-store'); return response.json();
    };
    const writer = await provision('Operador A', [{ merchant_id: a.id, role: 'writer' }]);
    const reader = await provision('Leitor A', [{ merchant_id: a.id, role: 'reader' }]);
    const both = await provision('Operador duas lojas', [{ merchant_id: a.id, role: 'reader' }, { merchant_id: b.id, role: 'reader' }]);
    assert.equal((await api(writer.token, '/v1/admin/operators', { display_name: 'intruso', grants: [{ merchant_id: b.id, role: 'writer' }] })).statusCode, 401);
    assert.deepEqual((await api(writer.token, '/v1/operator/stores')).json().stores.map((s: any) => s.merchant_id), [a.id]);
    assert.deepEqual((await api(both.token, '/v1/operator/stores')).json().stores.map((s: any) => s.merchant_id), [a.id, b.id]);
    assert.equal((await api(writer.token, '/v1/operator/stores?tenant_id=tenant-b')).statusCode, 400);
    assert.equal((await api(writer.token, `/v1/operator/stores/${b.id}/catalog`)).statusCode, 403);
    assert.equal((await api(writer.token, `/v1/operator/stores/${b.id}/health`)).statusCode, 403);
    assert.equal((await api(reader.token, `/v1/operator/stores/${a.id}/connection-codes`, { store_url: 'https://a.example' })).statusCode, 403);
    assert.equal((await api(writer.token, `/v1/operator/stores/${b.id}/connection-codes`, { store_url: 'https://b.example' })).statusCode, 403);
    assert.equal((await api(writer.token, `/v1/operator/stores/${a.id}/connection-codes`, { store_url: 'https://a.example', tenant_id: 'tenant-b' })).statusCode, 400);
    const validCode = await api(writer.token, `/v1/operator/stores/${a.id}/connection-codes`, { store_url: 'https://a.example' });
    assert.equal(validCode.statusCode, 200);
    const scoped = await credentials.exchange(validCode.json().code, 'https://a.example');
    assert.equal(scoped.tenant_id, 'tenant-a'); assert.equal(scoped.merchant_id, a.id);
    const signed = (who: typeof ia, path: string, input: unknown) => {
      const payload = JSON.stringify(input), timestamp = String(Math.floor(Date.now() / 1000)), nonce = randomBytes(16).toString('hex');
      return app.inject({ method: 'POST', url: path, payload, headers: { 'content-type': 'application/json', authorization: 'Bearer ' + who.token,
        'x-boopay-tenant': who.tenant_id, 'x-boopay-integration': who.integration_id, 'x-boopay-timestamp': timestamp,
        'x-boopay-nonce': nonce, 'x-boopay-signature': signRequest(who.signing_secret, 'POST', path, timestamp, nonce, Buffer.from(payload)) } });
    };
    const eventId = randomUUID();
    const product = { action: 'upsert', source_id: 1, revision: 1, sku: 'SAME-SKU', name: 'A', type: 'simple',
      price: '10.00', stock: 2, in_stock: true, url: 'https://a.example/1', images: [], variations: [] };
    for (const [who, name, price] of [[ia, 'A', '10.00'], [ib, 'B', '20.00']] as const) {
      const batch = { version: 1, event_id: eventId, merchant_id: who.merchant_id, items: [{ ...product, name, price }] };
      assert.equal((await signed(who, '/v1/admin/catalog/sync', batch)).statusCode, 200);
      assert.equal((await signed(who, '/v1/admin/catalog/sync', batch)).json().duplicate, true);
      const event = { version: 1, event_id: eventId, kind: 'view', session_hash: 'a'.repeat(64), product_id: 1,
        occurred_at: '2026-10-19T12:00:00Z', consent: true };
      assert.equal((await signed(who, '/v1/events', event)).statusCode, 200);
      assert.equal((await signed(who, '/v1/events', event)).json().duplicate, true);
    }
    for (const [id, name] of [[a.id, 'A'], [b.id, 'B']] as const) {
      const response = await api(both.token, `/v1/operator/stores/${id}/catalog?limit=1`);
      assert.equal(response.statusCode, 200); assert.equal(response.headers['cache-control'], 'no-store');
      assert.equal(response.json().items[0].name, name); assert.equal(response.json().total, 1);
      const health = (await api(both.token, `/v1/operator/stores/${id}/health`)).json();
      assert.equal(health.event_count, 1); assert.equal(health.catalog_count, 1);
      const dump = JSON.stringify(health);
      assert.equal(dump.includes('tokenHash'), false); assert.equal(dump.includes('encryptedSecret'), false);
    }
    assert.equal((await signed(ia, '/v1/admin/catalog/sync', { version: 1, event_id: randomUUID(), merchant_id: b.id, items: [] })).statusCode, 403);
    assert.equal((await api(writer.token, `/v1/operator/stores/${a.id}/disconnect`, { integration_id: ib.integration_id })).statusCode, 404);
    assert.equal((await signed(ib, '/v1/integrations/health', {})).statusCode, 200);
    // Legacy product SKU constraint is now scoped by merchant, not global.
    for (const store of [a, b]) await db.product.create({ data: { sku_woocommerce: 'SAME-SKU', nome: 'Legado', preco: 10,
      url_loja_origem: 'https://store.example', merchant_id: store.id } });
    assert.equal(await db.product.count(), 2);
    assert.equal((await api(writer.token, `/v1/operator/stores/${a.id}/disconnect`, { integration_id: ia.integration_id })).statusCode, 204);
    assert.equal((await signed(ia, '/v1/integrations/health', {})).statusCode, 401);
    assert.equal((await signed(ib, '/v1/integrations/health', {})).statusCode, 200);
    await tenantAccess.revoke(writer.operator_id);
    assert.equal((await api(writer.token, '/v1/operator/stores')).statusCode, 401);
    const persisted = new PrismaClient({ datasources: { db: { url } } });
    try {
      assert.equal(await persisted.catalogItem.count(), 2);
      assert.equal((await persisted.merchant.findUniqueOrThrow({ where: { id: a.id } })).tenantId, 'tenant-a');
    } finally { await persisted.$disconnect(); }
    for (const secret of [admin, ia.token, ib.token, writer.token, reader.token, both.token, ia.signing_secret, ib.signing_secret])
      assert.equal(logs.includes(secret), false);
  } finally { await app.close(); await db.$disconnect(); rmSync(dir, { recursive: true, force: true }); }
});

test('migration multiloja: legado unívoco é vinculado e legado conflitante falha fechado', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'boopay-tenant-migration-'));
  const url = 'file:' + join(dir, 'test.db').replace(/\\/g, '/');
  const schema = join(dir, 'schema.prisma');
  cpSync(resolve('prisma/schema.prisma'), schema);
  mkdirSync(join(dir, 'migrations'));
  cpSync(resolve('prisma/migrations/migration_lock.toml'), join(dir, 'migrations/migration_lock.toml'));
  for (const entry of readdirSync('prisma/migrations', { withFileTypes: true }))
    if (entry.isDirectory() && entry.name < '20261017010000')
      cpSync(resolve('prisma/migrations', entry.name), join(dir, 'migrations', entry.name), { recursive: true });
  migrate(url, schema);
  const db = new PrismaClient({ datasources: { db: { url } } });
  try {
    for (const id of [1, 2]) await db.$executeRaw`INSERT INTO Merchant (id,nome,razao_social,email,consumer_key,consumer_secretHash,data_atualizacao)
      VALUES (${id},'Legado','Sintético',${`legacy-${id}@example.invalid`},'unused','unused',CURRENT_TIMESTAMP)`;
    for (const [id, merchant, tenant, token] of [['ia', 1, 'tenant-a', 'a'.repeat(43)],
      ['ib', 2, 'tenant-b', 'b'.repeat(43)], ['ic', 2, 'tenant-c', 'c'.repeat(43)]] as const)
      await db.$executeRaw`INSERT INTO Integration (id,tenantId,merchantId,storeUrl,tokenHash,encryptedSecret)
        VALUES (${id},${tenant},${merchant},'https://legacy.example',${hashToken(token)},'synthetic-unused')`;
    migrate(url);
    assert.equal((await db.merchant.findUniqueOrThrow({ where: { id: 1 } })).tenantId, 'tenant-a');
    assert.equal((await db.merchant.findUniqueOrThrow({ where: { id: 2 } })).tenantId, null);
    const service = new CredentialService(db, '1'.repeat(64));
    assert.equal((await service.authenticate('a'.repeat(43))).merchantId, 1);
    await assert.rejects(service.authenticate('b'.repeat(43)), { code: 'merchant_tenant_mismatch' });
    await assert.rejects(service.authenticate('c'.repeat(43)), { code: 'merchant_tenant_mismatch' });
    await assert.rejects(service.issueCode('tenant-b', 2, 'https://legacy.example'), { code: 'merchant_tenant_mismatch' });
  } finally { await db.$disconnect(); rmSync(dir, { recursive: true, force: true }); }
});
