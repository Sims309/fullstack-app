import { db } from '../../config/db';
import { joueursParPoste, Player } from '../../../../shared/types/Defender';

// Mappage poste ↔ code court + ID
const positions: { [key: string]: { label: string; id: number } } = {
  gardiens: { label: 'GK', id: 1 },
  defenseursCentraux: { label: 'DEF', id: 2 },
  arrieresGauche: { label: 'DEF', id: 3 },
  arrieresDroits: { label: 'DEF', id: 4 },
  milieuxDefensifs: { label: 'MID', id: 5 },
  milieuxCentraux: { label: 'MID', id: 6 },
  milieuxOffensifs: { label: 'MID', id: 7 },
  ailiersGauche: { label: 'ATT', id: 8 },
  ailiersDroits: { label: 'ATT', id: 9 },
  attaquants: { label: 'ATT', id: 10 },
  secondsAttaquants: { label: 'ATT', id: 11 },
};

// Fonction générique d’insertion
const insertPlayers = (players: Player[], positionLabel: string, positionId: number) => {
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

    db.query(sql, values, (err) => {
      if (err) {
        console.error(`❌ Erreur pour ${player.name} (${positionLabel}) :`, err);
      } else {
        console.log(`✅ Joueur inséré : ${player.name} (${positionLabel})`);
      }
    });
  });
};

// Boucle sur tous les postes
Object.entries(joueursParPoste).forEach(([poste, joueurs]) => {
  const positionInfo = positions[poste];
  if (!positionInfo) {
    console.warn(`⚠️ Poste non reconnu : ${poste}`);
    return;
  }
  insertPlayers(Player, positionInfo.label, positionInfo.id);
});
