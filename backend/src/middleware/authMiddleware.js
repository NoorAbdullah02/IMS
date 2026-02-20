import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Support both Header-based and Query-based tokens (for direct link downloads)
    const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

    if (!token) {
        console.warn(`[Auth] No token detected for ${req.method} ${req.url}`);
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error('[Auth] JWT Verification Error:', err.message, '| Token source:', (authHeader ? 'Header' : 'Query'));
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
