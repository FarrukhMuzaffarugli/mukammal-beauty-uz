import { Router } from 'express';
import { body } from 'express-validator';
import { getCart, updateCart } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', authenticate, getCart);

router.put(
  '/',
  authenticate,
  [body('items').isArray({ min: 0 })],
  validateRequest,
  updateCart
);

export default router;
