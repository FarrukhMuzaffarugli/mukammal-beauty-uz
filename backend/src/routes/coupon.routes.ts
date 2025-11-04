import { Router } from 'express';
import { body } from 'express-validator';
import {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} from '../controllers/coupon.controller';
import { authenticate, requireRoles } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', authenticate, requireRoles('admin'), listCoupons);

router.post(
  '/',
  authenticate,
  requireRoles('admin'),
  [
    body('code').notEmpty(),
    body('discount_type').isIn(['percentage', 'fixed']),
    body('discount_value').isNumeric(),
    body('status').optional().isIn(['active', 'inactive', 'expired'])
  ],
  validateRequest,
  createCoupon
);

router.put(
  '/:id',
  authenticate,
  requireRoles('admin'),
  [
    body('discount_type').optional().isIn(['percentage', 'fixed']),
    body('status').optional().isIn(['active', 'inactive', 'expired'])
  ],
  validateRequest,
  updateCoupon
);

router.delete('/:id', authenticate, requireRoles('admin'), deleteCoupon);

router.post(
  '/validate',
  authenticate,
  [body('code').notEmpty(), body('orderTotal').isNumeric()],
  validateRequest,
  validateCoupon
);

export default router;
