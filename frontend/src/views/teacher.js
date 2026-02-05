export const renderTeacherCourses = (courses) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-3xl font-black text-white tracking-tight">Assigned Operational Units</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    if (courses.length === 0) {
        html += `
            <div class="col-span-full py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 text-center flex flex-col items-center">
                <ion-icon name="rocket-outline" class="text-6xl text-slate-700 mb-4"></ion-icon>
                <p class="text-slate-500 font-black uppercase tracking-widest text-xs">No active assignments detected</p>
            </div>
        `;
    } else {
        courses.forEach(course => {
            html += `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] shadow-2xl p-8 border-2 border-white/5 hover:border-indigo-500 transition-all group relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    
                    <div class="relative z-10 flex justify-between items-start mb-8">
                        <div>
                            <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">${course.code}</span>
                            <h2 class="text-2xl font-black text-white mt-4 leading-tight tracking-tight">${course.title}</h2>
                        </div>
                        <div class="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                            <ion-icon name="school-outline" class="text-2xl text-indigo-400 group-hover:text-white"></ion-icon>
                        </div>
                    </div>
                    
                    <div class="space-y-4 mb-10 pt-6 border-t border-white/5">
                        <div class="flex items-center text-sm text-slate-400">
                             <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 border border-white/5">
                                 <ion-icon name="person-outline" class="text-indigo-400"></ion-icon>
                             </div>
                             <span>Teacher: <span class="font-bold text-white ml-1">${course.teacherName || course.teacher_name || 'TBA'}</span></span>
                        </div>
                        <div class="flex items-center text-sm text-slate-400">
                             <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 border border-white/5">
                                 <ion-icon name="layers-outline" class="text-indigo-400"></ion-icon>
                             </div>
                             <span>Batch: <span class="font-bold text-white ml-1">${course.batch || '-'}</span></span>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between pt-6 border-t border-white/5">
                        <div class="flex items-baseline">
                            <span class="text-3xl font-black text-white">${course.credit}</span>
                            <span class="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Credits</span>
                        </div>
                        <div class="flex gap-3">
                             <button onclick="window.manageCourseMaterials(${course.id}, '${course.code}')" class="p-3 bg-white/5 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-xl border border-white/5 transition-all" title="Materials">
                                <ion-icon name="folder-open-outline" class="text-xl"></ion-icon>
                            </button>
                             <button onclick="window.loadUploadForm(${course.id}, '${course.code}')" class="p-3 bg-white/5 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl border border-white/5 transition-all" title="Upload Result">
                                <ion-icon name="cloud-upload-outline" class="text-xl"></ion-icon>
                            </button>
                            <button onclick="window.manageCourseResults(${course.id}, '${course.code}')" class="p-3 bg-white/5 hover:bg-amber-500 text-amber-400 hover:text-white rounded-xl border border-white/5 transition-all" title="Results Office">
                                <ion-icon name="ribbon-outline" class="text-xl"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    html += `</div></div>`;
    return html;
};

export const renderUploadResultForm = (courseId, courseCode, students = []) => {
    let studentOptions = students.map(s => `<option value="${s.id}" class="bg-slate-900">${s.studentId || s.name} - ${s.name}</option>`).join('');

    return `
    <div class="max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden animate-scaleIn">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div class="flex justify-between items-center mb-10 relative z-10">
            <div>
                <h2 class="text-3xl font-black text-white tracking-tight uppercase">Upload Result</h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">${courseCode} Operational Node</p>
            </div>
            <button onclick="window.manageCourseMaterials(${courseId}, '${courseCode}')" class="text-indigo-400 hover:text-white text-xs font-black flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/5 transition-all uppercase tracking-widest">
                <ion-icon name="document-text-outline" class="mr-2 text-lg"></ion-icon> Switch to Materials
            </button>
        </div>
        
        <form id="uploadResultForm" class="space-y-8 relative z-10">
            <input type="hidden" name="courseId" value="${courseId}">
            
            <div class="space-y-3">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student Candidate</label>
                <select name="studentId" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none">
                    <option value="" class="bg-slate-900">-- Select Student --</option>
                    ${studentOptions}
                </select>
                <p class="text-[9px] text-slate-600 font-bold uppercase tracking-widest ml-1">Only students enrolled in this course are shown</p>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="space-y-3">
                     <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Exam Category</label>
                     <select name="examType" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none">
                        <option value="CT" class="bg-slate-900">Class Test</option>
                        <option value="Midterm" class="bg-slate-900">Midterm</option>
                        <option value="Final" class="bg-slate-900">Final</option>
                        <option value="Quiz" class="bg-slate-900">Quiz</option>
                        <option value="Online Exam" class="bg-slate-900">Online Exam</option>
                        <option value="Online Quiz" class="bg-slate-900">Online Quiz</option>
                        <option value="Offline Exam" class="bg-slate-900">Offline Exam</option>
                        <option value="Assignment" class="bg-slate-900">Assignment</option>
                        <option value="Lab Report" class="bg-slate-900">Lab Report</option>
                        <option value="Class Performance" class="bg-slate-900">Class Performance</option>
                        <option value="Attendance" class="bg-slate-900">Attendance</option>
                        <option value="Viva" class="bg-slate-900">Viva</option>
                     </select>
                </div>
                <div class="space-y-3">
                     <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Achieved Marks</label>
                     <input type="number" name="marks" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" placeholder="0 - 100">
                </div>
            </div>
            
            <div class="space-y-3">
                 <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Grade Allocation (Optional)</label>
                 <input type="text" name="grade" placeholder="e.g. A+" class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">
            </div>

            <div class="space-y-3">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Material (PDF/Image)</label>
                <div class="relative group">
                    <input type="file" name="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                    <div class="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/2 group-hover:border-emerald-500 group-hover:bg-emerald-500/5 transition-all">
                        <ion-icon name="cloud-upload-outline" class="text-3xl text-slate-600 group-hover:text-emerald-400 mb-2 transition-colors"></ion-icon>
                        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Attach Digital Script</p>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-6 gap-4">
                <button type="button" onclick="handleNavigation('loadCourses')" class="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" class="px-10 py-4 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em]">Commit Result</button>
            </div>
        </form>
    </div>
    `;
};

export const renderCourseMaterials = (courseId, courseCode, materialsList, userRole) => {
    const canManage = ['teacher', 'course_coordinator', 'super_admin'].includes(userRole);
    return `
    <div class="space-y-8 animate-fadeIn">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-black text-white tracking-tight uppercase">Materials Repository</h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">${courseCode} Knowledge Base</p>
            </div>
            ${canManage ? `
            <button onclick="window.showUploadMaterialModalForCourse(${courseId}, '${courseCode}')" class="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 flex items-center text-[10px] uppercase tracking-widest transition-all hover:scale-105">
                <ion-icon name="add-outline" class="mr-2 text-lg"></ion-icon> Inject Material
            </button>` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${materialsList.map(m => `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 hover:border-indigo-500 transition-all group overflow-hidden relative">
                    <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                    <div class="flex items-start justify-between mb-10 relative z-10">
                        <div class="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                            <ion-icon name="document-text-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div class="flex-1 ml-5 min-w-0">
                            <h4 class="text-xl font-black text-white truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">${m.title}</h4>
                            <p class="text-[10px] font-bold text-slate-500 mt-2 line-clamp-2 uppercase tracking-widest">${m.description || 'Institutional research material'}</p>
                        </div>
                    </div>
                    <div class="mt-8 flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
                        <a href="${window.getDownloadUrl ? window.getDownloadUrl(m.fileUrl) : m.fileUrl}" download class="bg-indigo-500/10 text-indigo-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 shadow-lg hover:bg-indigo-500 hover:text-white transition-all flex items-center">
                            <ion-icon name="download-outline" class="mr-2 text-sm"></ion-icon> Extract
                        </a>
                        ${canManage ? `
                        <div class="flex space-x-2">
                            <button onclick="window.editMaterialItem(${m.id}, ${courseId}, '${courseCode}')" class="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-amber-500 hover:text-white transition-all border border-white/5">
                                <ion-icon name="create-outline"></ion-icon>
                            </button>
                            <button onclick="window.deleteMaterialItem(${m.id}, ${courseId}, '${courseCode}')" class="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-white/5">
                                <ion-icon name="trash-outline"></ion-icon>
                            </button>
                        </div>` : ''}
                    </div>
                </div>
            `).join('')}
            ${materialsList.length === 0 ? `
                <div class="col-span-full py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 text-center flex flex-col items-center cursor-pointer" onclick="window.showUploadMaterialModalForCourse(${courseId}, '${courseCode}')">
                    <ion-icon name="layers-outline" class="text-6xl text-slate-700 mb-4 opacity-50"></ion-icon>
                    <p class="text-slate-500 font-black uppercase tracking-widest text-xs">No research assets indexed yet</p>
                </div>
            ` : ''}
        </div>
    </div>
    `;
};

export const renderCourseResultsList = (courseId, courseCode, resultsList) => {
    return `
    <div class="space-y-8 animate-fadeIn">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-black text-white tracking-tight uppercase">Performance Ledger</h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">${courseCode} Assessment Portal</p>
            </div>
            <button onclick="window.loadUploadForm(${courseId}, '${courseCode}')" class="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-500 shadow-xl shadow-emerald-600/20 flex items-center text-[10px] uppercase tracking-widest transition-all hover:scale-105">
                <ion-icon name="add-outline" class="mr-2 text-lg"></ion-icon> Post New Result
            </button>
        </div>

        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-2 border-white/5">
            <table class="min-w-full divide-y divide-white/5">
                <thead>
                    <tr class="bg-white/5">
                        <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Core</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Type</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                        <th class="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${resultsList.map(r => `
                        <tr class="hover:bg-white/2 transition-colors">
                            <td class="px-8 py-6 whitespace-nowrap">
                                <div class="text-sm font-black text-white">${r.studentName}</div>
                                <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">${r.studentId}</div>
                            </td>
                            <td class="px-8 py-6 whitespace-nowrap text-[10px] text-indigo-400 uppercase font-black tracking-widest">${r.examType}</td>
                            <td class="px-8 py-6 whitespace-nowrap text-xl font-black text-white">${r.marks}</td>
                            <td class="px-8 py-6 whitespace-nowrap text-sm text-slate-300 font-black uppercase tracking-tighter">${r.grade || '-'}</td>
                            <td class="px-8 py-6 whitespace-nowrap text-right text-sm">
                                <div class="flex justify-end space-x-3">
                                    <button onclick="window.editResultItem(${r.id}, ${courseId}, '${courseCode}')" class="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all border border-white/5 shadow-lg">
                                        <ion-icon name="create-outline"></ion-icon>
                                    </button>
                                    ${r.fileUrl ? `<a href="${window.getDownloadUrl ? window.getDownloadUrl(r.fileUrl) : r.fileUrl}" download class="p-3 bg-white/5 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-white/5 shadow-lg flex items-center"><ion-icon name="download-outline"></ion-icon></a>` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                    ${resultsList.length === 0 ? '<tr><td colspan="5" class="py-24 text-center text-slate-600 font-black uppercase tracking-[0.3em] text-sm">No recorded performance metrics</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    </div>
    `;
};

export const renderEditResultForm = (result, courseCode) => {
    return `
    <div class="max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden animate-scaleIn">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <h2 class="text-3xl font-black text-white mb-10 tracking-tight uppercase">Update Protocol: <span class="text-indigo-400">${result.studentName}</span></h2>
        
        <form id="editResultForm" class="space-y-8 relative z-10">
            <input type="hidden" name="id" value="${result.id}">
            
            <div class="grid grid-cols-2 gap-6">
                <div class="space-y-3">
                     <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Modified Score</label>
                     <input type="number" name="marks" value="${result.marks}" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">
                </div>
                <div class="space-y-3">
                     <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Modified Grade</label>
                     <input type="text" name="grade" value="${result.grade || ''}" class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">
                </div>
            </div>

            <div class="space-y-3">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Replace Digital Script (Optional)</label>
                <div class="relative group">
                    <input type="file" name="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                    <div class="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/2 group-hover:border-indigo-500 group-hover:bg-indigo-500/5 transition-all">
                        <ion-icon name="cloud-upload-outline" class="text-3xl text-slate-600 group-hover:text-indigo-400 mb-2 transition-colors"></ion-icon>
                        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">${result.fileUrl ? 'Existing File Detected - Click to Replace' : 'Attach Verification Media'}</p>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-6 gap-4">
                <button type="button" onclick="window.manageCourseResults(${result.courseId}, '${courseCode}')" class="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" class="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em]">Commit Changes</button>
            </div>
        </form>
    </div>
    `;
};

export const renderEditMaterialForm = (material, courseCode) => {
    return `
    <div class="max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden animate-scaleIn">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <h2 class="text-3xl font-black text-white mb-10 tracking-tight uppercase">Edit Asset: <span class="text-indigo-400">${courseCode}</span></h2>
        
        <form id="editMaterialForm" class="space-y-8 relative z-10">
            <div class="space-y-3">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Designation (Title)</label>
                <input type="text" name="title" value="${material.title}" required class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">
            </div>
            
            <div class="space-y-3">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Technical Summary (Description)</label>
                <textarea name="description" rows="3" class="w-full bg-white/5 border-2 border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold">${material.description || ''}</textarea>
            </div>

            <div class="space-y-3">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Binary Replacement (File Upgrade)</label>
                <div class="relative group">
                    <input type="file" name="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                    <div class="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/2 group-hover:border-indigo-500 group-hover:bg-indigo-500/5 transition-all">
                        <ion-icon name="document-attach-outline" class="text-3xl text-slate-600 group-hover:text-indigo-400 mb-2 transition-colors"></ion-icon>
                        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Select New Source Binary</p>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-6 gap-4">
                <button type="button" onclick="window.manageCourseMaterials(${material.courseId}, '${courseCode}')" class="px-8 py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" class="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em]">Commit Injection</button>
            </div>
        </form>
    </div>
    `;
};

export const renderAttendanceDashboard = (courses, userRole) => {
    const canTakeAttendance = ['teacher', 'super_admin', 'course_coordinator'].includes(userRole);
    return `
    <div class="space-y-10 animate-fadeIn">
        <div>
            <h2 class="text-3xl font-black text-white tracking-tight uppercase flex items-center">
                <div class="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mr-4 border border-indigo-500/30">
                    <ion-icon name="checkbox-outline" class="text-indigo-400"></ion-icon>
                </div>
                Attendance Synchronization
            </h2>
            <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Real-time presence monitoring terminal</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${courses.map(course => `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 hover:border-indigo-500 transition-all group overflow-hidden relative">
                    <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                    <div class="flex justify-between items-start mb-10 relative z-10">
                        <div>
                            <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">${course.code}</span>
                            <h3 class="text-xl font-black text-white mt-4 line-clamp-1 uppercase tracking-tight">${course.title}</h3>
                        </div>
                        <div class="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-lg group-hover:bg-indigo-500 transition-all group-hover:text-white">
                            <ion-icon name="people-outline" class="text-2xl text-indigo-400 group-hover:text-white"></ion-icon>
                        </div>
                    </div>
                    
                    <div class="space-y-3 mb-10 pt-4 border-t border-white/5 relative z-10">
                        <div class="flex items-center text-xs text-slate-500 font-bold uppercase tracking-widest">
                             <ion-icon name="layers-outline" class="mr-3 text-indigo-400 text-lg"></ion-icon>
                             <span>Deployment: <span class="font-black text-white ml-1">${course.batch || '-'}</span></span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 relative z-10">
                        ${canTakeAttendance ? `
                        <button onclick="window.startTakingAttendance(${course.id}, '${course.code}')" class="w-full bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center uppercase tracking-[0.2em] hover:scale-105">
                            <ion-icon name="add-circle-outline" class="mr-2 text-xl"></ion-icon> Take Attendance
                        </button>` : ''}
                        <button onclick="window.viewAttendanceReport(${course.id}, '${course.code}')" class="w-full bg-white/5 text-white border-2 border-white/5 py-4 rounded-2xl text-[10px] font-black hover:bg-white/10 transition-all flex items-center justify-center uppercase tracking-[0.2em]">
                            <ion-icon name="bar-chart-outline" class="mr-2 text-xl"></ion-icon> View Analytics
                        </button>
                    </div>
                </div>
            `).join('')}
            ${courses.length === 0 ? `
                <div class="col-span-full py-24 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 text-center flex flex-col items-center">
                    <ion-icon name="calendar-outline" class="text-6xl text-slate-700 mb-4 opacity-50"></ion-icon>
                    <p class="text-slate-500 font-black uppercase tracking-widest text-xs">No course deployment detected in current sector</p>
                </div>
            ` : ''}
        </div>
    </div>
    `;
};

export const renderTakeAttendanceForm = (students, courseId, courseCode, semester) => {
    const today = new Date().toISOString().split('T')[0];
    return `
    <div class="space-y-8 animate-fadeIn">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div class="relative z-10">
                <h2 class="text-3xl font-black text-white tracking-tight uppercase">Presence Log: <span class="text-indigo-400">${courseCode}</span></h2>
                <div class="flex items-center gap-3 mt-2">
                    <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-md border border-indigo-500/30">${semester}</span>
                    <span class="text-slate-500 font-bold text-[10px] uppercase tracking-widest">${students.length} Synchronized Profiles</span>
                </div>
            </div>
            <div class="flex items-center gap-4 relative z-10">
                <div class="flex items-center bg-white/5 px-6 py-4 rounded-2xl border border-white/10 focus-within:border-indigo-500 transition-all">
                    <ion-icon name="calendar-outline" class="text-indigo-400 mr-3 text-xl"></ion-icon>
                    <input type="date" id="attendanceDate" value="${today}" class="bg-transparent border-none focus:ring-0 text-[10px] font-black text-white uppercase tracking-widest outline-none">
                </div>
                <button type="button" onclick="window.loadAttendanceForDate(${courseId})" class="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] hover:bg-indigo-500 transition-all uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                    Load Archive
                </button>
            </div>
        </div>

        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <form id="attendanceForm" onsubmit="window.submitAttendance(event, ${courseId}, '${semester}')">
                <table class="min-w-full divide-y divide-white/5">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Profile</th>
                            <th class="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Protocol</th>
                            <th class="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Remarks</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${students.map(s => `
                            <tr class="hover:bg-white/2 transition-colors">
                                <td class="px-8 py-6 whitespace-nowrap">
                                    <div class="text-sm font-black text-white">${s.name}</div>
                                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">${s.studentId}</div>
                                </td>
                                <td class="px-8 py-6 whitespace-nowrap">
                                    <div class="flex items-center justify-center space-x-6">
                                        <label class="flex flex-col items-center cursor-pointer group">
                                            <input type="radio" name="status-${s.id}" value="present" checked class="hidden peer">
                                            <div class="w-12 h-12 rounded-2xl border-2 border-white/5 flex items-center justify-center text-slate-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-checked:text-white transition-all shadow-lg group-hover:border-emerald-500/50">
                                                <ion-icon name="checkmark-sharp" class="text-xl"></ion-icon>
                                            </div>
                                            <span class="text-[8px] mt-2 font-black text-slate-600 peer-checked:text-emerald-500 uppercase tracking-widest">Active</span>
                                        </label>
                                        <label class="flex flex-col items-center cursor-pointer group">
                                            <input type="radio" name="status-${s.id}" value="late" class="hidden peer">
                                            <div class="w-12 h-12 rounded-2xl border-2 border-white/5 flex items-center justify-center text-slate-600 peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-checked:text-white transition-all shadow-lg group-hover:border-amber-500/50">
                                                <ion-icon name="time-sharp" class="text-xl"></ion-icon>
                                            </div>
                                            <span class="text-[8px] mt-2 font-black text-slate-600 peer-checked:text-amber-500 uppercase tracking-widest">Delayed</span>
                                        </label>
                                        <label class="flex flex-col items-center cursor-pointer group">
                                            <input type="radio" name="status-${s.id}" value="absent" class="hidden peer">
                                            <div class="w-12 h-12 rounded-2xl border-2 border-white/5 flex items-center justify-center text-slate-600 peer-checked:bg-rose-500 peer-checked:border-rose-500 peer-checked:text-white transition-all shadow-lg group-hover:border-rose-500/50">
                                                <ion-icon name="close-sharp" class="text-xl"></ion-icon>
                                            </div>
                                            <span class="text-[8px] mt-2 font-black text-slate-600 peer-checked:text-rose-500 uppercase tracking-widest">Offline</span>
                                        </label>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <input type="text" name="remarks-${s.id}" placeholder="Audit notes..." class="w-full bg-white/5 border-2 border-white/5 rounded-xl px-5 py-3 text-xs text-white placeholder-slate-700 outline-none focus:border-indigo-500 transition-all font-bold">
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="p-10 bg-white/2 border-t border-white/5 flex justify-end items-center gap-6">
                    <button type="button" onclick="window.handleNavigation('loadAttendance')" class="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Discard Sequence</button>
                    <button type="submit" class="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black hover:bg-indigo-500 shadow-2xl shadow-indigo-600/20 transition-all flex items-center uppercase tracking-[0.2em] text-[10px] hover:scale-105">
                        <ion-icon name="cloud-upload-outline" class="mr-2 text-xl"></ion-icon>
                        Commit Attendance
                    </button>
                </div>
            </form>
        </div>
    </div>
    `;
};

export const renderAttendanceReport = (data, courseCode) => {
    const { records, stats } = data;
    return `
    <div class="space-y-10 animate-fadeIn">
        <div class="flex justify-between items-end bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-[3rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div class="relative z-10">
                <h2 class="text-3xl font-black text-white tracking-tight uppercase">Presence Analytics: <span class="text-indigo-400">${courseCode}</span></h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Comprehensive institutional engagement audit</p>
            </div>
            <button onclick="window.handleNavigation('loadAttendance')" class="bg-white/5 text-indigo-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center shadow-xl relative z-10">
                <ion-icon name="arrow-back-outline" class="mr-2 text-lg"></ion-icon> Shift Control
            </button>
        </div>

        <!-- Progress Summary -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3.5rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <div class="px-10 py-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <h3 class="font-black text-white uppercase tracking-widest text-sm flex items-center">
                    <ion-icon name="stats-chart-outline" class="mr-4 text-indigo-400 text-2xl"></ion-icon>
                    Candidate Efficiency Matrix
                </h3>
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synchronized Intelligence</span>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-white/5">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Delayed</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Ops</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement %</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${stats.map(s => `
                                <tr class="hover:bg-white/2 transition-all">
                                    <td class="px-10 py-8 whitespace-nowrap">
                                        <div class="text-sm font-black text-white">${s.studentName}</div>
                                        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">${s.displayStudentId}</div>
                                    </td>
                                    <td class="px-10 py-8 whitespace-nowrap text-lg font-black text-emerald-400">${s.presentClasses}</td>
                                    <td class="px-10 py-8 whitespace-nowrap text-lg font-black text-amber-400">${s.lateClasses}</td>
                                    <td class="px-10 py-8 whitespace-nowrap text-lg font-black text-slate-400 font-bold">${s.totalClasses}</td>
                                    <td class="px-10 py-8 whitespace-nowrap">
                                        <div class="flex items-center space-x-6">
                                            <div class="flex flex-col">
                                                <span class="text-2xl font-black ${parseFloat(s.percentage) < 75 ? 'text-rose-500' : 'text-white'}">${s.percentage}%</span>
                                                <span class="text-[8px] font-black uppercase tracking-widest ${parseFloat(s.percentage) < 75 ? 'text-rose-700 animate-pulse' : 'text-slate-600'}">${parseFloat(s.percentage) < 75 ? 'WARNING' : 'SECURE'}</span>
                                            </div>
                                            <div class="w-32 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                                <div class="h-full bg-gradient-to-r ${parseFloat(s.percentage) < 75 ? 'from-rose-600 to-pink-500' : 'from-indigo-600 to-blue-500'} shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-1000" style="width: ${s.percentage}%"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
};
