import { db } from './src/db/index.js';
import { attendance, users, courses } from './src/db/schema.js';
import { eq, and } from 'drizzle-orm';

async function testAttendance() {
    try {
        console.log('Testing Attendance DB operations...');

        // Find a teacher and a student
        const [teacher] = await db.select().from(users).where(eq(users.role, 'teacher')).limit(1);
        const [student] = await db.select().from(users).where(eq(users.role, 'student')).limit(1);
        const [course] = await db.select().from(courses).limit(1);

        if (!teacher || !student || !course) {
            console.error('Teacher, Student, or Course not found in DB. Run seed first.');
            return;
        }

        console.log(`Using Teacher: ${teacher.name} (${teacher.id})`);
        console.log(`Using Student: ${student.name} (${student.id})`);
        console.log(`Using Course: ${course.title} (${course.id})`);

        const courseId = course.id;
        const date = '2026-02-19';
        const semester = 'Spring 2025';
        const teacherId = teacher.id;

        // Simulate Controller Logic
        console.log('1. Deleting existing records...');
        await db.delete(attendance).where(and(
            eq(attendance.courseId, parseInt(courseId)),
            eq(attendance.date, date)
        ));

        console.log('2. Preparing data...');
        const attendanceData = [{
            courseId: parseInt(courseId),
            studentId: parseInt(student.id),
            date: date,
            status: 'present',
            remarks: 'Test remark',
            semester: semester,
            takenBy: teacherId
        }];

        console.log('3. Inserting records...');
        await db.insert(attendance).values(attendanceData);

        console.log('✅ Attendance DB operation success!');
    } catch (err) {
        console.error('❌ DB Operation Failed:', err);
    } finally {
        process.exit();
    }
}

testAttendance();
