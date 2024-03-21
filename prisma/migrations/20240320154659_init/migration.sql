-- CreateTable
CREATE TABLE "Spellbook" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Spell" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "spellbookId" INTEGER NOT NULL,
    CONSTRAINT "Spell_spellbookId_fkey" FOREIGN KEY ("spellbookId") REFERENCES "Spellbook" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Spellbook_title_key" ON "Spellbook"("title");
