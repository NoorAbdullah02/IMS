export const renderStudentCourses = (courses) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-3xl font-black text-white flex items-center tracking-tight">
            <ion-icon name="book-outline" class="mr-3 text-indigo-400"></ion-icon>
            My Operational Courses
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    if (courses.length === 0) {
        html += `
            <div class="col-span-full bg-slate-900/50 backdrop-blur-xl p-16 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center flex flex-col items-center justify-center">
                <div class="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                    <ion-icon name="book-outline" class="text-4xl text-slate-600"></ion-icon>
                </div>
                <p class="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No operational units detected for this cycle.</p>
            </div>
        `;
    } else {
        courses.forEach(course => {
            html += `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] shadow-2xl p-8 border-2 border-white/5 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                    
                    <div class="relative z-10 flex justify-between items-start mb-6">
                        <div>
                            <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">${course.code}</span>
                            <h2 class="text-xl font-black text-white mt-3 leading-tight tracking-tight h-14 line-clamp-2">${course.title}</h2>
                        </div>
                        <div class="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <ion-icon name="book-outline" class="text-xl text-indigo-400 group-hover:text-white"></ion-icon>
                        </div>
                    </div>
                    
                    <div class="space-y-4 mb-8 pt-6 border-t border-white/5">
                        <div class="flex items-center text-sm text-slate-400">
                             <div class="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center mr-3 border border-white/5">
                                 <ion-icon name="person-outline" class="text-indigo-400"></ion-icon>
                             </div>
                             <span class="truncate">Teacher: <span class="font-bold text-white ml-1">${course.teacherName || course.teacher_name || 'TBA'}</span></span>
                        </div>
                        <div class="flex items-center text-sm text-slate-400">
                             <div class="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center mr-3 border border-white/5">
                                 <ion-icon name="layers-outline" class="text-indigo-400"></ion-icon>
                             </div>
                             <span>Batch: <span class="font-bold text-white ml-1">${course.batch || '-'}</span></span>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between pt-6 border-t border-white/5">
                        <div class="flex items-baseline">
                            <span class="text-2xl font-black text-white">${course.credit}</span>
                            <span class="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Credits</span>
                        </div>
                        <button onclick="window.manageCourseMaterials(${course.id}, '${course.code}')" class="px-4 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 flex items-center">
                            <ion-icon name="folder-open-outline" class="mr-2 text-sm"></ion-icon> Materials
                        </button>
                    </div>
                </div>
            `;
        });
    }

    html += `</div></div>`;
    return html;
};

export const renderStudentResults = (results) => {
    if (results.length === 0) {
        return `
            <div class="text-center py-10">
                <ion-icon name="document-text-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
                <p class="text-xl text-gray-500">No results have been published yet.</p>
            </div>
        `;
    }

    let html = `
    <div class="space-y-6">
        <h2 class="text-3xl font-black text-white flex items-center tracking-tight">
            <ion-icon name="ribbon-outline" class="mr-3 text-indigo-400"></ion-icon>
            Academic Merit Ledger
        </h2>
        
        <div class="overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[2rem] shadow-2xl border-2 border-white/5">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-white/5">
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Marks</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    ${results.map(r => `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="px-8 py-6 whitespace-nowrap text-sm font-black text-white uppercase tracking-tight">${r.examType}</td>
                            <td class="px-8 py-6 whitespace-nowrap text-sm text-slate-300 font-bold">${r.marks}</td>
                            <td class="px-8 py-6 whitespace-nowrap">
                                <span class="px-3 py-1 inline-flex text-[10px] font-black rounded-full border border-white/10 ${getGradeColor(r.grade)}">
                                    ${r.grade}
                                </span>
                            </td>
                            <td class="px-8 py-6 whitespace-nowrap text-right text-sm">
                                ${r.fileUrl ? `
                                    <a href="${window.getDownloadUrl ? window.getDownloadUrl(r.fileUrl) : r.fileUrl}" download class="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all inline-flex items-center">
                                        <ion-icon name="download-outline" class="mr-2 text-sm"></ion-icon> Script
                                    </a>` : '<span class="text-slate-600 font-black text-[10px] uppercase">No File</span>'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
    `;

    return html;
};

export const renderStudentAdmitCards = (admitCards) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-3xl font-black text-white flex items-center tracking-tight">
            <ion-icon name="id-card-outline" class="mr-3 text-indigo-400"></ion-icon>
            Digital Hall Vouchers
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    if (admitCards.length === 0) {
        html += `
            <div class="col-span-full bg-slate-900/50 backdrop-blur-xl p-16 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center flex flex-col items-center justify-center">
                <div class="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                    <ion-icon name="id-card-outline" class="text-4xl text-slate-600"></ion-icon>
                </div>
                <p class="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No digital hall vouchers issued to your terminal.</p>
            </div>
        `;
    } else {
        admitCards.forEach(card => {
            const date = new Date(card.createdAt).toLocaleDateString();
            html += `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border-2 border-white/5 hover:border-indigo-500 transition-all group">
                    <div class="bg-indigo-600/20 p-6 border-b border-indigo-500/20">
                        <div class="flex justify-between items-center text-[10px] font-black text-indigo-400 tracking-widest uppercase mb-2">
                            <span>Registration Voucher</span>
                            <span>${card.semester}</span>
                        </div>
                        <h3 class="text-xl font-black text-white">${card.examName}</h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4 mb-8">
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] font-black text-slate-500 uppercase">Verification Status</span>
                                <span class="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest">${card.status}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] font-black text-slate-500 uppercase">Released Date</span>
                                <span class="text-sm font-bold text-white">${date}</span>
                            </div>
                        </div>
                        <a href="${window.getDownloadUrl ? window.getDownloadUrl(card.fileUrl) : card.fileUrl}" download class="w-full bg-indigo-500 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                            <ion-icon name="grid-outline" class="mr-2 text-lg"></ion-icon> Print Admit Paper
                        </a>
                    </div>
                </div>
            `;
        });
    }

    html += `</div></div>`;
    return html;
};

export const renderStudentAttendance = (data) => {
    const { records, stats } = data;

    let html = `
    <div class="space-y-8">
        <h2 class="text-3xl font-black text-white flex items-center tracking-tight">
            <ion-icon name="checkbox-outline" class="mr-3 text-indigo-400"></ion-icon>
            Presence Analytics
        </h2>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${stats.map(s => `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2rem] shadow-2xl border-2 border-white/5 relative overflow-hidden group">
                    <div class="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                    <div class="relative z-10">
                        <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">${s.courseCode}</span>
                        <h4 class="text-xl font-black text-white mt-4 line-clamp-1">${s.courseTitle}</h4>
                        <div class="mt-8 flex items-end justify-between">
                            <div>
                                <p class="text-4xl font-black text-white">${s.percentage}%</p>
                                <p class="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">Attendance Rating</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xl font-black text-white">${s.presentClasses + s.lateClasses} <span class="text-slate-500">/ ${s.totalClasses}</span></p>
                                <p class="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-widest">Active Presence</p>
                            </div>
                        </div>
                        <!-- Progress Bar -->
                        <div class="mt-6 h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div class="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]" style="width: ${s.percentage}%"></div>
                        </div>
                    </div>
                </div>
                `).join('')}
            ${stats.length === 0 ? '<div class="col-span-full py-10 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">No attendance metrics captured for this cycle.</div>' : ''}
        </div>

        <!-- Detailed Audit Log -->
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[2rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <div class="px-8 py-6 border-b border-white/5 bg-white/5">
                <h3 class="text-xl font-black text-white uppercase tracking-tight">Synchronized Attendance Ledger</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Node (Date)</th>
                            <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Sector</th>
                            <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Protocol</th>
                            <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Remarks</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${records.map(r => `
                            <tr class="hover:bg-white/5 transition-colors">
                                <td class="px-8 py-6 whitespace-nowrap text-sm font-bold text-white">${new Date(r.date).toLocaleDateString()}</td>
                                <td class="px-8 py-6 whitespace-nowrap">
                                    <div class="text-sm font-black text-indigo-400">${r.courseCode}</div>
                                    <div class="text-[10px] text-slate-500 uppercase font-bold tracking-tight">${r.courseTitle}</div>
                                </td>
                                <td class="px-8 py-6 whitespace-nowrap">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 ${r.status === 'present' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'late' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}">
                                        ${r.status}
                                    </span>
                                </td>
                                <td class="px-8 py-6 text-sm text-slate-400 font-medium">${r.remarks || 'No remarks recorded'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
    return html;
};

// Helper for Grade Colors
function getGradeColor(grade) {
    if (!grade) return 'bg-white/5 text-slate-400';
    if (grade.startsWith('A')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (grade.startsWith('B')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (grade.startsWith('C')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (grade === 'F') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-white/5 text-white border-white/10';
}
