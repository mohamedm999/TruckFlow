import { Router } from 'express';
import { login, getMe, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, loginSchema } from '../middleware/validationMiddleware.js';

const router = Router();

// Public routes - Login only (no public registration)
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

export default router;
