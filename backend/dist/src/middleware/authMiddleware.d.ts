import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}
export declare function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
