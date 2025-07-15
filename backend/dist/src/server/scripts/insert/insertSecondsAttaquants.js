"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/insert/insertSecondsAttaquants.ts
const { db } = require('../../config/db');
// Update the import path below to the correct location of secondsAttaquants
// Example: import { secondsAttaquants } from '../../../../shared/data/secondsAttaquants';
const secondsAttaquants_1 = require("../../../../shared/data/secondsAttaquants");
const insertSecondsAttaquants = () => {
    secondsAttaquants_1.secondsAttaquants.forEach((player) => {
        const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, position_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ATT', 11)
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
                console.error(`❌ Erreur second attaquant ${player.name}:`, err);
            }
            else {
                console.log(`✅ Second attaquant inséré : ${player.name}`);
            }
        });
    });
};
insertSecondsAttaquants();
