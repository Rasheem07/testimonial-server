import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { playload } from '../types/playload';
import { AuthenticatedRequest } from '../types/user';
import { JWT_ACCESS_TOKEN } from '../config/config';

// Middleware function typed as RequestHandler
export const authenticateToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const tokenHeader = req.headers['access_token'] as string; // Access custom header correctly
  const token = tokenHeader && tokenHeader.split(' ')[1];
  
  if (!token) {
    return res.status(404).json({ error: 'Token is not passed!' });
  }

  try {
    const data = jwt.verify(token, JWT_ACCESS_TOKEN) as playload;
    (req as AuthenticatedRequest).user = data.user; // Type assertion to ensure compatibility
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token!' });
  }
};
