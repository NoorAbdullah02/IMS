import { db } from '../db/index.js';
import { users, courses, courseAssignments, enrollments, semesters, settings, notices, materials, results, notifications, refreshTokens, policies, departments, departmentEvents, departmentContent, departmentGallery, payments, semesterRegistrations } from '../db/schema.js';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        console.log('🌱 Seeding BAUET Intelligence Network database...\n');

        // Clear existing data
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

        // Seed Policies
        const defaultPolicies = [
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
                subject: 'dept_head',
                action: 'manage_dept_branding',
                resource: 'department',
                conditions: null,
                description: 'Heads can manage their department identity'
            },
            {
                subject: 'dept_head',
                action: 'manage_events',
                resource: 'event',
                conditions: null,
                description: 'Heads can manage departmental events'
            },
            {
                subject: 'treasurer',
                action: 'manage_payments',
                resource: 'finance',
                conditions: null,
                description: 'Treasurer can manage student payments and fee structures'
            },
            {
                subject: 'treasurer',
                action: 'verify_payment',
                resource: 'payment',
                conditions: null,
                description: 'Treasurer can verify and approve student payments'
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

        // 4. Students
        const [student1] = await db.insert(users).values({
            name: 'Noor Ahmed',
            email: 'noor@student.edu',
            password: hashedPassword,
            role: 'student',
            department: 'ICE',
            studentId: 'ICE-2020-001',
            batch: 'Batch 12'
        }).returning();

        const [student2] = await db.insert(users).values({
            name: 'Ayesha Khan',
            email: 'ayesha@student.edu',
            password: hashedPassword,
            role: 'student',
            department: 'BBA',
            studentId: 'BBA-2022-005',
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

        // Student 2: Pending Payment
        await db.insert(semesterRegistrations).values({
            studentId: student2.id,
            semesterId: spring25.id,
            isPaid: false,
            isRegistered: false
        });

        console.log('✅ Initial Financial states established');

        console.log('========================================');
        console.log('💰 TREASURY & PAYMENT SYSTEM SEEDED');
        console.log('========================================');
        console.log('Treasurer:   treasurer@bauet.edu / admin123');
        console.log('Student (Paid): noor@student.edu / admin123');
        console.log('Student (Pending): ayesha@student.edu / admin123');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seed();
