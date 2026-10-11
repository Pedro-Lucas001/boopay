import { FastifyInstance } from 'fastify';
import { syncCatalogSchema } from './catalog-contract';
import { PrismaClient } from '@prisma/client';
import { AccessError } from '../security/credentials';

export async function boopayRoutes(app: FastifyInstance, options: { db: PrismaClient }) {
  const prisma = options.db;
  
  // Endpoint de Saúde mapeado na documentação da API
  app.get('/health', async () => {
    return { status: 'ok', api: 'Boopay API', time: new Date() };
  });

  // [RB-005] Contrato Zod para validação do payload enviado pelo plugin

  // [RB-015] Rota de atualizações e exclusões incrementais (POST /v1/admin/catalog/sync)
  app.post('/v1/admin/catalog/sync', async (request, reply) => {
    const { merchant_id, items } = syncCatalogSchema.parse(request.body);
    if (request.boopayIntegration?.merchantId !== merchant_id)
      throw new AccessError(403, 'merchant_mismatch');
    // A chave global atual é uma limitação de RB-006/RB-016. Enquanto ela
    // existir, rejeitar colisão entre lojas antes de qualquer alteração.
    for (const item of items) {
      const existing = await prisma.product.findUnique({ where: { sku_woocommerce: item.sku_woocommerce } });
      if (existing && existing.merchant_id !== merchant_id)
        throw new AccessError(403, 'product_ownership_mismatch');
    }
    const resultados = { atualizados: 0, excluidos: 0, falhas: 0 };

    for (const item of items) {
      try {
        if (item.action === 'delete') {
          // Exclusão incremental: apenas inativa o produto
          await prisma.product.updateMany({
            where: { sku_woocommerce: item.sku_woocommerce, merchant_id },
            data: { status: 'inativo' }
          });
          resultados.excluidos++;
        } else if (item.action === 'upsert') {
          // Atualização incremental: cria se não existe, atualiza se já existe
          await prisma.$transaction(async tx => {
            const existing = await tx.product.findUnique({ where: { sku_woocommerce: item.sku_woocommerce } });
            if (existing && existing.merchant_id !== merchant_id)
              throw new AccessError(403, 'product_ownership_mismatch');
            await tx.product.upsert({
            where: { sku_woocommerce: item.sku_woocommerce },
            update: {
              nome: item.nome,
              preco: item.preco,
              estoque: item.estoque,
              status: 'ativo'
            },
            create: {
                sku_woocommerce: item.sku_woocommerce,
                nome: item.nome || 'Produto Sem Nome',
                preco: item.preco || 0,
                estoque: item.estoque || 0,
                url_loja_origem: item.url_loja_origem || '',
                merchant_id: merchant_id
              }
            });
          });
          resultados.atualizados++;
        }
      } catch (error) {
        request.log.error(`Erro SKU ${item.sku_woocommerce}`);
        resultados.falhas++;
      }
    }
    return { status: 'success', resultados };
  });
}
