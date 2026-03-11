import { db } from '../db/index.js';
import { users, courses, courseAssignments, enrollments, semesters, settings, notices, materials, results, notifications, refreshTokens, policies, departments, departmentEvents, departmentContent, departmentGallery, payments, semesterRegistrations, auditLogs, generatedIds, admitCards } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        console.log('🌱 Seeding BAUET Intelligence Network database...\n');

        // Clear existing data in correct dependency order
        await db.delete(generatedIds);
        await db.delete(auditLogs);
        await db.delete(notifications);
        await db.delete(results);
        await db.delete(enrollments);
        await db.delete(materials);
        await db.delete(notices);
        await db.delete(courseAssignments);
        await db.delete(courses);
        await db.delete(refreshTokens);
        await db.delete(payments);
        await db.delete(semesterRegistrations);
        await db.delete(admitCards);
        await db.delete(users);
        await db.delete(settings);
        await db.delete(semesters);
        await db.delete(policies);
        await db.delete(departmentGallery);
        await db.delete(departmentContent);
        await db.delete(departmentEvents);
        await db.delete(departments);
        console.log('✅ Previous data cleared');

        // Seed IDs (Format: DEPT-XXXXXX)
        const idList = [
            { idNumber: 'ICE-100001', status: 'unused' },
            { idNumber: 'ICE-100002', status: 'unused' },
            { idNumber: 'CSE-100001', status: 'unused' },
            { idNumber: 'CSE-100002', status: 'unused' },
            { idNumber: 'BBA-100001', status: 'unused' },
            { idNumber: 'EEE-100001', status: 'unused' },
            { idNumber: 'LAW-100001', status: 'unused' },
            { idNumber: 'ENG-100001', status: 'unused' }
        ];
        await db.insert(generatedIds).values(idList);
        console.log('✅ Student IDs Seeded');

        // Seed Policies
        const defaultPolicies = [
            // --- Teacher Policies ---
            { subject: 'teacher', action: 'view_courses', resource: 'course', allow: true, description: 'Teachers can view their assigned courses' },
            { subject: 'teacher', action: 'view_enrolled_students', resource: 'course', allow: true, description: 'Teachers can view students in their courses' },
            { subject: 'teacher', action: 'view_results', resource: 'result', allow: true, description: 'Teachers can view results' },
            {
                subject: 'teacher', action: 'mark_attendance', resource: 'attendance',
                conditions: JSON.stringify({ allOf: [{ field: 'context.isAssigned', op: 'eq', value: true }] }),
                description: 'Teachers can mark attendance for assigned courses'
            },
            { subject: 'teacher', action: 'view_attendance', resource: 'attendance', allow: true, description: 'Teachers can view attendance records' },
            { subject: 'teacher', action: 'view_report', resource: 'attendance', allow: true, description: 'Teachers can view attendance reports' },
            {
                subject: 'teacher', action: 'upload_result', resource: 'result',
                conditions: JSON.stringify({ allOf: [{ field: 'context.isAssigned', op: 'eq', value: true }] }),
                description: 'Teachers can upload results for assigned courses'
            },
            { subject: 'teacher', action: 'create_notice', resource: 'notice', allow: true, description: 'Teachers can create notices' },

            // --- Department Head Policies ---
            { subject: 'dept_head', action: 'view_courses', resource: 'course', allow: true, description: 'Heads can view dept courses' },
            { subject: 'dept_head', action: 'manage_dept_branding', resource: 'department', allow: true, description: 'Heads can manage branding' },
            { subject: 'dept_head', action: 'manage_events', resource: 'event', allow: true, description: 'Heads can manage events' },
            { subject: 'dept_head', action: 'manage_dept_content', resource: 'content', allow: true, description: 'Heads can manage faculty list' },
            { subject: 'dept_head', action: 'view_attendance', resource: 'attendance', allow: true, description: 'Heads can view dept attendance' },

            // --- Course Coordinator Policies ---
            { subject: 'course_coordinator', action: 'view_courses', resource: 'course', allow: true, description: 'Coordinators can view all courses' },
            { subject: 'course_coordinator', action: 'create_course', resource: 'course', allow: true, description: 'Coordinators can create courses' },
            { subject: 'course_coordinator', action: 'assign_teacher', resource: 'course', allow: true, description: 'Coordinators assign teachers' },

            // --- Treasurer Policies ---
            { subject: 'treasurer', action: 'manage_payments', resource: 'finance', allow: true, description: 'Treasurer manages finance' },
            { subject: 'treasurer', action: 'verify_payment', resource: 'payment', allow: true, description: 'Treasurer verifies records' },

            // --- Admin & Super Admin ---
            { subject: 'super_admin', action: 'view_courses', resource: 'course', allow: true, description: 'Full access' },
            { subject: 'super_admin', action: 'manage_policies', resource: 'policy', allow: true, description: 'Governance control' },
            { subject: 'admin', action: 'view_courses', resource: 'course', allow: true, description: 'System administration' }
        ];
        await db.insert(policies).values(defaultPolicies);
        console.log('✅ Governance Policies created');

        // Seed Departments
        await db.insert(departments).values([
            { name: 'ICE', totalProgramFee: 700000, description: 'Information and Communication Engineering' },
            { name: 'CSE', totalProgramFee: 700000, description: 'Computer Science and Engineering' },
            { name: 'EEE', totalProgramFee: 700000, description: 'Electrical and Electronic Engineering' },
            { name: 'BBA', totalProgramFee: 400000, description: 'Business Administration' },
            { name: 'LAW', totalProgramFee: 400000, description: 'Legal Studies' },
            { name: 'English', totalProgramFee: 400000, description: 'English Literature' }
        ]);
        console.log('✅ Departments seeded');

        // Create Semesters
        const [spring25] = await db.insert(semesters).values([
            { name: 'Spring 2025', isActive: true, paymentDeadline: new Date('2025-05-15'), registrationDeadline: new Date('2025-05-20') },
            { name: 'Fall 2024', isActive: false }
        ]).returning();

        await db.insert(settings).values({ key: 'current_semester', value: 'Spring 2025' });

        const hashedPassword = await bcrypt.hash('admin123', 10);

        // --- User Core ---
        // 1. Super Admin
        await db.insert(users).values({
            name: 'Gen. Super Admin', email: 'admin@bauet.edu', password: hashedPassword, role: 'super_admin', phone: '01700000001'
        });

        // 2. Admin
        await db.insert(users).values({
            name: 'Administrative Office', email: 'office@bauet.edu', password: hashedPassword, role: 'admin', phone: '01700000002'
        });

        // 3. Treasurer
        const [treasurer] = await db.insert(users).values({
            name: 'Maj. Finance Controller', email: 'treasurer@bauet.edu', password: hashedPassword, role: 'treasurer', phone: '01700000003'
        }).returning();

        // 4. Dept Heads
        await db.insert(users).values([
            { name: 'Dr. ICE Head', email: 'ice.head@bauet.edu', password: hashedPassword, role: 'dept_head', department: 'ICE' },
            { name: 'Dr. CSE Head', email: 'cse.head@bauet.edu', password: hashedPassword, role: 'dept_head', department: 'CSE' }
        ]);

        // 5. Coordinators
        await db.insert(users).values([
            { name: 'Capt. ICE Coordinator', email: 'coordinator@bauet.edu', password: hashedPassword, role: 'course_coordinator', department: 'ICE' },
            { name: 'Capt. CSE Coordinator', email: 'cse.coord@bauet.edu', password: hashedPassword, role: 'course_coordinator', department: 'CSE' }
        ]);

        // 6. Teachers
        const [teacher1, teacher2] = await db.insert(users).values([
            { name: 'Prof. Alice Smith', email: 'alice@faculty.edu', password: hashedPassword, role: 'teacher', department: 'ICE', designation: 'Assistant Professor' },
            { name: 'Prof. Bob Wilson', email: 'bob@faculty.edu', password: hashedPassword, role: 'teacher', department: 'CSE', designation: 'Lecturer' }
        ]).returning();

        // 7. Students (Bulk)
        const studentData = [
            { name: 'Noor Ahmed', email: 'noor@student.edu', studentId: 'ICE-100000', department: 'ICE', batch: 'Batch 12' },
            { name: 'Rahim Uddin', email: 'rahim@student.edu', studentId: 'CSE-100001', department: 'CSE', batch: 'Batch 15' },
            { name: 'Ayesha Khan', email: 'ayesha@student.edu', studentId: 'BBA-100000', department: 'BBA', batch: 'Batch 15' },
            { name: 'Sadiya Islam', email: 'sadiya@student.edu', studentId: 'LAW-100001', department: 'LAW', batch: 'Batch 10' },
            { name: 'Karim Sheikh', email: 'karim@student.edu', studentId: 'EEE-100001', department: 'EEE', batch: 'Batch 13' },
            { name: 'Borhan Ali', email: 'borhan@student.edu', studentId: 'ENG-100001', department: 'English', batch: 'Batch 11' }
        ];

        const seededStudents = await Promise.all(studentData.map(async (s) => {
            const [res] = await db.insert(users).values({
                ...s,
                password: hashedPassword,
                role: 'student'
            }).returning();
            return res;
        }));

        console.log('✅ All Users, Faculty & Students Seeded');

        // --- Academic Content ---
        const [c1, c2, c3] = await db.insert(courses).values([
            { code: 'ICE-2201', title: 'OOP', department: 'ICE', credit: 3, batch: 'Batch 12' },
            { code: 'ICE-2202', title: 'Data Comm', department: 'ICE', credit: 3, batch: 'Batch 12' },
            { code: 'CSE-1101', title: 'Algorithms', department: 'CSE', credit: 4, batch: 'Batch 15' }
        ]).returning();

        // Assignments
        await db.insert(courseAssignments).values([
            { courseId: c1.id, teacherId: teacher1.id, semester: 'Spring 2025' },
            { courseId: c2.id, teacherId: teacher1.id, semester: 'Spring 2025' },
            { courseId: c3.id, teacherId: teacher2.id, semester: 'Spring 2025' }
        ]);

        // Enrollments
        await db.insert(enrollments).values([
            { studentId: seededStudents[0].id, courseId: c1.id, semester: 'Spring 2025' },
            { studentId: seededStudents[0].id, courseId: c2.id, semester: 'Spring 2025' },
            { studentId: seededStudents[1].id, courseId: c3.id, semester: 'Spring 2025' }
        ]);

        // --- Finance ---
        // Register students for current semester
        await Promise.all(seededStudents.map(async (st) => {
            await db.insert(semesterRegistrations).values({
                studentId: st.id,
                semesterId: spring25.id,
                isPaid: st.email === 'noor@student.edu',
                isRegistered: st.email === 'noor@student.edu'
            });
        }));

        // Seed one payment for verified status
        await db.insert(payments).values({
            studentId: seededStudents[0].id,
            semesterId: spring25.id,
            amount: 87500,
            method: 'bKash',
            transactionId: 'BKASH-X920-TRX',
            status: 'verified',
            verifiedBy: treasurer.id
        });

        // --- Admit Cards ---
        await db.insert(admitCards).values([
            {
                studentId: seededStudents[0].id,
                semester: 'Spring 2025',
                examName: 'Midterm Examination',
                examDate: new Date('2025-03-15'),
                examTime: '10:00 AM',
                venue: 'Room 301, Academic Building',
                instructions: 'Bring your student ID.',
                generatedBy: treasurer.id, // Mocked generator
                fileUrl: '/uploads/admit-cards/test.pdf'
            }
        ]);

        console.log('\n🚀 SEEDING RE-INITIALIZATION COMPLETE');
        console.log('========================================');
        console.log('Super Admin:  admin@bauet.edu / admin123');
        console.log('Admin:        office@bauet.edu / admin123');
        console.log('Treasurer:    treasurer@bauet.edu / admin123');
        console.log('Dept Head:    ice.head@bauet.edu / admin123');
        console.log('Coordinator:  coordinator@bauet.edu / admin123');
        console.log('Teacher:      alice@faculty.edu / admin123');
        console.log('Student:      noor@student.edu / admin123 (ICE)');
        console.log('Student:      rahim@student.edu / admin123 (CSE)');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seed();

