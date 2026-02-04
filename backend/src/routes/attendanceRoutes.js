import express from 'express';
import { takeAttendance, getCourseAttendanceReport, getMyAttendance, getAttendanceByDate } from '../controllers/attendanceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizePolicy } from '../middleware/policyMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Policy-based authorization for teachers and staff
router.post('/take', authorizePolicy('mark_attendance', 'attendance'), takeAttendance);
router.get('/check', authorizePolicy('view_attendance', 'attendance'), getAttendanceByDate);
router.get('/report', authorizePolicy('view_report', 'attendance'), getCourseAttendanceReport);

// Student route
router.get('/me', getMyAttendance);

export default router;
