import { NextFunction, Request, Response } from "express";
import { logger } from "../helpers/loggers";

export const globalErrorHandling = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        user: req.user // if available
    });
  
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: 'Invalid data provided.' });
    } else if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized access.' });
    } else if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ error: 'Invalid CSRF token.' });
    } else {
        res.status(500).json({ error: 'Internal server error.' });
    }
  }