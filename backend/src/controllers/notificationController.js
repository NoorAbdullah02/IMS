import { db } from '../db/index.js';
import { notifications } from '../db/schema.js';
import { eq, and, gt, desc, lt } from 'drizzle-orm';

// Cleanup old notifications (older than 7 days) every hour
setInterval(async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        await db.delete(notifications).where(lt(notifications.createdAt, sevenDaysAgo));
        console.log('--- Notification Cleanup Completed ---');
    } catch (error) {
        console.error('Notification Cleanup Error:', error);
    }
}, 3600000); // 1 hour

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        // Only show notifications from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const list = await db.select()
            .from(notifications)
            .where(and(
                eq(notifications.userId, userId),
                gt(notifications.createdAt, sevenDaysAgo)
            ))
            .orderBy(desc(notifications.createdAt));

        res.json(list);
    } catch (error) {
        console.error('getNotifications Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, parseInt(id)));
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, userId));
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function for other controllers to create notifications
export const createNotification = async (userId, title, message, type = 'info') => {
    try {
        await db.insert(notifications).values({
            userId,
            title,
            message,
            type
        });
    } catch (error) {
        console.error('createNotification Error:', error);
    }
};
