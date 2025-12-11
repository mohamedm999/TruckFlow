import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getMaintenanceRecords,
  getMaintenanceRecord,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getVehicleMaintenanceHistory
} from '../controllers/maintenanceController.js';
import {
  validate,
  createMaintenanceSchema,
  updateMaintenanceSchema,
  mongoIdSchema
} from '../middleware/validationMiddleware.js';

const router = Router();

router.use(protect);
router.use(adminOnly);

router.get('/:vehicleType/:vehicleId/history', getVehicleMaintenanceHistory);

router.route('/')
  .get(getMaintenanceRecords)
  .post(validate(createMaintenanceSchema), createMaintenanceRecord);

router.route('/:id')
  .get(validate(mongoIdSchema, 'params'), getMaintenanceRecord)
  .put(validate(mongoIdSchema, 'params'), validate(updateMaintenanceSchema), updateMaintenanceRecord)
  .delete(validate(mongoIdSchema, 'params'), deleteMaintenanceRecord);

export default router;
