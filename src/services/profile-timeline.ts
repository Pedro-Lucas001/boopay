import { PrismaClient } from '@prisma/client';

export async function getProfileTimeline(db: PrismaClient, integrationId: string) {

  const events = await db.storeEvent.findMany({
    where: { integrationId },
    orderBy: { occurredAt: 'desc' },
    take: 20,
  });

  const totalEvents = events.length;
  const lastActivity = events.length > 0 ? events[0].occurredAt : null;

  return {
    profileProjection: {
      integrationId,
      totalInteractions: totalEvents,
      lastActiveAt: lastActivity,
      status: totalEvents > 0 ? 'ativo' : 'inativo',
    },
    timeline: events.map(event => ({
      eventId: event.eventId,
      kind: event.kind,
      productId: event.productId,
      occurredAt: event.occurredAt,
    })),
  };
}