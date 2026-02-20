import express from 'express';
import { getDeptUsers, generateAdmitCards, getAdmitCards, updateAdmitCard } from '../controllers/deptHeadController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('dept_head', 'super_admin'));

router.get('/users', getDeptUsers);
router.post('/admit-cards', generateAdmitCards);
router.get('/admit-cards', getAdmitCards);
router.put('/admit-cards/:id', updateAdmitCard);

export default router;
