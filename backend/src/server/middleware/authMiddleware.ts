// src/server/middleware/authMiddleware.ts
import { Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '@/types/express/AuthenticatedRequest';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    res.status(401).json({
      error: 'Token manquant',
      message: 'Un token d\'authentification est requis'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      userId: String(decoded.userId), // conversion string ici
      email: decoded.email as string,
      role: decoded.role as string | undefined,
      iat: decoded.iat,
      exp: decoded.exp
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        error: 'Token expiré',
        message: 'Votre session a expiré, veuillez vous reconnecter'
      });
    } else if (error instanceof JsonWebTokenError) {
      res.status(403).json({
        error: 'Token invalide',
        message: 'Le token fourni est invalide'
      });
    } else {
      res.status(500).json({
        error: 'Erreur serveur',
        message: 'Erreur lors de la vérification de l\'authentification'
      });
    }
  }
}
