import { Router } from 'express';
import { body } from 'express-validator';
import { createPresignedUrl } from '../controllers/upload.controller';
import { authenticate, requireRoles } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post(
  '/presign',
  authenticate,
  requireRoles('admin', 'user'),
  [body('fileName').notEmpty(), body('fileType').notEmpty()],
  validateRequest,
  createPresignedUrl
);

export default router;
