// scripts/insert/insertAiliersGauche.ts
const { db } = require('../../config/db');
import { ailiersGauche } from '../../../../shared/types/Defender';

const insertAiliersGauche = () => {
  ailiersGauche.forEach((player) => {
    const sql = `
      REPLACE INTO players (
        id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
        age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges, position, position_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ATT', 8)
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
        console.error(`❌ Erreur ailier gauche ${player.name}:`, err);
      } else {
        console.log(`✅ Ailier gauche inséré : ${player.name}`);
      }
    });
  });
};

insertAiliersGauche();
