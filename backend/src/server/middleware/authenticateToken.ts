// src/server/middleware/authenticateToken.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest'; // Import interface
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export function authenticateToken(
  req: AuthenticatedRequest, // <-- Remplace Request par AuthenticatedRequest
  res: Response,
  next: NextFunction
): void {
  const tokenFromCookie = req.cookies?.['auth-token'];
  const authHeader = req.headers['authorization'] as string | undefined;
  const token =
    tokenFromCookie ||
    (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined);

  if (!token) {
    res.status(401).json({
      error: 'Token manquant',
      message: 'Un token d\'authentification est requis',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    next();
  } catch (err) {
    res.status(401).json({
      error: 'Token invalide',
      message: 'Le token fourni est invalide ou expiré',
    });
    return;
  }
}
