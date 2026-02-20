import express from 'express';
import { proxyDownload } from '../controllers/mediaController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Proxy endpoint to handle Cloudinary assets securely and bypass CORS/Headers issues
router.get('/proxy', authenticateToken, proxyDownload);

export default router;
