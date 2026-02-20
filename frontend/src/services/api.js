import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor - attach access token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        // Safety: Do not send our internal JWT to external domains (like Cloudinary)
        const isExternal = config.url && config.url.startsWith('http') && !config.url.startsWith(API_BASE);

        if (token && !isExternal) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token, redirect to login
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(error);
            }

            try {
                // Call refresh endpoint
                const response = await axios.post(`${API_BASE}/api/auth/refresh-token`, {
                    token: refreshToken
                });

                const { accessToken } = response.data;

                // Save new access token
                localStorage.setItem('accessToken', accessToken);

                // Update authorization header
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // Process queued requests
                processQueue(null, accessToken);

                isRefreshing = false;

                // Retry original request
                return apiClient(originalRequest);

            } catch (refreshError) {
                // Refresh failed - logout user
                processQueue(refreshError, null);
                isRefreshing = false;

                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
