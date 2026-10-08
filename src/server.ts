// src/server.ts
import Fastify from 'fastify';
import { boopayRoutes } from './http/routes';

const app = Fastify({ logger: true });

app.register(boopayRoutes);

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🚀 Boopay API rodando em http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();