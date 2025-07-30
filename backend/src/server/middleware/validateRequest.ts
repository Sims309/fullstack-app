// src/server/middleware/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodObject } from 'zod';

export const validateRequest = (
  schema: ZodSchema<any>,
  errorStatus: number = 400
) => (req: Request, res: Response, next: NextFunction) => {
  // Si c'est un objet Zod, log ses clés
  if (schema instanceof ZodObject) {
    console.log('🛠️ Middleware validateRequest avec ce schéma, clés:', Object.keys(schema.shape));
  } else {
    console.log('🛠️ Middleware validateRequest avec schéma non-ZodObject');
  }

  const result = schema.safeParse(req.body);

  if (!result.success) {
    console.log('❌ Erreurs de validation:', result.error.issues);
    return res.status(errorStatus).json({ errors: result.error.issues });
  }

  req.body = result.data;
  next();
};
