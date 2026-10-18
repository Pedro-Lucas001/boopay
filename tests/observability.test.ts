import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';

test('request IDs are generated, returned and redacted when caller supplies one', async () => {
  let logs = '';
  const db = new PrismaClient({ datasources: { db: { url: 'file:./unused-observability-test.db' } } });
  const { app } = buildApp({ db, credentialKey: '1'.repeat(64), adminToken: 'a'.repeat(40),
    logger: true, logStream: { write(message) { logs += message; } } });
  try {
    const response = await app.inject({ method: 'GET', url: '/health?access_token=query-secret',
      headers: { 'x-request-id': 'caller-secret-id' } });
    const requestId = response.headers['x-request-id'];
    assert.match(String(requestId), /^[0-9a-f-]{36}$/i);
    assert.notEqual(requestId, 'caller-secret-id');
    assert.equal(response.json().status, 'ok');
    assert.match(logs, new RegExp(String(requestId)));
    assert.equal(logs.includes('caller-secret-id'), false);
    assert.equal(logs.includes('query-secret'), false);
  } finally { await app.close(); await db.$disconnect(); }
});

test('operational metrics require the server admin token and expose bounded route data', async () => {
  const db = new PrismaClient({ datasources: { db: { url: 'file:./unused-operational-metrics.db' } } });
  const token = 'b'.repeat(40);
  const { app } = buildApp({ db, credentialKey: '1'.repeat(64), adminToken: token });
  try {
    await app.inject({ method: 'GET', url: '/health' });
    const denied = await app.inject({ method: 'GET', url: '/v1/admin/observability/metrics',
      headers: { authorization: 'Bearer synthetic-private-token' } });
    assert.equal(denied.statusCode, 401);
    const response = await app.inject({ method: 'GET', url: '/v1/admin/observability/metrics',
      headers: { authorization: `Bearer ${token}` } });
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers['cache-control'], 'no-store');
    const data = response.json();
    assert.equal(data.scope, 'current_process');
    assert.ok(data.bucketsMs.includes('+Inf'));
    const health = data.routes.find((row: { route: string }) => row.route === 'GET /health 2xx');
    assert.equal(health.requests, 1);
    assert.equal(health.serverErrors, 0);
    assert.equal(typeof health.averageDurationMs, 'number');
    assert.equal(JSON.stringify(data).includes('synthetic-private-token'), false);
    assert.equal(JSON.stringify(data).includes(token), false);
  } finally { await app.close(); await db.$disconnect(); }
});
