// Disposable localhost environment. Never point this fixture at a shared database.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../src/app';

async function main() {
  const root = resolve('.test-artifacts', 'multistore-' + Date.now());
  mkdirSync(root, { recursive: true });
  const file = join(root, 'api.db'); writeFileSync(file, '');
  const url = 'file:' + file.replaceAll('\\', '/');
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'],
    { env: { ...process.env, DATABASE_URL: url }, stdio: 'pipe' });
  const db = new PrismaClient({ datasources: { db: { url } } });
  const { app, credentials, tenantAccess } = buildApp({ db, credentialKey: randomBytes(32).toString('hex'), adminToken: randomBytes(32).toString('hex') });
  const stores = [];
  for (const [name, tenant, price] of [['Loja Recife · QA', 'qa-recife', '39.90'], ['Loja Olinda · QA', 'qa-olinda', '59.90']]) {
    const merchant = await db.merchant.create({ data: { nome: name!, razao_social: 'Dados sintéticos de QA',
      email: tenant + '@example.invalid', consumer_key: 'unused', consumer_secretHash: 'unused' } });
    const code = await credentials.issueCode(tenant!, merchant.id, 'https://' + tenant + '.example');
    const identity = await credentials.exchange(code.code, 'https://' + tenant + '.example');
    const snapshot = { action: 'upsert', source_id: 1, revision: 1, sku: 'MESMO-SKU', name: 'Camiseta sintética · ' + name,
      type: 'simple', price, stock: 5, in_stock: true, url: 'https://' + tenant + '.example/1', images: [], variations: [] };
    await db.catalogItem.create({ data: { integrationId: identity.integration_id, sourceId: 1, revision: 1n, snapshot: JSON.stringify(snapshot) } });
    await db.storeEvent.create({ data: { integrationId: identity.integration_id, eventId: randomUUID(),
      payloadHash: createHash('sha256').update('synthetic').digest('hex'), kind: 'view', sessionHash: 'a'.repeat(64), occurredAt: new Date() } });
    stores.push(merchant.id);
  }
  const operator = await tenantAccess.provision({ display_name: 'QA duas lojas', grants: stores.map(id => ({ merchant_id: id, role: 'reader' })) });
  const reader = await tenantAccess.provision({ display_name: 'QA somente Recife', grants: [{ merchant_id: stores[0], role: 'reader' }] });
  writeFileSync(join(root, 'access.json'), JSON.stringify({ token: operator.token, restrictedToken: reader.token, stores }, null, 2));
  app.addHook('onClose', async () => { await db.$disconnect(); });
  await app.listen({ host: '127.0.0.1', port: 3340 });
  console.log(JSON.stringify({ url: 'http://127.0.0.1:3340/operator', credentialsFile: join(root, 'access.json'),
    note: 'Fixtures sintéticas em banco novo, sem checkout ou pagamento. Não publicar access.json.' }));
  const stop = () => { app.close().then(() => process.exit(0)); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
}
main().catch(() => { console.error('Falha ao preparar QA multiloja; confira porta 3340, Prisma e diretório de trabalho.'); process.exitCode = 1; });
