import { checkAuth, logout } from './auth.js';
import axios from 'axios';
import gsap from 'gsap';
import { io } from 'socket.io-client';
import { renderUserManagement } from './views/admin.js';
import { renderDepartmentsView } from './views/departments.js';
import { renderTeacherCourses, renderUploadResultForm, renderCourseMaterials, renderCourseResultsList, renderEditResultForm, renderEditMaterialForm, renderAttendanceDashboard, renderTakeAttendanceForm, renderAttendanceReport } from './views/teacher.js';
import { renderStudentResults, renderStudentCourses, renderStudentAdmitCards, renderStudentAttendance } from './views/student.js';
import { renderDeptHeadUsers, renderAdmitCardManager } from './views/deptHead.js';
import { renderDeptDashboard, renderDeptBranding, renderDeptEvents, renderDeptContent } from './views/department.js';
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

// Global helper for forced downloads
window.getDownloadUrl = getDownloadUrl;

const user = checkAuth();

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

// Axios response interceptor for global error handling
axios.interceptors.response.use(
    response => response,
    error => {
        // Only logout on 401 (Unauthorized) - token is invalid/expired
        // Don't logout on 403 (Forbidden) - user lacks permission but is authenticated
        const isStale = error.response && error.response.status === 401;

        if (isStale) {
            console.warn('Session invalid or user not found, logging out...');
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Semester Handling
const semesterSelector = document.getElementById('globalSemesterSelector');
let currentSemester = localStorage.getItem('activeSemester') || 'Spring 2025';

async function initSemester() {
    try {
        const token = localStorage.getItem('accessToken');
        const apiBase = import.meta.env.VITE_API_URL;

        // Fetch all semesters
        let semestersList = [];
        try {
            const semRes = await axios.get(`${apiBase}/api/semesters`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            semestersList = semRes.data;
        } catch (e) {
            console.error("Failed to fetch semesters list:", e);
        }

        // Check system settings for current active
        const sysRes = await axios.get(`${apiBase}/api/system`, {
            headers: { Authorization: `Bearer ${token}` }
        });

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
                        const token = localStorage.getItem('accessToken');
                        await axios.put(`${apiBase}/api/system`,
                            { key: 'current_semester', value: newSemester },
                            { headers: { Authorization: `Bearer ${token}` } }
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
        logout();
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
window.handleNavigation = async function (action, arg = null) {
    window.currentPath = action;
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
        <div class="flex flex-col items-center justify-center h-64 space-y-4">
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            <p class="text-indigo-600 font-medium animate-pulse">Loading content...</p>
        </div>
    `;

    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;

    try {
        switch (action) {
            case 'viewDeptDetails':
                pageTitle.innerText = `${arg || 'Department'} Users`;
                const dUsersRes = await axios.get(`${apiBase}/api/admin/users?dept=${encodeURIComponent(arg)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderUserManagement(dUsersRes.data);
                bindAddUserForm();
                bindEditRoleForm();
                break;

            case 'loadProfile':
                pageTitle.innerText = 'My Profile';
                const profileRes = await axios.get(`${apiBase}/api/user/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
                const resultsRes = await axios.get(`${apiBase}/api/student/results?semester=${currentSemester}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderStudentResults(resultsRes.data);
                break;

            case 'manageUsers':
                pageTitle.innerText = 'Manage Users';
                const usersRes = await axios.get(`${apiBase}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderUserManagement(usersRes.data);
                bindAddUserForm();
                bindEditRoleForm();
                break;

            case 'manageDepartments':
                pageTitle.innerText = 'Departments';
                const deptsRes = await axios.get(`${apiBase}/api/departments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderDepartmentsView(deptsRes.data);
                break;

            case 'loadCourses':
                pageTitle.innerText = 'My Courses';
                {
                    const isStaff = ['teacher', 'course_coordinator', 'dept_head', 'super_admin'].includes(user.role);
                    const courseEndpoint = isStaff ? 'teacher/courses' : 'student/courses';
                    const coursesRes = await axios.get(`${apiBase}/api/${courseEndpoint}?semester=${currentSemester}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (isStaff) {
                        mainContent.innerHTML = renderTeacherCourses(coursesRes.data);
                    } else {
                        mainContent.innerHTML = renderStudentCourses(coursesRes.data);
                    }
                }
                break;

            case 'loadNotices':
                pageTitle.innerText = 'Notices';
                const noticesRes = await axios.get(`${apiBase}/api/notices`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderNotices(noticesRes.data, user.role);
                if (['teacher', 'dept_head', 'super_admin'].includes(user.role)) {
                    bindCreateNoticeForm();
                }
                break;

            case 'loadDocuments':
                pageTitle.innerText = 'Course Materials';
                {
                    const isStaff = ['teacher', 'course_coordinator', 'dept_head', 'super_admin'].includes(user.role);
                    const [materialsRes, docCoursesRes] = await Promise.all([
                        axios.get(`${apiBase}/api/materials?semester=${currentSemester}`, { headers: { Authorization: `Bearer ${token}` } }),
                        isStaff
                            ? (['teacher', 'course_coordinator'].includes(user.role)
                                ? axios.get(`${apiBase}/api/teacher/courses`, { headers: { Authorization: `Bearer ${token}` } })
                                : axios.get(`${apiBase}/api/coordinator/courses`, { headers: { Authorization: `Bearer ${token}` } })
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
                    axios.get(`${apiBase}/api/coordinator/assignments?semester=${currentSemester}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${apiBase}/api/coordinator/courses`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${apiBase}/api/coordinator/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${apiBase}/api/semesters`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                mainContent.innerHTML = renderCoordinatorDashboard(assignmentsR.data, coursesR.data, teachersR.data, semestersR.data, user);
                bindAssignTeacherForm();
                bindCreateCourseForm();
                bindEditCourseForm();
                break;

            case 'manageSemesters':
                pageTitle.innerText = 'Manage Semesters';
                const semListRes = await axios.get(`${apiBase}/api/semesters`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderSemestersView(semListRes.data);
                bindSemesterActions();
                break;

            case 'loadDeptDashboard':
                pageTitle.innerText = `${user.department} Hub`;
                const deptStatsRes = await axios.get(`${apiBase}/api/departments/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderDeptDashboard(deptStatsRes.data);
                break;

            case 'customizeDept':
                pageTitle.innerText = 'Portal Personalization';
                const deptRes = await axios.get(`${apiBase}/api/departments/portal/${user.department}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderDeptBranding(deptRes.data.department);
                bindDeptBrandingForm();
                break;

            case 'manageDeptEvents':
                pageTitle.innerText = 'Event Calendar';
                const deptEventsRes = await axios.get(`${apiBase}/api/departments/events`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderDeptEvents(deptEventsRes.data);
                bindDeptEventForm();
                break;

            case 'manageDeptContent':
                pageTitle.innerText = 'Faculty Information';
                const deptContentRes = await axios.get(`${apiBase}/api/departments/content`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderDeptContent(deptContentRes.data);
                bindDeptContentForm();
                break;

            case 'manageDeptGallery':
                pageTitle.innerText = 'Institutional Gallery';
                const deptGalleryRes = await axios.get(`${apiBase}/api/departments/gallery`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderDeptGallery(deptGalleryRes.data);
                bindDeptGalleryForm();
                break;

            case 'managePolicies':
                pageTitle.innerText = 'Governance Policies';
                const policiesRes = await axios.get(`${apiBase}/api/policies`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderPoliciesView(policiesRes.data);
                bindPolicyActions();
                break;

            case 'manageDeptUsers':
                pageTitle.innerText = 'Department Users';
                const deptUsersRes = await axios.get(`${apiBase}/api/dept-head/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderDeptHeadUsers(deptUsersRes.data);
                break;

            case 'manageAdmitCards':
                pageTitle.innerText = 'Admit Cards';
                const admitCardsRes = await axios.get(`${apiBase}/api/dept-head/admit-cards?semester=${currentSemester}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderAdmitCardManager(admitCardsRes.data);
                bindGenerateCardForm();
                break;

            case 'loadAdmitCard':
                pageTitle.innerText = 'My Admit Card';
                const myAdmitCardsRes = await axios.get(`${apiBase}/api/student/admit-cards?semester=${currentSemester}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderStudentAdmitCards(myAdmitCardsRes.data);
                break;

            case 'loadFinance':
                pageTitle.innerText = 'Semester Finance';
                const financeStatusRes = await axios.get(`${apiBase}/api/finance/my-status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderStudentFinance(financeStatusRes.data);
                bindStudentPaymentForm();
                break;

            case 'managePayments':
                pageTitle.innerText = 'Institutional Ledger';
                const statusFilter = (arg && arg.status) ? arg.status : '';
                const paymentsRes = await axios.get(`${apiBase}/api/finance/payments?status=${statusFilter}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderPaymentsList(paymentsRes.data);
                bindPaymentFilters();
                break;

            case 'loadAttendance':
                pageTitle.innerText = 'Attendance Management';
                if (user.role === 'student') {
                    const studentAttendanceRes = await axios.get(`${apiBase}/api/attendance/me?semester=${currentSemester}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    mainContent.innerHTML = renderStudentAttendance(studentAttendanceRes.data);
                } else {
                    const endpoint = (user.role === 'teacher' || user.role === 'course_coordinator') ? 'teacher/courses' : 'coordinator/courses';
                    const coursesRes = await axios.get(`${apiBase}/api/${endpoint}?semester=${currentSemester}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
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
                const enrolledStudentsRes = await axios.get(`${apiBase}/api/teacher/courses/${courseId}/students?semester=${currentSemester}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderTakeAttendanceForm(enrolledStudentsRes.data, courseId, courseCode, currentSemester);
                break;

            case 'viewAttendanceReport':
                if (!arg) {
                    showError('Course information missing');
                    return handleNavigation('loadAttendance');
                }
                pageTitle.innerText = 'Attendance Report';
                const { id: cId, code: cCode } = arg;
                const attendanceReportRes = await axios.get(`${apiBase}/api/attendance/report?courseId=${cId}&semester=${currentSemester}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                mainContent.innerHTML = renderAttendanceReport(attendanceReportRes.data, cCode);
                break;

            case 'viewLogs':
                pageTitle.innerText = 'System Logs';
                // Mock endpoint for now, or just show component
                mainContent.innerHTML = renderSystemLogs([]);
                break;

            case 'loadDashboard':
                pageTitle.innerText = 'Command Center';
                if (user.role === 'treasurer') {
                    const treasurerOverviewRes = await axios.get(`${apiBase}/api/finance/overview`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    mainContent.innerHTML = renderTreasurerDashboard(treasurerOverviewRes.data);
                    return; // Exit early as treasurer has a unique dashboard
                }

                // Show Stats Grid on Dashboard
                const statsGrid = document.getElementById('statsGrid');
                if (statsGrid) {
                    statsGrid.classList.remove('hidden');
                    try {
                        const statsRes = await axios.get(`${apiBase}/api/system/stats`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const stats = statsRes.data;
                        statsGrid.innerHTML = `
                            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border-2 border-indigo-500/30 hover:border-indigo-500 transition-all group">
                                <div class="flex items-center space-x-4">
                                    <div class="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/50">
                                        <ion-icon name="people-outline" class="text-2xl text-white"></ion-icon>
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Students</p>
                                        <p class="text-3xl font-black text-white">${stats.students}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border-2 border-purple-500/30 hover:border-purple-500 transition-all group">
                                <div class="flex items-center space-x-4">
                                    <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/50">
                                        <ion-icon name="person-circle-outline" class="text-2xl text-white"></ion-icon>
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Teachers</p>
                                        <p class="text-3xl font-black text-white">${stats.teachers}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border-2 border-emerald-500/30 hover:border-emerald-500 transition-all group">
                                <div class="flex items-center space-x-4">
                                    <div class="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/50">
                                        <ion-icon name="book-outline" class="text-2xl text-white"></ion-icon>
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Courses</p>
                                        <p class="text-3xl font-black text-white">${stats.courses}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border-2 border-amber-500/30 hover:border-amber-500 transition-all group">
                                <div class="flex items-center space-x-4">
                                    <div class="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/50">
                                        <ion-icon name="notifications-outline" class="text-2xl text-white"></ion-icon>
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">New Notices</p>
                                        <p class="text-3xl font-black text-white">${stats.notices}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    } catch (e) {
                        console.error("Stats fetch failed:", e);
                        statsGrid.classList.add('hidden');
                    }
                }

                let dashboardExtraRes = { data: [] };
                let deptEvents = [];
                try {
                    const isStaff = ['teacher', 'course_coordinator', 'dept_head', 'super_admin'].includes(user.role);
                    const [courseRes, deptPortalRes] = await Promise.all([
                        isStaff
                            ? axios.get(`${apiBase}/api/teacher/courses?semester=${currentSemester}`, { headers: { Authorization: `Bearer ${token}` } })
                            : axios.get(`${apiBase}/api/student/courses?semester=${currentSemester}`, { headers: { Authorization: `Bearer ${token}` } }),
                        user.department ? axios.get(`${apiBase}/api/departments/portal/${user.department}`, { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve({ data: { events: [] } })
                    ]);
                    dashboardExtraRes = courseRes;
                    deptEvents = deptPortalRes.data.events || [];
                } catch (e) { console.error("Dashboard extra fetch failed:", e); }

                const extraContent = `
                    ${dashboardExtraRes.data.length > 0 ? `
                        <div class="mt-12">
                            <h4 class="text-2xl font-black text-white mb-8 flex items-center">
                                <div class="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mr-3 border border-indigo-500/30">
                                    <ion-icon name="book-outline" class="text-indigo-400"></ion-icon>
                                </div>
                                Your Current Courses
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                ${dashboardExtraRes.data.map(course => `
                                    <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border-2 border-indigo-500/20 hover:border-indigo-500 hover:-translate-y-2 transition-all duration-300 shadow-2xl group">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <span class="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/30">${course.code}</span>
                                                <h5 class="font-black text-xl text-white mt-4 tracking-tight">${course.title}</h5>
                                            </div>
                                            <div class="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                                <ion-icon name="school-outline" class="text-2xl text-indigo-400 group-hover:text-white"></ion-icon>
                                            </div>
                                        </div>
                                        <div class="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                            <div class="flex items-center text-slate-400">
                                                <ion-icon name="time-outline" class="mr-2"></ion-icon>
                                                <span class="text-xs font-bold">${course.credit} Credits</span>
                                            </div>
                                            <button onclick="window.handleNavigation('loadCourses')" class="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-indigo-500 hover:text-white transition-all">
                                                MANAGE
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${deptEvents.length > 0 ? `
                        <div class="mt-12">
                            <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <ion-icon name="sparkles-outline" class="mr-2 text-amber-500"></ion-icon>
                                Department Events
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${deptEvents.slice(0, 4).map(event => `
                                    <div class="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                        <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src="${event.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=150&q=80'}" class="w-full h-full object-cover">
                                        </div>
                                        <div class="flex-1">
                                            <h5 class="font-bold text-slate-800 text-sm line-clamp-1">${event.title}</h5>
                                            <div class="flex items-center space-x-3 mt-1">
                                                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${new Date(event.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                                <span class="text-[10px] text-indigo-500 font-bold uppercase">${event.type}</span>
                                            </div>
                                        </div>
                                        <ion-icon name="arrow-forward-outline" class="text-slate-300 group-hover:text-indigo-600 transition-colors"></ion-icon>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                `;

                mainContent.innerHTML = `
                    <div class="space-y-10">
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
                    </div>
                `;
                break;

            default:
                pageTitle.innerText = action;
                mainContent.innerHTML = `<p class="text-gray-500">Feature <b>${action}</b> is coming soon.</p>`;
        }
    } catch (err) {
        showError('Navigation error: ' + (err.response?.data?.message || err.message));
        mainContent.innerHTML = `<div class="bg-red-50 text-red-600 p-6 rounded-lg border border-red-200">
            <h4 class="font-bold">Error loading page</h4>
            <p class="mt-1">${err.message}</p>
            <button onclick="window.handleNavigation('${action}')" class="mt-4 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Try Again</button>
        </div>`;
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/users`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
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
            await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, { role, department, batch }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
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

window.deleteUser = async (id) => {
    const confirmed = await confirmAction('Delete User', 'Are you sure you want to remove this user? This action cannot be undone.');
    if (!confirmed) return;

    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
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
        const res = await axios.get(`${apiBase}/api/teacher/courses/${courseId}/students`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        document.getElementById('mainContent').innerHTML = renderUploadResultForm(courseId, courseCode, res.data);
        const form = document.getElementById('uploadResultForm');
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                try {
                    setBtnLoading(btn, true);
                    await axios.post(`${apiBase}/api/teacher/results`, new FormData(form), {
                        headers: {
                            Authorization: `Bearer ${token}`,
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
        const res = await axios.get(`${apiBase}/api/materials?courseId=${courseId}&semester=${currentSemester}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        document.getElementById('mainContent').innerHTML = renderCourseMaterials(courseId, courseCode, res.data, user.role);
    } catch (err) { showError('Load failed'); }
};

window.manageCourseResults = async (courseId, courseCode) => {
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    try {
        const res = await axios.get(`${apiBase}/api/teacher/courses/${courseId}/results?semester=${currentSemester}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        document.getElementById('mainContent').innerHTML = renderCourseResultsList(courseId, courseCode, res.data);
    } catch (err) { showError('Load failed'); }
};

window.deleteMaterialItem = async (id, courseId, courseCode) => {
    const confirmed = await confirmAction('Delete Material', 'Are you sure you want to delete this resource? Students will no longer be able to access it.');
    if (!confirmed) return;

    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/materials/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        showSuccess('Resource deleted successfully');
        window.manageCourseMaterials(courseId, courseCode);
    } catch (err) { showError('Delete failed: ' + (err.response?.data?.message || err.message)); }
};

window.editResultItem = async (id, courseId, courseCode) => {
    const token = localStorage.getItem('accessToken');
    const apiBase = import.meta.env.VITE_API_URL;
    try {
        const res = await axios.get(`${apiBase}/api/teacher/courses/${courseId}/results`, {
            headers: { Authorization: `Bearer ${token}` }
        });
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
                    await axios.put(`${apiBase}/api/teacher/results/${id}`, new FormData(form), {
                        headers: {
                            Authorization: `Bearer ${token}`,
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
        const res = await axios.get(`${apiBase}/api/materials?courseId=${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
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
                    await axios.put(`${apiBase}/api/materials/${id}`, new FormData(form), {
                        headers: {
                            Authorization: `Bearer ${token}`,
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
    // Create a modal overlay if it doesn't exist
    let modal = document.getElementById('courseUploadModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'courseUploadModal';
        modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-gray-900">Upload Material: ${courseCode}</h3>
                <button onclick="document.getElementById('courseUploadModal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
                    <ion-icon name="close-outline" class="text-2xl"></ion-icon>
                </button>
            </div>
            <form id="courseUploadForm" class="space-y-4">
                <input type="hidden" name="courseId" value="${courseId}">
                <input type="hidden" name="semester" value="${currentSemester}">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Type</label>
                        <select name="type" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border text-xs">
                            <option value="material">Lecture Material</option>
                            <option value="syllabus">Syllabus</option>
                            <option value="routine">Routine</option>
                            <option value="question">Question</option>
                            <option value="solution">Solution</option>
                            <option value="online_resource">Online Resource</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Files (Select Multiple)</label>
                    <input type="file" name="files" multiple required class="mt-1 block w-full text-sm">
                </div>
                <div class="flex justify-end space-x-3 mt-4">
                    <button type="button" onclick="document.getElementById('courseUploadModal').classList.add('hidden')" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                    <button type="submit" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">Upload</button>
                </div>
            </form>
        </div>
    `;
    modal.classList.remove('hidden');

    const form = document.getElementById('courseUploadForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        try {
            setBtnLoading(btn, true);
            const token = localStorage.getItem('accessToken');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/materials`, new FormData(form), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            showSuccess('Uploaded successfully!');
            modal.classList.add('hidden');
            window.manageCourseMaterials(courseId, courseCode);
        } catch (err) {
            showError('Upload failed');
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/dept-head/admit-cards`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/notices`, new FormData(form), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/materials`, new FormData(form), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/coordinator/assign`, Object.fromEntries(new FormData(form).entries()), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/coordinator/courses`, Object.fromEntries(new FormData(form).entries()), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
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
            await axios.put(`${import.meta.env.VITE_API_URL}/api/coordinator/courses/${id}`, Object.fromEntries(new FormData(form).entries()), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/coordinator/courses/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/semesters`, Object.fromEntries(new FormData(form).entries()), {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
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
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/semesters/${id}/toggle`, { isActive: true }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        showSuccess('Semester activated!');

        // Also update the global setting if it's the new active
        const apiBase = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiBase}/api/semesters`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const activeItem = res.data.find(s => s.id === id);

        if (activeItem) {
            await axios.put(`${apiBase}/api/system`,
                { key: 'current_semester', value: activeItem.name },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/semesters/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        showSuccess('Semester removed successfully');
        handleNavigation('manageSemesters');
    } catch (err) { showError('Failed to delete: ' + (err.response?.data?.message || err.message)); }
};

// Auto-load initial dashboard
handleNavigation('loadDashboard');

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
            await axios.put(`${apiBase}/api/user/me`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
        });

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
        await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        loadNotifications();
    } catch (err) { console.error(err); }
};

if (markAllReadBtn) {
    markAllReadBtn.onclick = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.put(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
        await axios.post(`${apiBase}/api/attendance/take`, {
            courseId,
            date,
            semester,
            students
        }, {
            headers: { Authorization: `Bearer ${token}` }
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

        const res = await axios.get(`${apiBase}/api/attendance/check?courseId=${courseId}&date=${date}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

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
                    await axios.put(`${apiBase}/api/policies/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                    showSuccess('Policy updated');
                } else {
                    await axios.post(`${apiBase}/api/policies`, payload, { headers: { Authorization: `Bearer ${token}` } });
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
        const res = await axios.get(`${apiBase}/api/policies`, { headers: { Authorization: `Bearer ${token}` } });
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/policies/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        showSuccess('Policy deleted');
        handleNavigation('managePolicies');
    } catch (err) { showError('Delete failed'); }
};
// --- Department Autonomy Helpers ---
window.bindDeptBrandingForm = () => {
    const form = document.getElementById('deptBrandingForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const token = localStorage.getItem('accessToken');
                await axios.put(`${import.meta.env.VITE_API_URL}/api/departments/meta/${user.department}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showSuccess('Department branding updated!');
                handleNavigation('loadDeptDashboard');
            } catch (err) {
                showError('Update failed: ' + (err.response?.data?.message || err.message));
            }
        };
    }
};

window.bindDeptEventForm = () => {
    const form = document.getElementById('deptEventForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            try {
                const token = localStorage.getItem('accessToken');
                await axios.post(`${import.meta.env.VITE_API_URL}/api/departments/events`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                showSuccess('Strategic event launched!');
                window.closeEventModal();
                handleNavigation('manageDeptEvents');
            } catch (err) {
                showError('Launch failed: ' + (err.response?.data?.message || err.message));
            }
        };
    }
};

window.showAddEventModal = () => {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
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
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/departments/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showSuccess('Event removed');
            handleNavigation('manageDeptEvents');
        } catch (err) {
            showError('Delete failed');
        }
    }
};

window.bindDeptContentForm = () => {
    const form = document.getElementById('deptContentForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const token = localStorage.getItem('accessToken');
                await axios.post(`${import.meta.env.VITE_API_URL}/api/departments/content`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showSuccess('Information broadcasted successfully!');
                window.closeContentModal();
                handleNavigation('manageDeptContent');
            } catch (err) {
                showError('Broadcast failed: ' + (err.response?.data?.message || err.message));
            }
        };
    }
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
    if (!confirm('Are you certain you wish to purge this visual asset from the institutional archive?')) return;
    try {
        await axios.delete(`${apiBase}/api/departments/gallery/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        showSuccess('Visual asset purged from archive.');
        handleNavigation('manageDeptGallery');
    } catch (err) {
        showError('Purge protocol failed.');
    }
};

window.showAddGalleryModal = () => {
    const modal = document.getElementById('galleryModal');
    if (modal) {
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

const bindDeptGalleryForm = () => {
    const form = document.getElementById('deptGalleryForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        try {
            setBtnLoading(submitBtn, true);
            await axios.post(`${apiBase}/api/departments/gallery`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
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
    });
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

const bindStudentPaymentForm = () => {
    const form = document.getElementById('studentPaymentForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        try {
            setBtnLoading(submitBtn, true, 'Settling...');
            await axios.post(`${apiBase}/api/finance/pay`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

        await axios.post(`${apiBase}/api/finance/register-confirm`, { semesterId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        showSuccess('Academic Access Unlocked. Registration Complete.');
        handleNavigation('loadFinance');
    } catch (err) {
        showError(err.response?.data?.message || 'Registration confirmation failed.');
    }
};

window.processPayment = async (paymentId, status) => {
    try {
        const actionText = status === 'verified' ? 'Verify' : 'Reject';
        const confirmed = await confirmAction(`${actionText} this payment claim?`);
        if (!confirmed) return;

        let remarks = '';
        if (status === 'rejected') {
            remarks = prompt('Enter rejection reason:');
            if (remarks === null) return;
        }

        await axios.put(`${apiBase}/api/finance/verify/${paymentId}`, { status, remarks }, {
            headers: { Authorization: `Bearer ${token}` }
        });
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
