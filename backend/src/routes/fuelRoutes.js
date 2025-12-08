import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Placeholder - will be implemented in Day 2
router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Fuel routes - coming soon', data: [] });
});

export default router;
