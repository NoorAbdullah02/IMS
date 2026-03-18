import apiClient from './services/api.js';
import { setBtnLoading, setupPasswordToggle } from './utils/ui.js';
import { showSuccess, showError } from './utils/toast.js';
import { initializeChatbot } from './initChatbot.js';

// Initialize UI
setupPasswordToggle();

// Initialize chatbot on auth pages
document.addEventListener('DOMContentLoaded', () => {
    initializeChatbot();
});

// Login Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            setBtnLoading(submitBtn, true);
            const response = await apiClient.post('/api/auth/login', { email, password });
            const { accessToken, refreshToken, user } = response.data;

            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            showSuccess('Login Successful! Redirecting...');

            // Log token info for debugging
            console.log('✅ Login successful');
            console.log('🔐 Auto-refresh enabled');

            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Login failed';
            showError(msg);
            setBtnLoading(submitBtn, false);
        }
    });
}

// Register Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            setBtnLoading(submitBtn, true);
            await apiClient.post('/api/auth/register', data);
            showSuccess('Registration Successful! Please Login.');
            document.getElementById('registerModal').classList.add('hidden'); // Close modal

            if (document.getElementById('email')) {
                document.getElementById('email').value = data.email;
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Registration failed';
            showError(msg);
        } finally {
            setBtnLoading(submitBtn, false);
        }
    });
}

// Check Auth on Dashboard
export const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/';
        return null;
    }
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        localStorage.clear();
        window.location.href = '/';
        return null;
    }
};

// Logout
export const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        try {
            await apiClient.post('/api/auth/logout', { token: refreshToken });
        } catch (e) {
            console.error('Logout failed on server:', e);
        }
    }
    localStorage.clear();
    window.location.href = '/';
};

// Auto-redirect if already logged in and on landing page
if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('/')) {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
        window.location.href = '/dashboard.html';
    }
}
