import axios from 'axios';
import { setBtnLoading, setupPasswordToggle } from './utils/ui.js';

// Initialize UI
setupPasswordToggle();

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// Helper to show toast
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `mb-4 px-6 py-3 rounded-lg text-white shadow-lg transform transition-all duration-300 translate-x-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
    toast.innerText = message;

    container.appendChild(toast);

    // Animation
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });

    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

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
            // Login doesn't need apiClient since it's not authenticated
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { accessToken, refreshToken, user } = response.data;

            // Store tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            showToast('Login Successful! Redirecting...');

            // Log token info for debugging
            console.log('✅ Login successful');
            console.log('📝 Access Token expires in: 15 minutes');
            console.log('🔄 Refresh Token expires in: 7 days');
            console.log('🔐 Auto-refresh enabled');

            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Login failed';
            showToast(msg, 'error');
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
            await axios.post(`${API_URL}/register`, data);
            showToast('Registration Successful! Please Login.');
            document.getElementById('registerModal').classList.add('hidden'); // Close modal

            // Optional: Auto-fill login email?
            if (document.getElementById('email')) {
                document.getElementById('email').value = data.email;
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Registration failed';
            showToast(msg, 'error');
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
        return null; // Return null to allow the caller to stop execution
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { token: refreshToken });
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
