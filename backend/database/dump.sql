-- Dump MySQL simulé d'après les tables fournies
-- Base de données : fullstack_db

CREATE DATABASE IF NOT EXISTS fullstack_db;
USE fullstack_db;

-- Table : users
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table : DROP TABLE IF EXISTS joueurs;

CREATE TABLE joueurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) DEFAULT NULL,
  biography TEXT DEFAULT NULL,
  statistics TEXT DEFAULT NULL,
  posteId INT DEFAULT NULL,
  country VARCHAR(100) DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  fifa_points INT DEFAULT NULL,
  age INT DEFAULT NULL,
  club VARCHAR(100) DEFAULT NULL,
  nationalite VARCHAR(100) DEFAULT NULL,
  buts INT NOT NULL DEFAULT 0,
  passes INT NOT NULL DEFAULT 0,
  cartons_jaunes INT NOT NULL DEFAULT 0,
  cartons_rouges INT NOT NULL DEFAULT 0,
  trophees_majeurs TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Création table positions si elle n'existe pas
CREATE TABLE IF NOT EXISTS positions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Mise à jour des noms des postes
UPDATE positions SET name = 'gardiens' WHERE id = 1;
UPDATE positions SET name = 'defenseursCentraux' WHERE id = 2;
UPDATE positions SET name = 'defenseursDroits' WHERE id = 3;
UPDATE positions SET name = 'defenseursGauches' WHERE id = 4;
UPDATE positions SET name = 'milieuxDefensifs' WHERE id = 5;
UPDATE positions SET name = 'milieuxRelayeurs' WHERE id = 6;
UPDATE positions SET name = 'milieuxOffensifs' WHERE id = 7;
UPDATE positions SET name = 'ailiersDroits' WHERE id = 8;
UPDATE positions SET name = 'ailiersGauches' WHERE id = 9;
UPDATE positions SET name = 'attaquantsDeSoutien' WHERE id = 10;
UPDATE positions SET name = 'buteurs' WHERE id = 11;


-- Table : ideal_team
CREATE TABLE IF NOT EXISTS ideal_team (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  player_id INT,
  position VARCHAR(10),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Exemple de données (facultatif)
INSERT INTO users (email, username, password, role) VALUES
('admin@example.com', 'admin', '$2b$10$hashedpassword', 'admin');

INSERT INTO positions (name) VALUES
('GK'), ('DEF'), ('MID'), ('FWD');

INSERT INTO players (name, position, rating, age, club, nationalite) VALUES
('Lionel Messi', 'FWD', 94.5, 36, 'Inter Miami', 'Argentine'),
('Kevin De Bruyne', 'MID', 91.2, 33, 'Manchester City', 'Belgique');


