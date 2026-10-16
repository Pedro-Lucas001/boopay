import { z } from 'zod';
const id = z.number().int().positive();
const price = z.string().regex(/^\d{1,10}(\.\d{1,6})?$/);
const image = z.string().url().max(2048).refine(v => new URL(v).protocol === 'https:');
const variation = z.object({ source_id: id, sku: z.string().max(200), price,
  stock: z.number().int().min(0).nullable(), in_stock: z.boolean(),
  attributes: z.record(z.string().max(100), z.string().max(200)) }).strict();
export const catalogItemSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('delete'), source_id: id, revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER) }).strict(),
  z.object({ action: z.literal('upsert'), source_id: id, revision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    sku: z.string().max(200), name: z.string().min(1).max(500), type: z.enum(['simple', 'variable']),
    price, stock: z.number().int().min(0).nullable(), in_stock: z.boolean(), url: image,
    images: z.array(image).max(20), variations: z.array(variation).max(100)
  }).strict()
]);
export const syncCatalogSchema = z.object({ version: z.literal(1), merchant_id: id,
  event_id: z.string().uuid(), items: z.array(catalogItemSchema).max(50) }).strict()
  .superRefine((value, ctx) => {
    const ids = new Set<number>();
    for (const item of value.items) {
      if (ids.has(item.source_id)) ctx.addIssue({ code: 'custom', message: 'duplicate_source_id' });
      ids.add(item.source_id);
      if (item.action === 'upsert') {
        if (new Set(item.variations.map(v => v.source_id)).size !== item.variations.length)
          ctx.addIssue({ code: 'custom', message: 'duplicate_variation_id' });
        if (item.type === 'simple' && item.variations.length)
          ctx.addIssue({ code: 'custom', message: 'simple_with_variations' });
      }
    }
  });
export const storeEventSchema = z.object({ version: z.literal(1), event_id: z.string().uuid(),
  kind: z.enum(['view', 'add_to_cart', 'exit_intent']), session_hash: z.string().regex(/^[0-9a-f]{64}$/),
  product_id: id.optional(), occurred_at: z.string().datetime(), consent: z.literal(true) }).strict();
