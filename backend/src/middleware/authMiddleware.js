import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.sendStatus(401);
        }

        // Verify user still exists in DB (to handle DB resets/seeding)
        try {
            const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
            if (!user) {
                console.warn(`[Auth] User ID ${decoded.id} not found in database. Token is stale.`);
                return res.sendStatus(401);
            }
            req.user = decoded;
            next();
        } catch (dbErr) {
            console.error('Database Verification Error during Auth:', dbErr);
            return res.sendStatus(500);
        }
    });
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};
