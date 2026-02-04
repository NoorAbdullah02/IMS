import express from 'express';
import { getProfile, getResults, getNotices, getMyCourses, getMyAdmitCards } from '../controllers/studentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require login and 'student' role
router.use(authenticateToken);
router.use(authorizeRoles('student'));

router.get('/profile', getProfile);
router.get('/results', getResults);
router.get('/courses', getMyCourses);
router.get('/notices', getNotices);
router.get('/admit-cards', getMyAdmitCards);

export default router;
