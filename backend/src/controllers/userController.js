import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [user] = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            department: users.department,
            phone: users.phone,
            profileImage: users.profilePhoto,
            studentId: users.studentId,
            designation: users.designation,
            createdAt: users.createdAt
        })
            .from(users)
            .where(eq(users.id, userId));

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, designation } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (designation) updateData.designation = designation;

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, userId));

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        const photoUrl = req.file ? req.file.path : null;

        if (!photoUrl) {
            return res.status(400).json({ message: 'No photo uploaded' });
        }

        await db.update(users)
            .set({ profilePhoto: photoUrl })
            .where(eq(users.id, userId));

        res.json({
            message: 'Profile photo updated successfully',
            profileImage: photoUrl
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
