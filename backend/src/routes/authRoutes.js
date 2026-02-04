import express from 'express';
import { register, login, refreshToken } from '../controllers/authController.js';
import { forgotPassword, resetPassword, changePassword } from '../controllers/passwordController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticateToken, changePassword);

export default router;
