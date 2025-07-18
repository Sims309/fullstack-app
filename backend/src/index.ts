import dotenv from 'dotenv';
import { app } from './server'; // <-- CORRECT
import { db } from './db';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    await db.getConnection();
    console.log('✅ Connexion à MySQL réussie');

    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Échec de connexion à MySQL:', error);
    process.exit(1);
  }
}

startServer();
