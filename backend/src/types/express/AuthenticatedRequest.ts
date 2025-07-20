export interface AuthenticatedRequest extends Express.Request {
  user?: {
    userId: number;
    email: string;
    role?: string;
  };
  cookies: {
    token?: string;
    [key: string]: any;
  };
}
