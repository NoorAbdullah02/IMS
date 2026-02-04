import express from 'express';
import { getNotices, createNotice, deleteNotice } from '../controllers/noticeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizePolicy } from '../middleware/policyMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.use(authenticateToken);

// All authenticated users can view notices
router.get('/', getNotices);

// Policy-based authorization for creating notices
router.post('/',
    authorizePolicy('create_notice', 'notice'),
    upload.single('file'),
    createNotice
);

// Policy-based authorization for deleting notices
router.delete('/:id',
    authorizePolicy('delete_notice', 'notice'),
    deleteNotice
);

export default router;
