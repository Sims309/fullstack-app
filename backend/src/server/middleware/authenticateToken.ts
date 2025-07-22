// src/server/routes/middleware/authenticateToken.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log('🧪 Cookies reçus :', req.cookies);
  console.log('🧪 Header Authorization :', req.headers.authorization);

  // ✅ Priorité : Cookie "auth-token"
  let token = req.cookies?.['auth-token'];

  // ✅ Fallback : Header Authorization: Bearer <token>
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      error: 'Token manquant',
      message: 'Un token d\'authentification est requis',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      role?: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token invalide :', error);
    return res.status(401).json({ error: 'Token invalide' });
  }
};
