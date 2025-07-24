-- CreateTable
CREATE TABLE "Joueur" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "poste" INTEGER NOT NULL,
    "rating" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "EquipeIdeal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "joueurId" TEXT NOT NULL,
    "poste" INTEGER NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EquipeIdeal_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "Joueur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
