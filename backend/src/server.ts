// src/server.ts
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
import protectedRoutes from '@routes/protectedRoutes'; // ✅ Ajout ici

import { authenticateToken } from '@middleware/authMiddleware';
import { cookieSessionChecker } from '@middleware/cookieSessionChecker';
import { protectAgainstSQLInjection } from '@middleware/protectAgainstSQLInjection';

import { db } from './db';
import logger from './server/logger';

dotenv.config();

export const app = express();

// 🔐 Sécurité globale
app.use(helmet());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, réessayez plus tard.',
});
app.use(limiter);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Middleware global contre injection SQL
app.use((req, res, next) => {
  if (req.path.startsWith('/api/health') || req.path.startsWith('/api/ping')) {
    return next();
  }
  return protectAgainstSQLInjection(req, res, next);
});

// ✅ Middleware global de session cookie JWT
app.use(cookieSessionChecker);

// ✅ Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/joueurs', joueurRoutes);
app.use(protectedRoutes); // ✅ Ajout de la route sécurisée

// ✅ Route protégée (test JWT)
app.get('/api/protected', authenticateToken, (req: Request, res: Response) => {
  res.json({ message: 'Route protégée accessible' });
});

// ✅ Infos utilisateur connecté
app.get('/api/me', authenticateToken, async (req: Request, res: Response) => {
  const user = req.user as { userId?: string; email?: string; role?: string }; // ✅ Correction ici
  const userId = user.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Utilisateur non identifié' });
  }

  const sql = 'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1';

  try {
    const [rows] = await db.query(sql, [userId]) as [any[], any];

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    logger.error("Erreur lors de la récupération de l'utilisateur:", err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ✅ Ping de santé
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ✅ Test DB
app.get('/api/test-db', async (_req: Request, res: Response) => {
  try {
    const [results] = await db.query('SELECT 1 AS test');
    console.log('✅ Requête test réussie :', results);
    res.json({ success: true, result: results });
  } catch (err) {
    console.error('❌ Erreur de requête test DB :', err);
    res.status(500).json({ error: 'Erreur base de données' });
  }
});

// ✅ Route racine simple
app.get('/', (_req: Request, res: Response) => {
  res.send('Bienvenue sur l’API Fullstack 🎯');
});
