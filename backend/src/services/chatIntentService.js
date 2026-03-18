/**
 * Chat Intent Definitions
 * Used by both frontend and backend for consistent response logic
 */

export const CHAT_INTENTS = {
    common: [
        {
            keywords: ['hello', 'hi', 'hey', 'start', 'help', 'greet'],
            responses: {
                any: "Greetings! I am the BAUET Intelligence Assistant. How can I facilitate your operation today?"
            },
            replies: ['General Help', 'System Navigation', 'Voice Mode']
        },
        {
            keywords: ['navigation', 'how to use', 'where is', 'find', 'locate', 'guide'],
            responses: {
                any: "You can navigate using the operational sidebar on the left. Each module is role-restricted based on your security clearance. Click on any menu item to access that section."
            },
            replies: ['Dashboard', 'Profile', 'Help']
        },
        {
            keywords: ['thank', 'thanks', 'thankyou'],
            responses: {
                any: "You're welcome! Feel free to ask me anything else about the system."
            },
            replies: []
        },
        {
            keywords: ['bye', 'goodbye', 'exit', 'close'],
            responses: {
                any: "Goodbye! Have a productive day!"
            },
            replies: []
        }
    ],
    guest: [
        {
            keywords: ['fee', 'payment', 'cost', 'dues', 'tuition', 'money'],
            responses: {
                guest: "Welcome to BAUET IMS! This system manages fees, payments, results, attendance, and course management. To access detailed information about fees and payment methods, please log in to your account. You can also contact our support team for general inquiries."
            },
            replies: ['Log In', 'General Help', 'Contact Support']
        },
        {
            keywords: ['attendance', 'attendance record', 'absent', 'present'],
            responses: {
                guest: "Attendance management is a role-specific feature. Log in to access attendance records and details. If you're a student, you can view your attendance in your profile. If you're a teacher, you can manage attendance for your courses."
            },
            replies: ['Log In', 'Contact Support']
        },
        {
            keywords: ['result', 'marks', 'grades', 'exam', 'score', 'performance'],
            responses: {
                guest: "Academic results are available to students and authorized personnel. To view or submit results, please log in to your account. Results are typically published after departmental moderation, usually 2-3 weeks after exams."
            },
            replies: ['Log In', 'Contact Support']
        },
        {
            keywords: ['course', 'courses', 'enroll', 'registration', 'class', 'subject'],
            responses: {
                guest: "Course management and registration are available to logged-in users. Log in to view your enrolled courses, register for new courses, or manage course materials. Course registration happens during designated registration periods."
            },
            replies: ['Log In', 'Registration Help']
        },
        {
            keywords: ['login', 'sign in', 'account', 'password', 'forgot password', 'reset'],
            responses: {
                guest: "To log in, visit the Login page and enter your username and password. If you forgot your password, click 'Forgot Password' to reset it. If you don't have an account, contact your department coordinator. For password reset issues, contact support."
            },
            replies: ['Log In', 'Password Help', 'Contact Support']
        }
    ],
    student: [
        {
            keywords: ['fee', 'payment', 'money', 'cost', 'dues', 'semester fee', 'tuition'],
            responses: {
                student: "Semester fees are calculated based on your department. Engineering programs (ICE, CSE, EEE) cost 7,00,000 BDT total, while non-engineering (BBA, LAW, English) cost 4,00,000 BDT. You can view your specific amount in the Finance Hub and make payments through bKash, Nagad, or Bank transfer."
            },
            replies: ['Finance Hub', 'Payment Methods', 'Payment Status']
        },
        {
            keywords: ['registration', 'lock', 'deny', 'access', 'cannot register', 'locked'],
            responses: {
                student: "Course registration and academic modules are locked if there are pending semester dues. Once your payment is verified by the Treasurer, your 'Academic Protocol' will automatically unlock. Contact your department if it takes more than 24 hours."
            },
            replies: ['Check Payment Status', 'Contact Support']
        },
        {
            keywords: ['how to pay', 'payment method', 'bkash', 'nagad', 'bank', 'transfer'],
            responses: {
                student: "You have three payment methods: 1) bKash/Nagad to 01748269350, 2) Bank transfer (details in Finance Hub), 3) Direct payment window. After payment, upload your transaction ID or proof for verification. The Treasurer will verify within 24 hours."
            },
            replies: ['Payment Methods', 'Finance Hub']
        },
        {
            keywords: ['result', 'marks', 'gpa', 'grades', 'exam', 'score', 'performance'],
            responses: {
                student: "Academic results are published by your course instructors after departmental moderation. You can view them in the 'Exam Results' section of your dashboard if your financial protocol is clear. Results typically appear within 2-3 weeks after exams."
            },
            replies: ['View Results', 'Dashboard']
        },
        {
            keywords: ['course', 'enroll', 'subject', 'class', 'module'],
            responses: {
                student: "You can view your enrolled courses in the 'My Courses' section. To register for new courses, go to Course Registration (available during registration periods). Your enrollment depends on having cleared all semester dues."
            },
            replies: ['My Courses', 'Registration']
        },
        {
            keywords: ['attendance', 'absent', 'present', 'attendance record'],
            responses: {
                student: "You can view your attendance record in the Attendance section of your profile. Teachers mark daily attendance. Missing classes affects your performance record. Contact your course teacher if there's a discrepancy."
            },
            replies: ['View Attendance']
        }
    ],
    teacher: [
        {
            keywords: ['attendance', 'mark attendance', 'absent', 'take', 'record'],
            responses: {
                teacher: "To mark attendance: 1) Navigate to 'Attendance Management' in your sidebar, 2) Select the course and semester, 3) Click the class session, 4) Mark students present/absent, 5) Submit. Records are saved automatically."
            },
            replies: ['Attendance Guide', 'My Courses']
        },
        {
            keywords: ['upload result', 'marks entry', 'grading', 'submit', 'result', 'score'],
            responses: {
                teacher: "To upload results: 1) Go to 'Assigned Units' section, 2) Select the specific course, 3) Use 'Upload Result' module, 4) Either enter marks manually or upload a CSV/Excel file with student IDs and marks, 5) Submit for moderation. Results become visible to students after approval."
            },
            replies: ['Result Upload Guide', 'My Courses']
        },
        {
            keywords: ['material', 'upload', 'document', 'resource', 'file', 'lecture'],
            responses: {
                teacher: "To share course materials: 1) Go to 'Course Materials' in the Materials section, 2) Click 'Upload Material', 3) Select your course and semester, 4) Choose resource type (lecture, syllabus, etc.), 5) Upload file and submit. Students can download materials immediately."
            },
            replies: ['Upload Material', 'My Courses']
        },
        {
            keywords: ['notice', 'announcement', 'post', 'message', 'communicate'],
            responses: {
                teacher: "You can post notices for your students through the Notice board feature. Navigate to 'Create Notice', write your message, select target audience (students in your courses), and submit. All enrolled students will receive the notification."
            },
            replies: ['Post Notice', 'Notices History']
        },
        {
            keywords: ['class', 'course', 'assign', 'teach', 'section'],
            responses: {
                teacher: "Your assigned courses appear in 'My Assigned Courses'. Each course shows the semester, students enrolled, and available actions (mark attendance, upload results, upload materials). If you're missing an assignment, contact your Department Head."
            },
            replies: ['My Courses']
        }
    ],
    treasurer: [
        {
            keywords: ['approve', 'verify', 'payment', 'ledger', 'transaction', 'proof'],
            responses: {
                treasurer: "All pending student payments are in the 'Institutional Ledger'. For each payment: 1) Review transaction ID and proof, 2) Click 'Verify' to approve or 'Reject' to deny, 3) Add remarks if needed, 4) Submit. Student's academic protocol unlocks automatically once verified."
            },
            replies: ['View Ledger', 'Pending Payments']
        },
        {
            keywords: ['reject', 'deny', 'decline', 'payment'],
            responses: {
                treasurer: "To reject a payment: 1) Select the payment in Institutional Ledger, 2) Click 'Reject', 3) Enter reason for rejection in remarks, 4) Submit. The student will be notified and can resubmit with corrected information."
            },
            replies: ['View Payments']
        },
        {
            keywords: ['student', 'outstanding', 'pending', 'due', 'unpaid'],
            responses: {
                treasurer: "You can see all unpaid students in the 'Institutional Ledger' with filters for status. Students with pending payments cannot access course registration or materials. Send automated reminders or contact them through the notification system."
            },
            replies: ['View Ledger', 'Send Reminder']
        }
    ],
    dept_head: [
        {
            keywords: ['admit', 'card', 'exam', 'issue', 'generate'],
            responses: {
                dept_head: "To generate admit cards: 1) Go to 'Admit Card Manager', 2) Click 'Generate Cards', 3) Select semester and exam name, 4) Review eligible students, 5) Generate and download. Students can download from their profiles once issued."
            },
            replies: ['Generate Admit Cards', 'View Cards']
        },
        {
            keywords: ['coordinator', 'assign', 'teacher', 'role'],
            responses: {
                dept_head: "To assign a course coordinator: 1) Go to 'User Management', 2) Select a teacher/coordinator, 3) Click 'Assign Role', 4) Choose 'Course Coordinator', 5) Select courses to coordinate, 6) Submit. They'll have access to all related courses."
            },
            replies: ['User Management']
        },
        {
            keywords: ['branding', 'department', 'logo', 'banner', 'profile', 'info'],
            responses: {
                dept_head: "You can customize your department profile: 1) Go to 'Department Branding', 2) Upload logo and banner, 3) Write vision/mission statements, 4) List achievements, 5) Save changes. This appears on your department portal."
            },
            replies: ['Edit Branding', 'View Portal']
        }
    ],
    super_admin: [
        {
            keywords: ['create user', 'add student', 'add teacher', 'provision', 'new'],
            responses: {
                super_admin: "User management is in the 'Security Core'. To create users: 1) Click 'Create User', 2) Enter email and select role, 3) Assign department, 4) System generates ID and sends invitation. The user can log in after setting their password."
            },
            replies: ['User Management', 'Security Core']
        },
        {
            keywords: ['semester', 'create', 'activate', 'timeline', 'academic'],
            responses: {
                super_admin: "To manage semesters: 1) Go to 'Academic Timeline', 2) Click 'Initialize Semester', 3) Enter semester name (e.g., 'Spring 2025'), 4) Set as active if current, 5) Save. Only one semester can be active at a time."
            },
            replies: ['Academic Timeline']
        },
        {
            keywords: ['policy', 'permission', 'role', 'access', 'rule'],
            responses: {
                super_admin: "Role-based policies are managed in 'Security Core' under Policies. You can view and modify permissions for each role (student, teacher, admin, etc.). Changes apply system-wide to all users with that role."
            },
            replies: ['Security Core', 'Policies']
        },
        {
            keywords: ['report', 'log', 'audit', 'activity', 'system'],
            responses: {
                super_admin: "System logs and audit trails are available in 'System Logs'. Filter by user, action, date, or resource. Each entry shows who did what and when, helping track system activity and troubleshoot issues."
            },
            replies: ['System Logs', 'View Audit']
        }
    ],
    course_coordinator: [
        {
            keywords: ['course', 'create', 'add', 'new course', 'section'],
            responses: {
                course_coordinator: "To create a course: 1) Go to 'Course Management', 2) Click 'Create Course', 3) Enter course code, title, credits, 4) Select department and batch level, 5) Assign a teacher, 6) Save. The course appears in the catalog."
            },
            replies: ['Course Management', 'My Courses']
        },
        {
            keywords: ['assign', 'teacher', 'instructor', 'teaching'],
            responses: {
                course_coordinator: "To assign a teacher to a course: 1) Select the course, 2) Click 'Assign Teacher', 3) Choose a teacher from available list, 4) Select semester, 5) Save. The teacher can now mark attendance and upload results for that course."
            },
            replies: ['Course Management']
        },
        {
            keywords: ['result', 'approve', 'moderate', 'finalize'],
            responses: {
                course_coordinator: "To moderate results: 1) Go to 'Result Moderation' section, 2) Review submitted results by teachers, 3) Approve or request corrections, 4) Once all approved, results publish to students. Ensure academic integrity standards are met."
            },
            replies: ['Result Moderation']
        }
    ]
};

/**
 * Process a chat message and return an intent-matched response
 * @param {String} message - User message
 * @param {String} userRole - User role (student, teacher, etc.)
 * @returns {Object} - { intent, response, replies }
 */
export function processIntent(message, userRole = 'guest') {
    if (!message || typeof message !== 'string') {
        return {
            intent: 'error',
            response: 'Please provide a valid message.',
            replies: ['General Help']
        };
    }

    const query = message.toLowerCase().trim();
    const categories = ['common', userRole];

    // Search through intents
    for (const category of categories) {
        if (!CHAT_INTENTS[category]) continue;

        for (const intent of CHAT_INTENTS[category]) {
            if (intent.keywords.some(kw => query.includes(kw))) {
                const response = intent.responses[userRole] || intent.responses.any;
                if (response) {
                    return {
                        intent: intent.keywords[0],
                        response,
                        replies: intent.replies || ['Help', 'Voice Mode']
                    };
                }
            }
        }
    }

    // No match found
    return {
        intent: 'unknown',
        response: "I don't have specific information about that. Try asking about: fees, payments, attendance records, results, course materials, or system navigation. Or switch to Voice Mode for advanced assistance!",
        replies: ['General Help', 'Voice Mode', 'Contact Support']
    };
}

export default { CHAT_INTENTS, processIntent };
