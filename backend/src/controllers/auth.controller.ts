import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { User } from '../models/User';
import { Token } from '../models/Token';
import { AppError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/password';
import {
  createAccessToken,
  createRefreshToken,
  generateTokenId,
  hashToken,
  verifyRefreshToken
} from '../utils/tokens';
import { env } from '../config/env';
import { toExpiryDate } from '../utils/date';

const buildAuthResponse = (user: unknown, accessToken: string, refreshToken: string) => ({
  user,
  tokens: {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: env.jwt.accessExpiresIn
  }
});

const persistRefreshToken = async (
  userId: string,
  tokenId: string,
  refreshToken: string,
  userAgent: string
) => {
  const tokenHash = hashToken(refreshToken);
  const expiresAt = toExpiryDate(env.jwt.refreshExpiresIn);

  await Token.findOneAndUpdate(
    { token_id: tokenId },
    {
      user_id: userId,
      token_id: tokenId,
      token_hash: tokenHash,
      user_agent: userAgent,
      expires_at: expiresAt
    },
    { upsert: true, new: true }
  );
};

const generateAuthTokens = (userId: string, roles: string[]) => {
  const tokenId = generateTokenId();
  const accessToken = createAccessToken({ sub: userId, roles });
  const refreshToken = createRefreshToken({ sub: userId, tokenId });
  return { accessToken, refreshToken, tokenId };
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const hashed = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashed,
    phone
  });

  const { accessToken, refreshToken, tokenId } = generateAuthTokens(user.user_id, user.roles);
  await persistRefreshToken(user.user_id, tokenId, refreshToken, req.headers['user-agent'] ?? '');

  res.status(201).json(buildAuthResponse(user.toJSON(), accessToken, refreshToken));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new AppError('Invalid credentials', 401);
  }

  const { accessToken, refreshToken, tokenId } = generateAuthTokens(user.user_id, user.roles);
  await persistRefreshToken(user.user_id, tokenId, refreshToken, req.headers['user-agent'] ?? '');

  res.json(buildAuthResponse(user.toJSON(), accessToken, refreshToken));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  if (!refreshToken) {
    throw new AppError('Refresh token required', 400);
  }

  const payload = verifyRefreshToken(refreshToken);
  const tokenRecord = await Token.findOne({ token_id: payload.tokenId, user_id: payload.sub });

  if (!tokenRecord) {
    throw new AppError('Invalid refresh token', 401);
  }

  const matches = tokenRecord.token_hash === hashToken(refreshToken);
  if (!matches) {
    await Token.deleteOne({ _id: tokenRecord._id });
    throw new AppError('Invalid refresh token', 401);
  }

  const user = await User.findOne({ user_id: payload.sub });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { accessToken, refreshToken: newRefreshToken, tokenId } = generateAuthTokens(
    user.user_id,
    user.roles
  );

  await persistRefreshToken(user.user_id, tokenId, newRefreshToken, req.headers['user-agent'] ?? '');
  await Token.deleteOne({ _id: tokenRecord._id });

  res.json(buildAuthResponse(user.toJSON(), accessToken, newRefreshToken));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) {
    return res.json({ message: 'Logged out' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    await Token.deleteOne({ token_id: payload.tokenId });
  } catch (error) {
    console.warn('Failed to invalidate refresh token', error);
  }

  res.json({ message: 'Logged out' });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  res.json({ user: req.user.toJSON() });
});
