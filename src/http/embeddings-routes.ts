import { FastifyInstance } from 'fastify';
import { searchCatalogWithEmbeddings } from '../services/embeddings-search';

export async function embeddingsRoutes(app: FastifyInstance, options: { db: any }) {
  const db = options.db;

  app.post('/v1/catalog/search', async (request: any, reply: any) => {
    try {
      const integrationId = request.boopayIntegration?.id;
      const { query } = request.body || {};

      if (!integrationId) {
        return reply.status(401).send({ status: 'error', message: 'Integração não autenticada.' });
      }

      if (!query) {
        return reply.status(400).send({ status: 'error', message: 'O campo query é obrigatório.' });
      }

      const data = await searchCatalogWithEmbeddings(db, query, integrationId);

      return {
        status: 'success',
        data,
      };
    } catch (error: any) {
      reply.status(500);
      return { status: 'error', message: 'Falha na recuperação inteligente do catálogo.', details: error.message };
    }
  });
}