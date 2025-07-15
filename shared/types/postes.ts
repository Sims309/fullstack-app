export interface Poste {
  id: number;
  nom: string;
}

export const postes: Poste[] = [
  { id: 1, nom: 'gardiens' },
  { id: 2, nom: 'defenseursCentraux' },
  { id: 3, nom: 'defenseursGauches' },
  { id: 4, nom: 'defenseursDroits' },
  { id: 5, nom: 'milieuxDefensifs' },
  { id: 6, nom: 'milieuxRelayeurs' },
  { id: 7, nom: 'milieuxOffensifs' },
  { id: 8, nom: 'ailiersGauches' },
  { id: 9, nom: 'ailiersDroits' },
  { id: 10, nom: 'attaquantsDeSoutien' },
  { id: 11, nom: 'buteurs' },
];
