// protectAgainstSQLInjection.ts
import { Request, Response, NextFunction } from 'express';

// Expressions régulières courantes d'injection SQL
const sqlInjectionPattern = /(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|--|#|\/\*)\b|\bOR\b\s+\d+=\d+)/i;

// ✅ Middleware de protection contre les injections SQL
export function protectAgainstSQLInjection(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const checkObjectForInjection = (obj: any): boolean => {
    if (!obj || typeof obj !== 'object') return false; // 🛡️ Protection ajoutée ici

    return Object.values(obj).some(value => {
      if (typeof value === 'string') {
        return sqlInjectionPattern.test(value);
      }
      if (typeof value === 'object' && value !== null) {
        return checkObjectForInjection(value); // ✅ scan récursif
      }
      return false;
    });
  };

  if (
    checkObjectForInjection(req.body) ||
    checkObjectForInjection(req.query) ||
    checkObjectForInjection(req.params)
  ) {
    return res.status(400).json({
      error: 'Injection SQL détectée',
      message: 'Votre requête contient des éléments suspects et a été bloquée.'
    });
  }

  // ✅ Rien de suspect : on continue
  next();
}
