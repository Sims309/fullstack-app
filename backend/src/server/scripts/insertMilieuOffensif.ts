// scripts/insert/insertMilieuxOffensifs.ts

import { db } from '../../db';
import { milieuxOffensifs } from '../../shared/types/Defender';

const insertMilieuxOffensifs = () => {
  milieuxOffensifs.forEach((player) => {
    const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, position_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'MID', 2)
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
        console.error(`❌ Erreur pour ${player.name}:`, err);
      } else {
        console.log(`✅ Milieu offensif inséré : ${player.name}`);
      }
    });
  });
};

insertMilieuxOffensifs();