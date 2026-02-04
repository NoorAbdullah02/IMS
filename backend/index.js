import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
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

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://localhost:5175'],
        credentials: true
    }
});

// For global access if needed
app.set('socketio', io);

// Socket Connection Handler
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Dynamic Room Joining based on Role/Department
    socket.on('join', (data) => {
        const { userId, role, department } = data;
        if (userId) socket.join(`user:${userId}`);
        if (role) socket.join(`role:${role}`);
        if (department) socket.join(`dept:${department}`);
        console.log(`Socket ${socket.id} joined rooms: user:${userId}, role:${role}, dept:${department}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for local dev if needed for sockets
}));
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));
app.use(express.json());

// Routes
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

// Root Route
app.get('/', (req, res) => {
    res.send('IMS API with Real-time Events is running...');
});

// Error Handling
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };
