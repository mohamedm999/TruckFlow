
import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate, createTrailerSchema, updateTrailerSchema, mongoIdSchema } from '../middleware/validationMiddleware.js';
import {
  getTrailers,
  getTrailer,
  createTrailer,
  updateTrailer,
  deleteTrailer
} from '../controllers/trailerController.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(getTrailers)
  .post(adminOnly, validate(createTrailerSchema), createTrailer);

router.route('/:id')
  .get(validate(mongoIdSchema, 'params'), getTrailer)
  .put(adminOnly, validate(mongoIdSchema, 'params'), validate(updateTrailerSchema), updateTrailer)
  .delete(adminOnly, validate(mongoIdSchema, 'params'), deleteTrailer);

export default router;
