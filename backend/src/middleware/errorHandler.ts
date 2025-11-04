import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { isProd } from '../config/env';

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message, details: error.details ?? null });
  }

  console.error('Unexpected error:', error);

  const message = error instanceof Error ? error.message : 'Internal server error';
  res.status(500).json({
    message: isProd ? 'Internal server error' : message
  });
};
