// src/types/express/index.d.ts ou src/@types/express/index.d.ts

import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload & {
      userId?: number;
      email?: string;
      role?: string;
    };
  }
}

export {};
