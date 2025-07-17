// src/index.ts
import dotenv from 'dotenv';
import app from './server/server';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
