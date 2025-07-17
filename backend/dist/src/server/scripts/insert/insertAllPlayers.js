"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../../db"); // ✅ chemin corrigé
const joueurs_1 = require("@shared/types/joueurs"); // ✅ chemin partagé
const positions = {
    gardiens: { label: 'GK', id: 1 },
    defenseursCentraux: { label: 'DEF', id: 2 },
    defenseursGauches: { label: 'DEF', id: 3 },
    defenseursDroits: { label: 'DEF', id: 4 },
    milieuxDefensifs: { label: 'MID', id: 5 },
    milieuxRelayeurs: { label: 'MID', id: 6 },
    milieuxOffensifs: { label: 'MID', id: 7 },
    ailiersGauches: { label: 'ATT', id: 8 },
    ailiersDroits: { label: 'ATT', id: 9 },
    attaquantsDeSoutien: { label: 'ATT', id: 10 },
    buteurs: { label: 'ATT', id: 11 },
};
const insertPlayers = (players, positionLabel, positionId) => {
    players.forEach((player) => {
        const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, position_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const values = [
            player.id,
            player.name,
            player.country,
            player.image,
            player.fifa_points,
            player.biography,
            player.statistics,
            player.trophees_majeurs,
            player.age,
            player.club,
            player.nationalite,
            player.buts,
            player.passes,
            player.cartons_jaunes,
            player.cartons_rouges,
            positionLabel,
            positionId,
        ];
        db_1.db.query(sql, values, (err) => {
            if (err instanceof Error) {
                console.error(`❌ Erreur pour ${player.name} (${positionLabel}) :`, err.message);
            }
            else {
                console.log(`✅ Joueur inséré : ${player.name} (${positionLabel})`);
            }
        });
    });
};
Object.entries(joueurs_1.joueursParPoste).forEach(([poste, joueurs]) => {
    const positionInfo = positions[poste];
    if (!positionInfo) {
        console.warn(`⚠️ Poste non reconnu : ${poste}`);
        return;
    }
    insertPlayers(joueurs, positionInfo.label, positionInfo.id);
});
