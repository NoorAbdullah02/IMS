import express from 'express';
import {
    getFinancialOverview,
    getPaymentsList,
    verifyPayment,
    submitPayment,
    getMyFinancialStatus,
    confirmRegistration
} from '../controllers/financeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.use(authenticateToken);

// --- Treasurer & Admin Routes ---
router.get('/overview', authorizeRoles('treasurer', 'super_admin'), getFinancialOverview);
router.get('/payments', authorizeRoles('treasurer', 'super_admin'), getPaymentsList);
router.put('/verify/:paymentId', authorizeRoles('treasurer', 'super_admin'), verifyPayment);

// --- Student Routes ---
router.get('/my-status', authorizeRoles('student'), getMyFinancialStatus);
router.post('/pay', authorizeRoles('student'), upload.single('proof'), submitPayment);
router.post('/register-confirm', authorizeRoles('student'), confirmRegistration);

export default router;
