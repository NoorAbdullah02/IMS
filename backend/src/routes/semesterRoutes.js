import express from 'express';
import { getSemesters, createSemester, deleteSemester, toggleSemester } from '../controllers/semesterController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getSemesters);

// Only Super Admin can manage semesters
router.post('/', authorizeRoles('super_admin'), createSemester);
router.delete('/:id', authorizeRoles('super_admin'), deleteSemester);
router.patch('/:id/toggle', authorizeRoles('super_admin'), toggleSemester);

export default router;
