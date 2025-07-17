// src/index.ts
import dotenv from 'dotenv';
import app from './server/server';
import { db } from './db';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '5000', 10);

// ✅ Vérifier la connexion à MySQL AVANT de démarrer le serveur
async function startServer() {
  try {
    await db.getConnection(); // Essaie d’obtenir une connexion
    console.log('✅ Connexion à MySQL réussie');

    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Échec de connexion à MySQL:', error);
    process.exit(1); // Quitte le processus si la BDD est inaccessible
  }
}

startServer();
