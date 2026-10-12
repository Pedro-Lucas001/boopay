import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { syncCatalogSchema, storeEventSchema } from '../src/http/catalog-contract';
export const simple = { action: 'upsert', source_id: 101, revision: 1, sku: 'TEST-1', name: 'Sintético',
  type: 'simple', price: '10.50', stock: 2, in_stock: true, url: 'https://store.example/product/test', images: [], variations: [] };
test('contrato versionado aceita simples, variável e vazio e rejeita PII e números inválidos', () => {
  const batch = (items: unknown[]) => ({ version: 1, merchant_id: 1, event_id: randomUUID(), items });
  assert.ok(syncCatalogSchema.safeParse(batch([])).success);
  assert.ok(syncCatalogSchema.safeParse(batch([simple])).success);
  assert.ok(syncCatalogSchema.safeParse(batch([{ ...simple, type: 'variable', variations: [
    { source_id: 102, sku: '', price: '12', stock: null, in_stock: true, attributes: { cor: 'azul' } }
  ] }])).success);
  for (const change of [{ price: '-2' }, { stock: -1 }, { email: 'pii@example.invalid' }, { action: 'charge' }])
    assert.equal(syncCatalogSchema.safeParse(batch([{ ...simple, ...change }])).success, false);
  assert.equal(syncCatalogSchema.safeParse(batch([simple, simple])).success, false);
  assert.equal(storeEventSchema.safeParse({ version: 1, event_id: randomUUID(), kind: 'view',
    session_hash: 'a'.repeat(64), occurred_at: new Date().toISOString(), consent: false }).success, false);
});
