import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../utils/email.js';

// Forgot Password - Send Reset Link
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            // Don't reveal if user exists for security
            return res.json({ message: 'If that email exists, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = await bcrypt.hash(resetToken, 10);
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Store in DB
        await db.update(users)
            .set({
                resetToken: resetTokenHash,
                resetTokenExpiry
            })
            .where(eq(users.id, user.id));

        // Send email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}&email=${email}`;

        await sendEmail({
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>You requested a password reset. Click the link below:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link expires in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        });

        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user || !user.resetToken || !user.resetTokenExpiry) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Check if token expired
        if (new Date() > new Date(user.resetTokenExpiry)) {
            return res.status(400).json({ message: 'Reset token has expired' });
        }

        // Verify token
        const isValidToken = await bcrypt.compare(token, user.resetToken);
        if (!isValidToken) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await db.update(users)
            .set({
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            })
            .where(eq(users.id, user.id));

        // Send confirmation email
        await sendEmail({
            to: email,
            subject: 'Password Changed Successfully',
            html: `
                <h2>Password Changed</h2>
                <p>Your password has been successfully changed.</p>
                <p>If you didn't make this change, please contact support immediately.</p>
            `
        });

        res.json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Change Password (for logged-in users)
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const [user] = await db.select().from(users).where(eq(users.id, userId));

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, userId));

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
