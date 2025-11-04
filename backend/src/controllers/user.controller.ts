import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/password';
import { generateId } from '../utils/id';
import { Product } from '../models/Product';

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  const { name, phone, avatar } = req.body;

  if (name !== undefined) {
    user.name = name;
  }
  if (phone !== undefined) {
    user.phone = phone;
  }
  if (avatar !== undefined) {
    user.avatar = avatar;
  }

  await user.save();
  res.json({ data: user.toJSON() });
});

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) {
    throw new AppError('Current password is incorrect', 400);
  }

  const hashed = await hashPassword(newPassword);
  user.password = hashed;
  await user.save();
  res.json({ message: 'Password updated' });
});

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  const address = {
    ...req.body,
    address_id: generateId()
  };

  if (address.is_default) {
    user.addresses = user.addresses.map((addr) => ({ ...addr, is_default: false }));
  }

  user.addresses.push(address as never);
  await user.save();

  res.status(201).json({ data: user.addresses });
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  const addressId = req.params.addressId;
  const address = user.addresses.find((item) => item.address_id === addressId);
  if (!address) {
    throw new AppError('Address not found', 404);
  }

  Object.assign(address, req.body);

  if (address.is_default) {
    user.addresses = user.addresses.map((addr) => ({
      ...addr,
      is_default: addr.address_id === addressId
    }));
  }

  await user.save();
  res.json({ data: user.addresses });
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  const addressId = req.params.addressId;
  const filtered = user.addresses.filter((item) => item.address_id !== addressId);
  if (filtered.length === user.addresses.length) {
    throw new AppError('Address not found', 404);
  }

  user.addresses = filtered as never;
  await user.save();
  res.status(204).send();
});

export const toggleWishlist = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  const { productId } = req.body as { productId: string };
  if (!productId) {
    throw new AppError('productId is required', 400);
  }

  const exists = user.wishlist.includes(productId);
  user.wishlist = exists
    ? (user.wishlist.filter((item) => item !== productId) as never)
    : ([...user.wishlist, productId] as never);

  await user.save();
  res.json({ data: user.wishlist });
});

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().sort({ created_at: -1 }).lean();
  const sanitized = users.map(({ password, ...rest }) => rest);
  res.json({ data: sanitized });
});

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Authentication required', 401);
  }

  const products = await Product.find({ product_id: { $in: user.wishlist } })
    .where('status')
    .equals('active')
    .lean();

  res.json({ data: products });
});
