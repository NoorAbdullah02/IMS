import { db } from '../index.js';
import { policies } from '../schema.js';

export const seedPolicies = async () => {
    console.log('Seeding Policies...');

    const defaultPolicies = [
        {
            subject: 'teacher',
            action: 'mark_attendance',
            resource: 'attendance',
            conditions: JSON.stringify({
                field: 'user.id',
                op: 'eq',
                value: '$context.body.takenBy' // Just an example, ideally we check assignment table in context
            }),
            description: 'Teachers can mark attendance for their courses'
        },
        {
            subject: 'teacher',
            action: 'upload_result',
            resource: 'result',
            conditions: null, // Allow all teachers for now, logic can be tightened
            description: 'Teachers can upload results'
        },
        {
            subject: 'course_coordinator',
            action: 'assign_course',
            resource: 'course',
            conditions: JSON.stringify({
                field: 'user.department',
                op: 'eq',
                value: '$context.body.department'
            }),
            description: 'Coordinators can assign courses within their department'
        },
        {
            subject: 'dept_head',
            action: 'generate_admit_card',
            resource: 'admit_card',
            conditions: null,
            description: 'Department heads can generate admit cards'
        },
        {
            subject: 'super_admin',
            action: 'create_notice',
            resource: 'notice',
            conditions: null,
            description: 'Admins can create global notices'
        }
    ];

    for (const p of defaultPolicies) {
        await db.insert(policies).values(p).onConflictDoNothing();
    }

    console.log('Policies seeded successfully!');
};
