-- CreateTable
CREATE TABLE "Merchant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "consumer_key" TEXT NOT NULL,
    "consumer_secretHash" TEXT NOT NULL,
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sku_woocommerce" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "url_loja_origem" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "data_criacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" DATETIME NOT NULL,
    "merchant_id" INTEGER NOT NULL,
    CONSTRAINT "Product_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_woocommerce_key" ON "Product"("sku_woocommerce");
