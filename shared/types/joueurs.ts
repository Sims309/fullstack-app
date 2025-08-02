// shared/types/joueurs.ts

// Interface principale pour tous les joueurs
export interface Joueur {
  posteId: number;
  id: number;
  name: string;
  country: string;
  image: string;
  fifa_points: number;
  biography: string;
  statistics: string;
  trophees_majeurs: string;
  age: number;
  club: string;
  nationalite: string;
  buts: number;
  passes: number;
  cartons_jaunes: number;
  cartons_rouges: number;
  youtubeUrl?: string;
}

// Fonction de mapping SQL → Joueur
export function mapSqlRowToJoueur(row: any): Joueur {
  return {
    posteId: row.posteId ?? row.poste_id ?? 0,
    id: row.id,
    name: row.name,
    country: row.country,
    image: row.image,
    fifa_points: row.fifa_points,
    biography: row.biography,
    statistics: row.statistics,
    trophees_majeurs: row.trophees_majeurs,
    age: row.age,
    club: row.club,
    nationalite: row.nationalite,
    buts: row.buts,
    passes: row.passes,
    cartons_jaunes: row.cartons_jaunes,
    cartons_rouges: row.cartons_rouges,
  };
}

// ✅ Importation de tous les groupes de joueurs
import { gardiens } from './gardiens';
import { defenseursCentraux } from './defenseursCentraux';
import { defenseursGauches } from './defenseursGauches';
import { defenseursDroits } from './defenseursDroits';
import { milieuxDefensifs } from './milieuxDefensifs';
import { milieuxRelayeurs } from './milieuxRelayeurs'; // ✅ corrigé et ajouté
import { milieuxOffensifs } from './milieuxOffensifs';
import { ailiersGauches } from './ailiersGauches';
import { ailiersDroits } from './ailiersDroits';
import { attaquantsDeSoutien } from './attaquantsDeSoutien';
import { buteurs } from './buteurs';

// ✅ Regroupement par poste (facultatif mais très utile)
export const joueursParPoste: Record<string, Joueur[]> = {
  gardiens,
  defenseursCentraux,
  defenseursGauches,
  defenseursDroits,
  milieuxDefensifs,
  milieuxRelayeurs,
  milieuxOffensifs,
  ailiersGauches,
  ailiersDroits,
  attaquantsDeSoutien,
  buteurs,
};

// ✅ Exports disponibles pour les autres modules
export {
  gardiens,
  defenseursCentraux,
  defenseursGauches,
  defenseursDroits,
  milieuxDefensifs,
  milieuxRelayeurs,
  milieuxOffensifs,
  ailiersGauches,
  ailiersDroits,
  attaquantsDeSoutien,
  buteurs
};
