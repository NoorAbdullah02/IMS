
// Department Head Controllers

import { db } from '../db/index.js';
import { users, admitCards, enrollments, courses } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

// Get Users of the same department as the Head
export const getDeptUsers = async (req, res) => {
    try {
        const currentUser = req.user;
        if (!currentUser.department) {
            return res.status(400).json({ message: 'You do not belong to a department.' });
        }

        const deptUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            phone: users.phone,
            studentId: users.studentId
        })
            .from(users)
            .where(eq(users.department, currentUser.department));

        res.json(deptUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate Admit Cards for the Department
export const generateAdmitCards = async (req, res) => {
    try {
        const { examName, semester } = req.body;
        const currentUser = req.user;

        // 1. Get all students in this department
        const students = await db.select().from(users)
            .where(and(
                eq(users.department, currentUser.department),
                eq(users.role, 'student')
            ));

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found in this department.' });
        }

        // 2. Generate generic admit cards (stub logic for now)
        // In real app, this would generate a PDF via a library like 'pdfkit' or 'puppeteer'
        // Here we just create database entries

        await db.transaction(async (tx) => {
            for (const student of students) {
                await tx.insert(admitCards).values({
                    studentId: student.id,
                    examName,
                    semester,
                    generatedBy: currentUser.id,
                    fileUrl: `/api/student/admit-cards/download/${student.id}/${encodeURIComponent(semester)}`,
                    status: 'issued'
                });
            }
        });

        // Real-time notifications for all students in department
        import('../services/eventService.js').then(({ emitEvent, EVENTS }) => {
            for (const student of students) {
                emitEvent(EVENTS.ADMIT_CARD_GENERATED, {
                    userId: student.id,
                    title: 'Admit Card Issued',
                    message: `Your admit card for ${examName} is now available.`,
                    data: { examName, semester }
                });
            }
        });

        res.status(201).json({ message: `Admit cards generated for ${students.length} students.` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdmitCards = async (req, res) => {
    try {
        const { semester } = req.query;
        const currentUser = req.user;

        let whereConditions = [eq(users.department, currentUser.department)];
        if (semester) {
            whereConditions.push(eq(admitCards.semester, semester));
        }

        const cards = await db.select({
            id: admitCards.id,
            studentName: users.name,
            examName: admitCards.examName,
            semester: admitCards.semester,
            status: admitCards.status,
            fileUrl: admitCards.fileUrl
        })
            .from(admitCards)
            .innerJoin(users, eq(admitCards.studentId, users.id))
            .where(and(...whereConditions));

        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAdmitCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { examName, status } = req.body;

        const [updatedCard] = await db.update(admitCards)
            .set({ examName, status })
            .where(eq(admitCards.id, parseInt(id)))
            .returning();

        if (!updatedCard) {
            return res.status(404).json({ message: 'Admit card not found' });
        }

        res.json({ message: 'Admit card updated successfully', card: updatedCard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
