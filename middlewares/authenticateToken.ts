import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { Payload } from '../types/playload';
import { JWT_ACCESS_TOKEN } from '../lib/config';
import { AuthenticatedRequest } from '../types/user';

export const authenticateToken: RequestHandler = (
    req: AuthenticatedRequest, 
    res: Response,
    next: NextFunction
) => {
    let token;
    if(req.cookies.accessToken)
     token = req.cookies.accessToken;
    else {
        token = req.tokens?.accessToken;
    }

    if (!token) {
        return res.status(401).json({ error: 'Token is not passed!' });
    }

    try {
        const data = jwt.verify(token, JWT_ACCESS_TOKEN) as Payload;
        console.log('payload id: ',data);
        if (!data) {
            return res.status(401).json({ error: 'Token cannot be verified!' });
        }

        req.user = data.user;

        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(403).json({ error: 'Invalid token!' });
    }
};

// Type definition for extending the Request interface
declare global {
    namespace Express {
      interface Request {
        tokens?: {
          accessToken: string;
          refreshToken: string;
        };
      }
    }
  }