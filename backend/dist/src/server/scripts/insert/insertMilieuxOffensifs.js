"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/insert/insertMilieuxOffensifs.ts
const { db } = require('../../config/db');
const Defender_1 = require("../../../../shared/types/Defender");
const insertMilieuxOffensifs = () => {
    Defender_1.milieuxOffensifs.forEach((player) => {
        const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, position_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'MID', 7)
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
                console.error(`❌ Erreur milieu offensif ${player.name}:`, err);
            }
            else {
                console.log(`✅ Milieu offensif inséré : ${player.name}`);
            }
        });
    });
};
insertMilieuxOffensifs();
