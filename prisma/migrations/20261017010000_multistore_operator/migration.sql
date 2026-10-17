ALTER TABLE "Merchant" ADD COLUMN "tenantId" TEXT;
CREATE INDEX "Merchant_tenantId_idx" ON "Merchant"("tenantId");

-- Bind only unambiguous existing merchants. Conflicting legacy data remains
-- unbound and fails closed until reviewed; never guess the owner of a store.
UPDATE "Merchant" SET "tenantId" = (
  SELECT MIN("tenantId") FROM "Integration" WHERE "merchantId" = "Merchant"."id"
)
WHERE (SELECT COUNT(DISTINCT "tenantId") FROM "Integration" WHERE "merchantId" = "Merchant"."id") = 1
AND NOT EXISTS (
  SELECT 1 FROM "ConnectionCode" AS c
  WHERE c."merchantId" = "Merchant"."id" AND c."tenantId" != (
    SELECT MIN("tenantId") FROM "Integration" WHERE "merchantId" = "Merchant"."id"
  )
);

DROP INDEX "Product_sku_woocommerce_key";
CREATE UNIQUE INDEX "Product_merchant_id_sku_woocommerce_key" ON "Product"("merchant_id", "sku_woocommerce");

CREATE TABLE "Operator" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "displayName" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "revokedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Operator_tokenHash_key" ON "Operator"("tokenHash");
CREATE TABLE "OperatorGrant" (
  "operatorId" TEXT NOT NULL,
  "merchantId" INTEGER NOT NULL,
  "role" TEXT NOT NULL CHECK ("role" IN ('reader', 'writer')),
  PRIMARY KEY ("operatorId", "merchantId"),
  CONSTRAINT "OperatorGrant_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OperatorGrant_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "OperatorGrant_merchantId_idx" ON "OperatorGrant"("merchantId");
