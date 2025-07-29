// src/server/server.ts
import express, { Request, Response } from 'express';
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

import { db } from './db';
import logger from './server/logger';

import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';

// Ne charger .env qu'en dev/production, pas en test
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

export const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS pour le frontend
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Limitation de requêtes
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes, réessayez plus tard.',
  })
);

// Anti-injection SQL
app.use((req, res, next) => {
  if (req.path.startsWith('/api/health') || req.path.startsWith('/api/ping')) {
    return next();
  }
  return protectAgainstSQLInjection(req, res, next);
});

// Cookie session checker
app.use(cookieSessionChecker);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/joueurs', joueurRoutes);
app.use('/api/equipe', equipeIdealRoutes);
app.use('/api/protected-routes', protectedRoutes);

// Route protégée
app.get(
  '/api/protected',
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) =>
    res.json({
      message: `Route protégée accessible par ${req.user?.email ??
        'utilisateur inconnu'}`,
    })
);

// Récupérer l’utilisateur connecté
app.get(
  '/api/me',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
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
  }
);

// Health & DB test
app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' })
);
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

// Route par défaut
app.get('/', (_req, res) => res.send("Bienvenue sur l'API Fullstack 🎯"));

// Vérification connexion MySQL au démarrage (sauf en test)
if (process.env.NODE_ENV !== 'test') {
  db.getConnection()
    .then(conn => {
      console.log('✅ Connexion à MySQL établie avec succès.');
      conn.release();
    })
    .catch(err => {
      console.error('❌ Échec de connexion à MySQL:', err);
      process.exit(1);
    });
}

// ▶️ Démarrage du serveur (uniquement hors tests)
export let server: import('http').Server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () =>
    console.log(`🚀 Backend lancé sur http://localhost:${PORT}`)
  );
}
