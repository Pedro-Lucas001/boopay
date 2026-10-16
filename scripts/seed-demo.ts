import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function main() {
try {
  const merchant = await db.merchant.upsert({ where: { email: 'demo@example.invalid' }, update: {},
    create: { nome: 'Loja demonstração', razao_social: 'Dados sintéticos', email: 'demo@example.invalid',
      consumer_key: 'unused-demo', consumer_secretHash: 'unused-demo' } });
  console.log(JSON.stringify({ merchant_id: merchant.id, note: 'Use este ID ao emitir código; nenhum segredo foi gerado.' }));
} finally { await db.$disconnect(); }

}
main().catch(() => { console.error("Falha ao preparar fixture; confira DATABASE_URL e migra��es."); process.exitCode = 1; });
