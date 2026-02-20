import { getIo } from './socketInstance.js';
import { db } from '../db/index.js';
import { notifications } from '../db/schema.js';

export const emitEvent = async (event, payload) => {
    const io = getIo();
    if (!io) {
        console.warn(`[EventService] Attempted to emit ${event} but Socket.IO is not initialized yet.`);
        return;
    }

    const { type, userId, role, department, title, message, data } = payload;

    console.log(`Emitting event: ${event}`, payload);

    // 1. Send via Socket.IO
    if (userId) {
        io.to(`user:${userId}`).emit(event, payload);
    } else if (role) {
        io.to(`role:${role}`).emit(event, payload);
    } else if (department) {
        io.to(`dept:${department}`).emit(event, payload);
    } else {
        io.emit(event, payload);
    }

    // 2. Persistent Notification in DB (optional but good for history)
    if (userId && title && message) {
        try {
            await db.insert(notifications).values({
                userId: parseInt(userId),
                title,
                message,
                type: type || 'info'
            });
        } catch (err) {
            console.error('Error saving notification to DB:', err);
        }
    }
};

export const EVENTS = {
    ATTENDANCE_MARKED: 'AttendanceMarked',
    RESULT_PUBLISHED: 'ResultPublished',
    NOTICE_CREATED: 'NoticeCreated',
    ADMIT_CARD_GENERATED: 'AdmitCardGenerated',
    COURSE_ASSIGNED: 'CourseAssigned'
};
