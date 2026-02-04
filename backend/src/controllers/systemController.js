import { db } from '../db/index.js';
import { settings, users, courses, notices } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export const getSettings = async (req, res) => {
    try {
        const allSettings = await db.select().from(settings);
        const config = {};
        allSettings.forEach(s => {
            config[s.key] = s.value;
        });
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStats = async (req, res) => {
    try {
        const [studentCount] = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.role, 'student'));
        const [teacherCount] = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.role, 'teacher'));
        const [courseCount] = await db.select({ count: sql`count(*)` }).from(courses);
        const [noticeCount] = await db.select({ count: sql`count(*)` }).from(notices);

        res.json({
            students: parseInt(studentCount.count),
            teachers: parseInt(teacherCount.count),
            courses: parseInt(courseCount.count),
            notices: parseInt(noticeCount.count)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;

        // Check if setting exists
        const [existing] = await db.select().from(settings).where(eq(settings.key, key));

        if (existing) {
            await db.update(settings)
                .set({ value, updatedAt: new Date() })
                .where(eq(settings.key, key));
        } else {
            await db.insert(settings).values({ key, value });
        }

        res.json({ message: `Setting ${key} updated successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
