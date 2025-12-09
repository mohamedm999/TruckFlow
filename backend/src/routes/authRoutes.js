import { Router } from 'express';
import { 
  login, 
  logout,
  logoutAll,
  refreshAccessToken,
  getMe, 
  updatePassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, loginSchema } from '../middleware/validationMiddleware.js';
import { authLimiter, passwordLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public routes with rate limiting
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshAccessToken);  // Uses HttpOnly cookie
router.post('/logout', logout);               // Clears cookie

// Protected routes
router.get('/me', protect, getMe);
router.put('/password', protect, passwordLimiter, updatePassword);
router.post('/logout-all', protect, logoutAll);  // Logout all devices

export default router;
