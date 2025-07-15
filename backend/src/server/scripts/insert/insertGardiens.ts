import { db } from '../../../db';
import { gardiens, type Joueur } from '@shared/types/joueurs';

const insertGardiens = (): void => {
  if (!gardiens || gardiens.length === 0) {
    console.log("⚠️ Aucun gardien trouvé à insérer");
    return;
  }

  gardiens.forEach((player: Joueur) => {
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

    db.query(sql, values, (err: Error | null) => {
      if (err) {
        console.error(`❌ Erreur lors de l'insertion du gardien ${player.name}:`, err.message);
      } else {
        console.log(`✅ Gardien inséré avec succès : ${player.name}`);
      }
    });
  });
};

try {
  insertGardiens();
} catch (error) {
  console.error("❌ Erreur lors de l'exécution de insertGardiens:", error);
}
