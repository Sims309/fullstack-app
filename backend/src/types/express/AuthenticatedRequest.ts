import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  email: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
