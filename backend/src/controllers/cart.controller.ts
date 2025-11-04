import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Cart } from '../models/Cart';
import { AppError } from '../utils/AppError';

const calculateTotal = (items: { qty: number; price: number }[]) => {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
};

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const existing = await Cart.findOne({ user_id: userId }).lean();

  if (!existing) {
    const created = await Cart.create({ user_id: userId, items: [], total: 0 });
    res.json({ data: created.toObject() });
    return;
  }

  res.json({ data: existing });
});

export const updateCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const items = req.body.items as { product_id: string; qty: number; price: number }[];
  if (!Array.isArray(items)) {
    throw new AppError('Items must be an array', 422);
  }

  const sanitized = items
    .map((item) => ({
      product_id: item.product_id,
      qty: Number(item.qty),
      price: Number(item.price)
    }))
    .filter((item) => item.product_id && Number.isFinite(item.qty) && item.qty > 0 && Number.isFinite(item.price));

  const total = calculateTotal(sanitized);

  const cart = await Cart.findOneAndUpdate(
    { user_id: userId },
    { items: sanitized, total },
    { upsert: true, new: true }
  );

  res.json({ data: cart.toObject() });
});
