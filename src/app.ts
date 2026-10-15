import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';
import { boopayRoutes } from './http/routes';
import { connectionRoutes } from './http/connection-routes';
import { AccessError, CredentialService } from './security/credentials';
import { verifySignedRequest } from './security/signed-request';

export function buildApp(options: { db: PrismaClient; credentialKey: string; adminToken: string; logger?: boolean; now?: () => Date }) {
  const app = Fastify({
    logger: options.logger ? { redact: ['req.headers.authorization', 'req.headers.x-boopay-signature'] } : false,
    bodyLimit: 1024 * 1024
  });
  const credentials = new CredentialService(options.db, options.credentialKey, options.now);
  app.removeContentTypeParser('application/json');
  const parseJson = app.getDefaultJsonParser('error', 'error');
  app.addContentTypeParser('application/json', { parseAs: 'buffer' }, (request, body, done) => {
    request.boopayRawBody = Buffer.isBuffer(body) ? body : Buffer.from(body);
    parseJson(request, body.toString('utf8'), done);
  });
  app.addHook('preHandler', async request => {
    if (request.routeOptions.url === '/v1/admin/catalog/sync')
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
