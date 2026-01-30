-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_credit_card_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "installments" INTEGER NOT NULL DEFAULT 1,
    "currentInstallment" INTEGER NOT NULL DEFAULT 1,
    "categoryId" TEXT,
    "creditCardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "credit_card_transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "credit_card_transactions_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "credit_cards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_credit_card_transactions" ("amount", "createdAt", "creditCardId", "currentInstallment", "date", "description", "id", "installments", "updatedAt") SELECT "amount", "createdAt", "creditCardId", "currentInstallment", "date", "description", "id", "installments", "updatedAt" FROM "credit_card_transactions";
DROP TABLE "credit_card_transactions";
ALTER TABLE "new_credit_card_transactions" RENAME TO "credit_card_transactions";
CREATE INDEX "credit_card_transactions_creditCardId_idx" ON "credit_card_transactions"("creditCardId");
CREATE INDEX "credit_card_transactions_categoryId_idx" ON "credit_card_transactions"("categoryId");
CREATE TABLE "new_financial_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "financial_movements_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "financial_movements_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_financial_movements" ("accountId", "amount", "createdAt", "date", "description", "id", "type", "updatedAt") SELECT "accountId", "amount", "createdAt", "date", "description", "id", "type", "updatedAt" FROM "financial_movements";
DROP TABLE "financial_movements";
ALTER TABLE "new_financial_movements" RENAME TO "financial_movements";
CREATE INDEX "financial_movements_accountId_idx" ON "financial_movements"("accountId");
CREATE INDEX "financial_movements_categoryId_idx" ON "financial_movements"("categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
