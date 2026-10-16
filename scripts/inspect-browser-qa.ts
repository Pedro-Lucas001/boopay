import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
async function main() {
  const meta=JSON.parse(readFileSync('.test-artifacts/browser-current.json','utf8'));
  const db=new PrismaClient({datasources:{db:{url:'file:'+meta.api.replaceAll('\\','/')}}});
  try { console.log(JSON.stringify({events:await db.storeEvent.count(),types:await db.storeEvent.groupBy({by:['kind'],_count:true}),
    items:await db.storeEvent.findMany({select:{kind:true,productId:true,receivedAt:true},orderBy:{receivedAt:'asc'}}),
    revoked:await db.integration.count({where:{revokedAt:{not:null}}})},null,2)); }
  finally { await db.$disconnect(); }
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
