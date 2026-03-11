import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), 'VITE_');

    return {
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
                    target: env.VITE_API_URL || 'http://localhost:4000',
                    changeOrigin: true,
                },
            },
        },
    };
});
