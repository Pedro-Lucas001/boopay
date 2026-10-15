import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

export class AccessError extends Error {
  constructor(public statusCode: number, public code: string) { super(code); }
}
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export function equalSecret(left: string, right: string) {
  const a = Buffer.from(left), b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function normalizeStoreUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash)
    throw new AccessError(400, 'invalid_store_url');
  return url.href.replace(/\/$/, '');
}

export class CredentialService {
  private key: Buffer;
  constructor(public db: PrismaClient, keyHex: string, public now: () => Date = () => new Date()) {
    if (!/^[0-9a-f]{64}$/i.test(keyHex)) throw new Error('BOOPAY_CREDENTIAL_KEY precisa conter 32 bytes em hexadecimal.');
    this.key = Buffer.from(keyHex, 'hex');
  }
  private encrypt(value: string) {
    const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    return [iv, cipher.getAuthTag(), encrypted].map(v => v.toString('base64url')).join('.');
  }
  decryptSecret(value: string) {
    const [iv, tag, body] = value.split('.').map(v => Buffer.from(v, 'base64url'));
    const cipher = createDecipheriv('aes-256-gcm', this.key, iv);
    cipher.setAuthTag(tag);
    return Buffer.concat([cipher.update(body), cipher.final()]).toString('utf8');
  }
  async issueCode(tenantId: string, merchantId: number, storeUrl: string) {
    if (!await this.db.merchant.findUnique({ where: { id: merchantId } }))
      throw new AccessError(404, 'merchant_not_found');
    const code = randomBytes(32).toString('base64url');
    const expiresAt = new Date(this.now().getTime() + 5 * 60_000);
    await this.db.connectionCode.create({ data: {
      codeHash: hashToken(code), tenantId, merchantId, storeUrl: normalizeStoreUrl(storeUrl), expiresAt
    } });
    return { code, expires_at: expiresAt.toISOString() };
  }
  async exchange(code: string, storeUrl: string) {
    const store = normalizeStoreUrl(storeUrl), now = this.now();
    const token = randomBytes(32).toString('base64url'), secret = randomBytes(32).toString('base64url');
    return this.db.$transaction(async tx => {
      const record = await tx.connectionCode.findUnique({ where: { codeHash: hashToken(code) } });
      if (!record || record.storeUrl !== store || record.usedAt || record.expiresAt <= now)
        throw new AccessError(401, 'invalid_connection_code');
      const changed = await tx.connectionCode.updateMany({
        where: { id: record.id, usedAt: null, expiresAt: { gt: now } }, data: { usedAt: now }
      });
      if (changed.count !== 1) throw new AccessError(401, 'invalid_connection_code');
      const integration = await tx.integration.create({ data: {
        tenantId: record.tenantId, merchantId: record.merchantId, storeUrl: record.storeUrl,
        tokenHash: hashToken(token), encryptedSecret: this.encrypt(secret)
      } });
      return { integration_id: integration.id, tenant_id: integration.tenantId,
        merchant_id: integration.merchantId, token, signing_secret: secret };
    });
  }
  async authenticate(token: string) {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new AccessError(401, 'invalid_credentials');
    const integration = await this.db.integration.findUnique({ where: { tokenHash: hashToken(token) } });
    if (!integration || integration.revokedAt) throw new AccessError(401, 'invalid_credentials');
    return integration;
  }
  async revoke(token: string) {
    const integration = await this.authenticate(token);
    await this.db.integration.update({ where: { id: integration.id }, data: { revokedAt: this.now() } });
  }
}
