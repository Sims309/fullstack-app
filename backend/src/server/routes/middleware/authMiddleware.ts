import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

// ✅ Extension du type global pour Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId?: number;
        email?: string;
        role?: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

// ✅ Middleware Express standard avec typage compatible
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      error: 'Token manquant',
      message: 'Un token d\'authentification est requis'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === 'string') {
      res.status(403).json({
        error: 'Token invalide',
        message: 'Le format du token est incorrect'
      });
      return;
    }

    req.user = decoded as JwtPayload & {
      userId?: number;
      email?: string;
      role?: string;
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
