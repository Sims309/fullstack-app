// src/server/middleware/cookieSessionChecker.ts
import { Response, NextFunction } from 'express';
import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export const cookieSessionChecker = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(); // Pas de cookie, continuer
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      ...(req.user || {}),
      userId: decoded.userId as string,
      email: decoded.email as string,
      role: decoded.role as string | undefined,
      iat: decoded.iat,
      exp: decoded.exp
    };

    return next(); // ✅ Token valide → continuer
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.clearCookie('token');
      return res.status(401).json({
        error: 'Session expirée',
        message: 'Votre token a expiré, veuillez vous reconnecter.',
      });
    }

    if (err instanceof JsonWebTokenError) {
      res.clearCookie('token');
      return res.status(400).json({
        error: 'Jeton invalide',
        message: 'Le cookie est invalide ou corrompu.',
      });
    }

    return res.status(500).json({
      error: 'Erreur interne',
      message: 'Erreur lors de la vérification du token cookie.',
    });
  }
};
