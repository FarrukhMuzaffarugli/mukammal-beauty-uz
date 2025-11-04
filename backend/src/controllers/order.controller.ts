import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';
import { AppError } from '../utils/AppError';
import { Coupon, CouponDocument } from '../models/Coupon';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const { items, address, total_amount, payment_status, coupon_code } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Order must contain at least one item', 422);
  }

  if (!address) {
    throw new AppError('Shipping address is required', 422);
  }

  const computedTotal = items.reduce(
    (sum: number, item: { qty: number; price: number }) => sum + item.qty * item.price,
    0
  );

  if (total_amount && Math.abs(Number(total_amount) - computedTotal) > 0.01) {
    throw new AppError('Invalid total amount', 422);
  }

  let discount = 0;
  let appliedCoupon: string | null = null;
  let couponDoc: CouponDocument | null = null;

  if (coupon_code) {
    const coupon = await Coupon.findOne({ code: coupon_code.toUpperCase() });
    if (!coupon) {
      throw new AppError('Coupon not found', 404);
    }

    const now = new Date();
    if (coupon.status !== 'active') {
      throw new AppError('Coupon inactive', 400);
    }
    if (coupon.starts_at && now < coupon.starts_at) {
      throw new AppError('Coupon not started', 400);
    }
    if (coupon.ends_at && now > coupon.ends_at) {
      throw new AppError('Coupon expired', 400);
    }
    if (coupon.min_order_amount && computedTotal < coupon.min_order_amount) {
      throw new AppError(`Minimum order amount is ${coupon.min_order_amount}`, 400);
    }
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      throw new AppError('Coupon usage limit reached', 400);
    }

    if (coupon.discount_type === 'percentage') {
      discount = (computedTotal * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }

    appliedCoupon = coupon.code;
    couponDoc = coupon;
  }

  const finalTotal = Math.max(computedTotal - discount, 0);

  const order = await Order.create({
    user_id: userId,
    items,
    address,
    total_amount: finalTotal,
    payment_status: payment_status ?? 'pending',
    coupon_code: appliedCoupon ?? undefined,
    discount
  });

  if (couponDoc) {
    const update: Record<string, unknown> = { $inc: { usage_count: 1 } };
    if (couponDoc.usage_limit && couponDoc.usage_count + 1 >= couponDoc.usage_limit) {
      update.$set = { status: 'expired' };
    }
    await Coupon.updateOne({ _id: couponDoc._id }, update);
  }

  await Cart.findOneAndUpdate({ user_id: userId }, { items: [], total: 0 });

  res.status(201).json({ data: order });
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const orders = await Order.find({ user_id: userId }).sort({ created_at: -1 }).lean();
  res.json({ data: orders });
});

export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await Order.find().sort({ created_at: -1 }).lean();
  res.json({ data: orders });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { payment_status, delivery_status } = req.body;

  const order = await Order.findOneAndUpdate(
    { order_id: orderId },
    { payment_status, delivery_status },
    { new: true }
  );

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.json({ data: order });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const order = await Order.findOne({ order_id: orderId }).lean();
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const isOwner = order.user_id === req.userId;
  const isAdmin = (req.roles ?? []).includes('admin');
  if (!isOwner && !isAdmin) {
    throw new AppError('Forbidden', 403);
  }

  res.json({ data: order });
});
