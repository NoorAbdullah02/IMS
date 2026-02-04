import express from 'express';
import { getProfile, updateProfile, uploadProfilePhoto } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.patch('/me/photo', upload.single('photo'), uploadProfilePhoto);

export default router;

