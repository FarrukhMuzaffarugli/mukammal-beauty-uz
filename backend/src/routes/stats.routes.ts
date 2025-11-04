import { Router } from 'express';
import { getStats } from '../controllers/stats.controller';
import { authenticate, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRoles('admin'), getStats);

export default router;
