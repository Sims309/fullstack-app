"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSqlRowToJoueur = mapSqlRowToJoueur;
exports.totalCartons = totalCartons;
exports.estMajeur = estMajeur;
function mapSqlRowToJoueur(row) {
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
function totalCartons(joueur) {
    const jaunes = joueur.statistiques?.cartonsJaunes ?? 0;
    const rouges = joueur.statistiques?.cartonsRouges ?? 0;
    return jaunes + rouges;
}
/**
 * Vérifie si un joueur est majeur (age >= 18)
 */
function estMajeur(joueur) {
    if (!joueur.age)
        return false;
    return joueur.age >= 18;
}
