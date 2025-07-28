import express from 'express';
import cors from 'cors';
import { corsOptions } from '../config';

export const setupMiddleware = (app: express.Application) => {
  // CORS middleware
  app.use(cors(corsOptions));
  
  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
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