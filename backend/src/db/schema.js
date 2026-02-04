import { pgTable, serial, text, varchar, timestamp, boolean, integer, pgEnum, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['admin', 'super_admin', 'student', 'teacher', 'dept_head', 'course_coordinator']);
export const deptEnum = pgEnum('department', ['ICE', 'CSE', 'EEE', 'BBA', 'LAW', 'English']);

// Users Table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    role: roleEnum('role').default('student').notNull(),
    department: deptEnum('department'),
    phone: varchar('phone', { length: 20 }),
    designation: varchar('designation', { length: 100 }), // For teachers
    studentId: varchar('student_id', { length: 50 }),
    batch: varchar('batch', { length: 50 }), // e.g. "Batch 12", "ICE-08"
    profilePhoto: text('profile_photo'),
    resetToken: text('reset_token'),
    resetTokenExpires: timestamp('reset_token_expires'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Refresh Tokens
export const refreshTokens = pgTable('refresh_tokens', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    token: text('token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Courses
export const courses = pgTable('courses', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 20 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    department: deptEnum('department').notNull(),
    credit: integer('credit').notNull(),
    batch: varchar('batch', { length: 50 }), // e.g. "Batch 12", "ICE-08"
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Course Assignments (Coordinator assigns teachers)
export const courseAssignments = pgTable('course_assignments', {
    id: serial('id').primaryKey(),
    courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
    teacherId: integer('teacher_id').references(() => users.id, { onDelete: 'cascade' }).notNull(), // Must be a teacher
    semester: varchar('semester', { length: 20 }).notNull(), // e.g., "Spring 2025"
    assignedBy: integer('assigned_by').references(() => users.id, { onDelete: 'cascade' }), // Coordinator who assigned
    createdAt: timestamp('created_at').defaultNow(),
});

// Enrollments (Students enroll in courses)
export const enrollments = pgTable('enrollments', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
    semester: varchar('semester', { length: 20 }).notNull(),
    enrolledAt: timestamp('enrolled_at').defaultNow(),
});

// Results
export const results = pgTable('results', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
    semester: varchar('semester', { length: 20 }).notNull(),
    examType: varchar('exam_type', { length: 50 }).notNull(), // midterm, final, ct
    marks: integer('marks').notNull(),
    grade: varchar('grade', { length: 5 }),
    fileUrl: text('file_url'), // Link to scanned answer script
    uploadedBy: integer('uploaded_by').references(() => users.id, { onDelete: 'cascade' }),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// Notices
export const notices = pgTable('notices', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    department: deptEnum('department'), // If null, visible to all
    targetRole: roleEnum('target_role'), // If null, visible to all
    postedBy: integer('posted_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    attachmentUrl: text('attachment_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Materials (General uploads)
export const materials = pgTable('materials', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    fileUrl: text('file_url').notNull(),
    uploadedBy: integer('uploaded_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
    semester: varchar('semester', { length: 20 }), // Default to null for general materials
    department: deptEnum('department'),
    type: varchar('type', { length: 50 }), // e.g., "syllabus", "routine", "material"
    createdAt: timestamp('created_at').defaultNow(),
});

// Admit Cards
export const admitCards = pgTable('admit_cards', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    examName: varchar('exam_name', { length: 100 }).notNull(), // e.g., "Final Exam Spring 2025"
    semester: varchar('semester', { length: 20 }).notNull(),
    generatedBy: integer('generated_by').references(() => users.id, { onDelete: 'cascade' }).notNull(), // Dept Head
    fileUrl: text('file_url').notNull(), // Generated PDF link
    status: varchar('status', { length: 20 }).default('issued'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Notifications
export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    type: varchar('type', { length: 50 }).default('info'), // info, success, warning, error
    isRead: boolean('is_read').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
    enrollments: many(enrollments),
    results: many(results),
    notices: many(notices),
    materials: many(materials),
    notifications: many(notifications),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
    assignments: many(courseAssignments),
    enrollments: many(enrollments),
    results: many(results),
    materials: many(materials),
}));

// Settings (Global Configuration)
export const settings = pgTable('settings', {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 100 }).unique().notNull(), // e.g., "current_semester"
    value: text('value').notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Semesters Table
export const semesters = pgTable('semesters', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(), // e.g., "Spring 2025"
    isActive: boolean('is_active').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Attendance Table
export const attendance = pgTable('attendance', {
    id: serial('id').primaryKey(),
    courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
    studentId: integer('student_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    date: date('date').notNull(),
    status: varchar('status', { length: 20 }).notNull(), // present, absent, late
    remarks: text('remarks'),
    semester: varchar('semester', { length: 20 }).notNull(),
    takenBy: integer('taken_by').references(() => users.id, { onDelete: 'cascade' }).notNull(), // Teacher
    createdAt: timestamp('created_at').defaultNow(),
});

// Policies (Policy-Based Access Control)
export const policies = pgTable('policies', {
    id: serial('id').primaryKey(),
    subject: varchar('subject', { length: 50 }).notNull(), // e.g., 'teacher', 'admin', 'student'
    action: varchar('action', { length: 50 }).notNull(), // e.g., 'upload_result', 'mark_attendance'
    resource: varchar('resource', { length: 50 }).notNull(), // e.g., 'result', 'attendance'
    conditions: text('conditions'), // JSON string of rules/logic
    allow: boolean('allow').default(true).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    action: varchar('action', { length: 50 }).notNull(),
    resource: varchar('resource', { length: 50 }).notNull(),
    targetId: varchar('target_id', { length: 50 }),
    status: varchar('status', { length: 20 }).notNull(), // 'allowed', 'denied'
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations (Continued)
export const materialsRelations = relations(materials, ({ one }) => ({
    uploader: one(users, {
        fields: [materials.uploadedBy],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [materials.courseId],
        references: [courses.id],
    }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    student: one(users, {
        fields: [attendance.studentId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [attendance.courseId],
        references: [courses.id],
    }),
    teacher: one(users, {
        fields: [attendance.takenBy],
        references: [users.id],
    }),
}));
// --- Department Autonomy Module ---

// Department Metadata
export const departments = pgTable('departments', {
    id: serial('id').primaryKey(),
    name: deptEnum('name').notNull().unique(),
    logo: text('logo'),
    banner: text('banner'),
    description: text('description'),
    vision: text('vision'),
    mission: text('mission'),
    achievements: text('achievements'), // Could be JSON or Text
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

// Department Events
export const departmentEvents = pgTable('department_events', {
    id: serial('id').primaryKey(),
    department: deptEnum('department').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    banner: text('banner'),
    type: varchar('type', { length: 50 }).notNull(), // Seminar, Workshop, Cultural, Tech Fest, Competition
    visibility: varchar('visibility', { length: 20 }).default('public').notNull(), // public, department, student
    venue: varchar('venue', { length: 255 }),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    organizer: varchar('organizer', { length: 255 }),
    createdBy: integer('created_by').references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Department Content (Newsletters, Research, Magazines)
export const departmentContent = pgTable('department_content', {
    id: serial('id').primaryKey(),
    department: deptEnum('department').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(), // newsletter, magazine, research, highlight
    description: text('description'),
    fileUrl: text('file_url'),
    imageUrl: text('image_url'),
    publishedAt: timestamp('published_at').defaultNow(),
});

// Photo Gallery
export const departmentGallery = pgTable('department_gallery', {
    id: serial('id').primaryKey(),
    department: deptEnum('department').notNull(),
    imageUrl: text('image_url').notNull(),
    caption: varchar('caption', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Audit Logs (Already exists, but ensuring it's available for relations if needed)
// Relations (Continued)
export const departmentRelations = relations(departments, ({ one, many }) => ({
    events: many(departmentEvents),
    content: many(departmentContent),
    gallery: many(departmentGallery),
}));
