// src/server/routes/middleware/checkUserRole.ts
import { Request, Response, NextFunction } from 'express';
import { logFraudAttempt } from '../../../utils/auditLogger';

/**
 * Middleware pour vérifier si l'utilisateur a l'un des rôles requis
 * @param allowedRoles - Liste des rôles autorisés (ex : ['admin', 'moderator'])
 */
export const checkUserRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    // 🔐 On force des valeurs par défaut pour éviter les erreurs TS
    const ip = req.ip || 'unknown';
    const url = req.originalUrl || 'unknown';

    // 🚫 Cas 1 : Aucun utilisateur ou rôle manquant
    if (!user || !user.role) {
      logFraudAttempt(ip, url, 'Tentative d’accès sans rôle');
      res.status(401).json({ error: 'Accès non autorisé. Aucun rôle trouvé.' });
      return;
    }

    // 🚫 Cas 2 : Rôle interdit
    if (!allowedRoles.includes(user.role)) {
      logFraudAttempt(ip, url, `Rôle interdit: ${user.role}`);
      res.status(403).json({ error: `Accès interdit. Rôle requis : ${allowedRoles.join(', ')}` });
      return;
    }

    // ✅ Cas OK
    next();
  };
};
