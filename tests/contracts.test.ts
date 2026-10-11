import test from 'node:test';
import assert from 'node:assert/strict';
import { syncCatalogSchema } from '../src/http/catalog-contract';

test('contrato aceita lote vazio e operações previstas', () => {
  assert.equal(syncCatalogSchema.safeParse({ merchant_id: 1, items: [] }).success, true);
  assert.equal(syncCatalogSchema.safeParse({ merchant_id: 1, items: [
    { action: 'upsert', sku_woocommerce: 'TEST-1', nome: 'Teste', preco: '10.50', estoque: 2 },
    { action: 'delete', sku_woocommerce: 'TEST-2' }
  ] }).success, true);
});
test('contrato rejeita operação desconhecida e payload incompleto', () => {
  assert.equal(syncCatalogSchema.safeParse({ merchant_id: 1, items: [{ action: 'charge' }] }).success, false);
  assert.equal(syncCatalogSchema.safeParse({ items: [] }).success, false);
});
