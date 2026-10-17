import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { TenantAccess } from '../security/tenant-context';
import { AccessError, CredentialService, equalSecret } from '../security/credentials';
import { bearer } from './connection-routes';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const params = z.object({ merchantId: z.coerce.number().int().positive() }).strict();
const pagination = z.object({ page: z.coerce.number().int().min(1).max(100_000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20) }).strict();

export function operatorRoutes(app: FastifyInstance, credentials: CredentialService, access: TenantAccess, adminToken: string) {
  const db = credentials.db;
  const surfaces = [['/operator', 'index.html', 'text/html; charset=utf-8'],
    ['/operator/assets/client.js', 'client.js', 'text/javascript; charset=utf-8'],
    ['/operator/assets/style.css', 'style.css', 'text/css; charset=utf-8']] as const;
  for (const [path, file, type] of surfaces) app.get(path, async (_request, reply) => reply
    .header('Cache-Control', 'no-store').header('X-Content-Type-Options', 'nosniff')
    .header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'")
    .type(type).send(readFileSync(resolve(__dirname, '../operator', file), 'utf8')));
  app.post('/v1/admin/operators', async (request, reply) => {
    if (adminToken.length < 32 || !equalSecret(bearer(request), adminToken))
      throw new AccessError(401, 'invalid_admin_credentials');
    reply.header('Cache-Control', 'no-store');
    return access.provision(request.body);
  });
  app.post('/v1/admin/operators/:operatorId/revoke', async (request, reply) => {
    if (adminToken.length < 32 || !equalSecret(bearer(request), adminToken))
      throw new AccessError(401, 'invalid_admin_credentials');
    const id = z.object({ operatorId: z.string().uuid() }).strict().parse(request.params).operatorId;
    await access.revoke(id); return reply.code(204).send();
  });
  app.get('/v1/operator/stores', async (request, reply) => {
    z.object({}).strict().parse(request.query);
    reply.header('Cache-Control', 'no-store');
    return { stores: await access.stores(bearer(request)) };
  });
  app.get('/v1/operator/stores/:merchantId/catalog', async (request, reply) => {
    const id = params.parse(request.params).merchantId;
    const context = await access.context(bearer(request), id);
    const query = pagination.parse(request.query);
    const where = { deleted: false, integration: { merchantId: context.merchantId, tenantId: context.tenantId } };
    const [items, total] = await db.$transaction([
      db.catalogItem.findMany({ where, skip: (query.page - 1) * query.limit, take: query.limit, orderBy: { id: 'asc' },
        select: { sourceId: true, revision: true, snapshot: true } }), db.catalogItem.count({ where })
    ]);
    reply.header('Cache-Control', 'no-store');
    return { merchant_id: context.merchantId, page: query.page, limit: query.limit, total,
      items: items.map(i => {
        const p = JSON.parse(i.snapshot);
        return { source_id: i.sourceId, revision: i.revision.toString(), name: p.name, type: p.type,
          price: p.price, stock: p.stock, in_stock: p.in_stock, variations: p.variations };
      }) };
  });
  app.get('/v1/operator/stores/:merchantId/health', async (request, reply) => {
    z.object({}).strict().parse(request.query);
    const context = await access.context(bearer(request), params.parse(request.params).merchantId);
    const scope = { merchantId: context.merchantId, tenantId: context.tenantId };
    const [catalogCount, eventCount, integrations] = await db.$transaction([
      db.catalogItem.count({ where: { deleted: false, integration: scope } }),
      db.storeEvent.count({ where: { integration: scope } }),
      db.integration.findMany({ where: scope, select: { id: true, storeUrl: true, revokedAt: true }, orderBy: { id: 'asc' } })
    ]);
    reply.header('Cache-Control', 'no-store');
    return { merchant_id: context.merchantId, catalog_count: catalogCount, event_count: eventCount,
      integrations: integrations.map(i => ({ integration_id: i.id, store_url: i.storeUrl, revoked: !!i.revokedAt })) };
  });
  app.post('/v1/operator/stores/:merchantId/connection-codes', async (request, reply) => {
    const context = await access.context(bearer(request), params.parse(request.params).merchantId, true);
    const input = z.object({ store_url: z.string().url().max(2048) }).strict().parse(request.body);
    reply.header('Cache-Control', 'no-store');
    return credentials.issueCode(context.tenantId, context.merchantId, input.store_url);
  });
  app.post('/v1/operator/stores/:merchantId/disconnect', async (request, reply) => {
    const context = await access.context(bearer(request), params.parse(request.params).merchantId, true);
    const input = z.object({ integration_id: z.string().uuid() }).strict().parse(request.body);
    const result = await db.integration.updateMany({ where: { id: input.integration_id, merchantId: context.merchantId,
      tenantId: context.tenantId, revokedAt: null }, data: { revokedAt: credentials.now() } });
    if (result.count !== 1) throw new AccessError(404, 'integration_not_found');
    return reply.code(204).send();
  });
}
