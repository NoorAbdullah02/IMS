export const renderCoordinatorDashboard = (assignments, courses, teachers, semesters = [], user = {}) => {
    const activeSemester = localStorage.getItem('activeSemester');
    const userBatch = user.batch;
    const isCoordinator = user.role === 'course_coordinator';
    let html = `
    <div class="space-y-10 animate-fadeIn">
        <!-- Header -->
        <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-[3rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div class="relative z-10">
                <h2 class="text-3xl font-black text-white tracking-tight uppercase flex items-center">
                    <div class="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mr-4 border border-indigo-500/30">
                        <ion-icon name="git-network-outline" class="text-indigo-400"></ion-icon>
                    </div>
                    Coordinator Hub
                </h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Operations Management Terminal</p>
            </div>
            <div class="flex space-x-4 relative z-10">
                <button onclick="window.showCreateCourseModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center uppercase tracking-widest text-[10px] hover:scale-105">
                    <ion-icon name="add-circle-outline" class="mr-2 text-xl"></ion-icon>
                    Create Unit
                </button>
                <button onclick="window.showAssignTeacherModal()" class="bg-white/5 text-slate-300 border border-white/5 hover:border-indigo-500 hover:text-white font-black py-4 px-8 rounded-2xl shadow-xl transition-all flex items-center uppercase tracking-widest text-[10px] hover:scale-105">
                    <ion-icon name="person-add-outline" class="mr-2 text-xl"></ion-icon>
                    Deploy Staff
                </button>
            </div>
        </div>

        <!-- Stats Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-indigo-500/20 hover:border-indigo-500 transition-all group overflow-hidden relative">
                <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                <div class="flex items-center space-x-5 relative z-10">
                    <div class="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                        <ion-icon name="git-network-outline" class="text-3xl text-indigo-400 group-hover:text-white"></ion-icon>
                    </div>
                    <div>
                        <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Total Assignments</p>
                        <p class="text-4xl font-black text-white mt-1">${assignments.length}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-emerald-500/20 hover:border-emerald-500 transition-all group overflow-hidden relative">
                <div class="absolute -right-10 -top-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div class="flex items-center space-x-5 relative z-10">
                    <div class="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg">
                        <ion-icon name="people-outline" class="text-3xl text-emerald-400 group-hover:text-white"></ion-icon>
                    </div>
                    <div>
                        <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Teachers</p>
                        <p class="text-4xl font-black text-white mt-1">${new Set(assignments.map(a => a.teacherEmail)).size}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-amber-500/20 hover:border-amber-500 transition-all group overflow-hidden relative">
                <div class="absolute -right-10 -top-10 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
                <div class="flex items-center space-x-5 relative z-10">
                    <div class="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-lg">
                        <ion-icon name="book-outline" class="text-3xl text-amber-400 group-hover:text-white"></ion-icon>
                    </div>
                    <div>
                        <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Active Units</p>
                        <p class="text-4xl font-black text-white mt-1">${courses.length}</p>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-rose-500/20 hover:border-rose-500 transition-all group overflow-hidden relative">
                <div class="absolute -right-10 -top-10 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
                <div class="flex items-center space-x-5 relative z-10">
                    <div class="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-lg">
                        <ion-icon name="layers-outline" class="text-3xl text-rose-400 group-hover:text-white"></ion-icon>
                    </div>
                    <div>
                        <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Dep. Coverage</p>
                        <p class="text-4xl font-black text-white mt-1">${new Set(assignments.map(a => a.courseCode)).size} <span class="text-lg text-slate-500">/ ${courses.length}</span></p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Courses Table -->
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[3rem] shadow-2xl border-2 border-white/5 overflow-hidden animate-scaleIn">
            <div class="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h3 class="text-xl font-black text-white uppercase tracking-widest">Departmental Academic Inventory</h3>
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Catalog</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full divide-y divide-white/5">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Code Identifier</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Credits</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Group</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">System Logs</th>
                            <th class="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${courses.map(course => `
                            <tr class="hover:bg-white/2 transition-colors">
                                <td class="px-10 py-8 whitespace-nowrap text-sm font-black text-indigo-400 uppercase tracking-widest">${course.code}</td>
                                <td class="px-10 py-8 whitespace-nowrap text-sm text-white font-black uppercase tracking-tight">${course.title}</td>
                                <td class="px-10 py-8 whitespace-nowrap text-lg font-black text-slate-400">${course.credit}</td>
                                <td class="px-10 py-8 whitespace-nowrap text-sm text-amber-500 font-black uppercase tracking-widest">${course.batch || '-'}</td>
                                <td class="px-10 py-8 text-sm text-slate-500 max-w-xs truncate font-medium underline underline-offset-8 decoration-white/5">${course.description || 'No description logged'}</td>
                                <td class="px-10 py-8 whitespace-nowrap text-right text-sm">
                                    <div class="flex justify-end space-x-3">
                                        <button onclick="window.showEditCourseModal('${course.id}', '${course.code}', '${course.title.replace(/'/g, "\\'")}', '${course.credit}', '${course.batch}', '${(course.description || "").replace(/'/g, "\\'")}')" class="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-lg border border-indigo-500/20">
                                            <ion-icon name="create-outline" class="text-xl"></ion-icon>
                                        </button>
                                        <button onclick="window.deleteCourseItem('${course.id}')" class="p-4 bg-rose-500/20 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-lg border border-rose-500/20">
                                            <ion-icon name="trash-outline" class="text-xl"></ion-icon>
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
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[3rem] shadow-2xl border-2 border-white/5 overflow-hidden animate-scaleIn">
            <div class="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                <h3 class="text-xl font-black text-white uppercase tracking-widest">Active Sector Assignments</h3>
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Staff Deployment</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full divide-y divide-white/5">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Unit</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector Batch</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Specialist</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Cycle</th>
                            <th class="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Activation Date</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${assignments.map(assign => {
        const date = new Date(assign.createdAt).toLocaleDateString();
        const courseObj = courses.find(c => c.code === assign.courseCode);
        return `
                                <tr class="hover:bg-white/2 transition-colors">
                                    <td class="px-10 py-8 whitespace-nowrap">
                                        <div class="text-sm font-black text-indigo-400 uppercase tracking-widest">${assign.courseCode}</div>
                                        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">${assign.courseTitle}</div>
                                    </td>
                                    <td class="px-10 py-8 whitespace-nowrap text-sm text-amber-400 font-black uppercase tracking-widest">
                                        ${courseObj?.batch || '-'}
                                    </td>
                                    <td class="px-10 py-8 whitespace-nowrap">
                                        <div class="text-sm font-black text-white uppercase tracking-tight">${assign.teacherName}</div>
                                        <div class="text-[10px] text-slate-500 font-medium">${assign.teacherEmail}</div>
                                    </td>
                                    <td class="px-10 py-8 whitespace-nowrap">
                                        <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            ${assign.semester}
                                        </span>
                                    </td>
                                    <td class="px-10 py-8 whitespace-nowrap text-right text-sm font-black text-slate-500 uppercase tracking-widest">${date}</td>
                                </tr>
                            `;
    }).join('')}
                    </tbody>
                </table>
                ${assignments.length === 0 ? '<div class="py-24 text-center text-slate-600 font-black uppercase tracking-[0.3em] text-sm">No recorded staff deployments</div>' : ''}
            </div>
        </div>
    </div>

    <!-- Modals (Dark Themed) -->
    <!-- Create Course Modal -->
    <div id="createCourseModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-xl h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 w-full max-w-lg shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden animate-scaleIn">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            <div class="p-12 relative z-10">
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl mb-6 shadow-xl shadow-emerald-500/20 rotate-3">
                        <ion-icon name="add-circle-outline" class="text-3xl text-white"></ion-icon>
                    </div>
                    <h3 class="text-3xl font-black text-white tracking-tight uppercase">Initialize Unit</h3>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Academic Inventory Registration</p>
                </div>

                <form id="createCourseForm" class="space-y-6">
                    <div class="grid grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal Code</label>
                            <input type="text" name="code" placeholder="ICE-XXXX" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold">
                        </div>
                        <div class="space-y-2">
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Sector (Batch)</label>
                            <select name="batch" required ${isCoordinator && userBatch ? 'disabled' : ''} class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold appearance-none ${isCoordinator && userBatch ? 'opacity-50' : ''}">
                                <option value="" class="bg-slate-900 text-white">Select Batch</option>
                                ${['Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17', 'Batch 18', 'Batch 19', 'Batch 20', 'Batch 21', 'Batch 22', 'Batch 23'].map(b => `
                                    <option value="${b}" ${isCoordinator && userBatch === b ? 'selected' : ''} class="bg-slate-900 text-white font-bold">${b}</option>
                                `).join('')}
                            </select>
                            ${isCoordinator && userBatch ? `<input type="hidden" name="batch" value="${userBatch}">` : ''}
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operation Title</label>
                        <input type="text" name="title" placeholder="Advanced System Orchestration" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold">
                    </div>
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Credit Allocation</label>
                        <input type="number" name="credit" min="1" max="4" value="3" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold">
                    </div>
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Logs (Description)</label>
                        <textarea name="description" rows="3" placeholder="Define operational objectives..." class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"></textarea>
                    </div>
                    <div class="flex gap-4 pt-6">
                        <button type="button" onclick="document.getElementById('createCourseModal').classList.add('hidden')" class="flex-1 bg-white/5 text-slate-400 font-bold py-5 rounded-2xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest">Abort</button>
                        <button type="submit" class="flex-1 bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-500 transition-all text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95">Commit Unit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Assign Teacher Modal -->
    <div id="assignTeacherModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-xl h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 w-full max-w-lg shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden animate-scaleIn">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
            
            <div class="p-12 relative z-10">
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-xl shadow-indigo-500/20 rotate-3">
                        <ion-icon name="person-add-outline" class="text-3xl text-white"></ion-icon>
                    </div>
                    <h3 class="text-3xl font-black text-white tracking-tight uppercase">Deploy Staff</h3>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Operational Module Specialist Allocation</p>
                </div>

                <form id="assignTeacherForm" class="space-y-6">
                    <div class="space-y-2 text-left">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Module (Course)</label>
                        <select name="courseId" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none">
                            <option value="" class="bg-slate-900 text-white">-- Select Module --</option>
                            ${courses.map(c => `<option value="${c.id}" class="bg-slate-900 text-white font-bold">${c.code} - ${c.title}</option>`).join('')}
                        </select>
                    </div>
                    <div class="space-y-2 text-left">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Specialist (Teacher)</label>
                        <select name="teacherId" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none">
                            <option value="" class="bg-slate-900 text-white">-- Select Specialist --</option>
                            ${teachers.map(t => `<option value="${t.id}" class="bg-slate-900 text-white font-bold">${t.name} (${t.designation || 'Lecturer'})</option>`).join('')}
                        </select>
                    </div>
                    <div class="space-y-2 text-left">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Activation Cycle (Semester)</label>
                        <select name="semester" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none">
                            <option value="" class="bg-slate-900 text-white">-- Select Cycle --</option>
                            ${semesters.map(s => `
                                <option value="${s.name}" ${s.name === activeSemester ? 'selected' : ''} class="bg-slate-900 text-white font-bold">
                                    ${s.name} ${s.isActive ? '(PRIMARY)' : ''}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="flex gap-4 pt-6">
                        <button type="button" onclick="document.getElementById('assignTeacherModal').classList.add('hidden')" class="flex-1 bg-white/5 text-slate-400 font-bold py-5 rounded-2xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest">Abort</button>
                        <button type="submit" class="flex-1 bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-500 transition-all text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 active:scale-95">Enable Deployment</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Course Modal -->
    <div id="editCourseModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-xl h-full w-full z-50 flex items-center justify-center p-4">
        <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 w-full max-w-lg shadow-[0_0_80px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden animate-scaleIn">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
            
            <div class="p-12 relative z-10">
                <div class="text-center mb-10">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-2xl mb-6 shadow-xl shadow-indigo-500/20 rotate-3">
                        <ion-icon name="create-outline" class="text-3xl text-white"></ion-icon>
                    </div>
                    <h3 class="text-3xl font-black text-white tracking-tight uppercase">Modify Unit</h3>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Operational Protocol Calibration</p>
                </div>

                <form id="editCourseForm" class="space-y-6">
                    <input type="hidden" name="courseId" id="editCourseId">
                    <div class="grid grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal Code</label>
                            <input type="text" name="code" id="editCourseCode" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold uppercase">
                        </div>
                        <div class="space-y-2">
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Sector</label>
                            <select name="batch" id="editCourseBatch" required ${isCoordinator && userBatch ? 'disabled' : ''} class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none ${isCoordinator && userBatch ? 'opacity-50' : ''}">
                                <option value="" class="bg-slate-900 text-white">Select Batch</option>
                                ${['Batch 12', 'Batch 13', 'Batch 14', 'Batch 15', 'Batch 16', 'Batch 17', 'Batch 18', 'Batch 19', 'Batch 20', 'Batch 21', 'Batch 22', 'Batch 23'].map(b => `
                                    <option value="${b}" class="bg-slate-900 text-white font-bold">${b}</option>
                                `).join('')}
                            </select>
                            ${isCoordinator && userBatch ? `<input type="hidden" name="batch" id="editCourseBatchHidden" value="">` : ''}
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operation Designation</label>
                        <input type="text" name="title" id="editCourseTitle" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">
                    </div>
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Impact Level (Credits)</label>
                        <input type="number" name="credit" id="editCourseCredit" min="1" max="4" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">
                    </div>
                    <div class="space-y-2">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operational Objectives (Description)</label>
                        <textarea name="description" id="editCourseDescription" rows="3" class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"></textarea>
                    </div>
                    <div class="flex gap-4 pt-6">
                        <button type="button" onclick="document.getElementById('editCourseModal').classList.add('hidden')" class="flex-1 bg-white/5 text-slate-400 font-bold py-5 rounded-2xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest">Abort</button>
                        <button type="submit" class="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-all text-xs uppercase tracking-[0.2em]">Update Unit</button>
                    </div>
                </form>
            </div>
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
