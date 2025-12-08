import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

// Placeholder - will be implemented in Day 4
router.use(protect);
router.use(adminOnly);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Maintenance routes - coming soon', data: [] });
});

export default router;
