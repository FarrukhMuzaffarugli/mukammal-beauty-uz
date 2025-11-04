import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const [users, products, orders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          revenue: { $sum: '$total_amount' }
        }
      }
    ])
  ]);

  const orderStats = orders[0] ?? { totalOrders: 0, revenue: 0 };

  res.json({
    data: {
      users,
      products,
      totalOrders: orderStats.totalOrders,
      revenue: orderStats.revenue
    }
  });
});
