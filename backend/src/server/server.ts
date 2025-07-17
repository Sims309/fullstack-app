import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes';
import playersRoutes from './routes/playersRoutes';
import joueurRoutes from './routes/joueurRoutes';
import { authenticateToken } from './routes/middleware/authMiddleware';
import { db } from '../db';

import logger from './logger';

dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
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

app.use('/api/auth', authRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/joueurs', joueurRoutes);

// ✅ Route protégée
app.get('/api/protected', authenticateToken, (req: Request, res: Response) => {
  res.json({ message: 'Route protégée accessible' });
});

// ✅ Infos utilisateur connecté
app.get('/api/me', authenticateToken, (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Utilisateur non identifié' });
  }

  const sql = 'SELECT id, email, username, role FROM users WHERE id = ? LIMIT 1';

  db.query(sql, [userId], (err: Error | null, results: any[]) => {
    if (err) {
      logger.error('Erreur lors de la récupération de l\'utilisateur:', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.json({ user: results[0] });
  });
});

// ✅ Ping de santé
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default app;
