import { PrismaClient } from '@prisma/client';
import { buildApp } from './app';

const db = new PrismaClient();
const { app } = buildApp({ db, credentialKey: process.env.BOOPAY_CREDENTIAL_KEY || '',
  adminToken: process.env.BOOPAY_ADMIN_TOKEN || '', logger: true });
app.addHook('onClose', async () => { await db.$disconnect(); });

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '127.0.0.1' });
    console.log('🚀 Boopay API rodando em http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
