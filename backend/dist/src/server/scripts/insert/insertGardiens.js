"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../../db");
const Defender_1 = require("../../../../../shared/types/Defender");
// If Player is not exported from there, create or export it accordingly.
// If the file is named differently, update accordingly.
const insertGardiens = () => {
    const { gardiens } = Defender_1.joueursParPoste;
    if (!gardiens || gardiens.length === 0) {
        console.log("⚠️ Aucun gardien trouvé à insérer");
        return;
    }
    gardiens.forEach((player) => {
        // Validation des données obligatoires
        if (!player.id || !player.name) {
            console.error(`❌ Données manquantes pour le joueur:`, player);
            return;
        }
        const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, position_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'GK', 1)
    `;
        const values = [
            player.id,
            player.name,
            player.country || null,
            player.image || null,
            player.fifa_points || 0,
            player.biography || null,
            player.statistics || null,
            player.trophees_majeurs || null,
            player.age || null,
            player.club || null,
            player.nationalite || null,
            player.buts || 0,
            player.passes || 0,
            player.cartons_jaunes || 0,
            player.cartons_rouges || 0,
        ];
        db_1.db.query(sql, values, (err) => {
            if (err) {
                console.error(`❌ Erreur lors de l'insertion du gardien ${player.name}:`, err.message);
            }
            else {
                console.log(`✅ Gardien inséré avec succès : ${player.name}`);
            }
        });
    });
};
// Gestion des erreurs globales
try {
    insertGardiens();
}
catch (error) {
    console.error("❌ Erreur lors de l'exécution de insertGardiens:", error);
}
