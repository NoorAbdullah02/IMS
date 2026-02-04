import { db } from '../db/index.js';
import { courses, courseAssignments, enrollments, users, results } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { upload } from '../utils/cloudinary.js';

// Get Courses assigned to the logged-in teacher
export const getMyCourses = async (req, res) => {
    try {
        const semester = req.query.semester ? req.query.semester.trim() : null;
        let whereClause = eq(courseAssignments.teacherId, req.user.id);

        if (semester) {
            whereClause = and(whereClause, eq(courseAssignments.semester, semester));
        }

        const myCourses = await db.select({
            id: courses.id,
            code: courses.code,
            title: courses.title,
            credit: courses.credit,
            batch: courses.batch,
            teacherName: users.name,
            semester: courseAssignments.semester
        })
            .from(courseAssignments)
            .innerJoin(courses, eq(courseAssignments.courseId, courses.id))
            .innerJoin(users, eq(courseAssignments.teacherId, users.id))
            .where(whereClause);

        res.json(myCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Students enrolled in a specific course (for Result Upload dropdown)
export const getEnrolledStudents = async (req, res) => {
    const { courseId } = req.params;
    const { semester } = req.query;

    try {
        let whereClause = eq(enrollments.courseId, courseId);

        if (semester) {
            whereClause = and(whereClause, eq(enrollments.semester, semester));
        }

        const students = await db.select({
            id: users.id,
            name: users.name,
            studentId: users.studentId
        })
            .from(enrollments)
            .innerJoin(users, eq(enrollments.studentId, users.id))
            .where(whereClause);

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload Result (Marks + File)
export const uploadResult = async (req, res) => {
    try {
        const { studentId, courseId, semester, examType, marks, grade } = req.body;
        const teacherId = req.user.id;

        // 1. Verify this teacher is assigned to this course and semester
        const [assignment] = await db.select().from(courseAssignments).where(
            and(
                eq(courseAssignments.courseId, parseInt(courseId)),
                eq(courseAssignments.teacherId, teacherId),
                eq(courseAssignments.semester, semester)
            )
        );

        if (!assignment) {
            return res.status(403).json({ message: 'You are not assigned to this course in this semester.' });
        }

        const fileUrl = req.file ? req.file.path : null;

        await db.insert(results).values({
            studentId: parseInt(studentId),
            courseId: parseInt(courseId),
            semester,
            examType,
            marks: parseInt(marks),
            grade,
            fileUrl,
            uploadedBy: teacherId,
            published: true
        });

        // Real-time notification for student
        import('../services/eventService.js').then(({ emitEvent, EVENTS }) => {
            db.select({ code: courses.code }).from(courses).where(eq(courses.id, parseInt(courseId))).then(([course]) => {
                emitEvent(EVENTS.RESULT_PUBLISHED, {
                    userId: parseInt(studentId),
                    title: 'New Result Published',
                    message: `${examType} result for ${course?.code || 'course'} is now available.`,
                    data: { courseId, semester, examType }
                });
            });
        });

        res.status(201).json({ message: 'Result uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Result
export const updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { marks, grade } = req.body;
        const updateData = { marks: parseInt(marks), grade };

        if (req.file) {
            updateData.fileUrl = req.file.path;
        }

        await db.update(results)
            .set(updateData)
            .where(eq(results.id, parseInt(id)));

        res.json({ message: 'Result updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get results for a specific course (for editing)
export const getResultsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { semester } = req.query;

        const filters = [eq(results.courseId, parseInt(courseId))];
        if (semester) {
            filters.push(eq(results.semester, semester));
        }

        const courseResults = await db.select({
            id: results.id,
            studentName: users.name,
            studentId: users.studentId,
            examType: results.examType,
            marks: results.marks,
            grade: results.grade,
            fileUrl: results.fileUrl,
            published: results.published,
            createdAt: results.createdAt
        })
            .from(results)
            .innerJoin(users, eq(results.studentId, users.id))
            .where(and(...filters));

        res.json(courseResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
