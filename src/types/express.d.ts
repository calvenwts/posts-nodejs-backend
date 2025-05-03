import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      // Add custom properties here if needed
    }
  }
}
