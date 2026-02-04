import express from 'express';
import { getSettings, updateSetting, getStats } from '../controllers/systemController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Anyone logged in can see settings
router.get('/', authenticateToken, getSettings);
router.get('/stats', authenticateToken, getStats);

// Only admins can update settings
router.put('/', authenticateToken, authorizeRoles('super_admin', 'admin'), updateSetting);

export default router;
