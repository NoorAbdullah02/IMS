/**
 * Vapi AI Service
 * Handles Vapi AI integration for voice and text assistance
 */

import axios from 'axios';

const VAPI_BASE_URL = 'https://api.vapi.ai';
const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
const VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

// Log missing configuration
if (!VAPI_PRIVATE_KEY) console.warn('⚠️ VAPI_PRIVATE_KEY not configured');
if (!VAPI_PUBLIC_KEY) console.warn('⚠️ VAPI_PUBLIC_KEY not configured');
if (!VAPI_ASSISTANT_ID) console.warn('⚠️ VAPI_ASSISTANT_ID not configured');

// Initialize Vapi API client
const vapiClient = axios.create({
    baseURL: VAPI_BASE_URL,
    headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
    }
});

/**
 * Create or get a Vapi assistant session
 * @param {Object} userData - User information
 * @returns {Promise<Object>} - Session data with token
 */
export const createVapiSession = async (userData) => {
    try {
        const assistantId = VAPI_ASSISTANT_ID;

        if (!assistantId) {
            console.error('❌ VAPI_ASSISTANT_ID is not configured');
            throw new Error('Vapi Assistant ID not configured. Please set VAPI_ASSISTANT_ID in environment variables.');
        }

        if (!VAPI_PUBLIC_KEY) {
            console.error('❌ VAPI_PUBLIC_KEY is not configured');
            throw new Error('Vapi Public Key not configured. Please set VAPI_PUBLIC_KEY in environment variables.');
        }

        const sessionData = {
            assistantId: assistantId,
            customerName: userData.name || 'User',
            customerId: userData.id,
            metadata: {
                role: userData.role,
                department: userData.department || 'General',
                email: userData.email
            }
        };

        console.log('✅ Vapi session created for user:', userData.name, 'with assistant:', assistantId);

        // Return session data with public key for client-side initialization
        return {
            success: true,
            publicKey: VAPI_PUBLIC_KEY,
            assistantId: assistantId,
            customerData: sessionData
        };
    } catch (error) {
        console.error('❌ Vapi session creation error:', error.message);
        throw error;
    }
};

/**
 * Log Vapi interaction/call data
 * @param {Object} callData - Call information
 * @returns {Promise<Object>} - Logged data
 */
export const logVapiInteraction = async (callData) => {
    try {
        const logEntry = {
            timestamp: new Date(),
            userId: callData.userId,
            callDuration: callData.duration,
            messageType: callData.type, // 'voice' or 'text'
            transcript: callData.transcript,
            assistantResponse: callData.response,
            metadata: callData.metadata || {}
        };

        console.log('📝 Vapi Interaction Logged:', logEntry);
        return { success: true, logEntry };
    } catch (error) {
        console.error('❌ Error logging Vapi interaction:', error);
        throw error;
    }
};

/**
 * Verify Vapi webhook
 * @param {Object} payload - Webhook payload
 * @returns {Boolean} - Whether webhook is valid
 */
export const verifyVapiWebhook = (payload) => {
    // Implement Vapi webhook verification if needed
    return true;
};

export default {
    createVapiSession,
    logVapiInteraction,
    verifyVapiWebhook
};
