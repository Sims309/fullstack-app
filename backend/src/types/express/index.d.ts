// src/server/types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        userId: number;
        email?: string;
        role?: string;
        photoUrl?: string;
      };
    }
  }
}

export {}; // ✅ Nécessaire pour traiter ce fichier comme un module TypeScript
