import { Router } from 'express';
import { body } from 'express-validator';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  relatedProducts
} from '../controllers/product.controller';
import { authenticate, requireRoles } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProductById);
router.get('/:id/related', relatedProducts);

router.post(
  '/',
  authenticate,
  requireRoles('admin'),
  [
    body('sku').notEmpty(),
    body('name').notEmpty(),
    body('brand').notEmpty(),
    body('price').isNumeric(),
    body('status').isIn(['active', 'draft', 'archived'])
  ],
  validateRequest,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  requireRoles('admin'),
  [body('status').optional().isIn(['active', 'draft', 'archived'])],
  validateRequest,
  updateProduct
);

router.delete('/:id', authenticate, requireRoles('admin'), deleteProduct);

export default router;
