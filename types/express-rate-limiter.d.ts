// src/types/express-rate-limiter.d.ts
declare module 'express-rate-limiter' {
    import { RequestHandler } from 'express';
  
    interface RateLimiterOptions {
      windowMs?: number;
      max?: number;
      message?: string;
      headers?: boolean;
    }
  
    function rateLimit(options: RateLimiterOptions): RequestHandler;
  
    export = rateLimit;
  }
  