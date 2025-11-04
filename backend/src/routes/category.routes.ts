import { Router } from 'express';
import { body } from 'express-validator';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { authenticate, requireRoles } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.get('/', listCategories);

router.post(
  '/',
  authenticate,
  requireRoles('admin'),
  [body('name').notEmpty(), body('slug').notEmpty()],
  validateRequest,
  createCategory
);

router.put(
  '/:id',
  authenticate,
  requireRoles('admin'),
  [body('name').optional().notEmpty(), body('slug').optional().notEmpty()],
  validateRequest,
  updateCategory
);

router.delete('/:id', authenticate, requireRoles('admin'), deleteCategory);

export default router;
