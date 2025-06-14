import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../lib/logger';
import { User } from '@prisma/client';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not defined in environment variables');
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as User;
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
