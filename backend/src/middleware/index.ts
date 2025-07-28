import express from 'express';
import cors from 'cors';
import { corsOptions } from '../config';
import { verifyToken, JWTPayload } from '../utils/auth';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const setupMiddleware = (app: express.Application) => {
  // CORS middleware
  app.use(cors(corsOptions));
  
  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
};

// Authentication middleware
export const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Error handling middleware
export const errorHandler = (
  err: Error, 
  _req: express.Request, 
  res: express.Response, 
  _next: express.NextFunction
) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// 404 handler
export const notFoundHandler = (_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
};