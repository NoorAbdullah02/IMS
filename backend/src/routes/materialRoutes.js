import express from 'express';
import { getMaterials, uploadMaterial, deleteMaterial, updateMaterial } from '../controllers/materialController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { authorizePolicy } from '../middleware/policyMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.use(authenticateToken);

// All users can view materials
router.get('/', getMaterials);

// Teachers, Coordinators, and Admins can upload
router.post('/',
    authorizePolicy('upload', 'material'),
    upload.array('files', 10),
    uploadMaterial
);

// Update material
router.put('/:id',
    authorizePolicy('update', 'material'),
    upload.single('file'),
    updateMaterial
);

// Delete material
router.delete('/:id',
    authorizePolicy('delete', 'material'),
    deleteMaterial
);

export default router;
