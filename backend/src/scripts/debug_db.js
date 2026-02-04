import { db } from '../db/index.js';
import { courses, courseAssignments, users } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const debug = async () => {
    try {
        const allCourses = await db.select().from(courses);
        console.log('--- ALL COURSES ---');
        console.table(allCourses.map(c => ({ id: c.id, code: c.code, batch: c.batch })));

        const allTeachers = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.role, 'teacher'));
        console.log('\n--- TEACHERS ---');
        console.table(allTeachers);

        const studentId = 32; // Noor Ahmed
        const semester = 'Spring 2025';

        const [student] = await db.select().from(users).where(eq(users.id, studentId));
        console.log('\n--- STUDENT INFO ---');
        console.log(student.name, student.batch, student.department);

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
            .where(and(
                eq(courses.department, student.department),
                eq(courses.batch, student.batch)
            ));

        console.log('\n--- STUDENT COURSES QUERY RESULT ---');
        console.table(studentCourses);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

debug();
