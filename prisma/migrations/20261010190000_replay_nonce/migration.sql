CREATE TABLE "ReplayNonce" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL
);
CREATE INDEX "ReplayNonce_expiresAt_idx" ON "ReplayNonce"("expiresAt");
