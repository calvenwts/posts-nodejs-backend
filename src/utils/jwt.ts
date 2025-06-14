import jwt from 'jsonwebtoken';
import { logger } from '../lib/logger';

export const generateToken = (userId: number, email: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    logger.error('JWT_SECRET is not defined in environment variables');
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { id: userId, email },
    jwtSecret,
    { expiresIn: '24h' }, // Token expires in 24 hours
  );
};
