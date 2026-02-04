import express from 'express';
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    assignTeacher,
    getCourseAssignments,
    getDepartmentTeachers
} from '../controllers/coordinatorController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizePolicy } from '../middleware/policyMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Course management
router.get('/courses', getCourses);
router.post('/courses', authorizePolicy('create_course', 'course'), createCourse);
router.put('/courses/:id', authorizePolicy('update_course', 'course'), updateCourse);
router.delete('/courses/:id', authorizePolicy('delete_course', 'course'), deleteCourse);

// Teacher assignment
router.get('/teachers', getDepartmentTeachers);
router.post('/assign', authorizePolicy('assign_teacher', 'course'), assignTeacher);
router.get('/assignments', getCourseAssignments);

export default router;
