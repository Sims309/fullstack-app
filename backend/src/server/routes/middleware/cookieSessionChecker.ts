import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// ✅ Ne pas écrire : `: void`
export const cookieSessionChecker = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(); // Pas de cookie, continuer
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = {
      ...(req.user || {}),
      ...decoded,
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
