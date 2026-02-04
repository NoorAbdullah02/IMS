import { db } from '../db/index.js';
import { users, results, notices, courses, enrollments, courseAssignments, admitCards, semesterRegistrations, semesters } from '../db/schema.js';
import { eq, and, or, isNull } from 'drizzle-orm';

const checkRegistration = async (studentId, semesterName) => {
    // Find semester ID from name
    const [sem] = await db.select().from(semesters).where(eq(semesters.name, semesterName));
    if (!sem) return false;

    const [reg] = await db.select().from(semesterRegistrations).where(and(
        eq(semesterRegistrations.studentId, studentId),
        eq(semesterRegistrations.semesterId, sem.id)
    ));

    return reg && reg.isPaid && reg.isRegistered;
};

export const getMyAdmitCards = async (req, res) => {
    try {
        const semester = req.query.semester ? req.query.semester.trim() : null;
        const studentId = req.user.id;

        if (!semester) {
            return res.status(400).json({ message: 'Semester is required' });
        }

        // Check registration
        const isRegistered = await checkRegistration(studentId, semester);
        if (!isRegistered) {
            return res.status(403).json({ message: 'Academic access locked. Please clear semester fees and confirm registration.' });
        }

        const myAdmitCards = await db.select().from(admitCards)
            .where(and(
                eq(admitCards.studentId, studentId),
                eq(admitCards.semester, semester)
            ));

        res.json(myAdmitCards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Exclude password
        const { password, ...profile } = user;
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getResults = async (req, res) => {
    try {
        const semester = req.query.semester ? req.query.semester.trim() : null;
        const studentId = req.user.id;

        if (semester) {
            const isRegistered = await checkRegistration(studentId, semester);
            if (!isRegistered) {
                return res.status(403).json({ message: 'Results locked. Financial compliance required.' });
            }
        }

        let whereClause = and(
            eq(results.studentId, studentId),
            eq(results.published, true)
        );

        if (semester) {
            whereClause = and(whereClause, eq(results.semester, semester));
        }

        const studentResults = await db.select({
            id: results.id,
            courseCode: courses.code,
            courseTitle: courses.title,
            examType: results.examType,
            marks: results.marks,
            grade: results.grade,
            semester: results.semester,
            fileUrl: results.fileUrl
        })
            .from(results)
            .innerJoin(courses, eq(results.courseId, courses.id))
            .where(whereClause);

        res.json(studentResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getNotices = async (req, res) => {
    try {
        // Fetch public notices + department notices + notices for student role
        const allNotices = await db.select().from(notices).where(
            eq(notices.postedBy, req.user.id) // Placeholder logic, needs proper filtering
        );
        res.json(allNotices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMyCourses = async (req, res) => {
    try {
        const semester = req.query.semester ? req.query.semester.trim() : null;
        const studentId = req.user.id;

        if (!semester) {
            return res.status(400).json({ message: 'Semester is required' });
        }

        // Check registration
        const isRegistered = await checkRegistration(studentId, semester);
        if (!isRegistered) {
            return res.status(403).json({ message: 'Course registration locked. Please clear semester fees.' });
        }

        // Fetch student info to get batch and department
        const [student] = await db.select().from(users).where(eq(users.id, studentId));
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Build filters for courses assigned to this student's batch and department
        const filters = [
            eq(courses.department, student.department),
            eq(courses.batch, student.batch)
        ];

        // Join with courseAssignments to see if this course is active in this semester
        const studentCourses = await db.select({
            id: courses.id,
            code: courses.code,
            title: courses.title,
            credit: courses.credit,
            batch: courses.batch,
            teacherName: users.name,
            semester: courseAssignments.semester
        })
            .from(courses)
            .leftJoin(courseAssignments, and(
                eq(courseAssignments.courseId, courses.id),
                eq(courseAssignments.semester, semester)
            ))
            .leftJoin(users, eq(courseAssignments.teacherId, users.id))
            .where(and(...filters));

        res.json(studentCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
