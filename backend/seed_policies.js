import { db } from './src/db/index.js';
import { policies } from './src/db/schema.js';

const seedMissingPolicies = async () => {
    try {
        await db.insert(policies).values([
            {
                subject: 'dept_head',
                action: 'view_courses',
                resource: 'course',
                allow: true,
                description: 'Department heads can view all courses in the system'
            },
            {
                subject: 'teacher',
                action: 'view_courses',
                resource: 'course',
                allow: true,
                description: 'Teachers can view courses'
            },
            {
                subject: 'super_admin',
                action: 'view_courses',
                resource: 'course',
                allow: true,
                description: 'Super admins can view all'
            }
        ]);
        console.log('✅ Missing policies seeded');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding policies:', err);
        process.exit(1);
    }
};

seedMissingPolicies();
