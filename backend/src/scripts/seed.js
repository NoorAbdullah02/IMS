import { db } from '../db/index.js';
import { users, courses, courseAssignments, enrollments, semesters, settings, notices, materials, results, notifications, refreshTokens, policies, departments, departmentEvents, departmentContent, departmentGallery, payments, semesterRegistrations, auditLogs, generatedIds, admitCards } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        console.log('🌱 Seeding BAUET Intelligence Network database...\n');

        // Clear existing data
        await db.delete(generatedIds); // Clear IDs first
        await db.delete(auditLogs);
        await db.delete(notifications);
        await db.delete(enrollments);
        await db.delete(results);
        await db.delete(materials);
        await db.delete(notices);
        await db.delete(courseAssignments);
        await db.delete(courses);
        await db.delete(refreshTokens);
        await db.delete(payments);
        await db.delete(semesterRegistrations);
        await db.delete(users);
        await db.delete(settings);
        await db.delete(semesters);
        await db.delete(policies);
        await db.delete(departmentGallery);
        await db.delete(departmentContent);
        await db.delete(departmentEvents);
        await db.delete(departments);
        console.log('✅ Previous data cleared');

        // Seed IDs (New Format)
        await db.insert(generatedIds).values([
            { idNumber: 'ICE-100001', status: 'unused' },
            { idNumber: 'ICE-100002', status: 'unused' },
            { idNumber: 'CSE-100001', status: 'unused' },
            { idNumber: 'CSE-100002', status: 'unused' },
            { idNumber: 'BBA-100001', status: 'unused' }
        ]);
        console.log('✅ Test Student IDs Seeded: ICE-10000X, CSE-10000X, BBA-10000X');

        // Seed Policies
        const defaultPolicies = [
            // --- Teacher Policies ---
            {
                subject: 'teacher',
                action: 'view_courses',
                resource: 'course',
                allow: true,
                description: 'Teachers can view their assigned courses'
            },
            {
                subject: 'teacher',
                action: 'view_enrolled_students',
                resource: 'course',
                allow: true,
                description: 'Teachers can view students in their courses'
            },
            {
                subject: 'teacher',
                action: 'view_results',
                resource: 'result',
                allow: true,
                description: 'Teachers can view results for their courses'
            },
            {
                subject: 'teacher',
                action: 'mark_attendance',
                resource: 'attendance',
                conditions: JSON.stringify({
                    allOf: [
                        { field: 'context.isAssigned', op: 'eq', value: true }
                    ]
                }),
                description: 'Teachers can mark attendance only for their assigned courses'
            },
            {
                subject: 'teacher',
                action: 'view_attendance',
                resource: 'attendance',
                allow: true,
                description: 'Teachers can view attendance records'
            },
            {
                subject: 'teacher',
                action: 'view_report',
                resource: 'attendance',
                allow: true,
                description: 'Teachers can view attendance reports'
            },
            {
                subject: 'teacher',
                action: 'upload_result',
                resource: 'result',
                conditions: JSON.stringify({
                    allOf: [
                        { field: 'context.isAssigned', op: 'eq', value: true }
                    ]
                }),
                description: 'Teachers can upload results only for their assigned courses'
            },
            {
                subject: 'teacher',
                action: 'update_result',
                resource: 'result',
                conditions: JSON.stringify({
                    allOf: [
                        { field: 'context.isAssigned', op: 'eq', value: true }
                    ]
                }),
                description: 'Teachers can update results for their assigned courses'
            },
            {
                subject: 'teacher',
                action: 'create_notice',
                resource: 'notice',
                allow: true,
                description: 'Teachers can create notices'
            },
            {
                subject: 'teacher',
                action: 'delete_notice',
                resource: 'notice',
                allow: true,
                description: 'Teachers can delete their own notices'
            },

            // --- Department Head Policies ---
            {
                subject: 'dept_head',
                action: 'view_courses',
                resource: 'course',
                allow: true,
                description: 'Heads can view all department courses'
            },
            {
                subject: 'dept_head',
                action: 'manage_dept_branding',
                resource: 'department',
                allow: true,
                description: 'Heads can manage their department identity'
            },
            {
                subject: 'dept_head',
                action: 'view_report',
                resource: 'attendance',
                allow: true,
                conditions: JSON.stringify({
                    allOf: [
                        { field: 'context.courseDepartment', op: 'eq', value: '$user.department' }
                    ]
                }),
                description: 'Heads can view attendance reports for their dept'
            },
            {
                subject: 'dept_head',
                action: 'view_attendance',
                resource: 'attendance',
                allow: true,
                conditions: JSON.stringify({
                    allOf: [
                        { field: 'context.courseDepartment', op: 'eq', value: '$user.department' }
                    ]
                }),
                description: 'Heads can view attendance records for their dept'
            },
            {
                subject: 'dept_head',
                action: 'manage_events',
                resource: 'event',
                allow: true,
                description: 'Heads can manage departmental events'
            },
            {
                subject: 'dept_head',
                action: 'manage_dept_content',
                resource: 'content',
                allow: true,
                description: 'Heads can manage faculty information'
            },
            {
                subject: 'dept_head',
                action: 'create_notice',
                resource: 'notice',
                allow: true,
                description: 'Heads can create official notices'
            },

            // --- Course Coordinator Policies ---
            {
                subject: 'course_coordinator',
                action: 'view_courses',
                resource: 'course',
                allow: true,
                description: 'Coordinators can view all courses'
            },
            {
                subject: 'course_coordinator',
                action: 'create_course',
                resource: 'course',
                allow: true,
                description: 'Coordinators can create new courses'
            },
            {
                subject: 'course_coordinator',
                action: 'update_course',
                resource: 'course',
                allow: true,
                description: 'Coordinators can update course details'
            },
            {
                subject: 'course_coordinator',
                action: 'delete_course',
                resource: 'course',
                allow: true,
                description: 'Coordinators can delete courses'
            },
            {
                subject: 'course_coordinator',
                action: 'assign_teacher',
                resource: 'course',
                allow: true,
                description: 'Coordinators can assign teachers to courses'
            },

            // --- Treasurer Policies ---
            {
                subject: 'treasurer',
                action: 'manage_payments',
                resource: 'finance',
                allow: true,
                description: 'Treasurer can manage student payments and fee structures'
            },
            {
                subject: 'treasurer',
                action: 'verify_payment',
                resource: 'payment',
                allow: true,
                description: 'Treasurer can verify and approve student payments'
            },

            {
                subject: 'super_admin',
                action: 'view_courses',
                resource: 'course',
                allow: true,
                description: 'Super admins can view all'
            },
            {
                subject: 'super_admin',
                action: 'manage_policies',
                resource: 'policy',
                allow: true,
                description: 'Super admins can manage governance'
            }
        ];
        await db.insert(policies).values(defaultPolicies);
        console.log('✅ Governance Policies created');

        // 0. Seed Department Metadata with Fee Structure
        // Engineering: 7,00,000 | Non-Eng: 4,00,000
        await db.insert(departments).values([
            {
                name: 'ICE',
                totalProgramFee: 700000,
                description: 'Information and Communication Engineering',
                vision: 'Center of communication excellence',
                mission: 'Produce elite communication engineers'
            },
            {
                name: 'CSE',
                totalProgramFee: 700000,
                description: 'Computer Science and Engineering',
                vision: 'Innovate computing',
                mission: 'Equip students with cutting-edge tech skills'
            },
            {
                name: 'EEE',
                totalProgramFee: 700000,
                description: 'Electrical and Electronic Engineering'
            },
            {
                name: 'BBA',
                totalProgramFee: 400000,
                description: 'Business Administration'
            },
            {
                name: 'LAW',
                totalProgramFee: 400000,
                description: 'Legal Studies'
            },
            {
                name: 'English',
                totalProgramFee: 400000,
                description: 'English Literature and Language'
            }
        ]);
        console.log('✅ Department meta & Fee structure seeded');

        // 1. Create Semesters
        const [spring25] = await db.insert(semesters).values([
            {
                name: 'Spring 2025',
                isActive: true,
                paymentDeadline: new Date('2025-05-15T23:59:59'),
                registrationDeadline: new Date('2025-05-20T23:59:59')
            },
            { name: 'Fall 2024', isActive: false }
        ]).returning();

        // 2. Initial Settings
        await db.insert(settings).values({
            key: 'current_semester',
            value: 'Spring 2025'
        });
        console.log('✅ Semesters & Payment Deadlines created');

        const hashedPassword = await bcrypt.hash('admin123', 10);

        // 1. Super Admin
        await db.insert(users).values({
            name: 'Gen. Super Admin',
            email: 'admin@bauet.edu',
            password: hashedPassword,
            role: 'super_admin',
            phone: '01700000001'
        });

        // 2. Treasurer (New Role)
        const [treasurer] = await db.insert(users).values({
            name: 'Maj. Treasurer',
            email: 'treasurer@bauet.edu',
            password: hashedPassword,
            role: 'treasurer',
            phone: '01700000050'
        }).returning();
        console.log('✅ Treasurer Account Created: treasurer@bauet.edu');

        // 3. Dept Heads
        await db.insert(users).values([
            {
                name: 'Dr. ICE Head', email: 'ice.head@bauet.edu', password: hashedPassword, role: 'dept_head', department: 'ICE'
            },
            {
                name: 'Dr. CSE Head', email: 'cse.head@bauet.edu', password: hashedPassword, role: 'dept_head', department: 'CSE'
            }
        ]);

        // 4. Course Coordinators
        await db.insert(users).values([
            {
                name: 'Capt. Coordinator', email: 'coordinator@bauet.edu', password: hashedPassword, role: 'course_coordinator', department: 'ICE'
            }
        ]);
        console.log('✅ Course Coordinator Account Created: coordinator@bauet.edu');

        // 5. Students
        const [student1] = await db.insert(users).values({
            name: 'Noor Ahmed',
            email: 'noor@student.edu',
            password: hashedPassword,
            role: 'student',
            department: 'ICE',
            studentId: 'ICE-100000',
            batch: 'Batch 12'
        }).returning();

        const [student2] = await db.insert(users).values({
            name: 'Ayesha Khan',
            email: 'ayesha@student.edu',
            password: hashedPassword,
            role: 'student',
            department: 'BBA',
            studentId: 'BBA-100000',
            batch: 'Batch 15'
        }).returning();

        console.log('✅ Students & Faculty created');

        // 5. Sample Financial States
        // Student 1: Already Paid part of it
        await db.insert(payments).values({
            studentId: student1.id,
            semesterId: spring25.id,
            amount: 87500, // 700000 / 8
            method: 'bKash',
            transactionId: 'BKASH-X920-TRX',
            status: 'verified',
            verifiedBy: treasurer.id
        });

        await db.insert(semesterRegistrations).values({
            studentId: student1.id,
            semesterId: spring25.id,
            isPaid: true,
            isRegistered: true
        });

        await db.insert(semesterRegistrations).values({
            studentId: student2.id,
            semesterId: spring25.id,
            isPaid: false,
            isRegistered: false
        });

        console.log('✅ Initial Financial states established');

        // 6. Seed Courses
        const [course1, course2, course3] = await db.insert(courses).values([
            {
                code: 'ICE-2201',
                title: 'Object Oriented Programming',
                department: 'ICE',
                credit: 3,
                batch: 'Batch 12',
                description: 'Core programming concepts using C++ and Java'
            },
            {
                code: 'ICE-2202',
                title: 'Data Communications',
                department: 'ICE',
                credit: 3,
                batch: 'Batch 12',
                description: 'Fundamentals of data transmission and networking'
            },
            {
                code: 'CSE-1101',
                title: 'Introduction to Algorithms',
                department: 'CSE',
                credit: 4,
                batch: 'Batch 15',
                description: 'Basic algorithmic complexity and design'
            }
        ]).returning();

        // 7. Faculty Assignments
        const [teacher1] = await db.insert(users).values({
            name: 'Prof. Alice Smith',
            email: 'alice@faculty.edu',
            password: hashedPassword,
            role: 'teacher',
            department: 'ICE',
            designation: 'Assistant Professor'
        }).returning();

        await db.insert(courseAssignments).values([
            {
                courseId: course1.id,
                teacherId: teacher1.id,
                semester: 'Spring 2025'
            },
            {
                courseId: course2.id,
                teacherId: teacher1.id,
                semester: 'Spring 2025'
            }
        ]);

        // 8. Seed Enrollments (CRITICAL for taking attendance)
        await db.insert(enrollments).values([
            {
                studentId: student1.id,
                courseId: course1.id,
                semester: 'Spring 2025'
            },
            {
                studentId: student2.id,
                courseId: course1.id,
                semester: 'Spring 2025'
            },
            {
                studentId: student1.id,
                courseId: course2.id,
                semester: 'Spring 2025'
            }
        ]);

        console.log('✅ Academic Courses, Faculty Assignments & Student Enrollments Seeded');

        // Get Super Admin for generatedBy field
        const [superAdmin] = await db.select().from(users).where(eq(users.role, 'super_admin'));

        // 7. Seed Admit Cards (Midterm and Final)
        await db.insert(admitCards).values([
            {
                studentId: student1.id,
                semester: 'Spring 2025',
                examName: 'Midterm Examination',
                examDate: new Date('2025-03-15'),
                examTime: '10:00 AM',
                venue: 'Room 301, Academic Building',
                instructions: 'Bring your student ID card and admit card. No electronic devices allowed.',
                generatedBy: superAdmin.id,
                fileUrl: '/uploads/admit-cards/midterm-spring2025-noor.pdf'
            },
            {
                studentId: student1.id,
                semester: 'Spring 2025',
                examName: 'Final Examination',
                examDate: new Date('2025-06-20'),
                examTime: '2:00 PM',
                venue: 'Examination Hall A',
                instructions: 'Arrive 30 minutes before exam time. Bring your student ID card and admit card.',
                generatedBy: superAdmin.id,
                fileUrl: '/uploads/admit-cards/final-spring2025-noor.pdf'
            }
        ]);

        console.log('✅ Admit Cards (Midterm & Final) Seeded');


        console.log('========================================');
        console.log('💰 TREASURY & ACADEMIC SYSTEM SEEDED');
        console.log('========================================');
        console.log('Treasurer:   treasurer@bauet.edu / admin123');
        console.log('Student (A): noor@student.edu / admin123 (Registered/Paid)');
        console.log('Student (B): ayesha@student.edu / admin123 (Registered/Paid)');
        console.log('Teacher:     alice@faculty.edu / admin123');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seed();
