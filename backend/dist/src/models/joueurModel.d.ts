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
export declare function mapSqlRowToJoueur(row: any): Joueur;
/**
 * Exemple : calculer le total de cartons d'un joueur
 */
export declare function totalCartons(joueur: Joueur): number;
/**
 * Vérifie si un joueur est majeur (age >= 18)
 */
export declare function estMajeur(joueur: Joueur): boolean;
