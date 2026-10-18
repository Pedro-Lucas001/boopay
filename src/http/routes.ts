import { createHash } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { syncCatalogSchema, storeEventSchema } from './catalog-contract';
import { Prisma, PrismaClient } from '@prisma/client';
import { AccessError } from '../security/credentials';

export async function boopayRoutes(app: FastifyInstance, options: { db: PrismaClient }) {
  const db = options.db;
  app.get('/health', async () => ({ status: 'ok', api: 'Boopay API' }));
  app.post('/v1/admin/catalog/sync', async request => {
    const input = syncCatalogSchema.parse(request.body), integration = request.boopayIntegration!;
    request.log.info({ correlationId: input.event_id }, 'catalog_sync_received');
    if (integration.merchantId !== input.merchant_id) throw new AccessError(403, 'merchant_mismatch');
    const hash = createHash('sha256').update(request.boopayRawBody!).digest('hex');
    for (let attempt = 0; ; attempt++) {
      try {
        return await db.$transaction(async tx => {
          const key = { integrationId: integration.id, eventId: input.event_id };
          const receipt = await tx.catalogReceipt.findUnique({ where: { integrationId_eventId: key } });
          if (receipt) {
            if (receipt.payloadHash !== hash) throw new AccessError(409, 'event_id_conflict');
            return { status: 'success', duplicate: true, applied: 0, ignored: input.items.length };
          }
          let applied = 0, ignored = 0;
          for (const item of input.items) {
            const identity = { integrationId: integration.id, sourceId: item.source_id };
            const existing = await tx.catalogItem.findUnique({ where: { integrationId_sourceId: identity } });
            if (existing && existing.revision >= BigInt(item.revision)) { ignored++; continue; }
            const data = { revision: BigInt(item.revision), deleted: item.action === 'delete', snapshot: JSON.stringify(item) };
            await tx.catalogItem.upsert({ where: { integrationId_sourceId: identity },
              create: { ...identity, ...data }, update: data });
            applied++;
          }
          await tx.catalogReceipt.create({ data: { ...key, payloadHash: hash } });
          return { status: 'success', duplicate: false, applied, ignored };
        });
      } catch (error) {
        if (attempt < 2 && error instanceof Prisma.PrismaClientKnownRequestError
          && ['P2002', 'P2034', 'P1008'].includes(error.code)) continue;
        throw error;
      }
    }
  });
  app.post('/v1/events', async request => {
    const input = storeEventSchema.parse(request.body), integrationId = request.boopayIntegration!.id;
    request.log.info({ correlationId: input.event_id }, 'store_event_received');
    const payloadHash = createHash('sha256').update(request.boopayRawBody!).digest('hex');
    const key = { integrationId, eventId: input.event_id };
    try {
      await db.storeEvent.create({ data: { ...key, payloadHash, kind: input.kind,
        sessionHash: input.session_hash, productId: input.product_id, occurredAt: new Date(input.occurred_at) } });
      return { status: 'accepted', duplicate: false };
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') throw error;
      const existing = await db.storeEvent.findUniqueOrThrow({ where: { integrationId_eventId: key } });
      if (existing.payloadHash !== payloadHash) throw new AccessError(409, 'event_id_conflict');
      return { status: 'accepted', duplicate: true };
    }
  });
  app.post('/v1/integrations/health', async request => {
    const id = request.boopayIntegration!.id;
    const [catalogCount, lastEvent] = await Promise.all([
      db.catalogItem.count({ where: { integrationId: id, deleted: false } }),
      db.storeEvent.findFirst({ where: { integrationId: id }, orderBy: { receivedAt: 'desc' },
        select: { eventId: true, kind: true, receivedAt: true } })
    ]);
    return { status: 'connected', integration_id: id, catalog_count: catalogCount, last_event: lastEvent };
  });
}
