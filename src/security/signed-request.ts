import { createHash, createHmac } from 'node:crypto';
import { FastifyRequest } from 'fastify';
import { Integration, Prisma } from '@prisma/client';
import { AccessError, CredentialService, equalSecret, hashToken } from './credentials';
import { bearer } from '../http/connection-routes';

declare module 'fastify' {
  interface FastifyRequest { boopayRawBody?: Buffer; boopayIntegration?: Integration }
}
export function signatureInput(method: string, path: string, timestamp: string, nonce: string, body: Buffer) {
  return ['v1', method.toUpperCase(), path, timestamp, nonce, createHash('sha256').update(body).digest('hex')].join('\n');
}
export function signRequest(secret: string, method: string, path: string, timestamp: string, nonce: string, body: Buffer) {
  return createHmac('sha256', secret).update(signatureInput(method, path, timestamp, nonce, body)).digest('hex');
}
export async function verifySignedRequest(request: FastifyRequest, credentials: CredentialService) {
  const integration = await credentials.authenticate(bearer(request));
  const header = (name: string) => {
    const value = request.headers[name];
    if (typeof value !== 'string') throw new AccessError(401, 'invalid_signature');
    return value;
  };
  const timestamp = header('x-boopay-timestamp'), nonce = header('x-boopay-nonce');
  const signature = header('x-boopay-signature');
  if (!/^\d{10}$/.test(timestamp) || !/^[a-zA-Z0-9_-]{16,128}$/.test(nonce) || !/^[0-9a-f]{64}$/.test(signature))
    throw new AccessError(401, 'invalid_signature');
  if (Math.abs(Math.floor(credentials.now().getTime() / 1000) - Number(timestamp)) > 300)
    throw new AccessError(401, 'expired_signature');
  if (header('x-boopay-tenant') !== integration.tenantId || header('x-boopay-integration') !== integration.id)
    throw new AccessError(403, 'integration_mismatch');
  if (!request.boopayRawBody || request.url.includes('?')) throw new AccessError(401, 'invalid_signature');
  const expected = signRequest(credentials.decryptSecret(integration.encryptedSecret),
    request.method, request.url, timestamp, nonce, request.boopayRawBody);
  if (!equalSecret(signature, expected)) throw new AccessError(401, 'invalid_signature');
  const now = credentials.now();
  await credentials.db.replayNonce.deleteMany({ where: { expiresAt: { lt: now } } });
  try {
    await credentials.db.replayNonce.create({ data: {
      id: hashToken(integration.id + ':' + nonce), expiresAt: new Date(now.getTime() + 301_000)
    } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
      throw new AccessError(409, 'replayed_request');
    throw error;
  }
  request.boopayIntegration = integration;
}
