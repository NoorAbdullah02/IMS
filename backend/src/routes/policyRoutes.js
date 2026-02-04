import express from 'express';
import { getPolicies, upsertPolicy, deletePolicy } from '../controllers/policyController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('super_admin')); // Policy management is highly sensitive

router.get('/', getPolicies);
router.post('/', upsertPolicy);
router.put('/:id', upsertPolicy);
router.delete('/:id', deletePolicy);

export default router;
