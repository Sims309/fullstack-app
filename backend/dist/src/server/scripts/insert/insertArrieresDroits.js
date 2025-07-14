"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/insert/insertArrieresDroits.ts
const { db } = require('../../config/db');
const Defender_1 = require("../../../../shared/types/Defender");
const insertArrieresDroits = () => {
    Defender_1.arrieresDroits.forEach((player) => {
        const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, position_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DEF', 4)
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
        ];
        db.query(sql, values, (err) => {
            if (err) {
                console.error(`❌ Erreur arrière droit ${player.name}:`, err);
            }
            else {
                console.log(`✅ Arrière droit inséré : ${player.name}`);
            }
        });
    });
};
insertArrieresDroits();
