import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController.js';
import { validate, mongoIdSchema } from '../middleware/validationMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', validate(mongoIdSchema, 'params'), markAsRead);

export default router;
