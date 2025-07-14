import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

db.connect((err: any) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err.message);
    process.exit(1); // Arrêter l'application si la connexion échoue
  } else {
    console.log('✅ Connecté à la base de données MySQL');
  }
});

// Gestion des erreurs de connexion
db.on('error', (err: any) => {
  console.error('Erreur de base de données:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Connexion à la base de données fermée. Tentative de reconnexion...');
    // Ici vous pourriez ajouter une logique de reconnexion
  }
});

// Fermeture propre de la connexion
process.on('SIGINT', () => {
  console.log('Fermeture de la connexion à la base de données...');
  db.end(() => {
    console.log('Connexion fermée.');
    process.exit(0);
  });
});

// Supprimez cette partie car elle doit être dans le middleware
// Types pour l'authentification
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId?: number;
        email?: string;
        role?: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {};