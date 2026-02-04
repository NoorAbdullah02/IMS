import express from 'express';
import { getMaterials, uploadMaterial, deleteMaterial, updateMaterial } from '../controllers/materialController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.use(authenticateToken);

// All users can view materials
router.get('/', getMaterials);

// Teachers, Coordinators, and Admins can upload

router.post('/',
    authorizeRoles('teacher', 'course_coordinator', 'super_admin'),
    upload.array('files', 10),
    uploadMaterial
);

// Update material
router.put('/:id',
    authorizeRoles('teacher', 'course_coordinator', 'super_admin'),
    upload.single('file'),
    updateMaterial
);

// Delete material
router.delete('/:id',
    authorizeRoles('teacher', 'course_coordinator', 'super_admin'),
    deleteMaterial
);

export default router;
