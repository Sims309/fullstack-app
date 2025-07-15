// src/middleware/authenticateToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Plus besoin de AuthenticatedRequest : on utilise Express.Request enrichi globalement

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded !== 'object' || decoded === null) {
      return res.status(403).json({ error: 'Token invalide (type)' });
    }

    req.user = decoded as JwtPayload & { userId?: number };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide' });
  }
}
