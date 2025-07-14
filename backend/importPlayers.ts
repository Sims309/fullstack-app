const mysql = require('mysql2');
const fs = require('fs');

// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'renaissance',
  password: 'motdepasse123',
  database: 'fullstack_db'
});

// Charger le fichier JSON
const rawData = fs.readFileSync('players.json', 'utf8');
const players = JSON.parse(rawData);

// Insérer les joueurs
players.forEach(player => {
  const { name, position, rating, image_url, biography, statistics } = player;
  db.query(
    'INSERT INTO players (name, position, rating, image_url, biography, statistics) VALUES (?, ?, ?, ?, ?, ?)',
    [name, position, rating, image_url, biography, statistics],
    (err) => {
      if (err) console.error(`❌ Erreur pour ${name} :`, err.message);
      else console.log(`✔️ ${name} ajouté à la base.`);
    }
  );
});
