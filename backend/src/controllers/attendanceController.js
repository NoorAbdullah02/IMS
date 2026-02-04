import { db } from '../db/index.js';
import { attendance, users, courses } from '../db/schema.js';
import { eq, and, sql, desc } from 'drizzle-orm';

// Take Attendance
export const takeAttendance = async (req, res) => {
    try {
        const { courseId, date, semester, students } = req.body;
        // students should be an array of { studentId, status, remarks }
        const teacherId = req.user.id;

        if (!students || !Array.isArray(students)) {
            return res.status(400).json({ message: 'Students data is required' });
        }

        // Delete existing attendance for this date/course to allow "overwrite/update" logic
        await db.delete(attendance).where(and(
            eq(attendance.courseId, parseInt(courseId)),
            eq(attendance.date, date)
        ));

        const attendanceData = students.map(s => ({
            courseId: parseInt(courseId),
            studentId: parseInt(s.studentId),
            date: date, // format: YYYY-MM-DD
            status: s.status, // present, absent, late
            remarks: s.remarks || null,
            semester: semester,
            takenBy: teacherId
        }));

        await db.insert(attendance).values(attendanceData);

        // Real-time notifications for students
        import('../services/eventService.js').then(async ({ emitEvent, EVENTS }) => {
            const [course] = await db.select().from(courses).where(eq(courses.id, parseInt(courseId)));
            for (const s of students) {
                emitEvent(EVENTS.ATTENDANCE_MARKED, {
                    userId: s.studentId,
                    title: 'Attendance Marked',
                    message: `You were marked ${s.status} in ${course?.code || 'course'} on ${date}`,
                    data: { courseId, date, status: s.status }
                });
            }
        });

        res.status(201).json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if attendance exists for a date
export const getAttendanceByDate = async (req, res) => {
    try {
        const { courseId, date } = req.query;
        if (!courseId || !date) return res.status(400).json({ message: 'Course ID and Date are required' });

        const records = await db.select({
            studentId: attendance.studentId,
            status: attendance.status,
            remarks: attendance.remarks
        })
            .from(attendance)
            .where(and(
                eq(attendance.courseId, parseInt(courseId)),
                eq(attendance.date, date)
            ));

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get Attendance Report for a course (Teacher/Coordinator/Head)
export const getCourseAttendanceReport = async (req, res) => {
    console.log(`[Attendance] Generating report for course ${req.query.courseId} semester ${req.query.semester}`);
    try {
        const { courseId, semester } = req.query;

        if (!courseId || !semester) {
            return res.status(400).json({ message: 'Course ID and Semester are required' });
        }

        const cIdInt = parseInt(courseId);
        if (isNaN(cIdInt)) {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }

        // Detailed log of all attendance records
        console.log(`[Attendance] Fetching records for ID ${cIdInt}...`);
        const records = await db.select({
            id: attendance.id,
            date: attendance.date,
            status: attendance.status,
            remarks: attendance.remarks,
            studentName: users.name,
            studentId: users.studentId,
            sysStudentId: users.id
        })
            .from(attendance)
            .innerJoin(users, eq(attendance.studentId, users.id))
            .where(and(
                eq(attendance.courseId, cIdInt),
                eq(attendance.semester, semester)
            ))
            .orderBy(desc(attendance.date));

        console.log(`[Attendance] Found ${records.length} records. Aggregating stats...`);

        // Percentage Calculation per student
        const statsRaw = await db.select({
            studentId: attendance.studentId,
            total: sql`count(*)`,
            present: sql`sum(case when status = 'present' then 1 else 0 end)`,
            late: sql`sum(case when status = 'late' then 1 else 0 end)`,
        })
            .from(attendance)
            .where(and(
                eq(attendance.courseId, cIdInt),
                eq(attendance.semester, semester)
            ))
            .groupBy(attendance.studentId);

        console.log(`[Attendance] Fetched ${statsRaw.length} stats rows. Resolving names...`);

        // Fetch student names separately
        const statsWithNames = await Promise.all(statsRaw.map(async (s) => {
            const [user] = await db.select({ name: users.name, studentId: users.studentId })
                .from(users).where(eq(users.id, s.studentId)).limit(1);

            const total = Number(s.total) || 0;
            const present = Number(s.present) || 0;
            const late = Number(s.late) || 0;

            return {
                studentId: s.studentId,
                studentName: user?.name || 'Unknown',
                displayStudentId: user?.studentId || 'N/A',
                totalClasses: total,
                presentClasses: present,
                lateClasses: late,
                percentage: total > 0
                    ? parseFloat((((present + late) / total) * 100).toFixed(2))
                    : 0
            };
        }));

        console.log(`[Attendance] Report generation complete.`);
        res.json({ records, stats: statsWithNames });
    } catch (error) {
        console.error('getCourseAttendanceReport Error:', error);
        res.status(500).json({
            message: 'Internal Server Error in Attendance Report',
            error: error.message,
            stack: error.stack
        });
    }
};

// Get My Attendance (Student)
export const getMyAttendance = async (req, res) => {
    try {
        const { semester } = req.query;
        const studentId = req.user.id;

        if (!semester) {
            return res.status(400).json({ message: 'Semester is required' });
        }

        const myRecords = await db.select({
            id: attendance.id,
            date: attendance.date,
            status: attendance.status,
            remarks: attendance.remarks,
            courseCode: courses.code,
            courseTitle: courses.title
        })
            .from(attendance)
            .innerJoin(courses, eq(attendance.courseId, courses.id))
            .where(and(
                eq(attendance.studentId, studentId),
                eq(attendance.semester, semester)
            ))
            .orderBy(desc(attendance.date));

        // Grouped Percentage per Course
        // Simplified query
        const statsRaw = await db.select({
            courseId: attendance.courseId,
            total: sql`count(*)`,
            present: sql`sum(case when ${attendance.status} = 'present' then 1 else 0 end)`,
            late: sql`sum(case when ${attendance.status} = 'late' then 1 else 0 end)`,
        })
            .from(attendance)
            .where(and(
                eq(attendance.studentId, studentId),
                eq(attendance.semester, semester)
            ))
            .groupBy(attendance.courseId);

        const stats = await Promise.all(statsRaw.map(async (s) => {
            const [course] = await db.select({ code: courses.code, title: courses.title })
                .from(courses).where(eq(courses.id, s.courseId)).limit(1);

            const total = Number(s.total) || 0;
            const present = Number(s.present) || 0;
            const late = Number(s.late) || 0;

            return {
                courseId: s.courseId,
                courseCode: course?.code || 'N/A',
                courseTitle: course?.title || 'Unknown Course',
                totalClasses: total,
                presentClasses: present,
                lateClasses: late,
                percentage: total > 0
                    ? parseFloat((((present + late) / total) * 100).toFixed(2))
                    : 0
            };
        }));

        res.json({ records: myRecords, stats });
    } catch (error) {
        console.error('getMyAttendance Error:', error);
        res.status(500).json({ message: error.message });
    }
};
