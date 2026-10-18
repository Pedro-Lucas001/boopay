import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import { boopayRoutes } from './http/routes';
import { connectionRoutes } from './http/connection-routes';
import { AccessError, CredentialService, equalSecret } from './security/credentials';
import { verifySignedRequest } from './security/signed-request';
import { RequestMetrics } from './observability/metrics';
import { bearer } from './http/connection-routes';

export function buildApp(options: { db: PrismaClient; credentialKey: string; adminToken: string; logger?: boolean; logStream?: { write(message: string): void }; now?: () => Date }) {
  const app = Fastify({
    logger: options.logger ? {
      redact: ['req.headers.authorization', 'req.headers.x-boopay-signature', 'req.headers.x-request-id'],
      serializers: { req: request => ({ method: request.method, url: String(request.url).split('?')[0], hostname: request.hostname }) },
      stream: options.logStream
    } : false,
    bodyLimit: 1024 * 1024,
    genReqId: () => randomUUID()
  });
  const metrics = new RequestMetrics();
  const credentials = new CredentialService(options.db, options.credentialKey, options.now);
  app.addHook('onRequest', async request => { request.boopayStartedAt = process.hrtime.bigint(); });
  app.addHook('onSend', async (request, reply, payload) => {
    reply.header('x-request-id', request.id);
    return payload;
  });
  app.addHook('onResponse', async (request, reply) => {
    const startedAt = request.boopayStartedAt;
    if (startedAt === undefined) return;
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    metrics.observe(request.method, request.routeOptions.url || 'unmatched', reply.statusCode, durationMs);
  });
  app.get('/v1/admin/observability/metrics', async (request, reply) => {
    if (options.adminToken.length < 32 || !equalSecret(bearer(request), options.adminToken))
      throw new AccessError(401, 'invalid_admin_credentials');
    reply.header('Cache-Control', 'no-store');
    return metrics.snapshot();
  });
  app.removeContentTypeParser('application/json');
  const parseJson = app.getDefaultJsonParser('error', 'error');
  app.addContentTypeParser('application/json', { parseAs: 'buffer' }, (request, body, done) => {
    request.boopayRawBody = Buffer.isBuffer(body) ? body : Buffer.from(body);
    parseJson(request, body.toString('utf8'), done);
  });
  app.addHook('preHandler', async request => {
    if (['/v1/admin/catalog/sync', '/v1/events', '/v1/integrations/health'].includes(request.routeOptions.url || ''))
      await verifySignedRequest(request, credentials);
  });
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AccessError) return reply.code(error.statusCode).send({ error: error.code });
    if (error instanceof ZodError) return reply.code(400).send({ error: 'invalid_payload' });
    const status = (error as { statusCode?: number }).statusCode;
    if (status && status >= 400 && status < 500) return reply.code(status).send({ error: 'invalid_request' });
    // Somente código/correlação; não serializar corpo, credenciais nem erro do banco.
    request.log.error({ requestId: request.id }, 'request_failed');
    return reply.code(500).send({ error: 'internal_error' });
  });
  connectionRoutes(app, credentials, options.adminToken);
  app.register(boopayRoutes, { db: options.db });
  return { app, credentials };
}
