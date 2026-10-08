import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function boopayRoutes(app: FastifyInstance) {
  
  // Endpoint de Saúde mapeado na documentação da API
  app.get('/health', async () => {
    return { status: 'ok', api: 'Boopay API', time: new Date() };
  });

  // [RB-005] Contrato Zod para validação do payload enviado pelo plugin
  const syncCatalogSchema = z.object({
    merchant_id: z.number(),
    items: z.array(z.object({
      action: z.enum(['upsert', 'delete']), 
      sku_woocommerce: z.string(),
      nome: z.string().optional(),
      preco: z.coerce.number().optional(),
      estoque: z.number().optional(),
      url_loja_origem: z.string().url().optional()
    }))
  });

  // [RB-015] Rota de atualizações e exclusões incrementais (POST /v1/admin/catalog/sync)
  app.post('/v1/admin/catalog/sync', async (request, reply) => {
    const { merchant_id, items } = syncCatalogSchema.parse(request.body);
    const resultados = { atualizados: 0, excluidos: 0, falhas: 0 };

    for (const item of items) {
      try {
        if (item.action === 'delete') {
          // Exclusão incremental: apenas inativa o produto
          await prisma.product.update({
            where: { sku_woocommerce: item.sku_woocommerce },
            data: { status: 'inativo' }
          });
          resultados.excluidos++;
        } else if (item.action === 'upsert') {
          // Atualização incremental: cria se não existe, atualiza se já existe
          await prisma.product.upsert({
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