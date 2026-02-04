import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users, refreshTokens } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/email.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, role, department, phone, batch } = req.body;

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
            role: role || 'student', // Default to student
            department,
            phone,
            batch
        }).returning();

        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });

        // --- Send Welcome Email ---
        try {
            await sendEmail({
                to: email,
                subject: 'Welcome to BAUET IMS - Account Initialized',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Welcome to BAUET IMS</h1>
                        </div>
                        <div style="padding: 30px; background: white;">
                            <p style="font-size: 16px; color: #64748b;">Hello <strong>${name}</strong>,</p>
                            <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Your institutional account has been successfully initialized. You are now part of the BAUET high-performance academic network.</p>
                            
                            <div style="margin: 30px 0; text-align: center;">
                                <a href="https://ims.bauet.edu" style="background: #4f46e5; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Access Your Portal</a>
                            </div>
                            
                            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                                <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Assigned Division:</strong> ${department}</p>
                                <p style="margin: 5px 0 0; font-size: 14px; color: #64748b;"><strong>Access Role:</strong> ${role || 'student'}</p>
                            </div>
                            
                            <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">If you did not initiate this registration, please contact the System Administrator immediately.</p>
                        </div>
                    </div>
                `
            });
            console.log(`Welcome email sent to ${email}`);
        } catch (emailErr) {
            console.error('Failed to send welcome email:', emailErr);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token
        // In production, hash this and store expiry properly
        // For simplicity here we store it directly or with separate logic
        // Usually DB store is good for revocation
        await db.insert(refreshTokens).values({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                department: user.department,
                batch: user.batch,
                profileImage: user.profilePhoto
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'Refresh Token is required' });

        // Check if token exists in DB
        const [storedToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
        if (!storedToken) return res.status(403).json({ message: 'Invalid refresh token' });

        // Verify JWT
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            // Fetch user
            const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
            if (!user) return res.status(403).json({ message: 'User not found' });

            const accessToken = generateAccessToken(user);
            res.json({ accessToken });
        } catch (err) {
            // If JWT is expired or invalid, remove from DB
            await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
            return res.status(403).json({ message: 'Refresh token expired or invalid' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
