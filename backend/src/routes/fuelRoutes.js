

import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate, createFuelSchema, updateFuelSchema, mongoIdSchema } from '../middleware/validationMiddleware.js';
import {
  getFuelRecords,
  getFuelRecord,
  createFuelRecord,
  updateFuelRecord,
  deleteFuelRecord
} from '../controllers/fuelController.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getFuelRecords)
  .post(validate(createFuelSchema), createFuelRecord);

router.route('/:id')
  .get(validate(mongoIdSchema, 'params'), getFuelRecord)
  .put(adminOnly, validate(mongoIdSchema, 'params'), validate(updateFuelSchema), updateFuelRecord)
  .delete(adminOnly, validate(mongoIdSchema, 'params'), deleteFuelRecord);

export default router;

