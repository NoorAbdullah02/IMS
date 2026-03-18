/**
 * Global Chatbot Initializer
 * Initializes the Vapi AI chatbot globally across all authenticated AND public pages
 */

import ChatbotWidget from './components/Chatbot.js';

/**
 * Initialize chatbot on page load
 * Supports both authenticated users and guests
 */
export function initializeChatbot() {
    try {
        // Check if chatbot already exists globally
        if (window.assistant && window.assistant instanceof ChatbotWidget) {
            console.log('ℹ️ Chatbot already initialized');
            return window.assistant;
        }

        // Get user from localStorage or create guest user
        let user = null;
        const userJson = localStorage.getItem('user');

        if (userJson) {
            try {
                user = JSON.parse(userJson);
                console.log('✅ Using authenticated user:', user.name);
            } catch (e) {
                console.warn('⚠️ Invalid user JSON, proceeding as guest');
                user = createGuestUser();
            }
        } else {
            console.log('ℹ️ No authenticated user, creating guest session');
            user = createGuestUser();
        }

        // Initialize chatbot with user (authenticated or guest)
        window.assistant = new ChatbotWidget(user);
        console.log('✅ Global chatbot initialized successfully');

        return window.assistant;
    } catch (error) {
        console.error('❌ Failed to initialize global chatbot:', error);
        return null;
    }
}

/**
 * Create a guest user object for unauthenticated visitors
 */
function createGuestUser() {
    return {
        id: 'guest_' + Date.now(),
        name: 'Guest',
        email: 'guest@bauet.edu.bd',
        role: 'guest',
        department: 'General'
    };
}

/**
 * Get the current chatbot instance
 */
export function getChatbot() {
    return window.assistant || null;
}

/**
 * Check if chatbot is initialized
 */
export function isChatbotReady() {
    return window.assistant && window.assistant instanceof ChatbotWidget;
}

// Auto-initialize on module load (works for both authenticated and unauthenticated users)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.assistant) {
            initializeChatbot();
        }
    });
} else {
    // DOM already loaded
    if (!window.assistant) {
        initializeChatbot();
    }
}

export default { initializeChatbot, getChatbot, isChatbotReady };
