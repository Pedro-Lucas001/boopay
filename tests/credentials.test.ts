import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';
import { hashToken } from '../src/security/credentials';

test('conexão: expiração, vínculo, uso único concorrente, persistência e revogação', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'boopay-credentials-'));
  const url = 'file:' + join(dir, 'test.db').replace(/\\/g, '/');
  writeFileSync(join(dir, 'test.db'), '');
  const env = { ...process.env, DATABASE_URL: url };
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], { env, stdio: 'pipe' });
  const db = new PrismaClient({ datasources: { db: { url } } });
  let clock = new Date('2026-10-10T12:00:00Z');
  const admin = 'a'.repeat(40);
  const { app, credentials } = buildApp({ db, credentialKey: '1'.repeat(64), adminToken: admin, now: () => clock });
  try {
    const merchant = await db.merchant.create({ data: { nome: 'Loja teste', razao_social: 'Sintética',
      email: 'synthetic@example.invalid', consumer_key: 'fixture', consumer_secretHash: 'fixture' } });
    assert.equal((await app.inject({ method: 'POST', url: '/v1/admin/connection-codes', payload: {} })).statusCode, 401);
    const issued = await app.inject({ method: 'POST', url: '/v1/admin/connection-codes',
      headers: { authorization: 'Bearer ' + admin },
      payload: { tenant_id: 'tenant-a', merchant_id: merchant.id, store_url: 'https://store.example/' } });
    assert.equal(issued.statusCode, 200);
    const code = issued.json().code;
    const exchange = (value: string, store = 'https://store.example') => app.inject({
      method: 'POST', url: '/v1/integrations/connect', payload: { code: value, store_url: store }
    });
    assert.equal((await exchange('invalid')).statusCode, 401);
    assert.equal((await exchange(code, 'https://other.example')).statusCode, 401);
    const result = await exchange(code);
    assert.equal(result.statusCode, 200);
    assert.equal(result.headers['cache-control'], 'no-store');
    const issuedCredential = result.json();
    assert.equal(issuedCredential.tenant_id, 'tenant-a');
    assert.equal(issuedCredential.merchant_id, merchant.id);
    assert.equal((await exchange(code)).statusCode, 401);
    const record = await db.integration.findUniqueOrThrow({ where: { id: issuedCredential.integration_id } });
    assert.equal(record.tokenHash, hashToken(issuedCredential.token));
    assert.notEqual(record.encryptedSecret, issuedCredential.signing_secret);
    assert.equal(credentials.decryptSecret(record.encryptedSecret), issuedCredential.signing_secret);
    await credentials.authenticate(issuedCredential.token);
    await credentials.revoke(issuedCredential.token);
    await assert.rejects(credentials.authenticate(issuedCredential.token), { code: 'invalid_credentials' });
    const expiring = await credentials.issueCode('tenant-a', merchant.id, 'https://store.example');
    clock = new Date(clock.getTime() + 5 * 60_000);
    assert.equal((await exchange(expiring.code)).statusCode, 401);
    const concurrent = await credentials.issueCode('tenant-a', merchant.id, 'https://store.example');
    const results = await Promise.allSettled([credentials.exchange(concurrent.code, 'https://store.example'),
      credentials.exchange(concurrent.code, 'https://store.example')]);
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(await db.integration.count(), 2);
    // Uma nova instância lê a mesma credencial e confirma persistência após reinício.
    const second = new PrismaClient({ datasources: { db: { url } } });
    try { assert.equal(await second.integration.count(), 2); } finally { await second.$disconnect(); }
  } finally { await app.close(); await db.$disconnect(); rmSync(dir, { recursive: true, force: true }); }
});
