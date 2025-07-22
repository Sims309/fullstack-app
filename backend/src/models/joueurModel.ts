export interface Joueur {
  id: number;
  nom: string;
  image: string;
  pays: string;
  pointsFIFA: number;
  biographie?: string;
  tropheesMajeurs?: string;
  statistiques?: {
    matchs: number;
    buts: number;
    passes: number;
    cartonsJaunes?: number;
    cartonsRouges?: number;
  };
  age?: number;
  club?: string;
  nationalite?: string;
  imageUrl?: string;
}

export function mapSqlRowToJoueur(row: any): Joueur {
  return {
    id: row.id,
    nom: row.name,
    pays: row.country,
    pointsFIFA: row.fifa_points,
    biographie: row.biography,
    tropheesMajeurs: row.trophees_majeurs,
    image: row.image_url,
    age: row.age,
    club: row.club,
    nationalite: row.nationalite,
    imageUrl: row.image_url,
    statistiques: row.statistics ? JSON.parse(row.statistics) : undefined,
  };
}
/**
 * Exemple : calculer le total de cartons d'un joueur
 */
export function totalCartons(joueur: Joueur): number {
  const jaunes = joueur.statistiques?.cartonsJaunes ?? 0;
  const rouges = joueur.statistiques?.cartonsRouges ?? 0;
  return jaunes + rouges;
}

/**
 * Vérifie si un joueur est majeur (age >= 18)
 */
export function estMajeur(joueur: Joueur): boolean {
  if (!joueur.age) return false;
  return joueur.age >= 18;
}
