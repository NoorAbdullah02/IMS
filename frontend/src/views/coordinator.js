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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Assignments</p>
                <p class="text-2xl font-black text-indigo-600 mt-1">${assignments.length}</p>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Teachers</p>
                <p class="text-2xl font-black text-emerald-600 mt-1">${new Set(assignments.map(a => a.teacherEmail)).size}</p>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Courses</p>
                <p class="text-2xl font-black text-amber-600 mt-1">${courses.length}</p>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Dep. Coverage</p>
                <p class="text-2xl font-black text-rose-600 mt-1">${new Set(assignments.map(a => a.courseCode)).size} / ${courses.length}</p>
            </div>
        </div>
        
        <!-- Courses Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Department Courses</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-indigo-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Code</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Title</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Credits</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Batch</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Description</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-indigo-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${courses.map(course => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">${course.code}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${course.title}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${course.credit}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">${course.batch || '-'}</td>
                            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${course.description || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onclick="window.showEditCourseModal('${course.id}', '${course.code}', '${course.title.replace(/'/g, "\\'")}', '${course.credit}', '${course.batch}', '${(course.description || "").replace(/'/g, "\\'")}')" class="text-indigo-600 hover:text-indigo-900 mr-4" title="Edit Course">
                                    <ion-icon name="create-outline" class="text-xl"></ion-icon>
                                </button>
                                <button onclick="window.deleteCourseItem('${course.id}')" class="text-rose-600 hover:text-rose-900" title="Delete Course">
                                    <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                    ${courses.length === 0 ? '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No courses found</td></tr>' : ''}
                </tbody>
            </table>
        </div>

        <!-- Assignments Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Current Course Assignments</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-indigo-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Course</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Batch</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Assigned Teacher</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Semester</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Assigned Date</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    if (!assignments || assignments.length === 0) {
        html += `
            <tr>
                <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                    <p>No teachers assigned to courses yet</p>
                </td>
            </tr>
        `;
    } else {
        assignments.forEach(assign => {
            const date = new Date(assign.createdAt).toLocaleDateString();
            const courseObj = courses.find(c => c.code === assign.courseCode);
            html += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${assign.courseCode}</div>
                        <div class="text-sm text-gray-500">${assign.courseTitle}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">
                        ${courseObj?.batch || '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${assign.teacherName}</div>
                        <div class="text-sm text-gray-500">${assign.teacherEmail}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ${assign.semester}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
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
