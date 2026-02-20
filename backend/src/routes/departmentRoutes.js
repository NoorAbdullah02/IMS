import express from 'express';
import {
    getDepartments,
    getDepartmentPortal,
    getPublicDepartments,
    updateDepartmentMetadata,
    createEvent,
    updateEvent,
    getDepartmentEvents,
    deleteEvent,
    createContent,
    getDepartmentContent,
    getDeptDashboardStats,
    getDepartmentGallery,
    createGalleryItem,
    deleteGalleryItem
} from '../controllers/departmentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizePolicy } from '../middleware/policyMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public Portal - No Auth Required for viewing public info
router.get('/portal/:deptName', getDepartmentPortal);
router.get('/public-list', getPublicDepartments);

// All authenticated users can see the list of depts
router.get('/', authenticateToken, getDepartments);

// All other routes require auth
router.use(authenticateToken);

// Dashboard Stats
router.get('/stats', getDeptDashboardStats);

// Branding Management
router.put('/meta/:deptName', authorizePolicy('manage_dept_branding', 'department'), upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
]), updateDepartmentMetadata);

// Event Management
router.post('/events', authorizePolicy('manage_events', 'event'), upload.single('banner'), createEvent);
router.put('/events/:id', authorizePolicy('manage_events', 'event'), upload.single('banner'), updateEvent);
router.get('/events', getDepartmentEvents);
router.delete('/events/:id', authorizePolicy('manage_events', 'event'), deleteEvent);

// Content Management
router.post('/content', authorizePolicy('manage_dept_content', 'content'), createContent);
router.get('/content', getDepartmentContent);

// Gallery Management
router.post('/gallery', authorizePolicy('manage_dept_branding', 'department'), upload.single('image'), createGalleryItem);
router.get('/gallery', getDepartmentGallery);
router.delete('/gallery/:id', authorizePolicy('manage_dept_branding', 'department'), deleteGalleryItem);

export default router;
