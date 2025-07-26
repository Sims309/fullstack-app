import { Request } from 'express';

export interface UserPayload {
  userId: string;  // <-- ici string uniquement, pas number
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}
