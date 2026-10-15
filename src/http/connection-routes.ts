import { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { AccessError, CredentialService, equalSecret } from '../security/credentials';

export function bearer(request: FastifyRequest) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new AccessError(401, 'missing_credentials');
  return header.slice(7);
}
const issueSchema = z.object({
  tenant_id: z.string().min(1).max(100), merchant_id: z.number().int().positive(),
  store_url: z.string().url().max(2048)
}).strict();
const exchangeSchema = z.object({ code: z.string().min(1).max(100), store_url: z.string().url().max(2048) }).strict();
export function connectionRoutes(app: FastifyInstance, credentials: CredentialService, adminToken: string) {
  app.post('/v1/admin/connection-codes', async (request, reply) => {
    if (adminToken.length < 32 || !equalSecret(bearer(request), adminToken))
      throw new AccessError(401, 'invalid_admin_credentials');
    const input = issueSchema.parse(request.body);
    reply.header('Cache-Control', 'no-store');
    return credentials.issueCode(input.tenant_id, input.merchant_id, input.store_url);
  });
  app.post('/v1/integrations/connect', async (request, reply) => {
    const input = exchangeSchema.parse(request.body);
    reply.header('Cache-Control', 'no-store');
    return credentials.exchange(input.code, input.store_url);
  });
  app.post('/v1/integrations/disconnect', async (request, reply) => {
    await credentials.revoke(bearer(request));
    return reply.code(204).send();
  });
}
