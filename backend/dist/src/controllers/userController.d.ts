import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
interface AuthenticatedRequest extends Request {
    user?: jwt.JwtPayload;
}
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const loginUser: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const logoutUser: (_req: Request, res: Response) => void;
export declare const getCurrentUser: (req: AuthenticatedRequest, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const getJoueurById: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const createJoueur: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export {};
