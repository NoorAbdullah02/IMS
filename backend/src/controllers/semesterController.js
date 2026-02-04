import { db } from '../db/index.js';
import { semesters } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const getSemesters = async (req, res) => {
    try {
        const list = await db.select().from(semesters).orderBy(desc(semesters.createdAt));
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSemester = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });

        await db.insert(semesters).values({ name, isActive: false });
        res.status(201).json({ message: 'Semester created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSemester = async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(semesters).where(eq(semesters.id, parseInt(id)));
        res.json({ message: 'Semester deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleSemester = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        // If setting to active, deactivate all others first
        if (isActive) {
            await db.update(semesters).set({ isActive: false });
        }

        await db.update(semesters).set({ isActive }).where(eq(semesters.id, parseInt(id)));
        res.json({ message: 'Semester status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
