import { FastifyInstance } from 'fastify';
import { updateOperationalState } from '../services/operational-state';

export async function operationalRoutes(app: FastifyInstance) {
  app.post('/v1/admin/operational/state', async (request: any, reply: any) => {
    try {
      const { storeId, ...stateData } = request.body;

      if (!storeId) {
        return reply.status(400).send({ status: 'error', message: 'O identificador storeId é obrigatório.' });
      }

      const result = await updateOperationalState(storeId, stateData);

      return {
        status: 'success',
        message: 'Estado operacional atualizado com sucesso no Firestore.',
        data: result,
      };
    } catch (error: any) {
      reply.status(500);
      return { status: 'error', message: 'Falha ao sincronizar o estado operacional.', details: error.message };
    }
  });
}