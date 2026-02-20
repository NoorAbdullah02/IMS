import { db } from '../db/index.js';
import { attendance, users, courses, enrollments } from '../db/schema.js';
import { eq, and, sql, desc } from 'drizzle-orm';
import fs from 'fs';

// Take Attendance
export const takeAttendance = async (req, res) => {
    try {
        console.log('[Attendance] Take Request Body:', JSON.stringify(req.body, null, 2));
        console.log('[Attendance] User ID (TakenBy):', req.user?.id);
        const { courseId, date, students } = req.body;
        const semester = req.body.semester ? String(req.body.semester).trim() : null;
        const teacherId = req.user.id;

        if (!courseId || !date || !semester || !students || !Array.isArray(students)) {
            return res.status(400).json({ message: 'Missing required attendance fields' });
        }

        const cIdInt = parseInt(courseId);
        if (isNaN(cIdInt)) {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }

        // Delete existing attendance for this date/course to allow "overwrite/update" logic
        await db.delete(attendance).where(and(
            eq(attendance.courseId, cIdInt),
            eq(attendance.date, date)
        ));

        if (students.length === 0) {
            return res.status(200).json({ message: 'No students to record' });
        }

        // Validate individual student records
        for (const s of students) {
            if (!s.studentId || !s.status) {
                return res.status(400).json({ message: 'Each student must have an ID and a status' });
            }
        }

        const attendanceData = students.map(s => ({
            courseId: cIdInt,
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
        try {
            const errorLog = `[${new Date().toISOString()}] takeAttendance Error: ${error.message}\nStack: ${error.stack}\n\n`;
            fs.appendFileSync('server_errors.log', errorLog);
        } catch (fsErr) {
            console.error('Failed to write to server_errors.log:', fsErr);
        }
        console.error('[Attendance] Take Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Check if attendance exists for a date
export const getAttendanceByDate = async (req, res) => {
    try {
        const { courseId, date } = req.query;
        if (!courseId || !date) return res.status(400).json({ message: 'Course ID and Date are required' });

        const cIdInt = parseInt(courseId);
        if (isNaN(cIdInt)) {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }

        const records = await db.select({
            studentId: attendance.studentId,
            status: attendance.status,
            remarks: attendance.remarks
        })
            .from(attendance)
            .where(and(
                eq(attendance.courseId, cIdInt),
                eq(attendance.date, date)
            ));

        res.json(records);
    } catch (error) {
        console.error('[Attendance] Check Error:', error);
        res.status(500).json({ message: error.message });
    }
};



// Get Attendance Report for a course (Teacher/Coordinator/Head)
export const getCourseAttendanceReport = async (req, res) => {
    console.log(`[Attendance] Generating report for course ${req.query.courseId} semester ${req.query.semester}`);
    try {
        const { courseId } = req.query;
        const semester = req.query.semester ? String(req.query.semester).trim() : null;

        if (!courseId || !semester) {
            return res.status(400).json({ message: 'Course ID and Semester are required' });
        }

        const cIdInt = parseInt(courseId);
        if (isNaN(cIdInt)) {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }

        // 1. Fetch all enrolled students for this course/semester
        const enrolledStudents = await db.select({
            id: users.id,
            name: users.name,
            studentId: users.studentId,
            batch: users.batch
        })
            .from(enrollments)
            .innerJoin(users, eq(enrollments.studentId, users.id))
            .where(and(
                eq(enrollments.courseId, cIdInt),
                eq(enrollments.semester, semester)
            ));

        console.log(`[Attendance] Found ${enrolledStudents.length} enrolled students.`);

        // 2. Fetch all detailed logs
        const records = await db.select({
            id: attendance.id,
            courseId: attendance.courseId,
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

        // 3. Aggregate stats from records
        const statsWithNames = enrolledStudents.map(student => {
            const studentRecords = records.filter(r => r.sysStudentId === student.id);
            const total = studentRecords.length;
            const present = studentRecords.filter(r => r.status === 'present').length;
            const late = studentRecords.filter(r => r.status === 'late').length;

            return {
                studentId: student.id,
                studentName: student.name,
                displayStudentId: student.studentId,
                batch: student.batch,
                totalClasses: total,
                presentClasses: present,
                lateClasses: late,
                percentage: total > 0
                    ? parseFloat((((present + late) / total) * 100).toFixed(2))
                    : 0
            };
        });

        // 4. Group by Session (Date)
        const sessionsMap = {};
        records.forEach(r => {
            if (!sessionsMap[r.date]) {
                sessionsMap[r.date] = {
                    date: r.date,
                    total: 0,
                    present: 0,
                    late: 0,
                    absent: 0
                };
            }
            sessionsMap[r.date].total++;
            if (r.status === 'present') sessionsMap[r.date].present++;
            else if (r.status === 'late') sessionsMap[r.date].late++;
            else sessionsMap[r.date].absent++;
        });

        const sessions = Object.values(sessionsMap).sort((a, b) => new Date(b.date) - new Date(a.date));

        console.log(`[Attendance] Report generation complete.`);
        res.json({ records, stats: statsWithNames, sessions });
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
