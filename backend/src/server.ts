// src/server/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRoutes from './server/routes/authRoutes';
import playersRoutes from './server/routes/playersRoutes';
import joueurRoutes from './server/routes/joueurRoutes';
import protectedRoutes from './server/routes/protectedRoutes';
import equipeIdealRoutes from './server/routes/equipeIdeal.routes';

import { authenticateToken } from './server/middleware/authenticateToken';
import { cookieSessionChecker } from './server/middleware/cookieSessionChecker';
import { protectAgainstSQLInjection } from './server/middleware/protectAgainstSQLInjection';
import { noCache } from './server/middleware/noCache';

import { db } from './db';
import logger from './server/logger';
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';

// Charger les variables d'environnement
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

export const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares globaux de parsing et sécurité
app.use(helmet());
app.use(morgan('dev')); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes, réessayez plus tard.',
  })
);

// --- Routes critiques sans cache
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.get('/api/test-db', async (_req, res) => {
  try {
    const [results] = await db.query('SELECT 1 AS test');
    console.log('✅ Requête test réussie :', results);
    return res.json({ success: true, result: results });
  } catch (err) {
    console.error('❌ Erreur de requête test DB :', err);
    return res.status(500).json({ error: 'Erreur base de données' });
  }
});

// --- Désactiver le cache HTTP sur les autres routes
app.use(noCache);

// --- Anti-injection SQL
app.use((req, res, next) => protectAgainstSQLInjection(req, res, next));

// --- Vérification de session/cookies
app.use(cookieSessionChecker);

// --- Routes applicatives
app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/joueurs', joueurRoutes);
app.use('/api/equipe', equipeIdealRoutes);
app.use('/api/protected-routes', protectedRoutes);

// --- Routes protégées
app.get(
  '/api/protected',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) =>
    res.json({ message: `Accessible par ${req.user?.email}` })
);

app.get('/api/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    return res.status(400).json({ error: 'Utilisateur non identifié' });
  }
  try {
    const [rows] = (await db.query(
      'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1',
      [req.user.userId]
    )) as [any[], any];
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    return res.json({ user: rows[0] });
  } catch (err) {
    logger.error('Erreur lors de la récupération de l’utilisateur:', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// --- Route racine
app.get('/', (_req, res) => res.send("Bienvenue sur l'API Fullstack 🎯"));

// --- Connexion MySQL puis lancement du serveur
export let server: import('http').Server;
if (process.env.NODE_ENV !== 'test') {
  db.getConnection()
    .then(conn => {
      conn.release();
      console.log('✅ Connexion à MySQL établie avec succès.');
      // Lancer le serveur **après** confirmation DB
      server = app.listen(PORT, () => {
        console.log(`🚀 Backend lancé et écoutant sur http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ Échec de connexion à MySQL:', err);
      process.exit(1);
    });
}
