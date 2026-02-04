import express from 'express';
import { getMyCourses, getEnrolledStudents, uploadResult, updateResult, getResultsByCourse } from '../controllers/teacherController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizePolicy } from '../middleware/policyMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/courses', authorizePolicy('view_courses', 'course'), getMyCourses);
router.get('/courses/:courseId/students', authorizePolicy('view_enrolled_students', 'course'), getEnrolledStudents);
router.get('/courses/:courseId/results', authorizePolicy('view_results', 'result'), getResultsByCourse);
router.post('/results', authorizePolicy('upload_result', 'result'), upload.single('file'), uploadResult);
router.put('/results/:id', authorizePolicy('update_result', 'result'), upload.single('file'), updateResult);

export default router;
