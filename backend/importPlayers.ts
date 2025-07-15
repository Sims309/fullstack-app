import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import type { Joueur } from '@shared/types/joueurs';

// Connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'renaissance',
  password: 'motdepasse123',
  database: 'fullstack_db'
});

// Charger le fichier JSON
const filePath = path.join(__dirname, 'players.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const players: Joueur[] = JSON.parse(rawData);

// Requête SQL avec tous les champs nécessaires
const insertSQL = `
  REPLACE INTO players (
    id, name, country, image, fifa_points, biography, statistics, trophees_majeurs,
    age, club, nationalite, buts, passes, cartons_jaunes, cartons_rouges,
    position, position_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

players.forEach((player) => {
  if (!player.name || !player.id) {
    console.warn(`⚠️ Joueur invalide (id ou nom manquant) :`, player);
    return;
  }

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
    // Ces deux derniers sont arbitraires ici – à adapter selon ta logique
    'UNKNOWN', // position string (ex: 'CB', 'ST'...) – tu peux le déduire si ton JSON a la valeur
    player.posteId || 0 // posteId – utile si tu as cette info dans le JSON
  ];

  db.query(insertSQL, values, (err) => {
    if (err) {
      console.error(`❌ Erreur pour ${player.name} :`, err.message);
    } else {
      console.log(`✅ ${player.name} inséré avec succès.`);
    }
  });
});
