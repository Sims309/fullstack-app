// src/server/routes/middleware/authenticateToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Interface pour req.user
export interface JwtPayload {
  userId: number;
  email: string;
  role?: string;
}

// Étend Request pour inclure user optionnel
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || '';

  if (!token) {
    return res.status(401).json({ error: 'Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; // ajout de user sur req
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide.' });
  }
};
