import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export interface CustomRequest extends Request {
  id?: string;
  startTime?: number;
}

export const loggerMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  req.id = randomUUID();
  req.startTime = Date.now();

  // Log incoming request
  console.log(`[INFO] [${new Date().toISOString()}] method=${req.method} path=${req.originalUrl} requestId=${req.id} ip=${req.ip}`);

  res.on('finish', () => {
    const latency = req.startTime ? Date.now() - req.startTime : 0;
    const logStr = `[INFO] [${new Date().toISOString()}] method=${req.method} path=${req.originalUrl} status=${res.statusCode} latency=${latency}ms requestId=${req.id} ip=${req.ip}`;
    
    if (res.statusCode >= 500) {
      console.error(logStr);
    } else if (res.statusCode >= 400) {
      console.warn(logStr);
    } else {
      console.log(logStr);
    }
  });

  next();
};
