import { db } from '../db/index.js';
import { departments, departmentEvents, departmentContent, departmentGallery, users, auditLogs } from '../db/schema.js';
import { eq, and, desc, or, count, gt } from 'drizzle-orm';
import { sendEmail } from '../utils/email.js';

// Get Overview for all departments (Used by Admin)
export const getDepartments = async (req, res) => {
    const depts = ['ICE', 'CSE', 'EEE', 'BBA', 'LAW', 'English'];
    try {
        const stats = await Promise.all(depts.map(async (dept) => {
            const usersInDept = await db.select({ role: users.role }).from(users).where(eq(users.department, dept));

            return {
                name: dept,
                studentCount: usersInDept.filter(u => u.role === 'student').length,
                teacherCount: usersInDept.filter(u => u.role === 'teacher' || u.role === 'dept_head' || u.role === 'course_coordinator').length
            };
        }));
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Department Metadata ---

export const getDepartmentPortal = async (req, res) => {
    try {
        const { deptName } = req.params;
        const [dept] = await db.select().from(departments).where(eq(departments.name, deptName));

        if (!dept) return res.status(404).json({ message: 'Department not found' });

        const events = await db.select().from(departmentEvents)
            .where(eq(departmentEvents.department, deptName))
            .orderBy(desc(departmentEvents.startTime));

        const contents = await db.select().from(departmentContent)
            .where(eq(departmentContent.department, deptName))
            .orderBy(desc(departmentContent.publishedAt));

        const gallery = await db.select().from(departmentGallery)
            .where(eq(departmentGallery.department, deptName))
            .orderBy(desc(departmentGallery.createdAt));

        const faculty = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
        }).from(users).where(
            and(
                eq(users.department, deptName),
                or(eq(users.role, 'teacher'), eq(users.role, 'dept_head'), eq(users.role, 'course_coordinator'))
            )
        );

        res.json({ department: dept, events, contents, gallery, faculty });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDepartmentMetadata = async (req, res) => {
    try {
        const { deptName } = req.params;
        const updates = { ...req.body };

        // Handle File Uploads (Multiple Fields)
        if (req.files) {
            if (req.files['logo'] && req.files['logo'][0]) {
                updates.logo = req.files['logo'][0].path;
            }
            if (req.files['banner'] && req.files['banner'][0]) {
                updates.banner = req.files['banner'][0].path;
            }
        }

        await db.update(departments).set(updates).where(eq(departments.name, deptName));

        res.json({ message: 'Department metadata updated successfully', logo: updates.logo, banner: updates.banner });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Department Events ---

export const createEvent = async (req, res) => {
    try {
        const { title, description, type, visibility, venue, startTime, endTime, organizer } = req.body;
        const department = req.user.department;
        const banner = req.file ? req.file.path : null;

        const [newEvent] = await db.insert(departmentEvents).values({
            department,
            title,
            description,
            type,
            visibility,
            venue,
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : null,
            organizer,
            banner,
            createdBy: req.user.id
        }).returning();

        res.status(201).json({ message: 'Event created successfully', event: newEvent });

        // --- Broadcast Email to Students ---
        try {
            const deptStudents = await db.select({ email: users.email, name: users.name })
                .from(users)
                .where(and(eq(users.department, department), eq(users.role, 'student')));

            if (deptStudents.length > 0) {
                const emailPromises = deptStudents.map(student => sendEmail({
                    to: student.email,
                    subject: `[New Event] ${title} - ${department} Portal`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                            <div style="background: #4f46e5; padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">New Academic Event</h1>
                            </div>
                            <div style="padding: 30px; background: white;">
                                <p style="font-size: 16px; color: #64748b;">Hello <strong>${student.name}</strong>,</p>
                                <p style="font-size: 16px; color: #1e293b;">A new event has been scheduled in the <strong>${department}</strong> department:</p>
                                
                                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <h2 style="font-size: 20px; color: #4f46e5; margin-top: 0;">${title}</h2>
                                    <p style="margin: 5px 0; color: #64748b;"><strong>Type:</strong> ${type}</p>
                                    <p style="margin: 5px 0; color: #64748b;"><strong>Venue:</strong> ${venue}</p>
                                    <p style="margin: 5px 0; color: #64748b;"><strong>Time:</strong> ${new Date(startTime).toLocaleString()}</p>
                                    <p style="margin: 15px 0 0; color: #475569; line-height: 1.6;">${description || 'No description provided.'}</p>
                                </div>
                                
                                <p style="font-size: 14px; color: #94a3b8;">This is an automated notification from the BAUET Institutional Management System.</p>
                            </div>
                        </div>
                    `
                }));

                await Promise.allSettled(emailPromises);
                console.log(`Successfully broadcasted event emails to ${deptStudents.length} students.`);
            }
        } catch (emailErr) {
            console.error('Failed to broadcast event emails:', emailErr);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDepartmentEvents = async (req, res) => {
    try {
        const deptName = req.user.role === 'super_admin' ? req.query.dept : req.user.department;
        const events = await db.select().from(departmentEvents)
            .where(eq(departmentEvents.department, deptName))
            .orderBy(desc(departmentEvents.startTime));
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(departmentEvents).where(eq(departmentEvents.id, parseInt(id)));
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, visibility, venue, startTime, endTime } = req.body;

        const updateData = {
            title, description, type, visibility, venue,
            startTime: startTime ? new Date(startTime) : undefined,
            endTime: endTime ? new Date(endTime) : null
        };

        if (req.file) {
            updateData.banner = req.file.path;
        }

        await db.update(departmentEvents)
            .set(updateData)
            .where(eq(departmentEvents.id, parseInt(id)));

        res.json({ message: 'Event updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Department Content ---

export const createContent = async (req, res) => {
    try {
        const { title, type, description, fileUrl, imageUrl } = req.body;
        const department = req.user.department;

        const [newContent] = await db.insert(departmentContent).values({
            department,
            title,
            type,
            description,
            fileUrl,
            imageUrl
        }).returning();

        res.status(201).json({ message: 'Content published successfully', content: newContent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDepartmentContent = async (req, res) => {
    try {
        const deptName = req.user.role === 'super_admin' ? req.query.dept : req.user.department;
        const contents = await db.select().from(departmentContent)
            .where(eq(departmentContent.department, deptName))
            .orderBy(desc(departmentContent.publishedAt));
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Dashboard Features ---

// --- Department Gallery ---

export const getDepartmentGallery = async (req, res) => {
    try {
        const deptName = req.user.role === 'super_admin' ? req.query.dept : req.user.department;
        const gallery = await db.select().from(departmentGallery)
            .where(eq(departmentGallery.department, deptName))
            .orderBy(desc(departmentGallery.createdAt));
        res.json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGalleryItem = async (req, res) => {
    try {
        const { title, description } = req.body;
        const department = req.user.department;
        const imageUrl = req.file ? req.file.path : req.body.imageUrl;

        if (!imageUrl) return res.status(400).json({ message: 'Image is required' });

        const [newItem] = await db.insert(departmentGallery).values({
            department,
            imageUrl,
            caption: title,
            description
        }).returning();

        res.status(201).json({ message: 'Gallery item uploaded successfully', item: newItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(departmentGallery).where(eq(departmentGallery.id, parseInt(id)));
        res.json({ message: 'Gallery item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDeptDashboardStats = async (req, res) => {
    try {
        const deptName = req.user.department;
        if (!deptName) {
            return res.status(400).json({ message: 'No department assigned to this user profile.' });
        }
        const [dept] = await db.select().from(departments).where(eq(departments.name, deptName));

        // Total Students
        const studentsCount = await db.select().from(users)
            .where(and(eq(users.department, deptName), eq(users.role, 'student')));

        // Total Teachers
        const teachersCount = await db.select().from(users)
            .where(and(eq(users.department, deptName), eq(users.role, 'teacher')));

        // Upcoming Events
        const upcomingEvents = await db.select().from(departmentEvents)
            .where(and(eq(departmentEvents.department, deptName), gt(departmentEvents.startTime, new Date())))
            .orderBy(departmentEvents.startTime)
            .limit(5);

        res.json({
            department: dept,
            name: deptName,
            students: studentsCount.length,
            teachers: teachersCount.length,
            upcomingEvents
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get list for landing page (Public)
export const getPublicDepartments = async (req, res) => {
    try {
        const list = await db.select().from(departments);
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
