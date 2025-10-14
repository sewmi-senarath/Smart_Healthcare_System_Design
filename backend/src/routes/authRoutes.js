import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { validators } from '../middlewares/validator.js';
import { strictRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', validators.register, register);
router.post('/login', strictRateLimiter, validators.login, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;
