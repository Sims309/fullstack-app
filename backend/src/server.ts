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

// Middleware
import { authenticateToken } from './server/middleware/authenticateToken';
import { cookieSessionChecker } from './server/middleware/cookieSessionChecker';
import { protectAgainstSQLInjection } from './server/middleware/protectAgainstSQLInjection';

import { db } from './db';
import logger from './server/logger';

// ** Import de l’interface étendue AuthenticatedRequest **
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';

dotenv.config();

export const app = express();

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

app.use((req, res, next) => {
  if (req.path.startsWith('/api/health') || req.path.startsWith('/api/ping')) {
    return next();
  }
  return protectAgainstSQLInjection(req, res, next);
});

app.use(cookieSessionChecker);

app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/joueurs', joueurRoutes);
app.use('/api/equipe', equipeIdealRoutes);
app.use('/api/protected-routes', protectedRoutes);

// Routes protégées avec AuthenticatedRequest pour accéder à req.user
app.get('/api/protected', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ 
    message: `Route protégée accessible par ${req.user?.email ?? 'utilisateur inconnu'}` 
  });
});

app.get('/api/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.userId) {
    return res.status(400).json({ error: 'Utilisateur non identifié' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1',
      [req.user.userId]
    ) as [any[], any];

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    return res.json({ user: rows[0] });
  } catch (err) {
    logger.error("Erreur lors de la récupération de l'utilisateur:", err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.get('/api/test-db', async (_req: Request, res: Response) => {
  try {
    const [results] = await db.query('SELECT 1 AS test');
    console.log('✅ Requête test réussie :', results);
    return res.json({ success: true, result: results });
  } catch (err) {
    console.error('❌ Erreur de requête test DB :', err);
    return res.status(500).json({ error: 'Erreur base de données' });
  }
});

app.get('/', (_req: Request, res: Response) => {
  return res.send('Bienvenue sur l\'API Fullstack 🎯');
});
