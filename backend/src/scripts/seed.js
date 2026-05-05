import { db } from '../db/index.js';
import {
    users, courses, courseAssignments, enrollments, semesters, settings,
    notices, materials, results, notifications, refreshTokens, policies,
    departments, departmentEvents, departmentContent, departmentGallery,
    payments, semesterRegistrations, auditLogs, generatedIds, admitCards
} from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        console.log('🌱 [SEED] Initializing BAUET Intelligence Network data sequence...\n');

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
        console.log('✅ Previous state purged');

        // Seed ID Pool (Academic Identifiers)
        const idPool = [
            { idNumber: 'ICE-2101001', status: 'unused' },
            { idNumber: 'ICE-2101002', status: 'unused' },
            { idNumber: 'ICE-2101003', status: 'unused' },
            { idNumber: 'CSE-2101001', status: 'unused' },
            { idNumber: 'CSE-2101002', status: 'unused' },
            { idNumber: 'EEE-2101001', status: 'unused' },
            { idNumber: 'BBA-2101001', status: 'unused' },
            { idNumber: 'LAW-2101001', status: 'unused' },
            { idNumber: 'ENG-2101001', status: 'unused' },
            { idNumber: 'ICE-2201001', status: 'unused' },
            { idNumber: 'ICE-2201002', status: 'unused' }
        ];
        await db.insert(generatedIds).values(idPool);
        console.log('✅ Identifier pool synchronized');

        // Core Governance Policies
        const corePolicies = [
            // Teacher Permissions
            { subject: 'teacher', action: 'view_courses', resource: 'course', allow: true, description: 'Academic visibility for assigned courses' },
            { subject: 'teacher', action: 'view_enrolled_students', resource: 'course', allow: true, description: 'Access to student lists for grading/attendance' },
            { subject: 'teacher', action: 'mark_attendance', resource: 'attendance', allow: true, description: 'Faculty attendance management' },
            { subject: 'teacher', action: 'view_attendance', resource: 'attendance', allow: true, description: 'Review daily attendance records' },
            { subject: 'teacher', action: 'view_report', resource: 'attendance', allow: true, description: 'Access to attendance analytics' },
            { subject: 'teacher', action: 'upload_result', resource: 'result', allow: true, description: 'Faculty assessment submission' },
            { subject: 'teacher', action: 'view_results', resource: 'result', allow: true, description: 'Access to departmental results' },
            { subject: 'teacher', action: 'update_result', resource: 'result', allow: true, description: 'Academic result modification' },

            // Department Head Permissions
            { subject: 'dept_head', action: 'manage_dept_branding', resource: 'department', allow: true },
            { subject: 'dept_head', action: 'issue_admit_card', resource: 'admit_card', allow: true },
            { subject: 'dept_head', action: 'assign_coordinator', resource: 'user', allow: true },
            { subject: 'dept_head', action: 'view_report', resource: 'attendance', allow: true },
            { subject: 'dept_head', action: 'view_attendance', resource: 'attendance', allow: true },
            { subject: 'dept_head', action: 'view_user', resource: 'user', allow: true },
            { subject: 'dept_head', action: 'view_results', resource: 'result', allow: true },
            { subject: 'dept_head', action: 'view_courses', resource: 'course', allow: true },
            { subject: 'dept_head', action: 'view_enrolled_students', resource: 'course', allow: true },
            { subject: 'dept_head', action: 'create_course', resource: 'course', allow: true },
            { subject: 'dept_head', action: 'update_course', resource: 'course', allow: true },
            { subject: 'dept_head', action: 'delete_course', resource: 'course', allow: true },
            { subject: 'dept_head', action: 'assign_teacher', resource: 'course', allow: true },
            { subject: 'dept_head', action: 'view_financials', resource: 'finance', allow: true },

            // Course Coordinator Permissions
            { subject: 'course_coordinator', action: 'create_course', resource: 'course', allow: true },
            { subject: 'course_coordinator', action: 'view_courses', resource: 'course', allow: true },
            { subject: 'course_coordinator', action: 'view_enrolled_students', resource: 'course', allow: true },
            { subject: 'course_coordinator', action: 'view_results', resource: 'result', allow: true },
            { subject: 'course_coordinator', action: 'update_result', resource: 'result', allow: true },
            { subject: 'course_coordinator', action: 'view_report', resource: 'attendance', allow: true },
            { subject: 'course_coordinator', action: 'view_attendance', resource: 'attendance', allow: true },
            { subject: 'course_coordinator', action: 'mark_attendance', resource: 'attendance', allow: true },
            { subject: 'course_coordinator', action: 'assign_teacher', resource: 'course', allow: true },

            // Administrative & Support Roles
            { subject: 'treasurer', action: 'manage_payments', resource: 'finance', allow: true },
            { subject: 'treasurer', action: 'verify_payment', resource: 'payment', allow: true },
            { subject: 'super_admin', action: 'all', resource: 'all', allow: true }
        ];
        await db.insert(policies).values(corePolicies);
        console.log('✅ Governance protocols active');

        // Academic Divisions
        await db.insert(departments).values([
            { name: 'ICE', totalProgramFee: 750000, description: 'Information & Communication Engineering - Specializing in smart systems and network intelligence.' },
            { name: 'CSE', totalProgramFee: 750000, description: 'Computer Science & Engineering - Engineering the digital frontier through AI and scalable systems.' },
            { name: 'EEE', totalProgramFee: 750000, description: 'Electrical & Electronic Engineering - Powering the future with sustainable energy and electronics.' },
            { name: 'BBA', totalProgramFee: 450000, description: 'Business Administration - Developing the next generation of strategic leaders and entrepreneurs.' },
            { name: 'LAW', totalProgramFee: 420000, description: 'Law & Justice - Upholding the principles of ethics and legal excellence.' },
            { name: 'English', totalProgramFee: 400000, description: 'English Literature & Linguistics - Refining communication and critical analysis.' }
        ]);
        console.log('✅ Academic divisions established');

        // Temporal States (Semesters)
        const [spring25, fall24] = await db.insert(semesters).values([
            { name: 'Spring 2025', isActive: true, paymentDeadline: new Date('2025-05-15'), registrationDeadline: new Date('2025-05-20') },
            { name: 'Fall 2024', isActive: false }
        ]).returning();

        await db.insert(settings).values({ key: 'current_semester', value: 'Spring 2025' });
        console.log('✅ Temporal parameters synchronized');

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const [superAdmin] = await db.insert(users).values({
            name: 'Brig. Gen. Md. Mostafa Kamal', email: 'admin@bauet.edu', password: hashedPassword, role: 'super_admin', phone: '01700000001'
        }).returning();

        await db.insert(users).values({
            name: 'Registrar Office (BAUET)', email: 'office@bauet.edu', password: hashedPassword, role: 'admin', phone: '01700000002'
        });

        // 3. Treasury (Treasurer)
        const [treasurer] = await db.insert(users).values({
            name: 'Major Md. Rafiqul Islam (Treasurer)', email: 'treasurer@bauet.edu', password: hashedPassword, role: 'treasurer', phone: '01700000003'
        }).returning();

        // 4. Department Leadership (Heads)
        await db.insert(users).values([
            { name: 'Prof. Dr. Mirza Fouzul Kabir', email: 'ice.head@bauet.edu', password: hashedPassword, role: 'dept_head', department: 'ICE' },
            { name: 'Prof. Mohammad S. Shariful Islam', email: 'cse.head@bauet.edu', password: hashedPassword, role: 'dept_head', department: 'CSE' }
        ]);

        // 5. Operations Commanders (Coordinators)
        await db.insert(users).values([
            { name: 'Capt. Sadia Jahan', email: 'coordinator@bauet.edu', password: hashedPassword, role: 'course_coordinator', department: 'ICE' },
            { name: 'Capt. Tanvir Ahmed', email: 'cse.coord@bauet.edu', password: hashedPassword, role: 'course_coordinator', department: 'CSE' }
        ]);

        // 6. Scientific Faculty (Teachers)
        const [t1, t2, t3, t4] = await db.insert(users).values([
            { name: 'Dr. Mohammad Ali', email: 'ali@faculty.edu', password: hashedPassword, role: 'teacher', department: 'ICE', designation: 'Professor' },
            { name: 'Dr. Sarah Johnson', email: 'sarah@faculty.edu', password: hashedPassword, role: 'teacher', department: 'CSE', designation: 'Associate Professor' },
            { name: 'Ms. Fahmida Rahman', email: 'fahmida@faculty.edu', password: hashedPassword, role: 'teacher', department: 'ICE', designation: 'Lecturer' },
            { name: 'Mr. Rafiqul Hasan', email: 'rafiq@faculty.edu', password: hashedPassword, role: 'teacher', department: 'EEE', designation: 'Assistant Professor' }
        ]).returning();

        // 7. Student Corps (Bulk Synchronization)
        const studentsToSeed = [
            { name: 'Noor-E-Abdullah', email: 'noor@student.edu', studentId: 'ICE-2101001', department: 'ICE', batch: 'Batch 12' },
            { name: 'Syed Rahim Uddin', email: 'rahim@student.edu', studentId: 'CSE-2101001', department: 'CSE', batch: 'Batch 15' },
            { name: 'Ayesha Siddiqua', email: 'ayesha@student.edu', studentId: 'BBA-2101001', department: 'BBA', batch: 'Batch 15' },
            { name: 'Abdullah Al Mamun', email: 'mamun@student.edu', studentId: 'EEE-2101001', department: 'EEE', batch: 'Batch 13' },
            { name: 'Sadiya Islam', email: 'sadiya@student.edu', studentId: 'LAW-2101001', department: 'LAW', batch: 'Batch 10' },
            { name: 'Mushfiqur Rahman', email: 'mushfiq@student.edu', studentId: 'ENG-2101001', department: 'English', batch: 'Batch 11' },
            { name: 'Tanvir Ahmed Joy', email: 'tanvir@student.edu', studentId: 'ICE-2101002', department: 'ICE', batch: 'Batch 12' },
            { name: 'Zarin Tasnim', email: 'zarin@student.edu', studentId: 'ICE-2101003', department: 'ICE', batch: 'Batch 13' },
            { name: 'Mahir Faisal', email: 'mahir@student.edu', studentId: 'CSE-2101002', department: 'CSE', batch: 'Batch 15' }
        ];

        const seededStudents = await Promise.all(studentsToSeed.map(async (s) => {
            const [res] = await db.insert(users).values({
                ...s,
                password: hashedPassword,
                role: 'student'
            }).returning();
            return res;
        }));

        console.log('✅ Personnel deployment complete');

        // --- Academic Infrastructure ---
        const [c1, c2, c3] = await db.insert(courses).values([
            { code: 'ICE-2201', title: 'Object-Oriented Programming', department: 'ICE', credit: 3, batch: 'Batch 12', description: 'Advanced OOP principles using Java.' },
            { code: 'ICE-2202', title: 'Data Communications', department: 'ICE', credit: 3, batch: 'Batch 12', description: 'Signal processing and networking fundamentals.' },
            { code: 'CSE-1101', title: 'Algorithms Design', department: 'CSE', credit: 4, batch: 'Batch 15', description: 'Algorithm complexity and optimization.' }
        ]).returning();

        // Faculty Allocation
        await db.insert(courseAssignments).values([
            { courseId: c1.id, teacherId: t1.id, semester: 'Spring 2025' },
            { courseId: c2.id, teacherId: t3.id, semester: 'Spring 2025' },
            { courseId: c3.id, teacherId: t2.id, semester: 'Spring 2025' }
        ]);

        // Student Enrollment Vectors
        await db.insert(enrollments).values([
            { studentId: seededStudents[0].id, courseId: c1.id, semester: 'Spring 2025' },
            { studentId: seededStudents[0].id, courseId: c2.id, semester: 'Spring 2025' },
            { studentId: seededStudents[6].id, courseId: c1.id, semester: 'Spring 2025' },
            { studentId: seededStudents[1].id, courseId: c3.id, semester: 'Spring 2025' }
        ]);

        // --- Treasury Records ---
        await Promise.all(seededStudents.map(async (st) => {
            await db.insert(semesterRegistrations).values({
                studentId: st.id,
                semesterId: spring25.id,
                isPaid: st.email === 'noor@student.edu',
                isRegistered: st.email === 'noor@student.edu'
            });
        }));

        // Verified Transaction
        await db.insert(payments).values({
            studentId: seededStudents[0].id,
            semesterId: spring25.id,
            amount: 87500,
            method: 'bKash',
            transactionId: 'BAUET-TRX-SP25-001',
            status: 'verified',
            verifiedBy: treasurer.id
        });

        await db.insert(notices).values([
            { title: 'Spring 2025 Midterm Schedule', content: 'Detailed schedule for midterms has been published. Check your portals.', department: 'ICE', postedBy: superAdmin.id },
            { title: 'Project Proposal Deadline', content: 'Submit 3rd-year project proposals by next week.', department: 'ICE', targetRole: 'student', postedBy: t1.id }
        ]);

        console.log('\n🚀 [SEQUENCE COMPLETE] BAUET Intelligence Network Re-Initialized');
        console.log('------------------------------------------------------------');
        console.log('Executive (Super Admin): admin@bauet.edu / admin123');
        console.log('Command (Registrar):      office@bauet.edu / admin123');
        console.log('Treasury (Treasurer):      treasurer@bauet.edu / admin123');
        console.log('ICE Portal (Head):         ice.head@bauet.edu / admin123');
        console.log('CSE Portal (Head):         cse.head@bauet.edu / admin123');
        console.log('Operations (Coordinator):  coordinator@bauet.edu / admin123');
        console.log('Scientific (Faculty):      ali@faculty.edu / admin123');
        console.log('Student Prime (Noor):      noor@student.edu / admin123');
        console.log('------------------------------------------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding malfunction detected:', error);
        process.exit(1);
    }
};

seed();
