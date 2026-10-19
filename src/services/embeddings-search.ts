import { PrismaClient } from '@prisma/client';

export async function searchCatalogWithEmbeddings(db: PrismaClient, queryText: string, integrationId: string) {

  const items = await db.catalogItem.findMany({
    where: {
      integrationId,
      deleted: false,
    },
    take: 10,
  });

  const results = items.filter(item => {
    const snapshot = JSON.parse(item.snapshot || '{}');
    const text = (snapshot.title || snapshot.name || '').toLowerCase();
    return text.includes(queryText.toLowerCase());
  });

  return {
    query: queryText,
    matches: results.map(item => ({
      sourceId: item.sourceId,
      revision: item.revision.toString(),
      snapshot: JSON.parse(item.snapshot || '{}'),
    })),
  };
}