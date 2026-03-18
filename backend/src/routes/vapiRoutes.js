/**
 * Vapi AI Routes
 * Handles endpoints for Vapi AI integration
 */

import express from 'express';
import { createVapiSession, logVapiInteraction, verifyVapiWebhook } from '../services/vapiService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/vapi/session
 * Initialize Vapi session for both authenticated users and guests
 */
router.post('/session', async (req, res) => {
    try {
        let userData = null;

        // Try to authenticate user, but don't fail if not authenticated
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                // Attempt to verify token manually
                const jwt = await import('jsonwebtoken');
                const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_me');
                if (decoded) {
                    // Authenticated user - fetch full user data
                    userData = {
                        id: decoded.id,
                        name: decoded.name,
                        email: decoded.email,
                        role: decoded.role,
                        department: decoded.department || 'General'
                    };
                    console.log('🔐 Creating Vapi session for authenticated user:', userData.name);
                }
            }
        } catch (tokenError) {
            console.log('⚠️ Token verification failed, proceeding as guest');
        }

        // If not authenticated, create guest session
        if (!userData) {
            userData = {
                id: 'guest_' + Date.now(),
                name: 'Guest User',
                email: 'guest@bauet.edu.bd',
                role: 'guest',
                department: 'General'
            };
            console.log('👤 Creating Vapi session for guest user');
        }

        // Create session with error handling
        const sessionData = await createVapiSession(userData);
        console.log('✅ Session created successfully:', {
            publicKey: sessionData.publicKey ? 'present' : 'missing',
            assistantId: sessionData.assistantId ? 'present' : 'missing'
        });

        res.json(sessionData);
    } catch (error) {
        console.error('❌ Error creating Vapi session:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to initialize Vapi session',
            details: error.message
        });
    }
});

/**
 * GET /api/vapi/health
 * Check Vapi service health (no auth required)
 */
router.get('/health', (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Vapi service is active',
            publicKey: process.env.VAPI_PUBLIC_KEY ? '***configured***' : 'NOT_CONFIGURED'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Vapi service error' });
    }
});

/**
 * POST /api/vapi/log-interaction (require auth)
 * Log Vapi voice/text interactions for authenticated users
 */
router.post('/log-interaction', authenticateToken, async (req, res) => {
    try {
        const { transcript, response, duration, type } = req.body;

        const callData = {
            userId: req.user.id,
            transcript,
            response,
            duration,
            type, // 'voice' or 'text'
            metadata: {
                userRole: req.user.role,
                timestamp: new Date()
            }
        };

        const result = await logVapiInteraction(callData);
        res.json(result);
    } catch (error) {
        console.error('Error logging Vapi interaction:', error);
        res.status(500).json({ success: false, error: 'Failed to log interaction' });
    }
});

/**
 * POST /api/vapi/chat
 * Send text message to Vapi AI chat
 * Works for both authenticated users and guests
 */
router.post('/chat', async (req, res) => {
    try {
        const { message, userRole: bodyUserRole } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // Try to get user info from token, but allow guests and fallback to body role
        let userRole = 'guest';
        let userId = null;

        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (token) {
                const jwt = await import('jsonwebtoken');
                const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_me');
                if (decoded) {
                    userRole = decoded.role || 'guest';
                    userId = decoded.id;
                    console.log('🔐 Chat from authenticated user:', { userId, role: userRole });
                }
            }
        } catch (tokenError) {
            console.log('👤 Chat from guest user (no token or invalid token)');
        }

        // Fallback to userRole from request body if not determined from token
        if (userRole === 'guest' && bodyUserRole) {
            userRole = bodyUserRole;
            console.log('📨 Using userRole from request body:', userRole);
        }

        console.log('💬 Chat message received:', { userId, userRole, message });

        // Import intent processing service
        const { processIntent } = await import('../services/chatIntentService.js');

        // Process message and get response
        const result = processIntent(message, userRole);

        console.log('✅ Intent matched:', { intent: result.intent, role: userRole });

        res.json({
            success: true,
            message: result.response,
            replies: result.replies,
            intent: result.intent,
            type: 'text'
        });
    } catch (error) {
        console.error('❌ Error in chat endpoint:', error.message);
        res.status(500).json({ success: false, error: 'Chat request failed: ' + error.message });
    }
});

/**
 * POST /api/vapi/webhook
 * Receive webhook events from Vapi
 */
router.post('/webhook', (req, res) => {
    try {
        const payload = req.body;

        // Verify webhook
        if (!verifyVapiWebhook(payload)) {
            return res.status(401).json({ success: false, error: 'Invalid webhook' });
        }

        // Process webhook event
        console.log('Vapi Webhook received:', payload);

        res.json({ success: true });
    } catch (error) {
        console.error('Error processing Vapi webhook:', error);
        res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
});

export default router;
