export const renderStudentCourses = (courses) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <ion-icon name="book-outline" class="mr-2 text-indigo-600"></ion-icon>
            My Courses
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    if (courses.length === 0) {
        html += `
            <div class="col-span-full bg-white p-10 rounded-xl shadow-sm border border-dashed border-gray-300 text-center">
                <ion-icon name="book-outline" class="text-6xl text-gray-200 mb-4"></ion-icon>
                <p class="text-gray-500 font-medium">No courses found for your batch this semester.</p>
            </div>
        `;
    } else {
        courses.forEach(course => {
            html += `
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-lg font-bold text-indigo-900">${course.code}</h3>
                            <p class="text-gray-600 text-sm line-clamp-1">${course.title}</p>
                        </div>
                        <span class="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-1 rounded uppercase">
                            ${course.credit} Credits
                        </span>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                        <div class="flex items-center text-sm text-gray-500">
                             <ion-icon name="person-outline" class="mr-2"></ion-icon>
                             <span>Teacher: <span class="font-bold text-gray-700">${course.teacherName || course.teacher_name || 'TBA'}</span></span>
                        </div>
                        <div class="flex items-center text-sm text-gray-500">
                             <ion-icon name="layers-outline" class="mr-2"></ion-icon>
                             <span>Batch: <span class="font-bold text-indigo-600">${course.batch || '-'}</span></span>
                        </div>
                    </div>

                    <div class="flex gap-2">
                         <button onclick="window.manageCourseMaterials(${course.id}, '${course.code}')" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center">
                            <ion-icon name="folder-open-outline" class="mr-1"></ion-icon> Materials
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
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <ion-icon name="ribbon-outline" class="mr-2 text-indigo-600"></ion-icon>
            My Exam Results
        </h2>
        
        <div class="overflow-hidden bg-white shadow sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-indigo-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Exam</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Marks</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Grade</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-indigo-700 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    results.forEach(r => {
        html += `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">${r.examType}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">${r.marks}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(r.grade)}">
                        ${r.grade}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${r.fileUrl ? `<a href="${window.getDownloadUrl ? window.getDownloadUrl(r.fileUrl) : r.fileUrl}" download class="text-indigo-600 hover:text-indigo-900 flex items-center justify-end font-bold"><ion-icon name="download-outline" class="mr-1"></ion-icon> Download Script</a>` : '<span class="text-gray-400">N/A</span>'}
                </td>
            </tr>
        `;
    });

    html += `
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
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <ion-icon name="id-card-outline" class="mr-2 text-indigo-600"></ion-icon>
            My Admit Cards
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    if (admitCards.length === 0) {
        html += `
            <div class="col-span-full bg-white p-10 rounded-xl shadow-sm border border-dashed border-gray-300 text-center">
                <ion-icon name="id-card-outline" class="text-6xl text-gray-200 mb-4"></ion-icon>
                <p class="text-gray-500 font-medium">No admit cards have been issued to you yet.</p>
            </div>
        `;
    } else {
        admitCards.forEach(card => {
            const date = new Date(card.createdAt).toLocaleDateString();
            html += `
                <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                    <div class="bg-indigo-600 p-4 text-white">
                        <div class="flex justify-between items-center text-xs opacity-80 mb-1">
                            <span>REGISTRATION CARD</span>
                            <span>${card.semester}</span>
                        </div>
                        <h3 class="text-lg font-bold">${card.examName}</h3>
                    </div>
                    <div class="p-5">
                        <div class="space-y-3 mb-6">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Status:</span>
                                <span class="font-bold text-emerald-600 uppercase">${card.status}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Issued On:</span>
                                <span class="font-bold text-gray-700">${date}</span>
                            </div>
                        </div>
                        <a href="${window.getDownloadUrl ? window.getDownloadUrl(card.fileUrl) : card.fileUrl}" download class="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white py-2.5 rounded-lg text-sm font-black transition-all flex items-center justify-center">
                            <ion-icon name="download-outline" class="mr-2"></ion-icon> Download Admit Card
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
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <ion-icon name="checkbox-outline" class="mr-2 text-indigo-600"></ion-icon>
            My Attendance
        </h2>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${stats.map(s => `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div class="relative z-10">
                        <span class="text-xs font-black text-indigo-600 uppercase tracking-tighter">${s.courseCode}</span>
                        <h4 class="font-bold text-gray-800 mt-1 line-clamp-1">${s.courseTitle}</h4>
                        <div class="mt-4 flex items-end justify-between">
                            <div>
                                <p class="text-3xl font-black text-gray-900">${s.percentage}%</p>
                                <p class="text-xs text-gray-500 mt-1">Attendance Rate</p>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold text-gray-700">${s.presentClasses + s.lateClasses} / ${s.totalClasses}</p>
                                <p class="text-xs text-gray-400">Classes Attended</p>
                            </div>
                        </div>
                        <!-- Progress Bar -->
                        <div class="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full bg-indigo-600 transition-all duration-1000" style="width: ${s.percentage}%"></div>
                        </div>
                    </div>
                    <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                        <ion-icon name="pie-chart" class="text-8xl text-indigo-900"></ion-icon>
                    </div>
                </div>
            `).join('')}
            ${stats.length === 0 ? '<div class="col-span-full p-10 bg-white rounded-2xl border border-dashed text-center text-gray-400">No attendance data found for this semester.</div>' : ''}
        </div>

        <!-- Detailed Log -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 class="font-bold text-gray-800">Recent Attendance Log</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        ${records.map(r => `
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">${new Date(r.date).toLocaleDateString()}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-bold text-indigo-900">${r.courseCode}</div>
                                    <div class="text-[10px] text-gray-400 uppercase font-black tracking-tighter">${r.courseTitle}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'present' ? 'bg-emerald-100 text-emerald-700' : r.status === 'late' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}">
                                        ${r.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-500">${r.remarks || '-'}</td>
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
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade === 'F') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
}
