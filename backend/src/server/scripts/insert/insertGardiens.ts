import { db } from "../../../db";
import { joueursParPoste } from "@shared/types/Defender";
import { Player } from "@shared/types/Player";

const insertGardiens = () => {
  const { gardiens } = joueursParPoste; // ✅ on récupère gardiens ici

  gardiens.forEach((player: Player) => {
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

    db.query(sql, values, (err: Error | null) => {
      if (err) {
        console.error(`❌ Erreur gardien ${player.name}:`, err.message);
      } else {
        console.log(`✅ Gardien inséré : ${player.name}`);
      }
    });
  });
};

insertGardiens();
