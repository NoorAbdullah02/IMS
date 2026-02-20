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

export const renderUploadResultForm = (courseId, courseCode, students) => {
    const studentOptions = students.map(s => `<option value="${s.id}" class="bg-slate-900 text-white font-bold p-4">${s.name.toUpperCase()} [${s.studentId || s.id}]</option>`).join('');

    return `
    <div class="max-w-4xl mx-auto space-y-10 animate-scaleIn">
        <div class="flex justify-between items-end bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
            <div class="relative z-10 text-left">
                <div class="flex items-center gap-3 mb-4">
                    <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">Evaluation Dispatch</span>
                    <span class="px-3 py-1 bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">Sector: ${courseCode}</span>
                </div>
                <h2 class="text-4xl font-black text-white tracking-tighter uppercase leading-tight">Post Academic Results</h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Candidate performance synchronization</p>
            </div>
            <div class="flex gap-4 relative z-10">
                <button onclick="window.manageCourseMaterials(${courseId}, '${courseCode}')" class="bg-white/5 text-indigo-400 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center shadow-xl border border-white/5">
                    <ion-icon name="document-text" class="mr-2 text-lg"></ion-icon> Materials
                </button>
                <button onclick="window.handleNavigation('loadCourses')" class="bg-white/5 text-slate-400 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all flex items-center shadow-xl border border-white/5">
                    <ion-icon name="close" class="mr-2 text-lg"></ion-icon> Cancel
                </button>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden text-left">
            <form id="uploadResultForm" class="space-y-10 relative z-10">
                <input type="hidden" name="courseId" value="${courseId}">
                
                <div class="space-y-3">
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Candidate Intelligence (Student Selection)</label>
                    <div class="relative">
                        <select name="studentId" required class="w-full bg-white/2 border-2 border-white/5 text-white p-6 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer">
                            <option value="" class="bg-slate-900">-- SELECT TARGET CANDIDATE --</option>
                            ${studentOptions}
                        </select>
                        <ion-icon name="people-outline" class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xl"></ion-icon>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-3">
                         <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assessment Classification</label>
                         <div class="relative">
                             <select name="examType" required class="w-full bg-white/2 border-2 border-white/5 text-white p-6 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer">
                                <option value="CT" class="bg-slate-900">Class Test</option>
                                <option value="Midterm" class="bg-slate-900">Midterm</option>
                                <option value="Final" class="bg-slate-900">Final</option>
                                <option value="Quiz" class="bg-slate-900">Quiz</option>
                                <option value="Assignment" class="bg-slate-900">Assignment</option>
                                <option value="Lab Report" class="bg-slate-900">Lab Report</option>
                                <option value="Viva" class="bg-slate-900">Viva Voice</option>
                             </select>
                             <ion-icon name="ribbon-outline" class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xl"></ion-icon>
                         </div>
                    </div>
                    <div class="space-y-3">
                         <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Performance Metric (Achieved Marks)</label>
                         <input type="number" name="marks" required step="0.5" class="w-full bg-white/2 border-2 border-white/5 text-white p-6 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black text-xl placeholder-slate-700" placeholder="0.00">
                    </div>
                </div>
                
                <div class="space-y-3">
                     <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Allocated Grade Index (Optional)</label>
                     <input type="text" name="grade" placeholder="e.g. A+" class="w-full bg-white/2 border-2 border-white/5 text-white p-6 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black uppercase text-sm tracking-[0.3em] placeholder-slate-800">
                </div>

                <div class="space-y-3">
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Material (Script Binary)</label>
                    <div class="relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 transition-all">
                        <input type="file" name="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="window.updateResultFileLabel(this)"/>
                        <div class="w-full py-12 flex flex-col items-center justify-center bg-white/1 group-hover:bg-emerald-500/5 transition-all">
                            <div class="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ion-icon name="cloud-upload-outline" id="resultFileIcon" class="text-4xl text-slate-600 group-hover:text-emerald-400 transition-colors"></ion-icon>
                            </div>
                            <h4 id="resultFileLabel" class="text-xs font-black text-slate-500 group-hover:text-white uppercase tracking-widest mb-1">Attach Digital Artifact</h4>
                            <p class="text-[9px] text-slate-700 font-bold uppercase tracking-widest">PDF or Secure Imagery Authorized</p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-10">
                    <button type="submit" id="resultSubmitBtn" class="w-full py-6 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black rounded-2xl shadow-[0_20px_60px_rgba(16,185,129,0.3)] hover:scale-[1.01] transition-all text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                        <ion-icon name="shield-checkmark" class="text-xl"></ion-icon>
                        Commit Evaluated Data
                    </button>
                </div>
            </form>
        </div>
    </div>
    <script>
        window.updateResultFileLabel = (input) => {
            const label = document.getElementById('resultFileLabel');
            const icon = document.getElementById('resultFileIcon');
            if (input.files.length > 0) {
                label.innerText = 'ARTIFACT READY: ' + input.files[0].name.toUpperCase();
                label.classList.add('text-emerald-400');
                icon.classList.add('text-emerald-400');
            } else {
                label.innerText = 'Attach Digital Artifact';
                label.classList.remove('text-emerald-400');
                icon.classList.remove('text-emerald-400');
            }
        };
    </script>
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
                        <button onclick="window.triggerSecureDownload('${m.fileUrl}')" 
                           class="bg-indigo-500/10 text-indigo-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 shadow-lg hover:bg-indigo-500 hover:text-white transition-all flex items-center">
                            <ion-icon name="cloud-download-outline" class="mr-2 text-sm"></ion-icon> Download Asset
                        </button>
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
            <table class="w-full divide-y divide-white/5">
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
                                    ${r.fileUrl ? `<button onclick="window.triggerSecureDownload('${r.fileUrl}')" class="p-3 bg-white/5 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-white/5 shadow-lg flex items-center"><ion-icon name="download-outline"></ion-icon></button>` : ''}
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
    <div class="max-w-3xl mx-auto space-y-10 animate-scaleIn">
        <div class="flex justify-between items-end bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>
            <div class="relative z-10 text-left">
                <div class="flex items-center gap-3 mb-4">
                    <span class="px-3 py-1 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-amber-500/20">Metric Adjustment</span>
                    <span class="px-3 py-1 bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">Sector: ${courseCode}</span>
                </div>
                <h2 class="text-4xl font-black text-white tracking-tighter uppercase leading-tight">Revise Evaluation</h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Candidate: ${result.studentName}</p>
            </div>
            <button onclick="window.manageCourseResults(${result.courseId}, '${courseCode}')" class="bg-white/5 text-slate-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all flex items-center shadow-xl relative z-10 border border-white/5">
                <ion-icon name="close" class="mr-2 text-lg"></ion-icon> Abort
            </button>
        </div>
        
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden text-left">
            <form id="editResultForm" class="space-y-10 relative z-10">
                <input type="hidden" name="id" value="${result.id}">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-3">
                         <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assessment Classification</label>
                         <div class="relative">
                             <select name="examType" required class="w-full bg-white/2 border-2 border-white/5 text-white p-6 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer">
                                <option value="CT" ${result.examType === 'CT' ? 'selected' : ''}>Class Test</option>
                                <option value="Midterm" ${result.examType === 'Midterm' ? 'selected' : ''}>Midterm</option>
                                <option value="Final" ${result.examType === 'Final' ? 'selected' : ''}>Final</option>
                                <option value="Quiz" ${result.examType === 'Quiz' ? 'selected' : ''}>Quiz</option>
                                <option value="Assignment" ${result.examType === 'Assignment' ? 'selected' : ''}>Assignment</option>
                                <option value="Lab Report" ${result.examType === 'Lab Report' ? 'selected' : ''}>Lab Report</option>
                                <option value="Viva" ${result.examType === 'Viva' ? 'selected' : ''}>Viva Voice</option>
                             </select>
                             <ion-icon name="ribbon-outline" class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xl"></ion-icon>
                         </div>
                    </div>
                    <div class="space-y-3">
                         <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Adjusted Metric (Marks)</label>
                         <input type="number" name="marks" value="${result.marks}" required step="0.5" class="w-full bg-white/2 border-2 border-white/5 text-white p-6 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black text-xl placeholder-slate-700">
                    </div>
                </div>
                
                <div class="space-y-3">
                     <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Allocated Grade Index (Optional)</label>
                     <input type="text" name="grade" value="${result.grade || ''}" placeholder="e.g. A+" class="w-full bg-white/2 border-2 border-white/5 text-white p-6 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black uppercase text-sm tracking-[0.3em] placeholder-slate-800">
                </div>

                <div class="space-y-3">
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Material (Binary Rewrite)</label>
                    <div class="relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-white/10 hover:border-amber-500/50 transition-all">
                        <input type="file" name="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="window.updateEditResultFileLabel(this)"/>
                        <div class="w-full py-12 flex flex-col items-center justify-center bg-white/1 group-hover:bg-amber-500/5 transition-all">
                            <div class="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ion-icon name="sync-outline" id="editResultFileIcon" class="text-4xl text-slate-600 group-hover:text-amber-400 transition-colors"></ion-icon>
                            </div>
                            <h4 id="editResultFileLabel" class="text-xs font-black text-slate-500 group-hover:text-white uppercase tracking-widest mb-1">Replace Digital Artifact</h4>
                            <p class="text-[9px] text-slate-700 font-bold uppercase tracking-widest">Existing artifact will be updated upon commitment</p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-10">
                    <button type="submit" id="resultEditSubmitBtn" class="w-full py-6 bg-gradient-to-r from-amber-600 to-indigo-600 text-white font-black rounded-2xl shadow-[0_20px_60px_rgba(245,158,11,0.2)] hover:scale-[1.01] transition-all text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4">
                        <ion-icon name="shield-checkmark" class="text-xl"></ion-icon>
                        Commit Metric Correction
                    </button>
                </div>
            </form>
        </div>
    </div>
    <script>
        window.updateEditResultFileLabel = (input) => {
            const label = document.getElementById('editResultFileLabel');
            const icon = document.getElementById('editResultFileIcon');
            if (input.files.length > 0) {
                label.innerText = 'ARTIFACT READY: ' + input.files[0].name.toUpperCase();
                label.classList.add('text-amber-400');
                icon.classList.add('text-amber-400');
            } else {
                label.innerText = 'Replace Digital Artifact';
                label.classList.remove('text-amber-400');
                icon.classList.remove('text-amber-400');
            }
        };
    </script>
    `;
};

export const renderEditMaterialForm = (material, courseCode) => {
    return `
    <div class="max-w-3xl mx-auto space-y-10 animate-scaleIn">
        <div class="flex justify-between items-end bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
            <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                    <span class="px-3 py-1 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-amber-500/20">Operational Amendment</span>
                    <span class="px-3 py-1 bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/10">ID: ${material.id}</span>
                </div>
                <h2 class="text-4xl font-black text-white tracking-tighter uppercase leading-tight">Modify Asset: <span class="text-indigo-400">${courseCode}</span></h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Targeted resource synchronization</p>
            </div>
            <button onclick="window.manageCourseMaterials(${material.courseId}, '${courseCode}')" class="bg-white/5 text-slate-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all flex items-center shadow-xl relative z-10 border border-white/5">
                <ion-icon name="close" class="mr-2 text-lg"></ion-icon> Cancel
            </button>
        </div>
        
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
            <form id="editMaterialForm" class="space-y-10 relative z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-3">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Designation (Title)</label>
                        <input type="text" name="title" value="${material.title}" required class="w-full bg-white/2 border-2 border-white/5 text-white p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-sm">
                    </div>
                    <div class="space-y-3">
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resource Classification</label>
                        <div class="relative">
                            <select name="type" class="w-full bg-white/2 border-2 border-white/5 text-white p-5 rounded-2xl outline-none focus:border-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none">
                                <option value="material" ${material.type === 'material' ? 'selected' : ''}>Lecture Material</option>
                                <option value="syllabus" ${material.type === 'syllabus' ? 'selected' : ''}>Institutional Syllabus</option>
                                <option value="routine" ${material.type === 'routine' ? 'selected' : ''}>Deployment Routine</option>
                                <option value="question" ${material.type === 'question' ? 'selected' : ''}>Assessment Archive</option>
                                <option value="solution" ${material.type === 'solution' ? 'selected' : ''}>Authored Solutions</option>
                                <option value="online_resource" ${material.type === 'online_resource' ? 'selected' : ''}>Digital Resource</option>
                            </select>
                            <ion-icon name="chevron-down-outline" class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></ion-icon>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Technical Summary (Description)</label>
                    <textarea name="description" rows="4" class="w-full bg-white/2 border-2 border-white/5 text-white p-6 rounded-3xl outline-none focus:border-indigo-500 transition-all font-medium text-xs leading-relaxed custom-scrollbar">${material.description || ''}</textarea>
                </div>

                <div class="space-y-3">
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Binary Replacement (Asset Upgrade)</label>
                    <div class="relative group">
                        <input type="file" name="file" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onchange="window.updateEditFileStatus(this)"/>
                        <div class="w-full py-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-white/2 group-hover:border-indigo-500 group-hover:bg-indigo-500/5 transition-all">
                            <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 transition-all">
                                <ion-icon name="sync-outline" id="editFileIcon" class="text-3xl text-slate-600 group-hover:text-indigo-400 transition-colors"></ion-icon>
                            </div>
                            <p id="editFileLabel" class="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Select New Source Binary</p>
                            <p class="text-[8px] text-slate-700 uppercase mt-2 font-bold tracking-widest italic">Current asset will be overwritten upon commitment</p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-8">
                    <button type="submit" class="w-full md:w-auto px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-all text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                        Commit Resource Injection
                        <ion-icon name="checkmark-done" class="text-lg"></ion-icon>
                    </button>
                </div>
            </form>
        </div>
    </div>
    <script>
        window.updateEditFileStatus = (input) => {
            const label = document.getElementById('editFileLabel');
            const icon = document.getElementById('editFileIcon');
            if (input.files.length > 0) {
                label.innerText = 'ASSET BUFFERED: ' + input.files[0].name.toUpperCase();
                label.classList.add('text-indigo-400');
                icon.classList.add('text-indigo-400');
            } else {
                label.innerText = 'Select New Source Binary';
                label.classList.remove('text-indigo-400');
                icon.classList.remove('text-indigo-400');
            }
        };
    </script>
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
                <table class="w-full divide-y divide-white/5">
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
                                    <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">${s.studentId} &bull; Batch: ${s.batch || 'N/A'}</div>
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
                        ${students.length === 0 ? `
                            <tr>
                                <td colspan="3" class="py-20 text-center">
                                    <ion-icon name="people-outline" class="text-4xl text-slate-700 mb-4 opacity-30"></ion-icon>
                                    <p class="text-slate-500 font-black uppercase tracking-widest text-[10px]">No synchronized candidates detected in this sector.</p>
                                    <p class="text-slate-600 text-[8px] font-bold uppercase mt-2">Please verify enrollment status with Course Coordinator.</p>
                                </td>
                            </tr>
                        ` : ''}
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

export const renderAttendanceReport = (data, courseCode, courseId) => {
    const { records, stats } = data;

    // Calculate Class Metrics
    const totalStudents = stats.length;
    const classAvg = totalStudents > 0
        ? (stats.reduce((acc, curr) => acc + parseFloat(curr.percentage), 0) / totalStudents).toFixed(2)
        : 0;

    const atRiskCount = stats.filter(s => parseFloat(s.percentage) < 75).length;
    const distinctionCount = stats.filter(s => parseFloat(s.percentage) >= 90).length;

    return `
    <div class="space-y-10 animate-fadeIn">
        <div class="flex justify-between items-end bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-[3rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div class="relative z-10">
                <h2 class="text-3xl font-black text-white tracking-tight uppercase">Presence Analytics: <span class="text-indigo-400">${courseCode}</span></h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Comprehensive institutional engagement audit</p>
            </div>
            <button onclick="window.handleNavigation('loadAttendance')" class="bg-white/5 text-indigo-400 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center shadow-xl relative z-10">
                <ion-icon name="arrow-back-outline" class="mr-2 text-lg"></ion-icon> Control Panel
            </button>
        </div>

        <!-- Class Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-gradient-to-br from-indigo-500/10 to-transparent p-8 rounded-[2.5rem] border-2 border-indigo-500/20 shadow-xl relative overflow-hidden group">
                <div class="absolute -right-5 -top-5 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
                <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Class Average</p>
                <p class="text-4xl font-black text-white">${classAvg}%</p>
                <div class="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500" style="width: ${classAvg}%"></div>
                </div>
            </div>

            <div class="bg-gradient-to-br from-emerald-500/10 to-transparent p-8 rounded-[2.5rem] border-2 border-emerald-500/20 shadow-xl relative overflow-hidden group">
                <div class="absolute -right-5 -top-5 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
                <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">High Attendance (90%+)</p>
                <p class="text-4xl font-black text-white">${distinctionCount}</p>
                <p class="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-2">Synchronized Candidates</p>
            </div>

            <div class="bg-gradient-to-br from-rose-500/10 to-transparent p-8 rounded-[2.5rem] border-2 border-rose-500/20 shadow-xl relative overflow-hidden group">
                <div class="absolute -right-5 -top-5 w-16 h-16 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all"></div>
                <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">At-Risk (Below 75%)</p>
                <p class="text-4xl font-black text-white">${atRiskCount}</p>
                <p class="text-[8px] text-rose-500/50 font-black uppercase tracking-widest mt-2 animate-pulse">Critical Intervention Required</p>
            </div>

            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border-2 border-white/5 shadow-xl relative overflow-hidden group">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Candidates</p>
                <p class="text-4xl font-black text-white">${totalStudents}</p>
                <div class="flex items-center gap-1 mt-4">
                    ${Array.from({ length: Math.min(totalStudents, 5) }).map(() => `
                        <div class="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    `).join('')}
                    ${totalStudents > 5 ? '<span class="text-[8px] text-slate-600 font-bold">...</span>' : ''}
                </div>
            </div>
        </div>

        <!-- Main Analytics Table -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3.5rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <div class="px-10 py-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <h3 class="font-black text-white uppercase tracking-widest text-sm flex items-center">
                    <ion-icon name="stats-chart-outline" class="mr-4 text-indigo-400 text-2xl"></ion-icon>
                    Candidate Efficiency Matrix
                </h3>
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal Sync: Enabled</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full divide-y divide-white/5">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Identity</th>
                            <th class="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</th>
                            <th class="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Delayed</th>
                            <th class="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Ops</th>
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement Ratio (%)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${stats.map(s => `
                                <tr class="hover:bg-white/2 transition-all">
                                    <td class="px-10 py-8 whitespace-nowrap">
                                        <div class="text-sm font-black text-white">${s.studentName}</div>
                                        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">${s.displayStudentId} &bull; Batch: ${s.batch || 'N/A'}</div>
                                    </td>
                                    <td class="px-10 py-8 whitespace-nowrap text-center text-lg font-black text-emerald-400">${s.presentClasses}</td>
                                    <td class="px-10 py-8 whitespace-nowrap text-center text-lg font-black text-amber-400">${s.lateClasses}</td>
                                    <td class="px-10 py-8 whitespace-nowrap text-center text-lg font-black text-slate-400">${s.totalClasses}</td>
                                    <td class="px-10 py-8 whitespace-nowrap">
                                        <div class="flex items-center space-x-6">
                                            <div class="flex flex-col min-w-[70px]">
                                                <span class="text-lg font-black ${parseFloat(s.percentage) < 75 ? 'text-rose-500' : 'text-white'}">${s.percentage}%</span>
                                                <span class="text-[8px] font-black uppercase tracking-widest ${parseFloat(s.percentage) < 75 ? 'text-rose-700 animate-pulse' : 'text-slate-600'}">${parseFloat(s.percentage) < 75 ? 'WARNING' : 'SECURE'}</span>
                                            </div>
                                            <div class="flex-1 max-w-[200px] h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                                <div class="h-full bg-gradient-to-r ${parseFloat(s.percentage) < 75 ? 'from-rose-600 to-pink-500' : 'from-indigo-600 to-blue-500'} shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-1000" style="width: ${s.percentage}%"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </div>
            ${stats.length === 0 ? `
                <div class="py-24 text-center">
                    <p class="text-slate-600 font-black uppercase tracking-widest text-xs italic">No efficiency metadata available for this sector.</p>
                </div>
            ` : ''}
        </div>

        <!-- Session Management Audit -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3.5rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <div class="px-10 py-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
                <h3 class="font-black text-white uppercase tracking-widest text-sm flex items-center">
                    <ion-icon name="calendar-outline" class="mr-4 text-indigo-400 text-2xl"></ion-icon>
                    Institutional Session Audit
                </h3>
                <div class="flex items-center gap-4">
                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">${data.sessions?.length || 0} Discrete Sessions Monitored</span>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full divide-y divide-white/5">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Node</th>
                            <th class="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</th>
                            <th class="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Delayed</th>
                            <th class="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Offline</th>
                            <th class="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Participation</th>
                            <th class="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${(data.sessions || []).map(sess => `
                                <tr class="hover:bg-white/2 transition-all">
                                    <td class="px-10 py-6 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-12 h-12 bg-white/5 rounded-[1.2rem] flex items-center justify-center mr-5 border border-white/10 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                                                <ion-icon name="calendar-clear-outline" class="text-indigo-400 text-xl"></ion-icon>
                                            </div>
                                            <div>
                                                <div class="text-[11px] font-black text-white uppercase tracking-tighter">
                                                    ${new Date(sess.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <span class="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 block">${sess.total} Entries Captured</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-10 py-6 text-center">
                                        <div class="inline-flex flex-col items-center">
                                            <span class="text-lg font-black text-emerald-400 leading-none">${sess.present}</span>
                                            <span class="text-[7px] text-slate-600 font-black uppercase mt-1 tracking-widest">Active</span>
                                        </div>
                                    </td>
                                    <td class="px-10 py-6 text-center">
                                        <div class="inline-flex flex-col items-center">
                                            <span class="text-lg font-black text-amber-400 leading-none">${sess.late}</span>
                                            <span class="text-[7px] text-slate-600 font-black uppercase mt-1 tracking-widest">Delayed</span>
                                        </div>
                                    </td>
                                    <td class="px-10 py-6 text-center">
                                        <div class="inline-flex flex-col items-center">
                                            <span class="text-lg font-black text-rose-500 leading-none">${sess.absent}</span>
                                            <span class="text-[7px] text-slate-600 font-black uppercase mt-1 tracking-widest">Offline</span>
                                        </div>
                                    </td>
                                    <td class="px-10 py-6 text-center">
                                        <div class="inline-flex flex-col items-center p-3 bg-white/5 rounded-2xl border border-white/5 min-w-[80px]">
                                            <span class="text-[11px] font-black text-white">${((sess.present + sess.late) / sess.total * 100).toFixed(0)}%</span>
                                            <div class="w-8 h-0.5 bg-indigo-500 rounded-full mt-1.5 opacity-50"></div>
                                        </div>
                                    </td>
                                    <td class="px-10 py-6 whitespace-nowrap text-right">
                                        <button onclick="window.editAttendanceRecord(${courseId}, '${courseCode}', '${sess.date}')" class="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-500 hover:scale-105 transition-all shadow-xl shadow-indigo-600/10 flex items-center justify-center float-right group">
                                            <ion-icon name="create-outline" class="mr-2 text-base group-hover:rotate-12 transition-transform"></ion-icon>
                                            Modify Audit
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                    </tbody>
                </table>
            </div>
            ${!data.sessions || data.sessions.length === 0 ? `
                <div class="py-24 text-center">
                    <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-700">
                        <ion-icon name="file-tray-outline" class="text-2xl text-slate-600"></ion-icon>
                    </div>
                    <p class="text-slate-600 font-black uppercase tracking-widest text-[10px]">No discrete session logs synchronized for this sector.</p>
                </div>
            ` : ''}
        </div>
    </div>
    `;
};
