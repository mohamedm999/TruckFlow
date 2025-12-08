import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validate, registerSchema, updateUserSchema, mongoIdSchema } from '../middleware/validationMiddleware.js';

const router = Router();

// All routes require auth and admin role
router.use(protect);
router.use(adminOnly);

// CRUD routes
// GET /api/users?role=chauffeur&isActive=true - Filter chauffeurs
router.route('/')
  .get(getUsers)
  .post(validate(registerSchema), createUser);

router.route('/:id')
  .get(validate(mongoIdSchema, 'params'), getUser)
  .put(validate(mongoIdSchema, 'params'), validate(updateUserSchema), updateUser)
  .delete(validate(mongoIdSchema, 'params'), deleteUser);

export default router;
