CREATE TABLE "CatalogItem" (
 "id" TEXT NOT NULL PRIMARY KEY, "integrationId" TEXT NOT NULL,
 "sourceId" INTEGER NOT NULL, "revision" BIGINT NOT NULL,
 "deleted" BOOLEAN NOT NULL DEFAULT false, "snapshot" TEXT NOT NULL,
 "updatedAt" DATETIME NOT NULL,
 FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CatalogItem_integrationId_sourceId_key" ON "CatalogItem"("integrationId", "sourceId");
CREATE TABLE "CatalogReceipt" (
 "id" TEXT NOT NULL PRIMARY KEY, "integrationId" TEXT NOT NULL, "eventId" TEXT NOT NULL,
 "payloadHash" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CatalogReceipt_integrationId_eventId_key" ON "CatalogReceipt"("integrationId", "eventId");
CREATE TABLE "StoreEvent" (
 "id" TEXT NOT NULL PRIMARY KEY, "integrationId" TEXT NOT NULL, "eventId" TEXT NOT NULL,
 "payloadHash" TEXT NOT NULL, "kind" TEXT NOT NULL, "sessionHash" TEXT NOT NULL,
 "productId" INTEGER, "occurredAt" DATETIME NOT NULL, "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "StoreEvent_integrationId_eventId_key" ON "StoreEvent"("integrationId", "eventId");
