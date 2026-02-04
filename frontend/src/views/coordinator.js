export const renderCoordinatorDashboard = (assignments, courses, teachers, semesters = [], user = {}) => {
    const activeSemester = localStorage.getItem('activeSemester');
    const userBatch = user.batch;
    const isCoordinator = user.role === 'course_coordinator';
    let html = `
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                <ion-icon name="git-network-outline" class="mr-2 text-indigo-600"></ion-icon>
                Course Coordinator Dashboard
            </h2>
            <div class="flex space-x-3">
                <button onclick="window.showCreateCourseModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded shadow flex items-center">
                    <ion-icon name="add-circle-outline" class="mr-2"></ion-icon>
                    Create Course
                </button>
                <button onclick="window.showAssignTeacherModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow flex items-center">
                    <ion-icon name="person-add-outline" class="mr-2"></ion-icon>
                    Assign Teacher
                </button>
            </div>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl shadow-2xl border-2 border-indigo-500/20 hover:border-indigo-500 transition-all group">
                <div class="flex items-center space-x-4">
                    <div class="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                        <ion-icon name="git-network-outline" class="text-2xl text-indigo-400"></ion-icon>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Assignments</p>
                        <p class="text-3xl font-black text-white">${assignments.length}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl shadow-2xl border-2 border-emerald-500/20 hover:border-emerald-500 transition-all group">
                <div class="flex items-center space-x-4">
                    <div class="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <ion-icon name="people-outline" class="text-2xl text-emerald-400"></ion-icon>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Teachers</p>
                        <p class="text-3xl font-black text-white">${new Set(assignments.map(a => a.teacherEmail)).size}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl shadow-2xl border-2 border-amber-500/20 hover:border-amber-500 transition-all group">
                <div class="flex items-center space-x-4">
                    <div class="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <ion-icon name="book-outline" class="text-2xl text-amber-400"></ion-icon>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Courses</p>
                        <p class="text-3xl font-black text-white">${courses.length}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl shadow-2xl border-2 border-rose-500/20 hover:border-rose-500 transition-all group">
                <div class="flex items-center space-x-4">
                    <div class="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                        <ion-icon name="layers-outline" class="text-2xl text-rose-400"></ion-icon>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Dep. Coverage</p>
                        <p class="text-3xl font-black text-white">${new Set(assignments.map(a => a.courseCode)).size} / ${courses.length}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Courses Table -->
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[2rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <div class="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 class="text-xl font-black text-white">Department Courses</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</th>
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits</th>
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                            <th class="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${courses.map(course => `
                            <tr class="hover:bg-white/5 transition-colors">
                                <td class="px-8 py-6 whitespace-nowrap text-sm font-black text-indigo-400">${course.code}</td>
                                <td class="px-8 py-6 whitespace-nowrap text-sm text-white font-bold">${course.title}</td>
                                <td class="px-8 py-6 whitespace-nowrap text-sm text-slate-400">${course.credit}</td>
                                <td class="px-8 py-6 whitespace-nowrap text-sm text-amber-400 font-black">${course.batch || '-'}</td>
                                <td class="px-8 py-6 text-sm text-slate-500 max-w-xs truncate">${course.description || '-'}</td>
                                <td class="px-8 py-6 whitespace-nowrap text-right text-sm">
                                    <div class="flex justify-end space-x-2">
                                        <button onclick="window.showEditCourseModal('${course.id}', '${course.code}', '${course.title.replace(/'/g, "\\'")}', '${course.credit}', '${course.batch}', '${(course.description || "").replace(/'/g, "\\'")}')" class="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all">
                                            <ion-icon name="create-outline"></ion-icon>
                                        </button>
                                        <button onclick="window.deleteCourseItem('${course.id}')" class="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                                            <ion-icon name="trash-outline"></ion-icon>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Assignments Table -->
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[2rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <div class="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 class="text-xl font-black text-white">Current Course Assignments</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Teacher</th>
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Semester</th>
                            <th class="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${assignments.map(assign => {
        const date = new Date(assign.createdAt).toLocaleDateString();
        const courseObj = courses.find(c => c.code === assign.courseCode);
        return `
                                <tr class="hover:bg-white/5 transition-colors">
                                    <td class="px-8 py-6 whitespace-nowrap">
                                        <div class="text-sm font-black text-indigo-400">${assign.courseCode}</div>
                                        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-tight">${assign.courseTitle}</div>
                                    </td>
                                    <td class="px-8 py-6 whitespace-nowrap text-sm text-amber-400 font-black">
                                        ${courseObj?.batch || '-'}
                                    </td>
                                    <td class="px-8 py-6 whitespace-nowrap">
                                        <div class="text-sm font-bold text-white">${assign.teacherName}</div>
                                        <div class="text-[10px] text-slate-500">${assign.teacherEmail}</div>
                                    </td>
                                    <td class="px-8 py-6 whitespace-nowrap">
                                        <span class="px-3 py-1 inline-flex text-[10px] font-black rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                                            ${assign.semester}
                                        </span>
                                    </td>
                                    <td class="px-8 py-6 whitespace-nowrap text-sm text-slate-400">${date}</td>
                                </tr>
                            `;
    }).join('')}
                    </tbody>
                </table>
                ${assignments.length === 0 ? '<div class="px-8 py-12 text-center text-slate-500 font-medium">No teachers assigned to courses yet</div>' : ''}
            </div>
        </div>
    </div>

    <!-- Create Course Modal -->
    <div id="createCourseModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Create New Course</h3>
            <form id="createCourseForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Course Code</label>
                        <input type="text" name="code" placeholder="e.g. ICE-3101" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Batch</label>
                        <select name="batch" required ${isCoordinator && userBatch ? 'disabled' : ''} class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border ${isCoordinator && userBatch ? 'bg-gray-50' : ''}">
                            <option value="">Select Batch</option>
                            ${['Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17', 'Batch 18', 'Batch 19', 'Batch 20', 'Batch 21', 'Batch 22', 'Batch 23'].map(b => `
                                <option value="${b}" ${isCoordinator && userBatch === b ? 'selected' : ''}>${b}</option>
                            `).join('')}
                        </select>
                        ${isCoordinator && userBatch ? `<input type="hidden" name="batch" value="${userBatch}">` : ''}
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Course Title</label>
                    <input type="text" name="title" placeholder="e.g. Database Management Systems" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Credits</label>
                    <input type="number" name="credit" min="1" max="4" value="3" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"></textarea>
                </div>
                <div class="flex justify-end space-x-3 mt-4">
                    <button type="button" onclick="document.getElementById('createCourseModal').classList.add('hidden')" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                    <button type="submit" class="bg-emerald-600 text-white font-bold py-2 px-4 rounded hover:bg-emerald-700">Create</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Assign Teacher Modal -->
    <div id="assignTeacherModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Assign Teacher to Course</h3>
            <form id="assignTeacherForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Select Course</label>
                    <select name="courseId" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                        <option value="">-- Select Course --</option>
                        ${courses.map(c => `<option value="${c.id}">${c.code} - ${c.title}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Select Teacher</label>
                    <select name="teacherId" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                        <option value="">-- Select Teacher --</option>
                        ${teachers.map(t => `<option value="${t.id}">${t.name} (${t.designation || 'Lecturer'})</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Semester</label>
                    <select name="semester" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                        <option value="">-- Select Semester --</option>
                        ${semesters.map(s => `
                            <option value="${s.name}" ${s.name === activeSemester ? 'selected' : ''}>
                                ${s.name} ${s.isActive ? '(Active)' : ''}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="flex justify-end space-x-3 mt-4">
                    <button type="button" onclick="document.getElementById('assignTeacherModal').classList.add('hidden')" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                    <button type="submit" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">Assign</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Course Modal -->
    <div id="editCourseModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Edit Course</h3>
            <form id="editCourseForm" class="space-y-4">
                <input type="hidden" name="courseId" id="editCourseId">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Course Code</label>
                        <input type="text" name="code" id="editCourseCode" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Batch</label>
                        <select name="batch" id="editCourseBatch" required ${isCoordinator && userBatch ? 'disabled' : ''} class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border ${isCoordinator && userBatch ? 'bg-gray-50' : ''}">
                            <option value="">Select Batch</option>
                            ${['Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17', 'Batch 18', 'Batch 19', 'Batch 20', 'Batch 21', 'Batch 22', 'Batch 23'].map(b => `
                                <option value="${b}">${b}</option>
                            `).join('')}
                        </select>
                        ${isCoordinator && userBatch ? `<input type="hidden" name="batch" id="editCourseBatchHidden" value="">` : ''}
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Course Title</label>
                    <input type="text" name="title" id="editCourseTitle" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Credits</label>
                    <input type="number" name="credit" id="editCourseCredit" min="1" max="4" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" id="editCourseDescription" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"></textarea>
                </div>
                <div class="flex justify-end space-x-3 mt-4">
                    <button type="button" onclick="document.getElementById('editCourseModal').classList.add('hidden')" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                    <button type="submit" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
    `;

    // Global Modal Helpers
    window.showCreateCourseModal = () => document.getElementById('createCourseModal').classList.remove('hidden');
    window.showAssignTeacherModal = () => document.getElementById('assignTeacherModal').classList.remove('hidden');

    window.showEditCourseModal = (id, code, title, credit, batch, description) => {
        document.getElementById('editCourseId').value = id;
        document.getElementById('editCourseCode').value = code;
        document.getElementById('editCourseTitle').value = title;
        document.getElementById('editCourseCredit').value = credit;
        document.getElementById('editCourseBatch').value = batch;
        const hiddenBatch = document.getElementById('editCourseBatchHidden');
        if (hiddenBatch) hiddenBatch.value = batch;
        document.getElementById('editCourseDescription').value = description;
        document.getElementById('editCourseModal').classList.remove('hidden');
    };

    return html;
};
