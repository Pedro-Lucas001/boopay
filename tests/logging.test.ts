import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';

test('logs de request não registram tokens, assinatura ou código do corpo', async () => {
  let logs = '';
  const db = new PrismaClient({ datasources: { db: { url: 'file:./unused-logging-test.db' } } });
  const { app } = buildApp({ db, credentialKey: '1'.repeat(64), adminToken: 'a'.repeat(40),
    logger: true, logStream: { write(message) { logs += message; } } });
  try {
    await app.inject({ method: 'GET', url: '/health',
      headers: { authorization: 'Bearer secret-token-not-for-log', 'x-boopay-signature': 'secret-signature-not-for-log' } });
    await app.inject({ method: 'POST', url: '/v1/integrations/connect',
      payload: { code: 'secret-code-not-for-log', store_url: 'http://invalid.example' } });
    assert.match(logs, /incoming request/);
    for (const secret of ['secret-token-not-for-log', 'secret-signature-not-for-log', 'secret-code-not-for-log'])
      assert.equal(logs.includes(secret), false);
  } finally { await app.close(); await db.$disconnect(); }
});
