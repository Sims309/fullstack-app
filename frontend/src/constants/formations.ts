// src/constants/formations.ts
export type Formation = {
  name: string;
  positions: number[][];
  // positions = tableau de lignes, chaque ligne contient un tableau de posteId à afficher
};

// Exemple avec des postesId hypothétiques (adaptés à ton modèle)
export const FORMATIONS: Formation[] = [
  {
    name: '4-4-2',
    positions: [
      [1],                // Gardien (posteId 1)
      [2, 3, 4, 5],       // Défenseurs (posteId 2 à 5)
      [6, 7, 8, 9],       // Milieux (posteId 6 à 9)
      [10, 11],           // Attaquants (posteId 10 et 11)
    ],
  },
  {
    name: '4-3-3',
    positions: [
      [1],
      [2, 3, 4, 5],
      [6, 7, 8],
      [9, 10, 11],
    ],
  },
  // Ajoute les autres formations ici...
];
