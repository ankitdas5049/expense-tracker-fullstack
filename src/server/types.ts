export interface AuthRequest {
  user_id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthRequest;
    }
  }
}
