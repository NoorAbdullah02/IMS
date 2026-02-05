import express from 'express';
import { getAllUsers, createUser, deleteUser, updateUser, generateStudentIds, getGeneratedIds, searchStudent } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

// Shared Route (Super Admin + Dept Head)
router.get('/search-student', authorizeRoles('super_admin', 'dept_head'), searchStudent);

// Super Admin Only Below
router.use(authorizeRoles('super_admin'));

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/generate-ids', generateStudentIds);
router.get('/generated-ids', getGeneratedIds);

export default router;
