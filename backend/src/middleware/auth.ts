import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from './asyncHandler';
import { verifyAccessToken } from '../utils/tokens';
import { AppError } from '../utils/AppError';
import { User } from '../models/User';

export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];

  const payload = verifyAccessToken(token);

  const user = await User.findOne({ user_id: payload.sub });
  if (!user) {
    throw new AppError('User not found', 401);
  }

  req.user = user;
  req.userId = user.user_id;
  req.roles = user.roles;

  next();
});

export const optionalAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    const user = await User.findOne({ user_id: payload.sub });
    if (user) {
      req.user = user;
      req.userId = user.user_id;
      req.roles = user.roles;
    }
  } catch (error) {
    console.warn('Optional auth failed', error);
  }

  next();
});

export const requireRoles = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRoles = req.roles ?? [];
    const hasRole = roles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new AppError('Forbidden', 403);
    }
    next();
  };
};
