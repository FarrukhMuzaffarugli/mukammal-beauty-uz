import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';

export type AccessTokenPayload = {
  sub: string;
  roles: string[];
};

export type RefreshTokenPayload = {
  sub: string;
  tokenId: string;
};

export const createAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.accessExpiresIn });
};

export const createRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.jwt.secret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.jwt.refreshSecret) as RefreshTokenPayload;
};

export const generateTokenId = (): string => crypto.randomUUID();

export const hashToken = (token: string): string => {
  return crypto.createHash('sha512').update(token).digest('hex');
};
