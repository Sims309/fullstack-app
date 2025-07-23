// src/scripts/insertAllPlayers.ts
import { db } from '../../../db';
import { joueursParPoste, Joueur } from '@shared/joueurs';

const positions: { [key: string]: { label: string; id: number } } = {
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

// 🔁 Fonction asynchrone pour insérer les joueurs
const insertPlayers = async (
  players: Joueur[],
  positionLabel: string,
  positionId: number
) => {
  for (const player of players) {
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
      positionLabel,
      positionId,
    ];

    try {
      await db.query(sql, values);
      console.log(`✅ Joueur inséré : ${player.name} (${positionLabel})`);
    } catch (err) {
      console.error(`❌ Erreur pour ${player.name} (${positionLabel}) :`, (err as Error).message);
    }
  }
};

// 🚀 Fonction principale d’insertion globale
const run = async () => {
  for (const [poste, joueurs] of Object.entries(joueursParPoste)) {
    const positionInfo = positions[poste];
    if (!positionInfo) {
      console.warn(`⚠️ Poste non reconnu : ${poste}`);
      continue;
    }

    await insertPlayers(joueurs, positionInfo.label, positionInfo.id);
  }
};

run().catch((err) => {
  console.error('❌ Erreur globale dans insertAllPlayers:', err);
});
