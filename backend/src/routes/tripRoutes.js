import { Router } from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate, mongoIdSchema, createTripSchema, updateTripSchema, updateTripStatusSchema, updateTripMileageSchema } from '../middleware/validationMiddleware.js';
import {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getMyTrips,
  updateTripStatus,
  generateTripPDFReport,
  updateTripMileage
} from '../controllers/tripController.js';

const router = Router();

router.use(protect);

// Driver-specific routes
router.get('/my-trips', getMyTrips);

router.route('/')
  .get(getTrips)
  .post(adminOnly, validate(createTripSchema), createTrip);

router.route('/:id')
  .get(validate(mongoIdSchema, 'params'), getTrip)
  .put(adminOnly, validate(mongoIdSchema, 'params'), validate(updateTripSchema), updateTrip) 
  .delete(adminOnly, validate(mongoIdSchema, 'params'), deleteTrip);

// Driver actions
router.patch('/:id/status', validate(mongoIdSchema, 'params'), validate(updateTripStatusSchema), updateTripStatus);
router.patch('/:id/mileage', validate(mongoIdSchema, 'params'), validate(updateTripMileageSchema), updateTripMileage);

// PDF generation
router.get('/:id/pdf', validate(mongoIdSchema, 'params'), generateTripPDFReport);

export default router;
