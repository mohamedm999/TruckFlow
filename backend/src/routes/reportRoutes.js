import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getFuelConsumption,
  getMaintenanceCosts,
  getTripStatistics
} from '../controllers/reportController.js';

const router = Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/fuel-consumption', adminOnly, getFuelConsumption);
router.get('/maintenance-costs', adminOnly, getMaintenanceCosts);
router.get('/trip-statistics', getTripStatistics);

export default router;
