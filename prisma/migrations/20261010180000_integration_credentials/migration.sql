CREATE TABLE "ConnectionCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeHash" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConnectionCode_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ConnectionCode_codeHash_key" ON "ConnectionCode"("codeHash");
CREATE INDEX "ConnectionCode_expiresAt_idx" ON "ConnectionCode"("expiresAt");
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "storeUrl" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "encryptedSecret" TEXT NOT NULL,
    "revokedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Integration_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Integration_tokenHash_key" ON "Integration"("tokenHash");
CREATE INDEX "Integration_tenantId_merchantId_idx" ON "Integration"("tenantId", "merchantId");
