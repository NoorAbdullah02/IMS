/**
 * NVIDIA AI Service
 * Handles NVIDIA NIM API integration for AI-powered chat
 */

import axios from 'axios';

const NVIDIA_NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

// Check if API key is configured
const isConfigured = !!NVIDIA_API_KEY;
if (!isConfigured) {
    console.warn('⚠️ NVIDIA_API_KEY not configured');
}

// Check if it looks like a NIM API key (starts with nvapi-)
const isNimKey = NVIDIA_API_KEY?.startsWith('nvapi-');
// Check if it looks like an NGC key (base64 encoded client_id:client_secret)
const isNgcKey = NVIDIA_API_KEY?.includes(':') || /^[A-Za-z0-9+/=]+$/.test(NVIDIA_API_KEY || '');

if (isConfigured) {
    if (isNimKey) {
        console.log('✅ NVIDIA NIM API key detected');
    } else if (isNgcKey) {
        console.log('⚠️ NGC API key detected. Note: NGC keys may not work with NIM. Get a NIM key from https://build.nvidia.com');
    } else {
        console.log('✅ NVIDIA API key configured');
    }
}

/**
 * Create NVIDIA NIM API client
 */
function createNimClient() {
    return axios.create({
        baseURL: NVIDIA_NIM_BASE_URL,
        headers: {
            'Authorization': `Bearer ${NVIDIA_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout: 30000
    });
}

/**
 * System prompt for BAUET IMS Assistant
 */
function getSystemPrompt(userRole = 'guest') {
    const basePrompt = `You are the BAUET Intelligence Assistant, an AI-powered helper for the BAUET Institute of Science and Technology Information Management System (IMS).

About BAUET IMS:
- A comprehensive academic management system for BAUET
- Handles student enrollment, course management, attendance tracking, exam results, fee payments
- Role-based access: students, teachers, department heads, treasurers, course coordinators, super admins
- Engineering programs (ICE, CSE, EEE): 7,00,000 BDT total fees
- Non-engineering programs (BBA, LAW, English): 4,00,000 BDT total fees
- Payment methods: bKash/Nagad (01748269350), Bank transfer, Direct payment
- Results published 2-3 weeks after exams after departmental moderation

Your personality: Professional, helpful, knowledgeable about the system, concise but thorough.
Always provide accurate information about the IMS features and guide users appropriately.`;

    const rolePrompts = {
        student: `
You are assisting a STUDENT. Key information:
- Students can view attendance, results, course materials, and make fee payments
- Course registration is locked if semester fees are pending
- Finance Hub shows payment status and history
- Results appear in 'Exam Results' section after moderation
- Can download admit cards when issued by department head`,

        teacher: `
You are assisting a TEACHER. Key information:
- Teachers can mark attendance for assigned courses
- Can upload results via 'Assigned Units' section (manual entry or CSV/Excel)
- Can upload course materials (lectures, syllabi, documents)
- Can post notices for enrolled students
- Assigned courses appear in 'My Assigned Courses'`,

        treasurer: `
You are assisting a TREASURER. Key information:
- Verify student payments in 'Institutional Ledger'
- Review transaction IDs and payment proofs
- Approve payments to unlock student academic protocols
- Can reject payments with remarks for correction
- Send reminders to students with pending dues`,

        dept_head: `
You are assisting a DEPARTMENT HEAD. Key information:
- Generate admit cards via 'Admit Card Manager'
- Assign course coordinators in 'User Management'
- Customize department branding (logo, banner, vision/mission)
- Oversee departmental academic activities`,

        super_admin: `
You are assisting a SUPER ADMIN. Key information:
- Create users in 'Security Core' (students, teachers, etc.)
- Manage semesters in 'Academic Timeline'
- Configure role-based policies and permissions
- View system logs and audit trails`,

        course_coordinator: `
You are assisting a COURSE COORDINATOR. Key information:
- Create courses in 'Course Management'
- Assign teachers to courses
- Moderate and approve results submitted by teachers
- Manage course catalog and assignments`,

        guest: `
You are assisting a GUEST USER. Key information:
- General information about BAUET IMS features
- Fee structures and payment methods overview
- Login assistance and password reset guidance
- Encourage login for detailed personal information`
    };

    return basePrompt + (rolePrompts[userRole] || rolePrompts.guest);
}

/**
 * Generate AI chat response using NVIDIA NIM
 */
export async function generateChatResponse(message, userRole = 'guest', conversationHistory = []) {
    try {
        if (!NVIDIA_API_KEY) {
            throw new Error('NVIDIA_API_KEY not configured');
        }

        const client = createNimClient();

        // Format conversation history
        const messages = [
            { role: 'system', content: getSystemPrompt(userRole) },
            ...conversationHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: 'user', content: message }
        ];

        console.log('🚀 Calling NVIDIA NIM API...');

        const response = await client.post('/chat/completions', {
            model: 'meta/llama-3.1-8b-instruct',
            messages: messages,
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1024,
            stream: false
        });

        const aiResponse = response.data.choices[0]?.message?.content ||
            'I apologize, but I could not generate a response at this time.';

        console.log('✅ NVIDIA AI response received');

        return {
            response: aiResponse,
            intent: 'ai_response',
            replies: generateQuickReplies(aiResponse, userRole)
        };
    } catch (error) {
        const status = error.response?.status;
        const detail = error.response?.data?.detail || error.message;

        console.error('❌ NVIDIA AI chat error:', {
            status,
            detail,
            isNgcKey
        });

        // If 401 and using NGC key, inform about the issue
        if (status === 401 && isNgcKey) {
            console.error('💡 Your API key appears to be an NGC key, not a NIM key.');
            console.error('💡 Get a NIM API key from: https://build.nvidia.com');
        }

        // Return fallback response
        return {
            response: 'I apologize, but I am having trouble connecting to my AI services. Please try again in a moment, or switch to Voice Mode for assistance.',
            intent: 'error',
            replies: ['Try Again', 'Voice Mode', 'Contact Support']
        };
    }
}

/**
 * Generate quick reply suggestions
 */
function generateQuickReplies(response, userRole) {
    const replies = [];
    const responseLower = response.toLowerCase();

    if (responseLower.includes('payment') || responseLower.includes('fee')) {
        replies.push('Finance Hub', 'Payment Methods');
    }
    if (responseLower.includes('attendance')) {
        replies.push('View Attendance', 'Mark Attendance');
    }
    if (responseLower.includes('result') || responseLower.includes('grade') || responseLower.includes('mark')) {
        replies.push('View Results', 'Upload Results');
    }
    if (responseLower.includes('course') || responseLower.includes('class')) {
        replies.push('My Courses', 'Course Registration');
    }
    if (responseLower.includes('material') || responseLower.includes('lecture')) {
        replies.push('Course Materials', 'Upload Material');
    }

    const roleReplies = {
        student: ['Finance Hub', 'My Courses', 'View Results'],
        teacher: ['My Courses', 'Mark Attendance', 'Upload Results'],
        treasurer: ['View Ledger', 'Pending Payments'],
        dept_head: ['Generate Admit Cards', 'User Management'],
        super_admin: ['Security Core', 'User Management'],
        course_coordinator: ['Course Management', 'Result Moderation'],
        guest: ['General Help', 'Login Help']
    };

    const specificReplies = roleReplies[userRole] || roleReplies.guest;
    for (const reply of specificReplies) {
        if (!replies.includes(reply)) {
            replies.push(reply);
        }
    }

    if (!replies.includes('Voice Mode')) {
        replies.push('Voice Mode');
    }

    return replies.slice(0, 4);
}

/**
 * Check NVIDIA AI service health
 */
export async function checkNvidiaHealth() {
    try {
        if (!NVIDIA_API_KEY) {
            return { status: 'not_configured', message: 'NVIDIA_API_KEY not set' };
        }

        // Try to list models to verify key works
        const client = createNimClient();
        await client.get('/models');

        return {
            status: 'healthy',
            message: 'NVIDIA AI service is available',
            apiKeyValid: true,
            keyType: isNimKey ? 'nim' : (isNgcKey ? 'ngc' : 'unknown')
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            message: error.response?.data?.detail || error.message || 'NVIDIA AI service unavailable',
            error: error.response?.status,
            keyType: isNimKey ? 'nim' : (isNgcKey ? 'ngc' : 'unknown'),
            hint: isNgcKey ? 'NGC keys may not work with NIM. Get a NIM key from https://build.nvidia.com' : null
        };
    }
}

export default {
    generateChatResponse,
    checkNvidiaHealth
};