import { Request, Response, NextFunction } from 'express';
import { logFraudAttempt } from '@utils/auditLogger';

// On étend l'interface Request pour inclure user avec role
interface User {
  role?: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
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

    if (!user || typeof user.role !== 'string') {
      logFraudAttempt(ip, url, 'Tentative d’accès sans rôle');
      res.status(401).json({ error: 'Accès non autorisé. Aucun rôle trouvé.' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      logFraudAttempt(ip, url, `Rôle interdit: ${user.role}`);
      res.status(403).json({ error: `Accès interdit. Rôle requis : ${allowedRoles.join(', ')}` });
      return;
    }

    next();
  };
};
