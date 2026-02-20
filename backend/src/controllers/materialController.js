import { db } from '../db/index.js';
import { materials, users, courses, courseAssignments, enrollments } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';

// Get materials (filtered by course/semester)
export const getMaterials = async (req, res) => {
    try {
        const { courseId, semester } = req.query;
        let whereConditions = [];

        if (courseId) {
            whereConditions.push(eq(materials.courseId, parseInt(courseId)));
        }
        if (semester) {
            whereConditions.push(eq(materials.semester, semester));
        }

        let query = db.select({
            id: materials.id,
            title: materials.title,
            description: materials.description,
            fileUrl: materials.fileUrl,
            courseId: materials.courseId,
            semester: materials.semester,
            courseName: courses.title,
            courseCode: courses.code,
            uploadedBy: users.name,
            createdAt: materials.createdAt
        })
            .from(materials)
            .leftJoin(courses, eq(materials.courseId, courses.id))
            .leftJoin(users, eq(materials.uploadedBy, users.id));

        if (whereConditions.length > 0) {
            query = query.where(and(...whereConditions));
        }

        const materialsList = await query.orderBy(desc(materials.createdAt));
        res.json(materialsList);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload material (Teacher, Coordinator, Admin)
export const uploadMaterial = async (req, res) => {
    try {
        const { title, description, courseId, semester, type } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // If user is a teacher or coordinator teaching a course, verify assignment
        if (userRole === 'teacher' || userRole === 'course_coordinator') {
            const [assignment] = await db.select().from(courseAssignments).where(
                and(
                    eq(courseAssignments.courseId, parseInt(courseId)),
                    eq(courseAssignments.teacherId, userId),
                    eq(courseAssignments.semester, semester)
                )
            );

            if (!assignment) {
                return res.status(403).json({ message: 'You can only upload materials for your assigned courses.' });
            }
        }

        const files = req.files;

        if (!files || files.length === 0) {
            console.error('[Upload] No files received');
            return res.status(400).json({ message: 'At least one file is required' });
        }

        console.log(`[Upload] Processing ${files.length} files for course ${courseId}`);

        // Fetch course to get department
        const [course] = await db.select().from(courses).where(eq(courses.id, parseInt(courseId)));
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const values = files.map(file => {
            console.log(`[Upload] File: ${file.originalname}, Path: ${file.path}`);
            return {
                title: files.length > 1 ? `${title} (${file.originalname})` : title,
                description,
                courseId: parseInt(courseId),
                semester: semester || null,
                department: course.department,
                type: type || 'material',
                fileUrl: file.path,
                uploadedBy: userId
            };
        });

        await db.insert(materials).values(values);

        // Real-time notification for enrolled students
        import('../services/eventService.js').then(async ({ emitEvent, EVENTS }) => {
            const enrolledStudents = await db.select({ id: enrollments.studentId })
                .from(enrollments)
                .where(and(
                    eq(enrollments.courseId, parseInt(courseId)),
                    eq(enrollments.semester, semester)
                ));

            for (const s of enrolledStudents) {
                emitEvent('MaterialUploaded', {
                    userId: s.id,
                    title: 'New Study Material',
                    message: `New material uploaded for ${course?.code || 'course'}: ${title}`,
                    data: { courseId, semester }
                });
            }
        });

        res.status(201).json({ message: 'Material uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete material
export const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const [material] = await db.select().from(materials).where(eq(materials.id, parseInt(id)));

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Only uploader or admin can delete
        if (material.uploadedBy !== userId && userRole !== 'super_admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await db.delete(materials).where(eq(materials.id, parseInt(id)));

        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update material
export const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const [material] = await db.select().from(materials).where(eq(materials.id, parseInt(id)));

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        if (material.uploadedBy !== userId && userRole !== 'super_admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (req.file) {
            console.log(`[Update] New file path: ${req.file.path}`);
            updateData.fileUrl = req.file.path;
        }

        await db.update(materials)
            .set(updateData)
            .where(eq(materials.id, parseInt(id)));

        res.json({ message: 'Material updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
