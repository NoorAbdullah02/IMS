import { db } from '../db/index.js';
import { notices, users } from '../db/schema.js';
import { eq, desc, and, or, isNull } from 'drizzle-orm';
import { sendEmail } from '../utils/email.js';

// Get all notices (filtered by department and target role)
export const getNotices = async (req, res) => {
    try {
        const userDept = req.user.department;
        const userRole = req.user.role;

        let noticesList;

        if (userRole === 'super_admin') {
            // Super admin sees all notices
            noticesList = await db.select({
                id: notices.id,
                title: notices.title,
                content: notices.content,
                attachmentUrl: notices.attachmentUrl,
                department: notices.department,
                targetRole: notices.targetRole,
                createdAt: notices.createdAt,
                authorName: users.name
            })
                .from(notices)
                .leftJoin(users, eq(notices.postedBy, users.id))
                .orderBy(desc(notices.createdAt));
        } else {
            const deptCondition = userDept
                ? or(eq(notices.department, userDept), isNull(notices.department))
                : isNull(notices.department);

            const roleCondition = or(eq(notices.targetRole, userRole), isNull(notices.targetRole));

            noticesList = await db.select({
                id: notices.id,
                title: notices.title,
                content: notices.content,
                attachmentUrl: notices.attachmentUrl,
                department: notices.department,
                targetRole: notices.targetRole,
                createdAt: notices.createdAt,
                authorName: users.name
            })
                .from(notices)
                .leftJoin(users, eq(notices.postedBy, users.id))
                .where(and(deptCondition, roleCondition))
                .orderBy(desc(notices.createdAt));
        }

        res.json(noticesList);
    } catch (error) {
        console.error('getNotices Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create notice (Teacher, Dept Head, Admin)
export const createNotice = async (req, res) => {
    try {
        const { title, content, department, targetRole } = req.body;
        const attachmentUrl = req.file ? req.file.path : null;

        const [newNotice] = await db.insert(notices).values({
            title,
            content,
            department: department || null,
            targetRole: targetRole || null,
            attachmentUrl,
            postedBy: req.user.id
        }).returning();

        // Real-time notification broadcast
        import('../services/eventService.js').then(({ emitEvent, EVENTS }) => {
            emitEvent(EVENTS.NOTICE_CREATED, {
                title: 'New Notice Posted',
                message: title,
                department: department || null,
                role: targetRole || null,
                data: newNotice
            });
        });

        res.status(201).json({ message: 'Notice created successfully', notice: newNotice });

        // --- Broadcast Email to Target Audience ---
        try {
            const deptCondition = department ? eq(users.department, department) : null;
            const roleCondition = targetRole ? eq(users.role, targetRole) : null;

            let conditions = [];
            if (deptCondition) conditions.push(deptCondition);
            if (roleCondition) conditions.push(roleCondition);

            const targetUsers = await db.select({ email: users.email, name: users.name })
                .from(users)
                .where(conditions.length > 0 ? and(...conditions) : undefined);

            if (targetUsers.length > 0) {
                const emailPromises = targetUsers.map(user => sendEmail({
                    to: user.email,
                    subject: `[Notice] ${title} - BAUET IMS`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                            <div style="background: #1e293b; padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">Institutional Notice</h1>
                            </div>
                            <div style="padding: 30px; background: white;">
                                <p style="font-size: 16px; color: #64748b;">Hello <strong>${user.name}</strong>,</p>
                                <p style="font-size: 16px; color: #1e293b;">A new notice has been published on the IMS Terminal:</p>
                                
                                <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
                                    <h2 style="font-size: 20px; color: #1e293b; margin-top: 0;">${title}</h2>
                                    <p style="margin: 15px 0 0; color: #475569; line-height: 1.6; font-size: 15px;">${content}</p>
                                </div>
                                
                                <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 30px;">
                                    Safe Login: <a href="https://ims.bauet.edu" style="color: #4f46e5; font-weight: bold; text-decoration: none;">Launch Dashboard &rarr;</a>
                                </p>
                            </div>
                        </div>
                    `
                }));

                await Promise.allSettled(emailPromises);
                console.log(`Successfully broadcasted notice emails to ${targetUsers.length} users.`);
            }
        } catch (emailErr) {
            console.error('Failed to broadcast notice emails:', emailErr);
        }
    } catch (error) {
        console.error('createNotice Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete notice (only creator or admin)
export const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const [notice] = await db.select().from(notices).where(eq(notices.id, parseInt(id)));

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        if (notice.postedBy !== userId && userRole !== 'super_admin') {
            return res.status(403).json({ message: 'Not authorized to delete this notice' });
        }

        await db.delete(notices).where(eq(notices.id, parseInt(id)));

        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('deleteNotice Error:', error);
        res.status(500).json({ message: error.message });
    }
};
