import { z } from 'zod';

// Extração sem alterar o contrato RB-005 existente.
export const syncCatalogSchema = z.object({
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
