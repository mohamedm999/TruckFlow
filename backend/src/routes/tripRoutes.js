import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Placeholder - will be implemented in Day 3
router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Trip routes - coming soon', data: [] });
});

export default router;
