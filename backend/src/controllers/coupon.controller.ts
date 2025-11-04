import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Coupon } from '../models/Coupon';
import { AppError } from '../utils/AppError';

export const listCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ created_at: -1 }).lean();
  res.json({ data: coupons });
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body;

  const exists = await Coupon.findOne({ code: payload.code.toUpperCase() });
  if (exists) {
    throw new AppError('Coupon code already exists', 409);
  }

  const coupon = await Coupon.create({
    ...payload,
    code: payload.code.toUpperCase(),
    starts_at: payload.starts_at ? new Date(payload.starts_at) : null,
    ends_at: payload.ends_at ? new Date(payload.ends_at) : null
  });

  res.status(201).json({ data: coupon });
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const couponId = req.params.id;
  const updates = { ...req.body };
  if (updates.code) {
    updates.code = updates.code.toUpperCase();
  }

  if (updates.starts_at) {
    updates.starts_at = new Date(updates.starts_at);
  }

  if (updates.ends_at) {
    updates.ends_at = new Date(updates.ends_at);
  }

  const coupon = await Coupon.findOneAndUpdate({ coupon_id: couponId }, updates, {
    new: true
  });

  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  res.json({ data: coupon });
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const couponId = req.params.id;
  const coupon = await Coupon.findOneAndDelete({ coupon_id: couponId });
  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }
  res.status(204).send();
});

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, orderTotal } = req.body as { code: string; orderTotal: number };
  if (!code) {
    throw new AppError('Coupon code is required', 400);
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();
  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  if (coupon.status !== 'active') {
    throw new AppError('Coupon is not active', 400);
  }

  const now = new Date();
  if (coupon.starts_at && now < coupon.starts_at) {
    throw new AppError('Coupon not started', 400);
  }
  if (coupon.ends_at && now > coupon.ends_at) {
    throw new AppError('Coupon expired', 400);
  }

  if (coupon.min_order_amount && Number(orderTotal) < coupon.min_order_amount) {
    throw new AppError(`Minimum order amount is ${coupon.min_order_amount}`, 400);
  }

  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    throw new AppError('Coupon usage limit reached', 400);
  }

  res.json({ data: coupon });
});
