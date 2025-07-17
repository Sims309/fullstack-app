"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../../db");
const joueurs_1 = require("@shared/types/joueurs");
const insertGardiens = () => {
    if (!joueurs_1.gardiens || joueurs_1.gardiens.length === 0) {
        console.log("⚠️ Aucun gardien trouvé à insérer");
        return;
    }
    joueurs_1.gardiens.forEach((player) => {
        if (!player.id || !player.name) {
            console.error(`❌ Données manquantes pour le joueur:`, player);
            return;
        }
        const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, posteId
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'GK', ?)
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
            player.posteId || 1 // posteId = 1 pour les gardiens
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
try {
    insertGardiens();
}
catch (error) {
    console.error("❌ Erreur lors de l'exécution de insertGardiens:", error);
}
