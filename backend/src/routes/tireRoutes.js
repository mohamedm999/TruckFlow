
import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate, createTireSchema, updateTireSchema, mongoIdSchema } from '../middleware/validationMiddleware.js';
import {
  getTires,
  getTire,
  createTire,
  updateTire,
  deleteTire
} from '../controllers/tireController.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getTires)
  .post(adminOnly, validate(createTireSchema), createTire);

router.route('/:id')
  .get(validate(mongoIdSchema, 'params'), getTire)
  .put(adminOnly, validate(mongoIdSchema, 'params'), validate(updateTireSchema), updateTire)
  .delete(adminOnly, validate(mongoIdSchema, 'params'), deleteTire);

export default router;
