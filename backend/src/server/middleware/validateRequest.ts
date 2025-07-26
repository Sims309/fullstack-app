// src/server/middleware/validateRequest.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware de validation Zod.
 * @param schema     Schéma Zod à utiliser.
 * @param errorStatus Code HTTP à renvoyer en cas d’échec (par défaut 400).
 */
export const validateRequest = (
  schema: ZodSchema<any>,
  errorStatus: number = 400
) => (req: Request, res: Response, next: NextFunction) => {
  // 1) On parse directement le corps de la requête
  const result = schema.safeParse(req.body);

  // 2) Si échec, on renvoie le status configuré et les issues Zod
  if (!result.success) {
    return res
      .status(errorStatus)
      .json({ errors: result.error.issues });
  }

  // 3) Sur succès, on remplace req.body par les données validées
  req.body = result.data;
  next();
};
