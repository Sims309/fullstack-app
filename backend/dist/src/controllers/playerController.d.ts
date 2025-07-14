import { Request, Response } from 'express';
export declare const getJoueurById: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const createJoueur: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
