import { db } from '../db/index.js';
import { users, courses, courseAssignments, enrollments, semesters, settings, notices, materials, results, notifications, refreshTokens, policies, departments, departmentEvents, departmentContent, departmentGallery } from '../db/schema.js';
import bcrypt from 'bcrypt';

const seed = async () => {
    try {
        console.log('🌱 Seeding database...\n');

        // Clear existing data
        await db.delete(notifications);
        await db.delete(enrollments);
        await db.delete(results);
        await db.delete(materials);
        await db.delete(notices);
        await db.delete(courseAssignments);
        await db.delete(courses);
        await db.delete(refreshTokens);
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
                subject: 'teacher',
                action: 'view_courses',
                resource: 'course',
                conditions: null,
                description: 'Teachers can view their courses'
            },
            {
                subject: 'teacher',
                action: 'view_enrolled_students',
                resource: 'course',
                conditions: null,
                description: 'Teachers can view enrolled students'
            },
            {
                subject: 'teacher',
                action: 'view_results',
                resource: 'result',
                conditions: null,
                description: 'Teachers can view results'
            },
            {
                subject: 'course_coordinator',
                action: 'assign_teacher',
                resource: 'course',
                conditions: null,
                description: 'Coordinators can assign teachers to courses'
            },
            {
                subject: 'course_coordinator',
                action: 'view_courses',
                resource: 'course',
                conditions: null,
                description: 'Coordinators can view courses'
            },
            {
                subject: 'dept_head',
                action: 'generate_admit_card',
                resource: 'admit_card',
                conditions: null,
                description: 'Department heads can generate admit cards'
            },
            {
                subject: 'dept_head',
                action: 'create_notice',
                resource: 'notice',
                conditions: null,
                description: 'Heads can create department notices'
            },
            {
                subject: 'dept_head',
                action: 'manage_dept_branding',
                resource: 'department',
                conditions: null,
                description: 'Heads can manage their department logo, banner, and mission'
            },
            {
                subject: 'dept_head',
                action: 'manage_events',
                resource: 'event',
                conditions: null,
                description: 'Heads can manage departmental events'
            },
            {
                subject: 'dept_head',
                action: 'manage_dept_content',
                resource: 'content',
                conditions: null,
                description: 'Heads can manage departmental showcases and research'
            },
            {
                subject: 'super_admin',
                action: 'manage_policies',
                resource: 'policy',
                conditions: null,
                description: 'Super admins can manage governance policies'
            }
        ];
        await db.insert(policies).values(defaultPolicies);
        console.log('✅ Policies created');

        // 0. Seed Department Metadata
        await db.insert(departments).values([
            {
                name: 'ICE',
                description: 'Department of Information and Communication Engineering (ICE) is a leading academic department dedicated to bridging the gap between information technology and communication systems.',
                vision: 'To be a globally recognized center of excellence in Information and Communication Engineering.',
                mission: 'To produce high-quality engineers and researchers who can contribute to the development of information and communication technologies.',
                achievements: 'Winner of National Tech Fest 2024, ISO Certified Academic Unit'
            },
            {
                name: 'CSE',
                description: 'Department of Computer Science and Engineering (CSE) focuses on the core principles of computing and their applications in software development, data science, and artificial intelligence.',
                vision: 'To innovate and lead in computer science education and research.',
                mission: 'To equip students with cutting-edge skills and knowledge in computing.',
                achievements: 'Top research output in AI/ML 2023, International Collegiate Programming Contest Finalists'
            }
        ]);
        console.log('✅ Department metadata seeded');

        // 1. Create Semesters
        await db.insert(semesters).values([
            { name: 'Spring 2025', isActive: true },
            { name: 'Fall 2024', isActive: false },
            { name: 'Summer 2024', isActive: false }
        ]);

        // 2. Initial Settings
        await db.insert(settings).values({
            key: 'current_semester',
            value: 'Spring 2025'
        });
        console.log('✅ Semesters & Settings created');

        const hashedPassword = await bcrypt.hash('admin123', 10);

        // 1. Super Admin
        const [superAdmin] = await db.insert(users).values({
            name: 'Super Admin',
            email: 'admin@bauet.edu',
            password: hashedPassword,
            role: 'super_admin',
            department: null,
            phone: '01700000001'
        }).returning();
        console.log('✅ Super Admin created: admin@bauet.edu / admin123');

        // 2. Department Heads (one per department)
        const [iceHead] = await db.insert(users).values({
            name: 'Dr. ICE Head',
            email: 'ice.head@bauet.edu',
            password: hashedPassword,
            role: 'dept_head',
            department: 'ICE',
            phone: '01700000002'
        }).returning();
        console.log('✅ ICE Dept Head: ice.head@bauet.edu / admin123');

        const [cseHead] = await db.insert(users).values({
            name: 'Dr. CSE Head',
            email: 'cse.head@bauet.edu',
            password: hashedPassword,
            role: 'dept_head',
            department: 'CSE',
            phone: '01700000003'
        }).returning();
        console.log('✅ CSE Dept Head: cse.head@bauet.edu / admin123');

        // 3. Course Coordinators
        const [iceCoordinator] = await db.insert(users).values({
            name: 'ICE Coordinator',
            email: 'ice.coord@bauet.edu',
            password: hashedPassword,
            role: 'course_coordinator',
            department: 'ICE',
            phone: '01700000004'
        }).returning();
        console.log('✅ ICE Coordinator: ice.coord@bauet.edu / admin123');

        // 4. Teachers
        const [teacher1] = await db.insert(users).values({
            name: 'Prof. Rahman',
            email: 'rahman@bauet.edu',
            password: hashedPassword,
            role: 'teacher',
            department: 'ICE',
            designation: 'Professor',
            phone: '01700000005'
        }).returning();
        console.log('✅ Teacher (ICE): rahman@bauet.edu / admin123');

        const [teacher2] = await db.insert(users).values({
            name: 'Prof. Khan',
            email: 'khan@bauet.edu',
            password: hashedPassword,
            role: 'teacher',
            department: 'CSE',
            designation: 'Associate Professor',
            phone: '01700000006'
        }).returning();
        console.log('✅ Teacher (CSE): khan@bauet.edu / admin123');

        // 5. Students
        const [student1] = await db.insert(users).values({
            name: 'Noor Ahmed',
            email: 'noor@student.edu',
            password: hashedPassword,
            role: 'student',
            department: 'ICE',
            studentId: 'ICE-2020-001',
            batch: 'Batch 12',
            phone: '01748269350'
        }).returning();
        console.log('✅ Student (ICE): noor@student.edu / admin123');

        const [student2] = await db.insert(users).values({
            name: 'Ayesha Khan',
            email: 'ayesha@student.edu',
            password: hashedPassword,
            role: 'student',
            department: 'ICE',
            studentId: 'ICE-2020-002',
            batch: 'Batch 12',
            phone: '01700000008'
        }).returning();
        console.log('✅ Student (ICE): ayesha@student.edu / admin123');

        const [student3] = await db.insert(users).values({
            name: 'Rakib Hassan',
            email: 'rakib@student.edu',
            password: hashedPassword,
            role: 'student',
            department: 'CSE',
            studentId: 'CSE-2020-001',
            batch: 'Batch 11',
            phone: '01700000009'
        }).returning();
        console.log('✅ Student (CSE): rakib@student.edu / admin123');

        // 6. Create Sample Courses
        const [course1] = await db.insert(courses).values({
            code: 'ICE-301',
            title: 'Digital Signal Processing',
            department: 'ICE',
            credit: 3,
            batch: 'Batch 12',
            description: 'Introduction to digital signal processing'
        }).returning();

        const [course2] = await db.insert(courses).values({
            code: 'ICE-302',
            title: 'Communication Systems',
            department: 'ICE',
            credit: 3,
            batch: 'Batch 12',
            description: 'Fundamentals of communication systems'
        }).returning();

        const [course3] = await db.insert(courses).values({
            code: 'CSE-401',
            title: 'Artificial Intelligence',
            department: 'CSE',
            credit: 3,
            batch: 'Batch 11',
            description: 'Introduction to AI and machine learning'
        }).returning();

        console.log('✅ Sample courses created');

        // 7. Assign courses to teachers
        await db.insert(courseAssignments).values({
            courseId: course1.id,
            teacherId: teacher1.id,
            semester: 'Spring 2025',
            assignedBy: iceCoordinator.id
        });

        await db.insert(courseAssignments).values({
            courseId: course2.id,
            teacherId: teacher1.id,
            semester: 'Spring 2025',
            assignedBy: iceCoordinator.id
        });

        await db.insert(courseAssignments).values({
            courseId: course3.id,
            teacherId: teacher2.id,
            semester: 'Spring 2025',
            assignedBy: cseHead.id
        });

        console.log('✅ Course assignments created');

        // 8. Enroll students
        await db.insert(enrollments).values([
            { studentId: student1.id, courseId: course1.id, semester: 'Spring 2025' },
            { studentId: student1.id, courseId: course2.id, semester: 'Spring 2025' },
            { studentId: student2.id, courseId: course1.id, semester: 'Spring 2025' },
            { studentId: student3.id, courseId: course3.id, semester: 'Spring 2025' }
        ]);

        console.log('✅ Student enrollments created\n');

        // 9. Seed Department Events
        await db.insert(departmentEvents).values([
            {
                department: 'ICE',
                title: 'International Seminar on 6G Technology',
                description: 'A deep dive into the future of wireless communication and the roadmap to 6G.',
                type: 'Seminar',
                visibility: 'public',
                venue: 'ICE Multimedia Lab',
                startTime: new Date('2025-03-15T10:00:00'),
                endTime: new Date('2025-03-15T13:00:00'),
                organizer: 'ICE Department',
                createdBy: iceHead.id
            },
            {
                department: 'CSE',
                title: 'Data Science Workshop 2025',
                description: 'Hands-on practical session on Python for Data Science and Machine Learning.',
                type: 'Workshop',
                visibility: 'department',
                venue: 'CSE Lab 01',
                startTime: new Date('2025-03-20T09:00:00'),
                endTime: new Date('2025-03-20T17:00:00'),
                organizer: 'CSE Programming Club',
                createdBy: cseHead.id
            }
        ]);
        console.log('✅ Department events seeded');

        // 10. Seed Department Content
        await db.insert(departmentContent).values([
            {
                department: 'ICE',
                title: 'ICE Newsletter - Winter 2024',
                type: 'newsletter',
                description: 'Reflecting on the achievements and research highlights of the last quarter.',
                fileUrl: 'https://example.com/ice-newsletter-w24.pdf'
            },
            {
                department: 'CSE',
                title: 'Research Highlight: Advances in Edge AI',
                type: 'research',
                description: 'Breakthrough research by CSE faculty on optimizing AI models for edge devices.',
                imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51'
            }
        ]);
        console.log('✅ Department content seeded');

        // 11. Seed Department Gallery
        await db.insert(departmentGallery).values([
            {
                department: 'ICE',
                imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585',
                caption: 'ICE Department Faculty Day 2024'
            },
            {
                department: 'CSE',
                imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
                caption: 'CSE Coding Competition - Hack-BAUET'
            }
        ]);
        console.log('✅ Department gallery seeded');

        console.log('========================================');
        console.log('📋 LOGIN CREDENTIALS (All use: admin123)');
        console.log('========================================');
        console.log('Super Admin:     admin@bauet.edu');
        console.log('ICE Dept Head:   ice.head@bauet.edu');
        console.log('CSE Dept Head:   cse.head@bauet.edu');
        console.log('ICE Coordinator: ice.coord@bauet.edu');
        console.log('Teacher (ICE):   rahman@bauet.edu');
        console.log('Teacher (CSE):   khan@bauet.edu');
        console.log('Student (ICE):   noor@student.edu');
        console.log('Student (ICE):   ayesha@student.edu');
        console.log('Student (CSE):   rakib@student.edu');
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        if (error.code === '23505') {
            console.log('⚠️  Database already seeded. To re-seed, truncate tables first.');
            process.exit(0);
        }
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seed();

