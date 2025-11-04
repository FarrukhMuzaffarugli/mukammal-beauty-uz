import { Router } from 'express';
import { body } from 'express-validator';
import {
  updateProfile,
  updatePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  listUsers,
  getWishlist
} from '../controllers/user.controller';
import { authenticate, requireRoles } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.put(
  '/profile',
  authenticate,
  [body('name').optional().notEmpty(), body('phone').optional().notEmpty()],
  validateRequest,
  updateProfile
);

router.patch(
  '/password',
  authenticate,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })],
  validateRequest,
  updatePassword
);

router.post(
  '/addresses',
  authenticate,
  [
    body('label').notEmpty(),
    body('full_name').notEmpty(),
    body('phone').notEmpty(),
    body('city').notEmpty(),
    body('district').notEmpty(),
    body('street').notEmpty()
  ],
  validateRequest,
  addAddress
);

router.put(
  '/addresses/:addressId',
  authenticate,
  [body('label').optional().notEmpty()],
  validateRequest,
  updateAddress
);

router.delete('/addresses/:addressId', authenticate, deleteAddress);

router.post(
  '/wishlist',
  authenticate,
  [body('productId').notEmpty()],
  validateRequest,
  toggleWishlist
);

router.get('/wishlist', authenticate, getWishlist);

router.get('/admin/users', authenticate, requireRoles('admin'), listUsers);

export default router;
