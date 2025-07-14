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

-- Table : players
CREATE TABLE IF NOT EXISTS players (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  position VARCHAR(10),
  rating FLOAT,
  image_url TEXT,
  biography TEXT,
  statistics TEXT,
  position_id INT,
  country VARCHAR(100),
  image VARCHAR(255),
  fifa_points INT,
  age INT,
  club VARCHAR(100),
  nationalite VARCHAR(100),
  trophees_majeurs TEXT
);

-- Table : positions
CREATE TABLE IF NOT EXISTS positions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

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
