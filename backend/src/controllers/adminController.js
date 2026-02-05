import { db } from '../db/index.js';
import { users, generatedIds, payments, settings, semesters } from '../db/schema.js';
import { eq, desc, like, and, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// ... (existing code) ...

// Search Student (Super Admin & Dept Head)
export const searchStudent = async (req, res) => {
    try {
        const { q } = req.query; // Query: ID or Email
        if (!q) return res.status(400).json({ message: 'Query required' });

        // User Details
        const [student] = await db.select().from(users).where(
            or(eq(users.studentId, q), eq(users.email, q))
        );

        if (!student || student.role !== 'student') {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check Dept Head Permission
        if (req.user.role === 'dept_head' && student.department !== req.user.department) {
            return res.status(403).json({ message: 'Access denied: Student belongs to another department' });
        }

        // Fetch Financials
        const currentSemKey = await db.select().from(settings).where(eq(settings.key, 'current_semester'));
        const currentSemName = currentSemKey[0]?.value;
        const [sem] = await db.select().from(semesters).where(eq(semesters.name, currentSemName));

        const paymentsList = await db.select().from(payments)
            .where(eq(payments.studentId, student.id))
            .orderBy(desc(payments.createdAt));

        // Return aggregated data
        const { password, ...safeUser } = student;
        res.json({
            profile: safeUser,
            payments: paymentsList,
            currentSemester: sem ? sem.name : 'Unknown'
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Generate Student IDs (Numeric, Super Admin)
export const generateStudentIds = async (req, res) => {
    // ...
    // ... (existing code)
    try {
        const { count = 10, startFrom, department } = req.body;

        if (!department) {
            return res.status(400).json({ message: 'Department is required for ID generation.' });
        }

        let currentSequenceNumber;

        if (startFrom) {
            currentSequenceNumber = parseInt(startFrom);
        } else {
            // Find last ID for this specific department to increment correctly
            const allIds = await db.select({ idNumber: generatedIds.idNumber }).from(generatedIds);
            const deptIds = allIds.filter(id => id.idNumber.startsWith(`${department}-`));

            if (deptIds.length > 0) {
                // Extract numeric parts and find max
                const numbers = deptIds.map(id => {
                    const parts = id.idNumber.split('-');
                    return parseInt(parts[parts.length - 1]); // Handle formats like ICE-1001
                }).filter(n => !isNaN(n));

                if (numbers.length > 0) {
                    currentSequenceNumber = Math.max(...numbers) + 1;
                } else {
                    currentSequenceNumber = 100001;
                }
            } else {
                currentSequenceNumber = 100001; // Default starting for new dept
            }
        }

        const idsToInsert = [];
        for (let i = 0; i < Number(count); i++) {
            idsToInsert.push({
                idNumber: `${department}-${currentSequenceNumber + i}`, // Format: ICE-100001
                status: 'unused'
            });
        }

        const insertedIds = await db.insert(generatedIds).values(idsToInsert).returning();

        res.status(201).json({
            message: `Generated ${insertedIds.length} IDs for ${department}`,
            range: `${insertedIds[0].idNumber} - ${insertedIds[insertedIds.length - 1].idNumber}`,
            ids: insertedIds
        });

    } catch (error) {
        console.error('ID Gen Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// View Generated IDs
export const getGeneratedIds = async (req, res) => {
    try {
        const { department, status } = req.query;
        let conditions = [];

        if (department) {
            conditions.push(like(generatedIds.idNumber, `${department}-%`));
        }
        if (status) {
            conditions.push(eq(generatedIds.status, status));
        }

        const ids = await db.select({
            id: generatedIds.id,
            idNumber: generatedIds.idNumber,
            status: generatedIds.status,
            createdAt: generatedIds.createdAt,
            ownerName: users.name,
            ownerEmail: users.email
        })
            .from(generatedIds)
            .leftJoin(users, eq(generatedIds.idNumber, users.studentId))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(generatedIds.createdAt));

        res.json(ids);
    } catch (error) {
        console.error('View IDs Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all users (with optional department filter)
export const getAllUsers = async (req, res) => {
    try {
        const { dept } = req.query;
        let query = db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            department: users.department,
            phone: users.phone,
            batch: users.batch,
            createdAt: users.createdAt
        }).from(users);

        if (dept) {
            query = query.where(eq(users.department, dept));
        }

        const allUsers = await query.orderBy(desc(users.createdAt));
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user (Teacher, Dept Head, etc.)
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role, department, phone, designation, batch } = req.body;

        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role,
            department: department || null, // Super admin might not have dept
            phone,
            designation,
            batch
        }).returning();

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(users).where(eq(users.id, id));
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User (Role and Department)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, department, batch } = req.body;

        await db.update(users)
            .set({
                role: role,
                department: department || null,
                batch: batch || null
            })
            .where(eq(users.id, id));

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


