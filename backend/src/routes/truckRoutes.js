

import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate, createTruckSchema, updateTruckSchema, mongoIdSchema } from '../middleware/validationMiddleware.js';
import {
  getTrucks,
  getTruck,
  createTruck,
  updateTruck,
  deleteTruck
} from '../controllers/truckController.js';

const router = Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getTrucks)
  .post(adminOnly, validate(createTruckSchema), createTruck);

router.route('/:id')
  .get(validate(mongoIdSchema, 'params'), getTruck)
  .put(adminOnly, validate(mongoIdSchema, 'params'), validate(updateTruckSchema), updateTruck)
  .delete(adminOnly, validate(mongoIdSchema, 'params'), deleteTruck);

export default router;

