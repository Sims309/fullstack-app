require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log('Connecté à MySQL');

  const createPositions = `
    CREATE TABLE IF NOT EXISTS positions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    );
  `;

  const createPlayers = `
    CREATE TABLE IF NOT EXISTS players (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      position_id INT,
      FOREIGN KEY (position_id) REFERENCES positions(id)
    );
  `;

  db.query(createPositions, (err) => {
    if (err) throw err;
    console.log('Table positions créée ou existe déjà');

    db.query(createPlayers, (err) => {
      if (err) throw err;
      console.log('Table players créée ou existe déjà');
      db.end();
    });
  });
});
