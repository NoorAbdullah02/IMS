import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    build: {
        outDir: './dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                department: resolve(__dirname, 'department.html'),
                forgotPassword: resolve(__dirname, 'forgot-password.html'),
                resetPassword: resolve(__dirname, 'reset-password.html'),
            },
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true,
            },
        },
    },
});
