import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { setIo } from './src/services/socketInstance.js';

// Route Imports
import authRoutes from './src/routes/authRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import departmentRoutes from './src/routes/departmentRoutes.js';
import teacherRoutes from './src/routes/teacherRoutes.js';
import deptHeadRoutes from './src/routes/deptHeadRoutes.js';
import noticeRoutes from './src/routes/noticeRoutes.js';
import materialRoutes from './src/routes/materialRoutes.js';
import coordinatorRoutes from './src/routes/coordinatorRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import systemRoutes from './src/routes/systemRoutes.js';
import semesterRoutes from './src/routes/semesterRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import policyRoutes from './src/routes/policyRoutes.js';
import financeRoutes from './src/routes/financeRoutes.js';
import mediaRoutes from './src/routes/mediaRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true
    }
});

// Set global socket instance for eventService
setIo(io);
app.set('socketio', io);

// Socket Handlers
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join', (data) => {
        const { userId, role, department } = data;
        if (userId) socket.join(`user:${userId}`);
        if (role) socket.join(`role:${role}`);
        if (department) socket.join(`dept:${department}`);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Security & Headers Middleware
app.use((req, res, next) => {
    // Development CSP
    res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: http: https:; img-src * data: blob:; connect-src * http: https: ws: wss:; font-src *; style-src * 'unsafe-inline';");

    // Explicit CORS
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Standard CORS Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/dept-head', deptHeadRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/media', mediaRoutes);

// Root Health Check
app.get('/', (req, res) => {
    res.send('IMS API is synchronized and operational.');
});

// Global Error Handler
app.use((err, req, res, next) => {
    const errorLog = `[${new Date().toISOString()}] ${req.method} ${req.url}\nError: ${err.message}\nStack: ${err.stack}\n\n`;
    try {
        fs.appendFileSync('server_errors.log', errorLog);
    } catch (e) { }
    console.error('SERVER ERROR:', err);
    res.status(500).json({
        message: 'Internal System Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };
