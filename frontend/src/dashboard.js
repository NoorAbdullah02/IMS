import { checkAuth, logout } from './auth.js';
import apiClient from './services/api.js';
import axios from 'axios'; // Keep for non-authenticated calls if needed
import gsap from 'gsap';
import { io } from 'socket.io-client';
import { renderUserManagement } from './views/admin.js';
import { renderDepartmentsView } from './views/departments.js';
import { renderTeacherCourses, renderUploadResultForm, renderCourseMaterials, renderCourseResultsList, renderEditResultForm, renderEditMaterialForm, renderAttendanceDashboard, renderTakeAttendanceForm, renderAttendanceReport } from './views/teacher.js';
import { renderStudentResults, renderStudentCourses, renderStudentAdmitCards, renderStudentAttendance } from './views/student.js';
import { renderDeptHeadUsers, renderAdmitCardManager } from './views/deptHead.js';
import { renderDeptDashboard, renderDeptBranding, renderDeptEvents, renderDeptContent, renderDeptGallery } from './views/department.js';
import { showSuccess, showError, showWarning, confirmAction, showToast } from './utils/toast.js';
import { renderPoliciesView } from './views/policies.js';
import { renderNotices } from './views/notices.js';
import { renderMaterials } from './views/materials.js';
import { renderCoordinatorDashboard } from './views/coordinator.js';
import { renderProfile } from './views/profile.js';
import { renderSystemLogs } from './views/adminLogs.js';
import { renderSemestersView } from './views/semesters.js';
import { renderTreasurerDashboard, renderPaymentsList } from './views/treasurer.js';
import { renderStudentFinance } from './views/finance.js';
import { getDownloadUrl } from './utils/file.js';
import { setBtnLoading } from './utils/ui.js';
import ChatbotWidget from './components/Chatbot.js';

// Global helper for forced downloads
window.getDownloadUrl = getDownloadUrl;

/**
 * Securely initiates a document download by ensuring the session token is fresh.
 * It manually triggers a light authentication check to force a token refresh if needed,
 * ensuring the subsequent link-based download doesn't fail with a 401.
 */
window.triggerSecureDownload = async (url) => {
    if (!url) return;
    try {
        // 1. Force a light check to refresh token if nearly expired
        await apiClient.get('/api/user/me');

        // 2. Generate the URL with the NEWEST token from localStorage
        const finalUrl = window.getDownloadUrl(url);

        // 3. Open in a new tab
        const win = window.open(finalUrl, '_blank');
        if (win) {
            win.focus();
        } else {
            showError('Pop-up restricted by browser. Please authorize and retry.');
        }
    } catch (err) {
        console.error('[Academic Dispatch] Secure download failed:', err);
        showError('Session validation failed. Re-authentication required.');
    }
};

const user = checkAuth();
if (!user) {
    // Stop execution if not authenticated (redirect already handled in checkAuth)
    throw new Error('Unauthorized access');
}
const apiBase = import.meta.env.VITE_API_URL;
let token = localStorage.getItem('accessToken');

// Initialize Intelligence Assistant
window.assistant = new ChatbotWidget(user);

// === Real-Time Event System (Socket.IO) ===
const socket = io(import.meta.env.VITE_API_URL, {
    transports: ['websocket', 'polling']
});

socket.on('connect', () => {
    console.log('Connected to Real-time system');
    socket.emit('join', {
        userId: user.id,
        role: user.role,
        department: user.department
    });
});

// Generic Event Listeners
const academicEvents = [
    'AttendanceMarked',
    'ResultPublished',
    'NoticeCreated',
    'AdmitCardGenerated',
    'CourseAssigned'
];

academicEvents.forEach(event => {
    socket.on(event, (payload) => {
        console.log(`Real-time Event Received: ${event}`, payload);

        // Push floating notification
        showToast(payload.message || `New academic event: ${event}`, payload.type || 'info');

        // Dynamic UI Refresh if currently on relevant page
        if (event === 'NoticeCreated') {
            const dot = document.getElementById('notificationDot');
            if (dot) dot.classList.remove('hidden');
            if (window.currentPath === 'loadNotices') handleNavigation('loadNotices');
        }

        if (event === 'AttendanceMarked' && window.currentPath === 'loadAttendance') {
            handleNavigation('loadAttendance');
        }

        if (event === 'ResultPublished' && window.currentPath === 'loadResults') {
            handleNavigation('loadResults');
        }

        if (event === 'AdmitCardGenerated' && window.currentPath === 'loadAdmitCard') {
            handleNavigation('loadAdmitCard');
        }

        if (event === 'CourseAssigned' && window.currentPath === 'loadCourses') {
            handleNavigation('loadCourses');
        }
    });
});

// Redundant axios interceptor removed - handled by apiClient in services/api.js

// Semester Handling
const semesterSelector = document.getElementById('globalSemesterSelector');
let currentSemester = (localStorage.getItem('activeSemester') || 'Spring 2025').trim();

async function initSemester() {
    try {
        const token = localStorage.getItem('accessToken');
        const apiBase = import.meta.env.VITE_API_URL;

        // Fetch all semesters
        let semestersList = [];
        try {
            const semRes = await apiClient.get('/api/semesters');
            semestersList = semRes.data;
        } catch (e) {
            console.error("Failed to fetch semesters list:", e);
        }

        // Check system settings for current active
        const sysRes = await apiClient.get('/api/system');

        if (sysRes.data.current_semester) {
            currentSemester = sysRes.data.current_semester;
        } else if (semestersList.length > 0) {
            const activeFromDb = semestersList.find(s => s.isActive)?.name || semestersList[0].name;
            currentSemester = activeFromDb;
        }

        localStorage.setItem('activeSemester', currentSemester);

        if (semesterSelector) {
            if (semestersList.length > 0) {
                semesterSelector.innerHTML = semestersList.map(s =>
                    `<option value="${s.name}" ${s.name === currentSemester ? 'selected' : ''}>${s.name}</option>`
                ).join('');
            } else {
                // Fallback if no semesters in DB yet
                semesterSelector.innerHTML = `<option value="${currentSemester}">${currentSemester}</option>`;
            }

            semesterSelector.value = currentSemester;

            // All users can change their current view filter
            semesterSelector.onchange = async () => {
                const newSemester = semesterSelector.value;
                localStorage.setItem('activeSemester', newSemester);

                // If admin, also update system-wide setting
                if (user.role === 'admin' || user.role === 'super_admin') {
                    try {
                        await apiClient.put('/api/system',
                            { key: 'current_semester', value: newSemester }
                        );
                        showSuccess(`System Semester updated to ${newSemester}`);
                    } catch (err) {
                        showError('Failed to update system semester global setting');
                    }
                }

                location.reload();
            };
        }
    } catch (err) {
        console.error('Failed to fetch system settings:', err);
    }
}

initSemester();

// Update User info in header
document.getElementById('userName').innerText = user.name;
const headerAvatar = document.getElementById('userAvatar');
if (headerAvatar) {
    headerAvatar.src = user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
}

// Sidebar Navigation Config
const navItems = {
    student: [
        { name: 'Dashboard', icon: 'grid-outline', action: 'loadDashboard' },
        { name: 'My Profile', icon: 'person-outline', action: 'loadProfile' },
        { name: 'Semester Finance', icon: 'wallet-outline', action: 'loadFinance' },
        { name: 'Results', icon: 'ribbon-outline', action: 'loadResults' },
        { name: 'Notices', icon: 'notifications-outline', action: 'loadNotices' },
        { name: 'Documents', icon: 'document-text-outline', action: 'loadDocuments' },
        { name: 'Admit Card', icon: 'id-card-outline', action: 'loadAdmitCard' },
        { name: 'Attendance', icon: 'checkbox-outline', action: 'loadAttendance' },
    ],
    teacher: [
        { name: 'Dashboard', icon: 'grid-outline', action: 'loadDashboard' },
        { name: 'My Profile', icon: 'person-outline', action: 'loadProfile' },
        { name: 'My Courses', icon: 'book-outline', action: 'loadCourses' },
        { name: 'Notices', icon: 'megaphone-outline', action: 'loadNotices' },
        { name: 'Attendance', icon: 'checkbox-outline', action: 'loadAttendance' },
    ],
    super_admin: [
        { name: 'Dashboard', icon: 'grid-outline', action: 'loadDashboard' },
        { name: 'My Profile', icon: 'person-outline', action: 'loadProfile' },
        { name: 'Departments', icon: 'business-outline', action: 'manageDepartments' },
        { name: 'Semesters', icon: 'calendar-outline', action: 'manageSemesters' },
        { name: 'Governance Rules', icon: 'shield-half-outline', action: 'managePolicies' },
        { name: 'Users', icon: 'people-outline', action: 'manageUsers' },
        { name: 'System Logs', icon: 'hardware-chip-outline', action: 'viewLogs' },
    ],
    dept_head: [
        { name: 'Dept Hub', icon: 'business-outline', action: 'loadDeptDashboard' },
        { name: 'My Profile', icon: 'person-outline', action: 'loadProfile' },
        { name: 'Dept Users', icon: 'people-outline', action: 'manageDeptUsers' },
        { name: 'Dept Events', icon: 'sparkles-outline', action: 'manageDeptEvents' },
        { name: 'Admit Cards', icon: 'id-card-outline', action: 'manageAdmitCards' },
        { name: 'Attendance', icon: 'checkbox-outline', action: 'loadAttendance' },
    ],
    course_coordinator: [
        { name: 'Dashboard', icon: 'grid-outline', action: 'loadDashboard' },
        { name: 'My Profile', icon: 'person-outline', action: 'loadProfile' },
        { name: 'My Courses', icon: 'book-outline', action: 'loadCourses' },
        { name: 'Course Management', icon: 'library-outline', action: 'manageCourses' },
        { name: 'Notices', icon: 'megaphone-outline', action: 'loadNotices' },
        { name: 'Attendance', icon: 'checkbox-outline', action: 'loadAttendance' },
    ],
    treasurer: [
        { name: 'Dashboard', icon: 'grid-outline', action: 'loadDashboard' },
        { name: 'My Profile', icon: 'person-outline', action: 'loadProfile' },
        { name: 'Payment Ledger', icon: 'list-outline', action: 'managePayments' },
        { name: 'Governance Rules', icon: 'shield-half-outline', action: 'managePolicies' },
    ]
};

// Fallback for other roles
const roleItems = navItems[user.role] || navItems.student;

// Render Sidebar
const sidebarNav = document.getElementById('sidebar-nav');
if (sidebarNav) {
    sidebarNav.innerHTML = '';
    roleItems.forEach(item => {
        const a = document.createElement('a');
        a.href = '#';
        a.dataset.action = item.action;
        a.className = 'nav-item flex items-center px-4 py-3 text-slate-400 hover:text-white rounded-2xl group transition-all duration-200';
        a.innerHTML = `
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-3 nav-icon-box">
                <ion-icon name="${item.icon}" class="text-xl"></ion-icon>
            </div>
            <span class="font-bold text-sm tracking-wide">${item.name}</span>
            <div class="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
                <ion-icon name="chevron-forward-outline" class="text-xs font-bold"></ion-icon>
            </div>
        `;
        a.onclick = (e) => {
            e.preventDefault();
            handleNavigation(item.action);
        };
        sidebarNav.appendChild(a);
    });

    // Fast Entrance Animation
    gsap.from('.sidebar-branding', {
        y: -10,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
    });

    gsap.from('.nav-item', {
        x: -15,
        opacity: 0,
        stagger: 0.04,
        duration: 0.3,
        ease: 'power2.out',
        clearProps: 'all'
    });
}

// Logout Helper
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.addEventListener('click', async () => {
    if (await confirmAction('Logout', 'Are you sure you want to sign out?')) {
        await logout();
    }
});

// Sidebar / Navbar Toggle Logic
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuIcon = document.getElementById('menuIcon');

if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Mobile: Toggle Drawer
            const isHidden = sidebar.classList.contains('-translate-x-full');
            if (isHidden) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        } else {
            // Desktop: Toggle Width/Collapse
            sidebar.classList.toggle('sidebar-hidden');

            // Optional: Change icon based on state
            if (sidebar.classList.contains('sidebar-hidden')) {
                menuIcon.setAttribute('name', 'chevron-forward-outline');
            } else {
                menuIcon.setAttribute('name', 'menu-outline');
            }
        }
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }

    // Handle window resize side-effects
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.add('hidden');
        } else if (!overlay.classList.contains('hidden')) {
            // If overlay was open, keep sidebar open on mobile
            sidebar.classList.remove('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
    });
}

// Zen Mode Logic
const zenModeBtn = document.getElementById('zenModeBtn');
if (zenModeBtn) {
    zenModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('zen-mode');
        const icon = zenModeBtn.querySelector('ion-icon');
        if (document.body.classList.contains('zen-mode')) {
            icon.setAttribute('name', 'contract-outline');
            showSuccess('Zen Mode Enabled (Alt+Z to toggle)');
        } else {
            icon.setAttribute('name', 'expand-outline');
        }
    });
}

// Shortcut for Zen Mode
window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'z') {
        zenModeBtn?.click();
    }
});
window.handleNavigation = async function (action, arg = null, shouldPushState = true) {
    window.currentPath = action;

    if (shouldPushState) {
        const path = action === 'loadDashboard' ? '' : `#${action}`;
        window.history.pushState({ action, arg }, '', window.location.pathname + path);
    }
    const mainContent = document.getElementById('mainContent');
    const pageTitle = document.getElementById('pageTitle');

    console.log('Navigating to:', action, 'with arg:', arg);

    // Update Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active-link'));
    const activeLink = document.querySelector(`.nav-item[data-action="${action}"]`);
    if (activeLink) activeLink.classList.add('active-link');


    // Clear previous content with a beautiful loader
    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) statsGrid.classList.add('hidden');

    mainContent.innerHTML = `
        <div class="flex flex-col items-center justify-center h-96 space-y-8 animate-fadeIn">
            <div class="relative">
                <div class="w-24 h-24 border-4 border-indigo-500/10 rounded-full shadow-[0_0_30px_rgba(79,70,229,0.1)]"></div>
                <div class="w-24 h-24 border-4 border-t-indigo-500 rounded-full animate-spin absolute top-0"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <ion-icon name="pulse-sharp" class="text-4xl text-indigo-400 animate-pulse"></ion-icon>
                </div>
            </div>
            <div class="flex flex-col items-center">
                <p class="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 animate-pulse ml-2">Neural Link Syncing</p>
                <div class="mt-6 flex space-x-2">
                    <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:1s]"></div>
                    <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></div>
                    <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></div>
                </div>
            </div>
        </div>
    `;

    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;

    try {
        switch (action) {
            // Aliases for new dashboard buttons
            case 'loadStudentResults':
                return handleNavigation('loadResults', arg);
            case 'loadHistory':
                return handleNavigation('loadFinance', arg);

            case 'viewDeptDetails':
                pageTitle.innerText = `${arg || 'Department'} Users`;
                const dUsersRes = await apiClient.get(`/api/admin/users?dept=${encodeURIComponent(arg)}`);
                mainContent.innerHTML = renderUserManagement(dUsersRes.data);
                bindAddUserForm();
                bindEditRoleForm();
                break;

            case 'loadProfile':
                pageTitle.innerText = 'My Profile';
                const profileRes = await apiClient.get('/api/user/me');
                mainContent.innerHTML = renderProfile(profileRes.data);
                bindEditProfileForm();

                // Sync header and localStorage
                localStorage.setItem('user', JSON.stringify(profileRes.data));
                if (headerAvatar) {
                    headerAvatar.src = profileRes.data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileRes.data.name)}&background=random`;
                }
                document.getElementById('userName').innerText = profileRes.data.name;
                break;

            case 'loadResults':
                pageTitle.innerText = 'Exam Results';
                const resultsRes = await apiClient.get(`/api/student/results?semester=${currentSemester}`);
                mainContent.innerHTML = renderStudentResults(resultsRes.data);
                break;

            case 'manageUsers':
                pageTitle.innerText = 'Manage Users';
                const usersRes = await apiClient.get('/api/admin/users');
                mainContent.innerHTML = renderUserManagement(usersRes.data);
                bindAddUserForm();
                bindEditRoleForm();
                break;

            case 'manageDepartments':
                pageTitle.innerText = 'Departments';
                const deptsRes = await apiClient.get('/api/departments');
                mainContent.innerHTML = renderDepartmentsView(deptsRes.data);
                break;

            case 'loadCourses':
                pageTitle.innerText = 'My Courses';
                {
                    const isStaff = ['teacher', 'course_coordinator', 'dept_head', 'super_admin', 'admin', 'treasurer'].includes(user.role);
                    const courseEndpoint = isStaff ? 'teacher/courses' : 'student/courses';
                    const coursesRes = await apiClient.get(`/api/${courseEndpoint}?semester=${currentSemester}`);
                    if (isStaff) {
                        mainContent.innerHTML = renderTeacherCourses(coursesRes.data);
                    } else {
                        mainContent.innerHTML = renderStudentCourses(coursesRes.data);
                    }
                }
                break;

            case 'loadNotices':
                pageTitle.innerText = 'Notices';
                const noticesRes = await apiClient.get('/api/notices');
                mainContent.innerHTML = renderNotices(noticesRes.data, user.role);
                if (['teacher', 'dept_head', 'super_admin', 'admin', 'treasurer'].includes(user.role)) {
                    bindCreateNoticeForm();
                }
                break;

            case 'loadDocuments':
                pageTitle.innerText = 'Course Materials';
                {
                    const isStaff = ['teacher', 'course_coordinator', 'dept_head', 'super_admin', 'admin', 'treasurer'].includes(user.role);
                    const [materialsRes, docCoursesRes] = await Promise.all([
                        apiClient.get(`/api/materials?semester=${currentSemester}`),
                        isStaff
                            ? (['teacher', 'course_coordinator'].includes(user.role)
                                ? apiClient.get('/api/teacher/courses')
                                : apiClient.get('/api/coordinator/courses')
                            )
                            : Promise.resolve({ data: [] })
                    ]);
                    mainContent.innerHTML = renderMaterials(materialsRes.data, user.role, docCoursesRes.data);
                    if (isStaff) {
                        bindUploadMaterialForm();
                    }
                }
                break;

            case 'manageCourses':
                pageTitle.innerText = 'Course Management';
                const [assignmentsR, coursesR, teachersR, semestersR] = await Promise.all([
                    apiClient.get(`/api/coordinator/assignments?semester=${currentSemester}`),
                    apiClient.get('/api/coordinator/courses'),
                    apiClient.get('/api/coordinator/teachers'),
                    apiClient.get('/api/semesters')
                ]);
                mainContent.innerHTML = renderCoordinatorDashboard(assignmentsR.data, coursesR.data, teachersR.data, semestersR.data, user);
                bindAssignTeacherForm();
                bindCreateCourseForm();
                bindEditCourseForm();
                break;

            case 'manageSemesters':
                pageTitle.innerText = 'Manage Semesters';
                const semListRes = await apiClient.get('/api/semesters');
                mainContent.innerHTML = renderSemestersView(semListRes.data);
                bindSemesterActions();
                break;

            case 'loadDeptDashboard':
                pageTitle.innerText = `${user.department} Hub`;
                const deptStatsRes = await apiClient.get('/api/departments/stats');
                mainContent.innerHTML = renderDeptDashboard(deptStatsRes.data);
                break;

            case 'customizeDept':
                pageTitle.innerText = 'Portal Personalization';
                const deptRes = await apiClient.get(`/api/departments/portal/${user.department}`);
                mainContent.innerHTML = renderDeptBranding(deptRes.data.department);
                window.bindDeptBrandingForm();
                break;

            case 'manageDeptEvents':
                pageTitle.innerText = 'Event Calendar';
                const deptEventsRes = await apiClient.get('/api/departments/events');
                mainContent.innerHTML = renderDeptEvents(deptEventsRes.data);
                window.bindDeptEventForm();
                break;

            case 'manageDeptContent':
                pageTitle.innerText = 'Faculty Information';
                const deptContentRes = await apiClient.get('/api/departments/content');
                mainContent.innerHTML = renderDeptContent(deptContentRes.data);
                window.bindDeptContentForm();
                break;

            case 'manageDeptGallery':
                pageTitle.innerText = 'Institutional Gallery';
                const deptGalleryRes = await apiClient.get('/api/departments/gallery');
                mainContent.innerHTML = renderDeptGallery(deptGalleryRes.data);
                window.bindDeptGalleryForm();
                break;

            case 'managePolicies':
                pageTitle.innerText = 'Governance Policies';
                const policiesRes = await apiClient.get('/api/policies');
                mainContent.innerHTML = renderPoliciesView(policiesRes.data);
                bindPolicyActions();
                break;

            case 'manageDeptUsers':
                pageTitle.innerText = 'Department Users';
                const deptUsersRes = await apiClient.get('/api/dept-head/users');
                mainContent.innerHTML = renderDeptHeadUsers(deptUsersRes.data);
                break;

            case 'manageAdmitCards':
                pageTitle.innerText = 'Admit Cards';
                const admitCardsRes = await apiClient.get(`/api/dept-head/admit-cards?semester=${currentSemester}`);
                mainContent.innerHTML = renderAdmitCardManager(admitCardsRes.data, currentSemester);
                bindGenerateCardForm();
                break;

            case 'loadAdmitCard':
                pageTitle.innerText = 'My Admit Card';
                const myAdmitCardsRes = await apiClient.get(`/api/student/admit-cards?semester=${currentSemester}`);
                mainContent.innerHTML = renderStudentAdmitCards(myAdmitCardsRes.data);
                break;

            case 'loadFinance':
                pageTitle.innerText = 'Semester Finance';
                const financeStatusRes = await apiClient.get('/api/finance/my-status');
                mainContent.innerHTML = renderStudentFinance(financeStatusRes.data);
                bindStudentPaymentForm();
                break;

            case 'managePayments':
                pageTitle.innerText = 'Institutional Ledger';
                const statusFilter = (arg && arg.status) ? arg.status : '';
                const paymentsRes = await apiClient.get(`/api/finance/payments?status=${statusFilter}`);
                mainContent.innerHTML = renderPaymentsList(paymentsRes.data);
                bindPaymentFilters();
                break;

            case 'loadAttendance':
                pageTitle.innerText = 'Attendance Management';
                if (user.role === 'student') {
                    const studentAttendanceRes = await apiClient.get(`/api/attendance/me?semester=${currentSemester}`);
                    mainContent.innerHTML = renderStudentAttendance(studentAttendanceRes.data);
                } else {
                    const endpoint = (user.role === 'teacher' || user.role === 'course_coordinator') ? 'teacher/courses' : 'coordinator/courses';
                    const coursesRes = await apiClient.get(`/api/${endpoint}?semester=${currentSemester}`);
                    mainContent.innerHTML = renderAttendanceDashboard(coursesRes.data, user.role);
                }
                break;

            case 'startTakingAttendance':
                if (!arg) {
                    showError('Course information missing');
                    return handleNavigation('loadAttendance');
                }
                pageTitle.innerText = 'Take Attendance';
                const { id: courseId, code: courseCode } = arg;
                const enrolledStudentsRes = await apiClient.get(`/api/teacher/courses/${courseId}/students?semester=${currentSemester}`);
                mainContent.innerHTML = renderTakeAttendanceForm(enrolledStudentsRes.data, courseId, courseCode, currentSemester);
                break;

            case 'viewAttendanceReport':
                if (!arg) {
                    showError('Course information missing');
                    return handleNavigation('loadAttendance');
                }
                pageTitle.innerText = 'Attendance Report';
                const { id: cId, code: cCode } = arg;
                const attendanceReportRes = await apiClient.get(`/api/attendance/report?courseId=${cId}&semester=${currentSemester}`);
                mainContent.innerHTML = renderAttendanceReport(attendanceReportRes.data, cCode, cId);
                break;

            case 'viewLogs':
                pageTitle.innerText = 'System Logs';
                // Mock endpoint for now, or just show component
                mainContent.innerHTML = renderSystemLogs([]);
                break;

            case 'loadDashboard':
                pageTitle.innerText = 'Command Center';
                if (user.role === 'treasurer') {
                    const treasurerOverviewRes = await apiClient.get('/api/finance/overview');
                    mainContent.innerHTML = renderTreasurerDashboard(treasurerOverviewRes.data);
                    return; // Exit early as treasurer has a unique dashboard
                }

                // Show Hero and Stats Grid on Dashboard
                const statsGrid = document.getElementById('statsGrid');
                const dashboardHero = document.getElementById('dashboardHero');
                if (dashboardHero) dashboardHero.classList.remove('hidden');

                if (statsGrid) {
                    statsGrid.classList.remove('hidden');
                    try {
                        const statsRes = await apiClient.get('/api/system/stats');
                        const stats = statsRes.data;
                        statsGrid.innerHTML = `
                            <div class="relative p-8 rounded-[2rem] shadow-2xl group overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-cyan-500/20 border border-cyan-500/10 hover:border-cyan-500/30" style="background: linear-gradient(135deg, rgba(6,182,212,0.08), rgba(12,14,26,0.95))">
                                <div class="absolute -right-8 -top-8 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                                <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                                <div class="flex items-center justify-between relative z-10">
                                    <div>
                                        <p class="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400/60 mb-3">Student Corps</p>
                                        <p class="text-4xl font-black bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">${stats.students}</p>
                                    </div>
                                    <div class="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 text-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/10 border border-cyan-500/20 group-hover:shadow-cyan-500/30 transition-all">
                                        <ion-icon name="people-sharp" class="text-2xl"></ion-icon>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="relative p-8 rounded-[2rem] shadow-2xl group overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-violet-500/20 border border-violet-500/10 hover:border-violet-500/30" style="background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(12,14,26,0.95))">
                                <div class="absolute -right-8 -top-8 w-28 h-28 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all"></div>
                                <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                                <div class="flex items-center justify-between relative z-10">
                                    <div>
                                        <p class="text-[9px] font-black uppercase tracking-[0.25em] text-violet-400/60 mb-3">Faculty Staff</p>
                                        <p class="text-4xl font-black bg-gradient-to-r from-violet-300 to-purple-500 bg-clip-text text-transparent">${stats.teachers}</p>
                                    </div>
                                    <div class="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-purple-600/10 text-violet-400 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/10 border border-violet-500/20 group-hover:shadow-violet-500/30 transition-all">
                                        <ion-icon name="person-circle-sharp" class="text-2xl"></ion-icon>
                                    </div>
                                </div>
                            </div>

                            <div class="relative p-8 rounded-[2rem] shadow-2xl group overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-emerald-500/20 border border-emerald-500/10 hover:border-emerald-500/30" style="background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(12,14,26,0.95))">
                                <div class="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                                <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                                <div class="flex items-center justify-between relative z-10">
                                    <div>
                                        <p class="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400/60 mb-3">Active Courses</p>
                                        <p class="text-4xl font-black bg-gradient-to-r from-emerald-300 to-teal-500 bg-clip-text text-transparent">${stats.courses}</p>
                                    </div>
                                    <div class="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-600/10 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10 border border-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all">
                                        <ion-icon name="book-sharp" class="text-2xl"></ion-icon>
                                    </div>
                                </div>
                            </div>

                            <div class="relative p-8 rounded-[2rem] shadow-2xl group overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-rose-500/20 border border-rose-500/10 hover:border-rose-500/30" style="background: linear-gradient(135deg, rgba(244,63,94,0.08), rgba(12,14,26,0.95))">
                                <div class="absolute -right-8 -top-8 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
                                <div class="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                                <div class="flex items-center justify-between relative z-10">
                                    <div>
                                        <p class="text-[9px] font-black uppercase tracking-[0.25em] text-rose-400/60 mb-3">New Alerts</p>
                                        <p class="text-4xl font-black bg-gradient-to-r from-rose-300 to-pink-500 bg-clip-text text-transparent">${stats.notices}</p>
                                    </div>
                                    <div class="w-14 h-14 bg-gradient-to-br from-rose-500/20 to-pink-600/10 text-rose-400 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/10 border border-rose-500/20 group-hover:shadow-rose-500/30 transition-all">
                                        <ion-icon name="notifications-sharp" class="text-2xl"></ion-icon>
                                    </div>
                                </div>
                            </div>
                        `;
                    } catch (e) {
                        console.error("Stats fetch failed:", e);
                        statsGrid.classList.add('hidden');
                    }
                }

                let extraContent = '';
                let dashboardExtraRes = { data: [] };
                let deptEvents = [];
                try {
                    const isStaff = ['teacher', 'course_coordinator', 'dept_head', 'super_admin', 'admin', 'treasurer'].includes(user.role);
                    const [courseRes, deptPortalRes] = await Promise.all([
                        isStaff
                            ? apiClient.get(`/api/teacher/courses?semester=${currentSemester}`)
                            : apiClient.get(`/api/student/courses?semester=${currentSemester}`),
                        user.department ? apiClient.get(`/api/departments/portal/${user.department}`) : Promise.resolve({ data: { events: [] } })
                    ]);
                    dashboardExtraRes = courseRes;
                    deptEvents = deptPortalRes.data.events || [];
                } catch (e) {
                    if (e.response && e.response.status === 403 && user.role === 'student') {
                        // Check financial status
                        let isPending = false;
                        let hasMinimumPayment = false;
                        let isRegistered = false;
                        let currentSemesterId = null;

                        try {
                            const financeRes = await apiClient.get('/api/finance/my-status');
                            const progress = financeRes.data?.paymentProgress;
                            isRegistered = financeRes.data?.registration?.isRegistered;
                            currentSemesterId = financeRes.data?.currentSemester?.id;

                            isPending = progress?.totalPending > 0;
                            hasMinimumPayment = progress?.hasMinimumPayment; // paymentPercentage >= 30
                        } catch (finErr) { console.error("Finance check failed:", finErr); }

                        if (hasMinimumPayment && !isRegistered) {
                            // Case: Paid already, just needs confirmation
                            extraContent = `
                                <div class="mt-12 bg-gradient-to-br from-indigo-900/40 to-slate-900 p-12 rounded-[3.5rem] border-2 border-indigo-500/20 shadow-2xl relative overflow-hidden group">
                                     <div class="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] group-hover:bg-indigo-500/10 transition-all"></div>
                                     <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div class="flex items-center space-x-6">
                                            <div class="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-3xl border border-indigo-500/20 flex items-center justify-center shadow-xl">
                                                <ion-icon name="checkmark-done-circle-outline" class="text-4xl"></ion-icon>
                                            </div>
                                            <div>
                                                <h3 class="text-2xl font-black text-white tracking-tight">Academic Access Unlocked!</h3>
                                                <p class="text-slate-400 font-medium mt-2 max-w-sm">You have completed the required payment. Please confirm your registration to access courses.</p>
                                            </div>
                                        </div>
                                        <button onclick="window.confirmAcademicRegistration(${currentSemesterId})" class="bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-[12px]">
                                            Confirm Registration
                                        </button>
                                    </div>
                                </div>
                            `;
                        } else if (isPending) {
                            extraContent = `
                                <div class="mt-12 bg-gradient-to-br from-amber-600/20 to-slate-900 p-12 rounded-[3.5rem] border-2 border-amber-500/20 shadow-2xl relative overflow-hidden group">
                                    <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] group-hover:bg-amber-500/10 transition-all"></div>
                                    <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div class="flex items-center space-x-8">
                                            <div class="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-3xl flex items-center justify-center border border-amber-500/20 shadow-xl">
                                                <ion-icon name="time-outline" class="text-4xl"></ion-icon>
                                            </div>
                                            <div>
                                                <h4 class="text-2xl font-black text-white px-2">Access Verification In Progress</h4>
                                                <p class="text-slate-400 font-medium mt-2 max-w-sm">We have received your payment. Access will be unlocked automatically once the Treasurer verifies your transaction.</p>
                                            </div>
                                        </div>
                                        <div class="text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-6 py-4 rounded-xl border border-amber-500/20">
                                            Status: Under Review
                                        </div>
                                    </div>
                                </div>
                            `;
                        } else {
                            // Show standard locked state message
                            extraContent = `
                                <div class="mt-12 bg-gradient-to-br from-rose-900/20 to-slate-900 p-12 rounded-[3.5rem] border-2 border-rose-500/20 shadow-2xl relative overflow-hidden group">
                                    <div class="absolute -right-20 -top-20 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] group-hover:bg-rose-500/10 transition-all"></div>
                                    <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div class="flex items-center space-x-8">
                                            <div class="w-20 h-20 bg-rose-500/10 text-rose-400 rounded-3xl flex items-center justify-center border border-rose-500/20 shadow-xl">
                                                <ion-icon name="lock-closed-outline" class="text-4xl"></ion-icon>
                                            </div>
                                            <div>
                                                <h4 class="text-2xl font-black text-white px-2">Academic Protocol Locked</h4>
                                                <p class="text-slate-400 font-medium mt-2 max-w-sm">Your operational modules are currently restricted due to pending semester settlement.</p>
                                            </div>
                                        </div>
                                        <button onclick="window.handleNavigation('loadFinance')" class="whitespace-nowrap bg-rose-500 text-white px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all">
                                            Resolve Dues
                                        </button>
                                    </div>
                                </div>
                            `;
                        }
                    } else {
                        console.error("Dashboard extra fetch failed:", e);
                    }
                }

                if (dashboardExtraRes.data.length === 0 && user.role === 'student' && !deptEvents.length) {
                    // Check if it was a 403 or just empty
                    // Handled in catch block above, but if we reach here with 0 data, it's just empty.
                }

                // If extraContent wasn't set by the catch block, generate standard content
                if (!extraContent) {
                    if (dashboardExtraRes.data.length > 0) {
                        extraContent = `
                            <div class="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]"></div>
                                
                                <div class="flex flex-col md:flex-row justify-between items-end mb-12 relative z-10">
                                    <div>
                                        <h4 class="text-3xl font-black text-white flex items-center mb-2">
                                            <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-5 shadow-lg shadow-indigo-500/20 text-white">
                                                <ion-icon name="book" class="text-2xl"></ion-icon>
                                            </div>
                                            Active Operational Units
                                        </h4>
                                        <p class="text-slate-400 font-medium ml-[4.5rem] max-w-lg">Access your assigned course modules and real-time academic protocols for ${currentSemester}.</p>
                                    </div>
                                    <div class="mt-6 md:mt-0">
                                         <span class="px-5 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center">
                                            <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                                            Registration Active
                                        </span>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                                    ${dashboardExtraRes.data.map((course, index) => `
                                        <div class="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 hover:-translate-y-2 transition-all duration-300 shadow-xl group flex flex-col justify-between h-full relative overflow-hidden">
                                            <div class="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                                            
                                            <div>
                                                <div class="flex justify-between items-start mb-6">
                                                    <span class="px-4 py-1.5 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/5 group-hover:border-indigo-500/30 transition-all">${course.code}</span>
                                                    <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                                        <ion-icon name="ellipsis-horizontal" class="text-slate-400"></ion-icon>
                                                    </div>
                                                </div>
                                                <h5 class="font-black text-2xl text-white tracking-tight leading-tight mb-2 group-hover:text-indigo-400 transition-colors">${course.title}</h5>
                                                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-8">Department of ${user.department || 'General'}</p>
                                            </div>

                                            <div class="space-y-6">
                                                <div class="flex items-center space-x-4">
                                                     <div class="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div class="h-full bg-indigo-500 w-3/4"></div>
                                                     </div>
                                                     <span class="text-[10px] font-black text-indigo-400">75%</span>
                                                </div>

                                                <div class="flex justify-between items-end pt-6 border-t border-white/5">
                                                    <div class="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                        <ion-icon name="layers-outline" class="mr-2 text-indigo-500 text-sm"></ion-icon>
                                                        <span>${course.credit} Credits</span>
                                                    </div>
                                                    <button onclick="window.handleNavigation('loadCourses')" class="w-10 h-10 rounded-full bg-white text-indigo-950 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                                                        <ion-icon name="arrow-forward" class="text-lg"></ion-icon>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else if (user.role === 'student' && dashboardExtraRes.data.length === 0) {
                        // Registered but no courses assigned
                        extraContent = `
                            <div class="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden text-center">
                                <div class="absolute inset-0 bg-[url('assets/pattern.svg')] opacity-5"></div>
                                <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]"></div>

                                <div class="relative z-10 py-10">
                                    <div class="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-2 border-dashed border-slate-700 mb-8 animate-pulse-slow">
                                        <ion-icon name="file-tray-outline" class="text-4xl text-slate-500"></ion-icon>
                                    </div>
                                    <h4 class="text-3xl font-black text-white mb-4">No Course Units Assigned</h4>
                                    <p class="text-slate-300 font-medium max-w-lg mx-auto mb-10 text-lg">Your registration is confirmed, but the Course Coordinator has not yet assigned specific modules to your profile for ${currentSemester}.</p>
                                    
                                    <div class="flex justify-center gap-6">
                                        <button onclick="window.location.reload()" class="bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-[11px] flex items-center">
                                            <ion-icon name="refresh" class="mr-2 text-lg"></ion-icon>
                                            Check Updates
                                        </button>
                                        <button class="bg-white/5 text-white px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-[11px]">
                                            Contact Coordinator
                                        </button>
                                    </div>
                                </div>

                                <!-- Previous Semesters Logic -->
                                <div class="mt-16 pt-10 border-t border-white/5">
                                    <h5 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Previous Academic History</h5>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                        <button onclick="window.handleNavigation('loadStudentResults')" class="bg-slate-800 p-6 rounded-3xl border border-white/5 hover:border-indigo-500/30 hover:bg-slate-700 transition-all group text-left">
                                            <div class="flex items-center space-x-4">
                                                <div class="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                    <ion-icon name="stats-chart" class="text-xl"></ion-icon>
                                                </div>
                                                <div>
                                                    <span class="block text-white font-black text-lg">View Results</span>
                                                    <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Archive Access</span>
                                                </div>
                                            </div>
                                        </button>
                                        <button onclick="window.handleNavigation('loadHistory')" class="bg-slate-800 p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 hover:bg-slate-700 transition-all group text-left">
                                            <div class="flex items-center space-x-4">
                                                <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                                    <ion-icon name="time" class="text-xl"></ion-icon>
                                                </div>
                                                <div>
                                                    <span class="block text-white font-black text-lg">Finance History</span>
                                                    <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Transaction Ledger</span>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }

                if (deptEvents.length > 0) {
                    extraContent += `
                            <div class="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl">
                                <h4 class="text-3xl font-black text-white mb-10 flex items-center">
                                    <div class="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mr-4 border border-amber-500/30">
                                        <ion-icon name="sparkles-sharp" class="text-amber-400"></ion-icon>
                                    </div>
                                    Strategic Engagements
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    ${deptEvents.slice(0, 4).map(event => `
                                        <div class="flex items-center space-x-6 p-6 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-amber-500 transition-all cursor-pointer group">
                                            <div class="w-20 h-20 rounded-[1.5rem] overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-amber-500 transition-all">
                                                <img src="${event.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=150&q=80'}" class="w-full h-full object-cover">
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <h5 class="font-black text-white text-lg truncate group-hover:text-amber-400 transition-colors uppercase tracking-tight">${event.title}</h5>
                                                <div class="flex items-center space-x-4 mt-2">
                                                    <span class="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] flex items-center">
                                                        <ion-icon name="calendar-sharp" class="mr-1.5 text-amber-400"></ion-icon>
                                                        ${new Date(event.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span class="text-[9px] text-amber-400 font-black border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest bg-amber-500/5">${event.type}</span>
                                                </div>
                                            </div>
                                            <ion-icon name="chevron-forward-sharp" class="text-slate-600 group-hover:text-amber-400 transition-all group-hover:translate-x-1"></ion-icon>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                }

                mainContent.innerHTML = extraContent;
                break;

                mainContent.innerHTML = `
                    < div class="space-y-10" >
                        <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-[3rem] shadow-2xl border-2 border-white/5 relative overflow-hidden">
                            <div class="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                            <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"></div>

                            <div class="relative z-10">
                                <h3 class="text-4xl font-black text-white tracking-tight">Welcome back, ${user.name}!</h3>
                                <p class="mt-4 text-slate-400 text-xl font-medium">Elevating academic governance through high-performance management.</p>

                                <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div class="p-8 bg-slate-800/50 rounded-3xl border border-indigo-500/20 hover:border-indigo-500 hover:bg-slate-800 transition-all cursor-pointer group shadow-xl" onclick="window.handleNavigation('loadNotices')">
                                        <div class="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg shadow-indigo-500/10">
                                            <ion-icon name="notifications-outline" class="text-3xl text-indigo-400 group-hover:text-white"></ion-icon>
                                        </div>
                                        <h4 class="text-xl font-black text-white">Recent Notices</h4>
                                        <p class="text-sm text-slate-400 mt-2 line-clamp-2">Stay updated with the latest university announcements and news.</p>
                                    </div>

                                    <div class="p-8 bg-slate-800/50 rounded-3xl border border-emerald-500/20 hover:border-emerald-500 hover:bg-slate-800 transition-all cursor-pointer group shadow-xl" onclick="window.handleNavigation('loadProfile')">
                                        <div class="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg shadow-emerald-500/10">
                                            <ion-icon name="person-outline" class="text-3xl text-emerald-400 group-hover:text-white"></ion-icon>
                                        </div>
                                        <h4 class="text-xl font-black text-white">My Profile</h4>
                                        <p class="text-sm text-slate-400 mt-2 line-clamp-2">Manage your personal information and profile settings.</p>
                                    </div>

                                    <div class="p-8 bg-slate-800/50 rounded-3xl border border-rose-500/20 hover:border-rose-500 hover:bg-slate-800 transition-all cursor-pointer group shadow-xl" onclick="window.handleNavigation('loadFinance')">
                                        <div class="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/30 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all shadow-lg shadow-rose-500/10">
                                            <ion-icon name="wallet-outline" class="text-3xl text-rose-400 group-hover:text-rose-600"></ion-icon>
                                        </div>
                                        <h4 class="text-xl font-black text-white">Semester Finance</h4>
                                        <p class="text-sm text-slate-400 mt-2 line-clamp-2">Track fees, settle dues, and verify academic registration status.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50 rounded-full opacity-20"></div>
                        </div>

                        ${extraContent}

                <div class="bg-gray-900 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <h5 class="text-xl font-bold">System Status: All Systems Operational</h5>
                            <p class="text-gray-400 text-sm mt-1">Real-time monitoring enabled. Last sync: ${new Date().toLocaleTimeString()}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="relative flex h-3 w-3">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span class="text-sm font-medium text-emerald-400">Live Connection</span>
                        </div>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-transparent"></div>
                </div>
                    </div >
                    `;
                break;

            default:
                pageTitle.innerText = action;
                mainContent.innerHTML = `< p class="text-gray-500" > Feature < b > ${action}</b > is coming soon.</p > `;
        }
    } catch (err) {
        console.error("Navigation failed details:", err.response?.data || err);
        const isForbidden = err.response && err.response.status === 403;
        const errorMessage = err.response?.data?.message || err.message;

        mainContent.innerHTML = `
                    < div class="flex flex-col items-center justify-center h-96 space-y-8 animate-fadeIn text-center px-6" >
                <div class="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center border-2 border-rose-500/20 shadow-2xl relative">
                    <div class="absolute inset-0 bg-rose-500 rounded-[2rem] blur-2xl opacity-10"></div>
                    <ion-icon name="${isForbidden ? 'lock-closed-outline' : 'alert-circle-outline'}" class="text-5xl"></ion-icon>
                </div>
                <div class="max-w-md">
                    <h4 class="text-2xl font-black text-white tracking-tight">${isForbidden ? 'Access Restricted' : 'Neural Link Failure'}</h4>
                    <p class="text-slate-400 font-medium mt-3 leading-relaxed">
                        ${errorMessage}
                    </p>
                </div>
                <div class="flex space-x-4">
                    <button onclick="window.handleNavigation('${action}')" class="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all flex items-center">
                        <ion-icon name="refresh-outline" class="mr-2 text-lg"></ion-icon> Retry Sync
                    </button>
                    ${isForbidden && !action.includes('Finance') ? `
                        <button onclick="window.handleNavigation('loadFinance')" class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center">
                            <ion-icon name="wallet-outline" class="mr-2 text-lg"></ion-icon> Finance Hub
                        </button>
                    ` : ''}
                </div>
            </div >
                    `;
    }
}

// Attach handleNavigation to window for onclick support
window.handleNavigation = handleNavigation;

// --- Helper Functions & Form Bindings ---

// Admin User Management
function bindAddUserForm() {
    const form = document.getElementById('addUserForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const data = Object.fromEntries(new FormData(form).entries());
        try {
            setBtnLoading(btn, true);
            await apiClient.post('/api/admin/users', data);
            showSuccess('User created successfully!');
            window.closeAddUserModal();
            handleNavigation('manageUsers');
        } catch (err) {
            showError('Error creating user: ' + (err.response?.data?.message || err.message));
        } finally {
            setBtnLoading(btn, false);
        }
    };
}

function bindEditRoleForm() {
    const form = document.getElementById('editRoleForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');

        const confirmed = await confirmAction('Update User Role', 'Are you sure you want to change this user\'s permissions? This may affect their access levels.');
        if (!confirmed) return;

        const id = document.getElementById('editUserId').value;
        const role = document.getElementById('editUserRole').value;
        const department = document.getElementById('editUserDept').value;
        const batch = document.getElementById('editUserBatch').value;
        try {
            setBtnLoading(btn, true);
            await apiClient.put(`/api/admin/users/${id}`, { role, department, batch });
            showSuccess('User permissions updated successfully!');
            window.closeEditRoleModal();
            handleNavigation('manageUsers');
        } catch (err) {
            showError('Error updating user: ' + (err.response?.data?.message || err.message));
        } finally {
            setBtnLoading(btn, false);
        }
    };
}

window.showAddUserModal = () => document.getElementById('addUserModal')?.classList.remove('hidden');
window.closeAddUserModal = () => document.getElementById('addUserModal')?.classList.add('hidden');
window.closeEditRoleModal = () => document.getElementById('editRoleModal')?.classList.add('hidden');

window.showGenerateIdsModal = () => document.getElementById('generateIdsModal')?.classList.remove('hidden');
window.closeGenerateIdsModal = () => document.getElementById('generateIdsModal')?.classList.add('hidden');

window.handleGenerateIds = async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');

    try {
        setBtnLoading(btn, true);
        const count = form.count.value;
        const startFrom = form.startFrom.value;
        const department = form.department.value;

        await apiClient.post('/api/admin/generate-ids', { count, startFrom, department });

        // Use standard notification
        showSuccess(`Generated ${count} IDs for ${department}`);
        window.closeGenerateIdsModal();
        // If view modal is open, refresh it
        if (!document.getElementById('viewIdsModal').classList.contains('hidden')) {
            window.loadGeneratedIds();
        }
    } catch (err) {
        console.error(err);
        showError(err.response?.data?.message || 'Failed to generate IDs');
    } finally {
        setBtnLoading(btn, false);
    }
};

window.showViewIdsModal = () => {
    const modal = document.getElementById('viewIdsModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        window.loadGeneratedIds();
    }
};

window.closeViewIdsModal = () => {
    const modal = document.getElementById('viewIdsModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.loadGeneratedIds = async () => {
    const tbody = document.getElementById('generatedIdsTableBody');
    const dept = document.getElementById('viewIdsDeptFilter').value;

    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="3" class="text-center p-4 text-slate-500 text-xs font-bold uppercase tracking-widest">Loading registry...</td></tr>';

    try {
        const token = localStorage.getItem('accessToken');
        const res = await apiClient.get(`/api/admin/generated-ids${dept ? `?department=${dept}` : ''}`);

        if (res.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center p-4 text-slate-500 text-xs font-bold uppercase tracking-widest">No generated identities found</td></tr>';
            return;
        }

        tbody.innerHTML = res.data.map(id => `
                    < tr class="border-b border-white/5 hover:bg-white/5 transition-colors group" >
                <td class="p-4">
                    <div class="flex flex-col">
                        <span class="text-sm font-black text-white font-mono tracking-wide">${id.idNumber}</span>
                        ${id.ownerName ? `<span class="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">${id.ownerName}</span>` : ''}
                    </div>
                </td>
                <td class="p-4 text-right">
                    <div class="flex flex-col items-end">
                        <span class="px-2 py-1 rounded text-[10px] font-black uppercase ${id.status === 'unused' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}">
                            ${id.status}
                        </span>
                        ${id.status === 'used' ? `
                            <button onclick="window.handleStudentSearch('${id.idNumber}')" class="mt-1 text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-tighter transition-colors">
                                View Profile →
                            </button>
                        ` : ''}
                    </div>
                </td>
                 <td class="p-4 text-right text-[10px] mobile-hidden font-bold text-slate-500">${new Date(id.createdAt).toLocaleDateString()}</td>
            </tr >
                    `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center p-4 text-rose-500 text-xs font-bold uppercase tracking-widest">Registry access failed</td></tr>';
    }
};

window.handleStudentSearch = async (query) => {
    if (!query) return;

    // Create/Reuse Modal
    let modal = document.getElementById('studentDetailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'studentDetailsModal';
        modal.className = 'hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4';
        document.body.appendChild(modal);
    }

    modal.innerHTML = '<div class="text-white text-xl font-bold animate-pulse">Searching Identity Matrix...</div>';
    modal.classList.remove('hidden');

    try {
        const token = localStorage.getItem('accessToken');
        // Determine role to choose prefix? Admin routes are at /api/admin and search-student is shared there.
        const res = await apiClient.get(`/api/admin/search-student?q=${encodeURIComponent(query)}`);

        const { profile, payments, currentSemester } = res.data;

        // Render Content
        modal.innerHTML = `
                    < div class="relative bg-slate-900 border-2 border-white/10 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn" >
                <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <button onclick="document.getElementById('studentDetailsModal').classList.add('hidden')" class="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md">
                    <ion-icon name="close" class="text-xl"></ion-icon>
                </button>
                
                <div class="relative px-8 pt-16 pb-8">
                    <div class="flex items-end mb-6">
                        <div class="w-24 h-24 bg-slate-800 rounded-3xl border-4 border-slate-900 shadow-xl overflow-hidden relative z-10">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=4f46e5&color=fff&bold=true" class="w-full h-full object-cover">
                        </div>
                        <div class="ml-6 mb-2">
                             <h3 class="text-2xl font-black text-white">${profile.name}</h3>
                             <p class="text-indigo-400 font-bold text-sm uppercase tracking-widest">${profile.studentId}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-8">
                        <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Department</p>
                            <p class="text-white font-bold">${profile.department}</p>
                        </div>
                         <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Batch</p>
                            <p class="text-white font-bold">${profile.batch || 'N/A'}</p>
                        </div>
                         <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Contact</p>
                            <p class="text-white font-bold truncate">${profile.email}</p>
                        </div>
                         <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Phone</p>
                            <p class="text-white font-bold">${profile.phone || 'N/A'}</p>
                        </div>
                    </div>

                    <div class="border-t border-white/10 pt-6">
                        <h4 class="text-lg font-black text-white mb-4 flex items-center">
                            <ion-icon name="wallet-outline" class="mr-2 text-emerald-400"></ion-icon>
                            Financial Status (${currentSemester})
                        </h4>
                        
                        ${payments.length > 0 ? `
                            <div class="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                                ${payments.map(p => `
                                    <div class="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                        <div>
                                            <p class="text-xs font-bold text-white">${p.amount.toLocaleString()} BDT <span class="text-slate-500">via ${p.method}</span></p>
                                            <p class="text-[10px] text-slate-500 font-mono mt-0.5">${p.transactionId}</p>
                                        </div>
                                        <span class="px-2 py-1 rounded text-[10px] font-black uppercase ${p.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}">
                                            ${p.status}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="text-slate-500 text-sm italic">No payment records found.</p>'}
                    </div>
                </div>
            </div >
                    `;
    } catch (err) {
        modal.innerHTML = `
                    < div class="bg-slate-900 border-2 border-rose-500/50 p-8 rounded-3xl shadow-2xl text-center max-w-sm" >
                <ion-icon name="alert-circle" class="text-4xl text-rose-500 mb-4"></ion-icon>
                <h3 class="text-xl font-bold text-white mb-2">Search Failed</h3>
                <p class="text-slate-400 text-sm mb-6">${err.response?.data?.message || 'Access denied or Identity not found.'}</p>
                <button onclick="document.getElementById('studentDetailsModal').classList.add('hidden')" class="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all">Dismiss</button>
            </div >
                    `;
    }
};

window.deleteUser = async (id) => {
    const confirmed = await confirmAction('Delete User', 'Are you sure you want to remove this user? This action cannot be undone.');
    if (!confirmed) return;

    try {
        await apiClient.delete(`/api/admin/users/${id}`);
        showSuccess('User deleted successfully');
        handleNavigation('manageUsers');
    } catch (err) {
        showError('Delete failed: ' + (err.response?.data?.message || err.message));
    }
};

// Teacher functions
window.loadUploadForm = async (courseId, courseCode) => {
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    try {
        const res = await apiClient.get(`/api/teacher/courses/${courseId}/students`);
        document.getElementById('mainContent').innerHTML = renderUploadResultForm(courseId, courseCode, res.data);
        const form = document.getElementById('uploadResultForm');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                try {
                    setBtnLoading(btn, true);
                    await apiClient.post('/api/teacher/results', new FormData(form), {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    showSuccess('Results uploaded!');
                    window.manageCourseResults(courseId, courseCode);
                } catch (err) {
                    showError('Upload failed');
                } finally {
                    setBtnLoading(btn, false);
                }
            };
        }
    } catch (err) {
        showError('Load failed');
    }
};

window.manageCourseMaterials = async (courseId, courseCode) => {
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    try {
        const res = await apiClient.get(`/api/materials?courseId=${courseId}&semester=${currentSemester}`);
        document.getElementById('mainContent').innerHTML = renderCourseMaterials(courseId, courseCode, res.data, user.role);
    } catch (err) { showError('Load failed'); }
};

window.manageCourseResults = async (courseId, courseCode) => {
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    try {
        const res = await apiClient.get(`/api/teacher/courses/${courseId}/results?semester=${currentSemester}`);
        document.getElementById('mainContent').innerHTML = renderCourseResultsList(courseId, courseCode, res.data);
    } catch (err) { showError('Load failed'); }
};

window.deleteMaterialItem = async (id, courseId, courseCode) => {
    const confirmed = await confirmAction('Delete Material', 'Are you sure you want to delete this resource? Students will no longer be able to access it.');
    if (!confirmed) return;

    try {
        await apiClient.delete(`/api/materials/${id}`);
        showSuccess('Resource deleted successfully');
        window.manageCourseMaterials(courseId, courseCode);
    } catch (err) { showError('Delete failed: ' + (err.response?.data?.message || err.message)); }
};

window.editResultItem = async (id, courseId, courseCode) => {
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    try {
        const res = await apiClient.get(`/api/teacher/courses/${courseId}/results`);
        const result = res.data.find(r => r.id === id);
        if (!result) return;

        document.getElementById('mainContent').innerHTML = renderEditResultForm(result, courseCode);

        const form = document.getElementById('editResultForm');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');

                const confirmed = await confirmAction('Update Student Result', 'Are you sure you want to save these changes? The student will see the updated marks immediately.');
                if (!confirmed) return;

                try {
                    setBtnLoading(btn, true);
                    await apiClient.put(`/api/teacher/results/${id}`, new FormData(form), {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    showSuccess('Result updated successfully!');
                    window.manageCourseResults(courseId, courseCode);
                } catch (err) {
                    showError('Update failed: ' + (err.response?.data?.message || err.message));
                } finally {
                    setBtnLoading(btn, false);
                }
            };
        }
    } catch (err) { showError('Load failed'); }
};

window.editMaterialItem = async (id, courseId, courseCode) => {
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    try {
        const res = await apiClient.get(`/api/materials?courseId=${courseId}`);
        const material = res.data.find(m => m.id === id);
        if (!material) return;

        document.getElementById('mainContent').innerHTML = renderEditMaterialForm(material, courseCode);

        const form = document.getElementById('editMaterialForm');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');

                const confirmed = await confirmAction('Update Material', 'Save changes to this resource?');
                if (!confirmed) return;

                try {
                    setBtnLoading(btn, true);
                    await apiClient.put(`/api/materials/${id}`, new FormData(form), {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    showSuccess('Material updated successfully!');
                    window.manageCourseMaterials(courseId, courseCode);
                } catch (err) {
                    showError('Update failed: ' + (err.response?.data?.message || err.message));
                } finally {
                    setBtnLoading(btn, false);
                }
            };
        }
    } catch (err) { showError('Load failed'); }
};

window.showUploadMaterialModalForCourse = (courseId, courseCode) => {
    let modal = document.getElementById('courseUploadModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'courseUploadModal';
        modal.className = 'fixed inset-0 bg-slate-950/90 backdrop-blur-xl overflow-y-auto h-full w-full z-[100] flex items-center justify-center p-4';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="relative bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 p-1 rounded-[3.5rem] w-full max-w-2xl shadow-[0_0_80px_rgba(79,70,229,0.2)] animate-scaleIn border border-white/10">
            <div class="bg-slate-900 rounded-[3.4rem] p-12 overflow-hidden relative">
                <!-- Background Decorations -->
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px]"></div>
                
                <div class="flex justify-between items-start mb-12 relative z-10">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">Sector: ${courseCode}</span>
                            <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">Signal: Secure</span>
                        </div>
                        <h3 class="text-4xl font-black text-white tracking-tighter uppercase leading-none">Resource Injection</h3>
                        <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Knowledge Base Synchronization Protocol</p>
                    </div>
                    <button onclick="document.getElementById('courseUploadModal').classList.add('hidden')" class="w-14 h-14 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 rounded-[1.5rem] flex items-center justify-center transition-all border border-white/5 group">
                        <ion-icon name="close-outline" class="text-3xl group-hover:rotate-90 transition-transform duration-500"></ion-icon>
                    </button>
                </div>

                <form id="courseUploadForm" class="space-y-8 relative z-10 text-left">
                    <input type="hidden" name="courseId" value="${courseId}">
                    <input type="hidden" name="semester" value="${currentSemester}">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                        <div class="space-y-3">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Asset Label</label>
                            <input type="text" name="title" required class="w-full px-8 py-5 rounded-2xl border-2 border-white/5 bg-white/2 text-white focus:border-indigo-500 transition-all outline-none font-bold text-sm placeholder-slate-700" placeholder="e.g. Advanced AI Modules">
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Resource Classification</label>
                            <div class="relative">
                                <select name="type" class="w-full px-8 py-5 rounded-2xl border-2 border-white/5 bg-white/2 text-white focus:border-indigo-500 transition-all outline-none font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer">
                                    <option value="material">Lecture Material</option>
                                    <option value="syllabus">Institutional Syllabus</option>
                                    <option value="routine">Deployment Routine</option>
                                    <option value="question">Assessment Archive</option>
                                    <option value="solution">Authored Solutions</option>
                                    <option value="online_resource">Digital Resource</option>
                                </select>
                                <ion-icon name="chevron-down-outline" class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></ion-icon>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3 text-left">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Contextual Orientation</label>
                        <textarea name="description" rows="3" class="w-full px-8 py-5 rounded-3xl border-2 border-white/5 bg-white/2 text-white focus:border-indigo-500 transition-all outline-none font-medium text-xs leading-relaxed placeholder-slate-700 custom-scrollbar" placeholder="Provide a brief abstract for the academic resource..."></textarea>
                    </div>

                    <div class="space-y-3 text-left">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Binary Registry (Drop Assets)</label>
                        <div class="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-indigo-500/50 transition-all" id="dropZone">
                            <input type="file" name="files" id="materialFileInput" multiple required class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onchange="window.handleMaterialFileSelection(this)">
                            <div class="bg-white/2 group-hover:bg-indigo-500/5 p-10 flex flex-col items-center justify-center transition-all">
                                <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform group-hover:bg-indigo-500/10">
                                    <ion-icon name="shapes-outline" id="uploadIcon" class="text-3xl text-slate-600 group-hover:text-indigo-400"></ion-icon>
                                </div>
                                <h4 id="fileMainStatus" class="text-xs font-black text-slate-400 group-hover:text-white uppercase tracking-widest mb-1">Engage Local Storage</h4>
                                <p class="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Multi-Binary Support Active</p>
                            </div>
                        </div>
                        
                        <!-- File List Preview Container -->
                        <div id="filePreviewContainer" class="hidden space-y-2 mt-4 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                        </div>
                    </div>

                    <div class="flex gap-4 pt-10">
                        <button type="button" onclick="document.getElementById('courseUploadModal').classList.add('hidden')" class="flex-1 bg-white/2 hover:bg-white/5 text-slate-500 hover:text-white font-black py-6 rounded-2xl transition-all border border-white/5 uppercase tracking-[0.2em] text-[10px]">
                            Discard Sequence
                        </button>
                        <button type="submit" id="uploadExecBtn" class="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 group">
                            <span>Execute Injection</span>
                            <ion-icon name="send-outline" class="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></ion-icon>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');

    window.handleMaterialFileSelection = (input) => {
        const status = document.getElementById('fileMainStatus');
        const icon = document.getElementById('uploadIcon');
        const preview = document.getElementById('filePreviewContainer');
        const files = input.files;

        if (files.length > 0) {
            status.innerText = `${files.length} ASSETS BUFFERED`;
            status.classList.add('text-indigo-400');
            icon.name = "layers-outline";
            icon.classList.add('text-indigo-400');

            // Build preview
            preview.innerHTML = '';
            preview.classList.remove('hidden');
            Array.from(files).forEach(f => {
                const size = (f.size / 1024).toFixed(1);
                preview.innerHTML += `
                    <div class="flex justify-between items-center p-4 bg-white/2 rounded-xl border border-white/5 animate-fadeIn">
                        <div class="flex items-center gap-3">
                            <ion-icon name="document-outline" class="text-indigo-400"></ion-icon>
                            <span class="text-[10px] font-black text-slate-300 uppercase truncate max-w-[200px]">${f.name}</span>
                        </div>
                        <span class="text-[9px] font-black text-indigo-500/50 uppercase">${size} KB</span>
                    </div>
                `;
            });
        } else {
            status.innerText = 'Engage Local Storage';
            status.classList.remove('text-indigo-400');
            icon.name = "shapes-outline";
            icon.classList.remove('text-indigo-400');
            preview.classList.add('hidden');
        }
    };

    const form = document.getElementById('courseUploadForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('uploadExecBtn');
        try {
            setBtnLoading(btn, true, 'Synchronizing...');
            await apiClient.post('/api/materials', new FormData(form), {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showSuccess('Institutional resource synchronized successfully.');
            document.getElementById('courseUploadModal').classList.add('hidden');
            if (window.manageCourseMaterials) {
                window.manageCourseMaterials(courseId, courseCode);
            }
        } catch (err) {
            showError('Synchronization failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setBtnLoading(btn, false);
        }
    };
};

function bindGenerateCardForm() {
    const form = document.getElementById('generateCardForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            setBtnLoading(btn, true);
            await apiClient.post('/api/dept-head/admit-cards', data);
            showSuccess('Admit cards generated successfully for all eligible students!');
            window.hideGenerateCardModal();
            // Refresh the view
            handleNavigation('manageAdmitCards');
        } catch (err) {
            showError('Generation failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setBtnLoading(btn, false);
        }
    };
}

// Notice & Materials Bindings
function bindCreateNoticeForm() {
    const form = document.getElementById('createNoticeForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        try {
            setBtnLoading(btn, true);
            await apiClient.post('/api/notices', new FormData(form), {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showSuccess('Notice posted!');
            handleNavigation('loadNotices');
        } catch (err) { showError('Failed'); }
        finally { setBtnLoading(btn, false); }
    };
}

function bindUploadMaterialForm() {
    const form = document.getElementById('uploadMaterialForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        try {
            setBtnLoading(btn, true);
            await apiClient.post('/api/materials', new FormData(form), {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showSuccess('Material uploaded!');
            handleNavigation('loadDocuments');
        } catch (err) { showError('Failed'); }
        finally { setBtnLoading(btn, false); }
    };
}

function bindAssignTeacherForm() {
    const form = document.getElementById('assignTeacherForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        try {
            setBtnLoading(btn, true);
            await apiClient.post('/api/coordinator/assign', Object.fromEntries(new FormData(form).entries()));
            showSuccess('Assigned!');
            document.getElementById('assignTeacherModal')?.classList.add('hidden');
            handleNavigation('manageCourses');
        } catch (err) { showError(err.response?.data?.message || 'Failed to assign'); }
        finally { setBtnLoading(btn, false); }
    };
}

function bindCreateCourseForm() {
    const form = document.getElementById('createCourseForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        try {
            setBtnLoading(btn, true);
            await apiClient.post('/api/coordinator/courses', Object.fromEntries(new FormData(form).entries()));
            showSuccess('Course created!');
            document.getElementById('createCourseModal')?.classList.add('hidden');
            handleNavigation('manageCourses');
        } catch (err) { showError(err.response?.data?.message || 'Failed to create course'); }
        finally { setBtnLoading(btn, false); }
    };
}

function bindEditCourseForm() {
    const form = document.getElementById('editCourseForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const id = document.getElementById('editCourseId').value;
        try {
            setBtnLoading(btn, true);
            await apiClient.put(`/api/coordinator/courses/${id}`, Object.fromEntries(new FormData(form).entries()));
            showSuccess('Course updated!');
            document.getElementById('editCourseModal')?.classList.add('hidden');
            handleNavigation('manageCourses');
        } catch (err) { showError(err.response?.data?.message || 'Failed to update course'); }
        finally { setBtnLoading(btn, false); }
    };
}

window.deleteCourseItem = async (id) => {
    const confirmed = await confirmAction('Delete Course', 'Are you sure you want to delete this course? This will remove all associated assignments and results.');
    if (!confirmed) return;

    try {
        await apiClient.delete(`/api/coordinator/courses/${id}`);
        showSuccess('Course deleted!');
        handleNavigation('manageCourses');
    } catch (err) { showError(err.response?.data?.message || 'Failed to delete course'); }
};

window.showCreateNoticeModal = () => document.getElementById('createNoticeModal')?.classList.remove('hidden');
window.showUploadMaterialModal = () => document.getElementById('uploadMaterialModal')?.classList.remove('hidden');
window.showAssignTeacherModal = () => document.getElementById('assignTeacherModal')?.classList.remove('hidden');
window.showCreateCourseModal = () => document.getElementById('createCourseModal')?.classList.remove('hidden');

function bindSemesterActions() {
    const form = document.getElementById('addSemesterForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/api/semesters', Object.fromEntries(new FormData(form).entries()));
            showSuccess('Semester created!');
            window.closeAddSemesterModal();
            handleNavigation('manageSemesters');
        } catch (err) { showError('Failed to create semester'); }
    };
}

window.showAddSemesterModal = () => document.getElementById('addSemesterModal')?.classList.remove('hidden');
window.closeAddSemesterModal = () => document.getElementById('addSemesterModal')?.classList.add('hidden');

window.activateSemester = async (id) => {
    const confirmed = await confirmAction('Activate Semester', 'Are you sure you want to set this as the ACTIVE semester? This will deactivate the current one.');
    if (!confirmed) return;

    try {
        await apiClient.patch(`/api/semesters/${id}/toggle`, { isActive: true });
        showSuccess('Semester activated!');

        // Also update the global setting if it's the new active
        const apiBase = import.meta.env.VITE_API_URL;
        const res = await apiClient.get('/api/semesters');
        const activeItem = res.data.find(s => s.id === id);

        if (activeItem) {
            await apiClient.put('/api/system', { key: 'current_semester', value: activeItem.name });
            localStorage.setItem('activeSemester', activeItem.name);
            currentSemester = activeItem.name;
        }

        handleNavigation('manageSemesters');
        // Force refresh to update all panels
        setTimeout(() => location.reload(), 500);
    } catch (err) { showError('Failed to activate'); }
};

window.deleteSemester = async (id) => {
    const confirmed = await confirmAction('Delete Semester', 'Are you sure you want to delete this semester? This may affect data consistency across the system.');
    if (!confirmed) return;

    try {
        await apiClient.delete(`/api/semesters/${id}`);
        showSuccess('Semester removed successfully');
        handleNavigation('manageSemesters');
    } catch (err) { showError('Failed to delete: ' + (err.response?.data?.message || err.message)); }
};

// History Back/Forward Support
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.action) {
        window.handleNavigation(event.state.action, event.state.arg, false);
    } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            window.handleNavigation(hash, null, false);
        } else {
            window.handleNavigation('loadDashboard', null, false);
        }
    }
});

// Auto-load initial dashboard based on hash or state
const initialHash = window.location.hash.replace('#', '');
if (initialHash) {
    handleNavigation(initialHash, null, false);
} else {
    handleNavigation('loadDashboard', null, false);
}

function bindEditProfileForm() {
    const form = document.getElementById('editProfileForm');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');

        const confirmed = await confirmAction('Update Profile', 'Save changes to your profile details?');
        if (!confirmed) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const token = localStorage.getItem('accessToken');
        const apiBase = import.meta.env.VITE_API_URL;

        try {
            setBtnLoading(btn, true);
            await apiClient.put('/api/user/me', data);
            showSuccess('Profile updated successfully!');

            // Update name in header if it changed
            if (data.name) {
                const nameEl = document.getElementById('userName');
                if (nameEl) nameEl.innerText = data.name;
                // Update local storage too to keep it consistent
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (userObj) {
                    userObj.name = data.name;
                    localStorage.setItem('user', JSON.stringify(userObj));
                }
            }

            window.closeEditProfileModal();
            handleNavigation('loadProfile');
        } catch (err) {
            showError('Error updating profile: ' + (err.response?.data?.message || err.message));
        } finally {
            setBtnLoading(btn, false);
        }
    };
}

// === Notification System ===
const notificationIcon = document.getElementById('notificationIcon');
const notificationDropdown = document.getElementById('notificationDropdown');
const notificationDot = document.getElementById('notificationDot');
const notificationList = document.getElementById('notificationList');
const markAllReadBtn = document.getElementById('markAllReadBtn');

if (notificationIcon) {
    notificationIcon.onclick = (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('hidden');
        if (!notificationDropdown.classList.contains('hidden')) {
            loadNotifications();
        }
    };
}

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    notificationDropdown?.classList.add('hidden');
});
notificationDropdown?.addEventListener('click', (e) => e.stopPropagation());

async function loadNotifications() {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await apiClient.get('/api/notifications');

        const notifications = res.data;
        renderNotifications(notifications);

        const unreadCount = notifications.filter(n => !n.isRead).length;
        if (unreadCount > 0) {
            notificationDot.classList.remove('hidden');
        } else {
            notificationDot.classList.add('hidden');
        }
    } catch (err) {
        console.error('Error loading notifications:', err);
    }
}

function renderNotifications(notifications) {
    const unreadNotifications = notifications.filter(n => !n.isRead);

    if (unreadNotifications.length === 0) {
        notificationList.innerHTML = `
            <div class="p-10 text-center text-gray-400">
                <ion-icon name="notifications-off-outline" class="text-4xl mb-2"></ion-icon>
                <p class="text-sm font-medium">No new notifications</p>
                <p class="text-[10px] mt-1 opacity-50">You're all caught up!</p>
            </div>`;
        return;
    }

    notificationList.innerHTML = unreadNotifications.map(n => `
        <div class="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${n.isRead ? 'border-transparent opacity-60' : 'border-indigo-500 bg-indigo-50/20'}" 
             onclick="window.markNotificationRead(${n.id})">
            <div class="flex justify-between items-start">
                <h5 class="text-sm font-bold text-gray-800">${n.title}</h5>
                <span class="text-[10px] text-gray-400">${new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p class="text-xs text-gray-600 mt-1 leading-relaxed">${n.message}</p>
        </div>
    `).join('');
}

window.markNotificationRead = async (id) => {
    try {
        const token = localStorage.getItem('accessToken');
        await apiClient.put(`/api/notifications/${id}/read`, {});
        loadNotifications();
    } catch (err) { console.error(err); }
};

if (markAllReadBtn) {
    markAllReadBtn.onclick = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await apiClient.put('/api/notifications/read-all', {});
            showSuccess('All marked as read');
            loadNotifications();
        } catch (err) {
            showError('Failed to mark all as read');
            console.error(err);
        }
    };
}

// Start notification polling
loadNotifications();
setInterval(loadNotifications, 60000);

// --- Attendance Helpers ---
window.startTakingAttendance = (courseId, courseCode) => {
    handleNavigation('startTakingAttendance', { id: courseId, code: courseCode });
};

window.viewAttendanceReport = (courseId, courseCode) => {
    handleNavigation('viewAttendanceReport', { id: courseId, code: courseCode });
};

window.editAttendanceRecord = async (courseId, courseCode, date) => {
    // Navigate to take attendance form
    await handleNavigation('startTakingAttendance', { id: courseId, code: courseCode });
    // After navigation, set the date and trigger load
    setTimeout(() => {
        const dateInput = document.getElementById('attendanceDate');
        if (dateInput) {
            dateInput.value = date;
            window.loadAttendanceForDate(courseId);
        }
    }, 100);
};

window.submitAttendance = async (event, courseId, semester) => {
    event.preventDefault();
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    const date = document.getElementById('attendanceDate').value;
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Extract students data from form
    const formData = new FormData(form);
    const students = [];

    const studentStatusMap = {};
    const studentRemarksMap = {};

    for (const [key, value] of formData.entries()) {
        if (key.startsWith('status-')) {
            const sId = key.split('-')[1];
            studentStatusMap[sId] = value;
        } else if (key.startsWith('remarks-')) {
            const sId = key.split('-')[1];
            studentRemarksMap[sId] = value;
        }
    }

    // Construct the payload
    Object.keys(studentStatusMap).forEach(sId => {
        students.push({
            studentId: sId,
            status: studentStatusMap[sId],
            remarks: studentRemarksMap[sId]
        });
    });

    try {
        setBtnLoading(submitBtn, true);
        await apiClient.post('/api/attendance/take', {
            courseId,
            date,
            semester,
            students
        });

        showSuccess('Attendance recorded successfully!');
        handleNavigation('loadAttendance');
    } catch (err) {
        showError('Error submitting attendance: ' + (err.response?.data?.message || err.message));
        setBtnLoading(submitBtn, false);
    }
};

window.loadAttendanceForDate = async (courseId) => {
    const date = document.getElementById('attendanceDate').value;
    if (!date) {
        showWarning('Please select a date first');
        return;
    }

    try {
        const token = localStorage.getItem('accessToken');
        const apiBase = import.meta.env.VITE_API_URL;

        const res = await apiClient.get(`/api/attendance/check?courseId=${courseId}&date=${date}`);

        const records = res.data;
        if (records.length > 0) {
            // Update UI with existing data
            records.forEach(r => {
                // Set Status
                const radio = document.querySelector(`input[name="status-${r.studentId}"][value="${r.status}"]`);
                if (radio) radio.checked = true;

                // Set Remarks
                const remarksInput = document.querySelector(`input[name="remarks-${r.studentId}"]`);
                if (remarksInput) remarksInput.value = r.remarks || '';
            });
            showSuccess(`Loaded existing attendance for ${date}`);
        } else {
            // Reset form to default (Present) if no data found
            document.querySelectorAll('input[type="radio"][value="present"]').forEach(r => r.checked = true);
            document.querySelectorAll('input[type="text"][name^="remarks-"]').forEach(i => i.value = '');
            showWarning(`No attendance found for ${date}. Starting fresh.`);
        }
    } catch (err) {
        console.error(err);
        showError('Failed to check attendance');
    }
};
// --- Policy Management Helpers ---
window.bindPolicyActions = () => {
    const policyForm = document.getElementById('policyForm');
    if (policyForm) {
        policyForm.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('policyId').value;
            const payload = {
                subject: document.getElementById('pSubject').value,
                action: document.getElementById('pAction').value,
                resource: document.getElementById('pResource').value,
                conditions: document.getElementById('pConditions').value ? JSON.parse(document.getElementById('pConditions').value) : null,
                allow: document.getElementById('pAllow').value === 'true',
                description: document.getElementById('pDescription').value
            };

            const token = localStorage.getItem('accessToken');
            const apiBase = import.meta.env.VITE_API_URL;

            try {
                if (id) {
                    await apiClient.put(`/api/policies/${id}`, payload);
                    showSuccess('Policy updated');
                } else {
                    await apiClient.post('/api/policies', payload);
                    showSuccess('Policy created');
                }
                window.closePolicyModal();
                handleNavigation('managePolicies');
            } catch (err) {
                showError('Policy save failed: ' + (err.response?.data?.message || err.message));
            }
        };
    }
};

window.showAddPolicyModal = () => {
    document.getElementById('policyForm').reset();
    document.getElementById('policyId').value = '';
    document.getElementById('modalTitle').innerText = 'Create Governance Policy';
    document.getElementById('policyModal').classList.remove('hidden');
    document.getElementById('policyModal').classList.add('flex');
};

window.closePolicyModal = () => {
    document.getElementById('policyModal').classList.add('hidden');
    document.getElementById('policyModal').classList.remove('flex');
};

window.editPolicy = async (id) => {
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    try {
        const res = await apiClient.get('/api/policies');
        const policy = res.data.find(p => p.id === id);
        if (policy) {
            document.getElementById('policyId').value = policy.id;
            document.getElementById('pSubject').value = policy.subject;
            document.getElementById('pAction').value = policy.action;
            document.getElementById('pResource').value = policy.resource;
            document.getElementById('pConditions').value = policy.conditions ? JSON.stringify(JSON.parse(policy.conditions), null, 2) : '';
            document.getElementById('pAllow').value = String(policy.allow);
            document.getElementById('pDescription').value = policy.description || '';

            document.getElementById('modalTitle').innerText = 'Update Governance Policy';
            document.getElementById('policyModal').classList.remove('hidden');
            document.getElementById('policyModal').classList.add('flex');
        }
    } catch (err) { showError('Failed to load policy'); }
};

window.deletePolicy = async (id) => {
    const confirmed = await confirmAction('Delete Policy', 'This rule will be permanently removed. System behavior might change instantly.');
    if (!confirmed) return;

    try {
        const token = localStorage.getItem('accessToken');
        await apiClient.delete(`/api/policies/${id}`);
        showSuccess('Policy deleted');
        handleNavigation('managePolicies');
    } catch (err) { showError('Delete failed'); }
};
// --- Department Autonomy Helpers ---

window.bindDeptBrandingForm = () => {
    const form = document.getElementById('deptBrandingForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        try {
            setBtnLoading(submitBtn, true);
            await apiClient.put(`/api/departments/meta/${user.department}`, new FormData(form), {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showSuccess('Institutional identity synchronized.');
            handleNavigation('loadDeptDashboard');
        } catch (err) {
            showError('Synchronization failed.');
        } finally {
            setBtnLoading(submitBtn, false);
        }
    });
};

window.previewDeptAsset = (input, previewId) => {
    const file = input.files?.[0];
    const preview = document.getElementById(previewId);
    if (file && preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

window.bindDeptEventForm = () => {
    const form = document.getElementById('deptEventForm');
    if (!form) return;

    // Remote any existing listeners by cloning (if needed) but simple onsubmit is safer if we re-bind
    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        const eventId = document.getElementById('editEventId')?.value;
        try {
            setBtnLoading(submitBtn, true);
            if (eventId) {
                await apiClient.put(`/api/departments/events/${eventId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showSuccess('Operational engagement updated.');
            } else {
                await apiClient.post('/api/departments/events', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showSuccess('New engagement deployed.');
            }
            window.closeEventModal();
            handleNavigation('manageDeptEvents');
        } catch (err) {
            showError('Event deployment failed.');
        } finally {
            setBtnLoading(submitBtn, false);
        }
    };
};

window.showAddEventModal = () => {
    const modal = document.getElementById('eventModal');
    if (modal) {
        const form = document.getElementById('deptEventForm');
        if (form) form.reset();
        if (document.getElementById('editEventId')) document.getElementById('editEventId').value = '';
        if (document.getElementById('eventSubmitBtn')) document.getElementById('eventSubmitBtn').innerText = 'Initialize Deployment Sequence';
        // Reset image preview
        const prev = document.getElementById('bannerPreviewContainer');
        if (prev) prev.classList.add('hidden');
        const placeholder = document.getElementById('bannerUploadPlaceholder');
        if (placeholder) placeholder.classList.remove('hidden');

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.editDeptEvent = (eventDataStr) => {
    try {
        const event = JSON.parse(decodeURIComponent(eventDataStr));
        const modal = document.getElementById('eventModal');
        const form = document.getElementById('deptEventForm');

        if (modal && form) {
            form.reset();
            document.getElementById('editEventId').value = event.id;

            form.querySelector('input[name="title"]').value = event.title;
            form.querySelector('select[name="type"]').value = event.type;
            form.querySelector('select[name="visibility"]').value = event.visibility;
            form.querySelector('input[name="venue"]').value = event.venue;

            if (event.startTime) {
                const d = new Date(event.startTime);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                form.querySelector('input[name="startTime"]').value = d.toISOString().slice(0, 16);
            }

            if (event.endTime) {
                const d2 = new Date(event.endTime);
                d2.setMinutes(d2.getMinutes() - d2.getTimezoneOffset());
                form.querySelector('input[name="endTime"]').value = d2.toISOString().slice(0, 16);
            }

            form.querySelector('textarea[name="description"]').value = event.description || '';
            document.getElementById('eventSubmitBtn').innerText = 'Update Deployment Setup';

            // Show existing banner as preview if present
            const prevContainer = document.getElementById('bannerPreviewContainer');
            const prevImg = document.getElementById('bannerPreviewImg');
            if (event.banner && prevContainer && prevImg) {
                prevImg.src = event.banner;
                prevContainer.classList.remove('hidden');
            } else if (prevContainer) {
                prevContainer.classList.add('hidden');
            }

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    } catch (e) {
        console.error("Error parsing event data for edit:", e);
    }
};

window.previewEventBanner = (input) => {
    const file = input.files?.[0];
    const prevContainer = document.getElementById('bannerPreviewContainer');
    const prevImg = document.getElementById('bannerPreviewImg');
    if (file && prevContainer && prevImg) {
        const reader = new FileReader();
        reader.onload = (e) => {
            prevImg.src = e.target.result;
            prevContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
};

window.closeEventModal = () => {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.deleteDeptEvent = async (id) => {
    if (await confirmAction('Delete Event', 'This action will permanently remove the event from all portals.')) {
        try {
            await apiClient.delete(`/api/departments/events/${id}`);
            showSuccess('Event removed');
            handleNavigation('manageDeptEvents');
        } catch (err) {
            showError('Delete failed');
        }
    }
};

window.bindDeptContentForm = () => {
    const form = document.getElementById('deptContentForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            setBtnLoading(submitBtn, true);
            await apiClient.post('/api/departments/content', data);
            showSuccess('Information broadcasted successfully!');
            window.closeContentModal();
            handleNavigation('manageDeptContent');
        } catch (err) {
            showError('Broadcast failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setBtnLoading(submitBtn, false);
        }
    };
};

window.showAddContentModal = () => {
    const modal = document.getElementById('contentModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closeContentModal = () => {
    const modal = document.getElementById('contentModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.deleteGalleryItem = async (id) => {
    const confirmed = await confirmAction('Purge Visual Asset', 'Are you certain you wish to purge this visual asset from the institutional archive?');
    if (!confirmed) return;
    try {
        await apiClient.delete(`/api/departments/gallery/${id}`);
        showSuccess('Visual asset purged from archive.');
        handleNavigation('manageDeptGallery');
    } catch (err) {
        showError('Purge protocol failed.');
    }
};

window.previewGalleryImage = (input) => {
    const file = input.files?.[0];
    const prevContainer = document.getElementById('galleryPreviewContainer');
    const prevImg = document.getElementById('galleryPreviewImg');
    const placeholder = document.getElementById('galleryUploadPlaceholder');
    if (file && prevContainer && prevImg) {
        const reader = new FileReader();
        reader.onload = (e) => {
            prevImg.src = e.target.result;
            prevContainer.classList.remove('hidden');
            if (placeholder) placeholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
};

window.showAddGalleryModal = () => {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        const form = document.getElementById('deptGalleryForm');
        if (form) form.reset();

        // Reset preview
        const prev = document.getElementById('galleryPreviewContainer');
        if (prev) prev.classList.add('hidden');
        const placeholder = document.getElementById('galleryUploadPlaceholder');
        if (placeholder) placeholder.classList.remove('hidden');

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closeGalleryModal = () => {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.bindDeptGalleryForm = () => {
    const form = document.getElementById('deptGalleryForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        try {
            setBtnLoading(submitBtn, true);
            await apiClient.post('/api/departments/gallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showSuccess('Visual asset committed to archive.');
            window.closeGalleryModal();
            handleNavigation('manageDeptGallery');
        } catch (err) {
            showError('Archive commitment failed.');
        } finally {
            setBtnLoading(submitBtn, false);
        }
    };
};

// --- Finance & Treasury Helpers ---

window.showPaymentModal = () => {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
};

window.closePaymentModal = () => {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

window.selectPaymentAmount = (amount, btn) => {
    // Update hidden input
    document.getElementById('paymentAmount').value = amount;

    // Update button styles
    document.querySelectorAll('.payment-amount-btn').forEach(b => {
        b.classList.remove('active', 'border-emerald-500', 'bg-emerald-500/10');
        b.classList.add('border-white/5', 'bg-white/5');
    });
    btn.classList.add('active', 'border-emerald-500', 'bg-emerald-500/10');
    btn.classList.remove('border-white/5', 'bg-white/5');

    const customInput = document.getElementById('customAmountInput');
    const customToggle = document.getElementById('customAmountToggle');
    if (customInput && customToggle) {
        customInput.classList.add('hidden');
        customToggle.checked = false;
    }
};

window.toggleCustomAmount = () => {
    const customInput = document.getElementById('customAmountInput');
    const toggle = document.getElementById('customAmountToggle');

    if (toggle.checked) {
        customInput.classList.remove('hidden');
        customInput.focus();

        // Deselect all preset buttons
        document.querySelectorAll('.payment-amount-btn').forEach(b => {
            b.classList.remove('active', 'border-emerald-500', 'bg-emerald-500/10');
            b.classList.add('border-white/5', 'bg-white/5');
        });

        // Update amount on input
        customInput.addEventListener('input', (e) => {
            document.getElementById('paymentAmount').value = e.target.value;
        });
    } else {
        customInput.classList.add('hidden');
        // Reset to first installment
        const firstBtn = document.querySelector('.payment-amount-btn');
        if (firstBtn) firstBtn.click();
    }
};

// Update payment amount from manual input
window.updatePaymentAmount = (value) => {
    document.getElementById('paymentAmount').value = value;
};

// Quick select preset amount
window.quickSelectAmount = (amount) => {
    const manualInput = document.getElementById('manualAmountInput');
    if (manualInput) {
        manualInput.value = amount;
        document.getElementById('paymentAmount').value = amount;

        // Visual feedback
        manualInput.classList.add('border-emerald-500', 'bg-emerald-500/10');
        setTimeout(() => {
            manualInput.classList.remove('border-emerald-500', 'bg-emerald-500/10');
        }, 500);
    }
};

const bindStudentPaymentForm = () => {
    const form = document.getElementById('studentPaymentForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        try {
            setBtnLoading(submitBtn, true, 'Settling...');
            await apiClient.post('/api/finance/pay', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showSuccess('Payment claim submitted. Institutional verification in progress.');
            window.closePaymentModal();
            handleNavigation('loadFinance');
        } catch (err) {
            showError(err.response?.data?.message || 'Transaction settlement failed.');
        } finally {
            setBtnLoading(submitBtn, false);
        }
    });
};

window.confirmAcademicRegistration = async (semesterId) => {
    try {
        const confirmed = await confirmAction('Finalize Course Registration? This will lock your academic status for the semester.');
        if (!confirmed) return;

        await apiClient.post('/api/finance/register-confirm', { semesterId });
        showSuccess('Academic Access Unlocked. Registration Complete.');
        handleNavigation('loadFinance');
    } catch (err) {
        showError(err.response?.data?.message || 'Registration confirmation failed.');
    }
};

window.processPayment = async (paymentId, status) => {
    try {
        const token = localStorage.getItem('accessToken');
        const apiBase = import.meta.env.VITE_API_URL;

        const actionText = status === 'verified' ? 'Verify' : 'Reject';
        const confirmed = await confirmAction(`${actionText} this payment claim?`);
        if (!confirmed) return;

        let remarks = '';
        if (status === 'rejected') {
            remarks = prompt('Enter rejection reason:');
            if (remarks === null) return;
        }

        await apiClient.put(`/api/finance/verify/${paymentId}`, { status, remarks });
        showSuccess(`Payment ${status} successfully.`);
        handleNavigation('managePayments');
    } catch (err) {
        showError('Verification protocol failure.');
    }
};

const bindPaymentFilters = () => {
    const filter = document.getElementById('paymentStatusFilter');
    if (!filter) return;
    filter.addEventListener('change', (e) => {
        handleNavigation('managePayments', { status: e.target.value });
    });
};
