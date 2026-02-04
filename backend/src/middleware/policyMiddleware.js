import { db } from '../db/index.js';
import { courseAssignments, auditLogs } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { evaluatePolicy } from './policyEngine.js';

export const authorizePolicy = (action, resource) => {
    return async (req, res, next) => {
        const user = req.user;
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const courseId = req.body?.courseId || req.query?.courseId;
        const semester = req.body?.semester || req.query?.semester;

        // Contextual data from request
        const context = {
            params: req.params,
            query: req.query,
            body: req.body,
            department: user.department,
            semester: semester,
            isAssigned: false
        };

        // Enrichment for Academic Resources
        if (resource === 'attendance' || resource === 'result') {
            if (courseId && semester) {
                const [assignment] = await db.select().from(courseAssignments).where(
                    and(
                        eq(courseAssignments.courseId, parseInt(courseId)),
                        eq(courseAssignments.teacherId, user.id),
                        eq(courseAssignments.semester, semester)
                    )
                );
                if (assignment) context.isAssigned = true;
            }
        }

        const isAllowed = await evaluatePolicy(user, action, resource, context);

        // --- Audit Logging ---
        try {
            const targetId = courseId || req.params.id || null;
            await db.insert(auditLogs).values({
                userId: user.id,
                action,
                resource,
                targetId: targetId ? String(targetId) : null,
                status: isAllowed ? 'allowed' : 'denied',
                ipAddress: req.ip || req.socket.remoteAddress,
                userAgent: req.headers['user-agent']
            });
        } catch (auditErr) {
            console.error('Audit Logging Failed:', auditErr);
            // Don't block the main flow if audit logging fails
        }

        if (!isAllowed) {
            return res.status(403).json({
                message: `Policy Denied: You do not have permission to ${action} on ${resource}.`,
                details: 'This action is restricted by the institutional governance policy.'
            });
        }

        next();
    };
};
