import { db } from '../db/index.js';
import { courses, courseAssignments, users } from '../db/schema.js';
import { eq, and, desc, or } from 'drizzle-orm';
import { createNotification } from './notificationController.js';

// Get all courses (for coordinators in their department)
export const getCourses = async (req, res) => {
    try {
        const userDept = req.user.department;
        const userRole = req.user.role;

        let courseList;

        if (userRole === 'super_admin') {
            courseList = await db.select().from(courses).orderBy(courses.code);
        } else if (userRole === 'course_coordinator') {
            // Course Coordinators see courses for their assigned batch AND department
            const filters = [eq(courses.department, userDept)];
            if (req.user.batch) {
                filters.push(eq(courses.batch, req.user.batch));
            }
            courseList = await db.select()
                .from(courses)
                .where(and(...filters))
                .orderBy(courses.code);
        } else if (userDept) {
            // Dept Heads / Admin see all courses in department
            courseList = await db.select()
                .from(courses)
                .where(eq(courses.department, userDept))
                .orderBy(courses.code);
        } else {
            courseList = [];
        }

        res.json(courseList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create course (Admin/Coordinator)
export const createCourse = async (req, res) => {
    try {
        const { code, title, credit, description } = req.body;
        let batch = req.body.batch;

        if (req.user.role === 'course_coordinator' && req.user.batch) {
            batch = req.user.batch;
        }

        const department = req.user.role === 'super_admin'
            ? req.body.department
            : req.user.department;

        await db.insert(courses).values({
            code,
            title,
            department,
            credit: parseInt(credit),
            description,
            batch
        });

        res.status(201).json({ message: 'Course created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, title, credit, description, batch } = req.body;

        await db.update(courses)
            .set({
                code,
                title,
                credit: parseInt(credit),
                description,
                batch
            })
            .where(eq(courses.id, parseInt(id)));

        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(courses).where(eq(courses.id, parseInt(id)));
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Assign teacher to course
export const assignTeacher = async (req, res) => {
    try {
        const { courseId, teacherId, semester } = req.body;

        const [teacher] = await db.select()
            .from(users)
            .where(and(
                eq(users.id, parseInt(teacherId)),
                or(
                    eq(users.role, 'teacher'),
                    eq(users.role, 'course_coordinator')
                )
            ));

        if (!teacher) {
            return res.status(400).json({ message: 'Invalid teacher ID' });
        }

        const [course] = await db.select()
            .from(courses)
            .where(eq(courses.id, parseInt(courseId)));

        if (!course) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }

        const [existingAssignment] = await db.select()
            .from(courseAssignments)
            .where(and(
                eq(courseAssignments.courseId, parseInt(courseId)),
                eq(courseAssignments.teacherId, parseInt(teacherId)),
                eq(courseAssignments.semester, semester)
            ));

        if (existingAssignment) {
            return res.status(400).json({ message: 'Teacher already assigned for this semester' });
        }

        await db.insert(courseAssignments).values({
            courseId: parseInt(courseId),
            teacherId: parseInt(teacherId),
            semester,
            assignedBy: req.user.id
        });

        // Create notification for the teacher
        await createNotification(
            teacher.id,
            'New Course Assignment',
            `You have been assigned to teach ${course.code} - ${course.title} for ${semester}.`,
            'success'
        );

        // Real-time notification for the teacher
        import('../services/eventService.js').then(({ emitEvent, EVENTS }) => {
            emitEvent(EVENTS.COURSE_ASSIGNED, {
                userId: teacher.id,
                title: 'New Course Assigned',
                message: `You have been assigned to teach ${course.code} for ${semester}.`,
                data: { courseId, semester }
            });
        });

        res.status(201).json({ message: 'Teacher assigned successfully' });
    } catch (error) {
        console.error('assignTeacher Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get course assignments
export const getCourseAssignments = async (req, res) => {
    try {
        const { semester } = req.query;
        let whereClause = undefined;

        if (semester) {
            whereClause = whereClause ? and(whereClause, eq(courseAssignments.semester, semester)) : eq(courseAssignments.semester, semester);
        }

        if (req.user.role === 'course_coordinator' && req.user.batch) {
            whereClause = whereClause ? and(whereClause, eq(courses.batch, req.user.batch)) : eq(courses.batch, req.user.batch);
        }

        let query = db.select({
            id: courseAssignments.id,
            courseCode: courses.code,
            courseTitle: courses.title,
            teacherName: users.name,
            teacherEmail: users.email,
            semester: courseAssignments.semester,
            createdAt: courseAssignments.createdAt
        })
            .from(courseAssignments)
            .leftJoin(courses, eq(courseAssignments.courseId, courses.id))
            .leftJoin(users, eq(courseAssignments.teacherId, users.id));

        if (whereClause) {
            query = query.where(whereClause);
        }

        const assignments = await query.orderBy(desc(courseAssignments.createdAt));
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get teachers in department
export const getDepartmentTeachers = async (req, res) => {
    try {
        const userDept = req.user.department;

        const teachers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            designation: users.designation
        })
            .from(users)
            .where(and(
                or(
                    eq(users.role, 'teacher'),
                    eq(users.role, 'course_coordinator')
                ),
                eq(users.department, userDept)
            ));

        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
