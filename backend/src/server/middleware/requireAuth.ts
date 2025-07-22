import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Token manquant. Accès refusé.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role?: string };
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Erreur de vérification du token :', (err as Error).message);
    return res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};
