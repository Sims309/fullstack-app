import { Request, Response, NextFunction } from 'express';
import { logFraudAttempt } from '@utils/auditLogger';

// Interface pour le payload JWT décodé
interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// On étend l'interface Request pour incluer le user décodé du JWT
interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

/**
 * Middleware pour vérifier si l'utilisateur a l'un des rôles requis
 * @param allowedRoles - Liste des rôles autorisés (ex : ['admin', 'moderator'])
 */
export const checkUserRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user;
    const ip = req.ip || 'unknown';
    const url = req.originalUrl || 'unknown';

    // Vérifier si l'utilisateur est authentifié
    if (!user) {
      logFraudAttempt(ip, url, 'Tentative d\'accès sans authentification');
      res.status(401).json({ error: 'Accès non autorisé. Authentification requise.' });
      return;
    }

    // Vérifier si l'utilisateur a un rôle défini
    if (!user.role || typeof user.role !== 'string') {
      logFraudAttempt(ip, url, 'Tentative d\'accès sans rôle défini');
      res.status(401).json({ error: 'Accès non autorisé. Aucun rôle trouvé.' });
      return;
    }

    // Vérifier si le rôle de l'utilisateur est dans les rôles autorisés
    if (!allowedRoles.includes(user.role)) {
      logFraudAttempt(ip, url, `Rôle interdit: ${user.role}, rôles requis: ${allowedRoles.join(', ')}`);
      res.status(403).json({ 
        error: `Accès interdit. Rôle requis : ${allowedRoles.join(', ')}`,
        userRole: user.role 
      });
      return;
    }

    // L'utilisateur a un rôle autorisé, continuer
    next();
  };
};

// Export du type pour réutilisation dans d'autres fichiers
export type { AuthenticatedRequest };