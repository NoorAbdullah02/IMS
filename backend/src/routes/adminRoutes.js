import express from 'express';
import { getAllUsers, createUser, deleteUser, updateUser } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes: Logged in + Super Admin only
router.use(authenticateToken);
router.use(authorizeRoles('super_admin'));

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
