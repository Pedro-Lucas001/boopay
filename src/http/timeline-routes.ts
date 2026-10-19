import { FastifyInstance } from 'fastify';
import { getProfileTimeline } from '../services/profile-timeline';

export async function timelineRoutes(app: FastifyInstance, options: { db: any }) {
  const db = options.db;

  app.get('/v1/profile/timeline', async (request: any, reply: any) => {
    try {
      const integrationId = request.boopayIntegration?.id;

      if (!integrationId) {
        return reply.status(401).send({ status: 'error', message: 'Integração não autenticada.' });
      }

      const data = await getProfileTimeline(db, integrationId);

      return {
        status: 'success',
        data,
      };
    } catch (error: any) {
      reply.status(500);
      return { status: 'error', message: 'Falha ao gerar projeção de perfil e linha do tempo.', details: error.message };
    }
  });
}