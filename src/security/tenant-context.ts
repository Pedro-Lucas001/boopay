import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { AccessError, hashToken } from './credentials';

export const operatorInput = z.object({ display_name: z.string().min(1).max(100),
  grants: z.array(z.object({ merchant_id: z.number().int().positive(), role: z.enum(['reader', 'writer']) }).strict())
    .min(1).max(50) }).strict().superRefine((input, ctx) => {
      if (new Set(input.grants.map(g => g.merchant_id)).size !== input.grants.length)
        ctx.addIssue({ code: 'custom', message: 'duplicate_store_grant' });
    });

/** Credentials and memberships are resolved per request; no caller-supplied tenant or shared context cache. */
export class TenantAccess {
  constructor(private readonly db: PrismaClient, private readonly now: () => Date = () => new Date()) {}
  async provision(input: unknown) {
    const parsed = operatorInput.parse(input);
    const token = randomBytes(32).toString('base64url');
    return this.db.$transaction(async tx => {
      const stores = await tx.merchant.findMany({ where: { id: { in: parsed.grants.map(g => g.merchant_id) },
        tenantId: { not: null }, status: 'ativo' } });
      if (stores.length !== parsed.grants.length) throw new AccessError(403, 'store_not_authorized');
      const operator = await tx.operator.create({ data: { displayName: parsed.display_name, tokenHash: hashToken(token),
        grants: { create: parsed.grants.map(g => ({ merchantId: g.merchant_id, role: g.role })) } } });
      return { operator_id: operator.id, token };
    });
  }
  async authenticate(token: string) {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new AccessError(401, 'invalid_operator_credentials');
    const operator = await this.db.operator.findUnique({ where: { tokenHash: hashToken(token) } });
    if (!operator || operator.revokedAt) throw new AccessError(401, 'invalid_operator_credentials');
    return operator;
  }
  async context(token: string, merchantId: number, write = false) {
    const operator = await this.authenticate(token);
    const grant = await this.db.operatorGrant.findUnique({ where: { operatorId_merchantId: { operatorId: operator.id, merchantId } },
      include: { merchant: true } });
    if (!grant || !grant.merchant.tenantId || grant.merchant.status !== 'ativo' ||
      !['reader', 'writer'].includes(grant.role) || (write && grant.role !== 'writer'))
      throw new AccessError(403, 'store_not_authorized');
    return Object.freeze({ operatorId: operator.id, merchantId, tenantId: grant.merchant.tenantId, role: grant.role });
  }
  async stores(token: string) {
    const operator = await this.authenticate(token);
    const grants = await this.db.operatorGrant.findMany({ where: { operatorId: operator.id,
      role: { in: ['reader', 'writer'] }, merchant: { tenantId: { not: null }, status: 'ativo' } },
      include: { merchant: true }, orderBy: { merchantId: 'asc' } });
    return grants.map(g => ({ merchant_id: g.merchantId, tenant_id: g.merchant.tenantId, name: g.merchant.nome, role: g.role }));
  }
  async revoke(operatorId: string) {
    await this.db.operator.update({ where: { id: operatorId }, data: { revokedAt: this.now() } });
  }
}
