import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById
} from '../controllers/order.controller';
import { authenticate, requireRoles } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post(
  '/',
  authenticate,
  [
    body('items').isArray({ min: 1 }),
    body('total_amount').isNumeric(),
    body('address.full_name').notEmpty(),
    body('address.phone').notEmpty(),
    body('coupon_code').optional().isString()
  ],
  validateRequest,
  createOrder
);

router.get('/', authenticate, getMyOrders);
router.get('/admin/all', authenticate, requireRoles('admin'), getAllOrders);
router.get('/:id', authenticate, getOrderById);

router.patch(
  '/:id',
  authenticate,
  requireRoles('admin'),
  [
    body('payment_status').optional().isIn(['pending', 'paid', 'failed']),
    body('delivery_status').optional().isIn(['preparing', 'shipping', 'delivered'])
  ],
  validateRequest,
  updateOrderStatus
);

export default router;
