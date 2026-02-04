import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import bcrypt from 'bcrypt';

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
