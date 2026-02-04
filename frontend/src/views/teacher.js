export const renderTeacherCourses = (courses) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">My Assigned Courses</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    if (courses.length === 0) {
        html += `<p class="text-gray-500">No courses assigned yet.</p>`;
    } else {
        courses.forEach(course => {
            html += `
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <!-- Top Icon -->
                    <div class="absolute top-4 right-4 p-2 bg-indigo-50 rounded-lg text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                        <ion-icon name="school-outline" class="text-xl"></ion-icon>
                    </div>

                    <div class="mb-5">
                        <h3 class="text-sm font-black text-indigo-600 uppercase tracking-widest">${course.code}</h3>
                        <h2 class="text-xl font-bold text-gray-800 mt-1 leading-tight">${course.title}</h2>
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
                        <div class="flex items-center text-sm text-gray-400">
                             <ion-icon name="calendar-outline" class="mr-2"></ion-icon>
                             <span>${course.semester}</span>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span class="text-sm font-bold text-gray-400">${course.credit} Credits</span>
                        <div class="flex gap-2">
                             <button onclick="window.manageCourseMaterials(${course.id}, '${course.code}')" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Materials">
                                <ion-icon name="folder-open-outline" class="text-xl"></ion-icon>
                            </button>
                             <button onclick="window.loadUploadForm(${course.id}, '${course.code}')" class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Upload Result">
                                <ion-icon name="cloud-upload-outline" class="text-xl"></ion-icon>
                            </button>
                            <button onclick="window.manageCourseResults(${course.id}, '${course.code}')" class="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Results">
                                <ion-icon name="create-outline" class="text-xl"></ion-icon>
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
    let studentOptions = students.map(s => `<option value="${s.id}">${s.studentId || s.name} - ${s.name}</option>`).join('');

    return `
    <div class="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Upload Result: ${courseCode}</h2>
            <button onclick="window.manageCourseMaterials(${courseId}, '${courseCode}')" class="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center">
                <ion-icon name="document-text-outline" class="mr-1"></ion-icon> Upload Material instead?
            </button>
        </div>
        
        <form id="uploadResultForm" class="space-y-4">
            <input type="hidden" name="courseId" value="${courseId}">
            
            <div>
                <label class="block text-sm font-medium text-gray-700">Select Student</label>
                <select name="studentId" required class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="">-- Select Student --</option>
                    ${studentOptions}
                </select>
                <p class="text-xs text-gray-500 mt-1">Only students enrolled in this course are shown.</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                     <label class="block text-sm font-medium text-gray-700">Exam Type</label>
                     <select name="examType" required class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2">
                        <option value="CT">Class Test</option>
                        <option value="Midterm">Midterm</option>
                        <option value="Final">Final</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Online Exam">Online Exam</option>
                        <option value="Online Quiz">Online Quiz</option>
                        <option value="Offline Exam">Offline Exam</option>
                        <option value="Assignment">Assignment</option>
                        <option value="Lab Report">Lab Report</option>
                        <option value="Class Performance">Class Performance</option>
                        <option value="Attendance">Attendance</option>
                        <option value="Viva">Viva</option>
                     </select>
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700">Marks</label>
                     <input type="number" name="marks" required class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                </div>
            </div>
            
            <div>
                 <label class="block text-sm font-medium text-gray-700">Grade (Optional)</label>
                 <input type="text" name="grade" placeholder="e.g. A+" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Upload Answer Script (PDF/Image)</label>
                <input type="file" name="file" class="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                "/>
            </div>

            <div class="flex justify-end pt-4">
                <button type="button" onclick="handleNavigation('loadCourses')" class="mr-3 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow">Upload</button>
            </div>
        </form>
    </div>
    `;
};

export const renderCourseMaterials = (courseId, courseCode, materialsList, userRole) => {
    const canManage = ['teacher', 'course_coordinator', 'super_admin'].includes(userRole);
    return `
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Materials: ${courseCode}</h2>
            ${canManage ? `
            <button onclick="window.showUploadMaterialModalForCourse(${courseId}, '${courseCode}')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow flex items-center">
                <ion-icon name="add-outline" class="mr-2"></ion-icon> Add Material
            </button>` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${materialsList.map(m => `
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between">
                        <div class="p-3 bg-indigo-50 rounded-lg text-indigo-600 mr-4">
                            <ion-icon name="document-outline" class="text-2xl"></ion-icon>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-lg font-bold text-gray-800 truncate">${m.title}</h4>
                            <p class="text-sm text-gray-500 mt-1">${m.description || 'No description'}</p>
                        </div>
                    </div>
                    <div class="mt-6 flex items-center justify-between border-t pt-4">
                        <a href="${window.getDownloadUrl ? window.getDownloadUrl(m.fileUrl) : m.fileUrl}" download class="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center">
                            <ion-icon name="download-outline" class="mr-1"></ion-icon> Download Material
                        </a>
                        ${canManage ? `
                        <div class="flex space-x-3">
                            <button onclick="window.editMaterialItem(${m.id}, ${courseId}, '${courseCode}')" class="text-amber-500 hover:text-amber-700 text-sm font-bold flex items-center">
                                <ion-icon name="create-outline" class="mr-1"></ion-icon> Edit
                            </button>
                            <button onclick="window.deleteMaterialItem(${m.id}, ${courseId}, '${courseCode}')" class="text-rose-500 hover:text-rose-700 text-sm font-bold flex items-center">
                                <ion-icon name="trash-outline" class="mr-1"></ion-icon> Delete
                            </button>
                        </div>` : ''}
                    </div>
                </div>
            `).join('')}
            ${materialsList.length === 0 ? '<div class="col-span-full py-10 text-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed">No materials uploaded for this course yet.</div>' : ''}
        </div>
    </div>
    `;
};

export const renderCourseResultsList = (courseId, courseCode, resultsList) => {
    return `
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Manage Results: ${courseCode}</h2>
            <button onclick="window.loadUploadForm(${courseId}, '${courseCode}')" class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow flex items-center">
                <ion-icon name="add-outline" class="mr-2"></ion-icon> New Result
            </button>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${resultsList.map(r => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-bold text-gray-800">${r.studentName}</div>
                                <div class="text-xs text-gray-500">${r.studentId}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 uppercase font-medium">${r.examType}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-black text-indigo-600">${r.marks}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">${r.grade || '-'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onclick="window.editResultItem(${r.id}, ${courseId}, '${courseCode}')" class="text-indigo-600 hover:text-indigo-900 mr-3 font-bold">Edit</button>
                                ${r.fileUrl ? `<a href="${window.getDownloadUrl ? window.getDownloadUrl(r.fileUrl) : r.fileUrl}" download class="text-emerald-600 hover:text-emerald-900 font-bold flex items-center"><ion-icon name="download-outline" class="mr-1"></ion-icon> Download Script</a>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                    ${resultsList.length === 0 ? '<tr><td colspan="5" class="px-6 py-10 text-center text-gray-400">No results found for this course.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    </div>
    `;
};

export const renderEditResultForm = (result, courseCode) => {
    return `
    <div class="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Result: ${result.studentName} (${courseCode})</h2>
        
        <form id="editResultForm" class="space-y-4">
            <input type="hidden" name="id" value="${result.id}">
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                     <label class="block text-sm font-medium text-gray-700">Marks</label>
                     <input type="number" name="marks" value="${result.marks}" required class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                </div>
                <div>
                     <label class="block text-sm font-medium text-gray-700">Grade</label>
                     <input type="text" name="grade" value="${result.grade || ''}" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Replace Answer Script (Optional)</label>
                <input type="file" name="file" class="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                "/>
                ${result.fileUrl ? `<p class="text-xs text-indigo-600 mt-1">Current file exists. Uploading new one will replace it.</p>` : ''}
            </div>

            <div class="flex justify-end pt-4">
                <button type="button" onclick="window.manageCourseResults(${result.courseId}, '${courseCode}')" class="mr-3 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow">Update Result</button>
            </div>
        </form>
    </div>
    `;
};

export const renderEditMaterialForm = (material, courseCode) => {
    return `
    <div class="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Material: ${courseCode}</h2>
        
        <form id="editMaterialForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" value="${material.title}" required class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" rows="3" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">${material.description || ''}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700">Replace File (Optional)</label>
                <input type="file" name="file" class="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                "/>
            </div>

            <div class="flex justify-end pt-4">
                <button type="button" onclick="window.manageCourseMaterials(${material.courseId}, '${courseCode}')" class="mr-3 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow">Update Material</button>
            </div>
        </form>
    </div>
    `;
};

export const renderAttendanceDashboard = (courses, userRole) => {
    const canTakeAttendance = ['teacher', 'super_admin', 'course_coordinator'].includes(userRole);
    return `
    <div class="space-y-8">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <ion-icon name="checkbox-outline" class="mr-2 text-indigo-600"></ion-icon>
            Attendance Management
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${courses.map(course => `
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">${course.code}</span>
                            <h3 class="text-lg font-bold text-gray-800 line-clamp-1">${course.title}</h3>
                        </div>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                        <div class="flex items-center text-sm text-gray-500">
                             <ion-icon name="layers-outline" class="mr-2"></ion-icon>
                             <span>Batch: <span class="font-bold text-gray-700">${course.batch || '-'}</span></span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        ${canTakeAttendance ? `
                        <button onclick="window.startTakingAttendance(${course.id}, '${course.code}')" class="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center">
                            <ion-icon name="add-circle-outline" class="mr-2 text-lg"></ion-icon> Take Attendance
                        </button>` : ''}
                        <button onclick="window.viewAttendanceReport(${course.id}, '${course.code}')" class="w-full bg-white text-indigo-600 border border-indigo-100 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all flex items-center justify-center">
                            <ion-icon name="bar-chart-outline" class="mr-2 text-lg"></ion-icon> View Reports
                        </button>
                    </div>
                </div>
            `).join('')}
            ${courses.length === 0 ? '<div class="col-span-full p-10 bg-white rounded-2xl border border-dashed text-center text-gray-400">No assigned courses found for this semester.</div>' : ''}
        </div>
    </div>
    `;
};

export const renderTakeAttendanceForm = (students, courseId, courseCode, semester) => {
    const today = new Date().toISOString().split('T')[0];
    return `
    <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Take Attendance: ${courseCode}</h2>
                <p class="text-sm text-gray-500">${semester} | ${students.length} Students Enrolled</p>
            </div>
            <div class="flex items-center gap-2">
                <div class="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <ion-icon name="calendar-outline" class="text-indigo-600 mr-2"></ion-icon>
                    <input type="date" id="attendanceDate" value="${today}" class="border-none focus:ring-0 text-sm font-bold text-gray-700">
                </div>
                <button type="button" onclick="window.loadAttendanceForDate(${courseId})" class="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
                    Load Sheet
                </button>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <form id="attendanceForm" onsubmit="window.submitAttendance(event, ${courseId}, '${semester}')">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Student</th>
                            <th class="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                            <th class="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Remarks</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        ${students.map(s => `
                            <tr class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-bold text-gray-800">${s.name}</div>
                                    <div class="text-xs text-gray-500 font-medium">${s.studentId}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center justify-center space-x-4">
                                        <label class="flex flex-col items-center cursor-pointer group">
                                            <input type="radio" name="status-${s.id}" value="present" checked class="hidden peer">
                                            <div class="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-checked:text-white transition-all">
                                                <ion-icon name="checkmark-outline"></ion-icon>
                                            </div>
                                            <span class="text-[10px] mt-1 font-bold text-gray-400 peer-checked:text-emerald-600 uppercase">P</span>
                                        </label>
                                        <label class="flex flex-col items-center cursor-pointer group">
                                            <input type="radio" name="status-${s.id}" value="late" class="hidden peer">
                                            <div class="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-checked:text-white transition-all">
                                                <ion-icon name="time-outline"></ion-icon>
                                            </div>
                                            <span class="text-[10px] mt-1 font-bold text-gray-400 peer-checked:text-amber-600 uppercase">L</span>
                                        </label>
                                        <label class="flex flex-col items-center cursor-pointer group">
                                            <input type="radio" name="status-${s.id}" value="absent" class="hidden peer">
                                            <div class="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 peer-checked:bg-rose-500 peer-checked:border-rose-500 peer-checked:text-white transition-all">
                                                <ion-icon name="close-outline"></ion-icon>
                                            </div>
                                            <span class="text-[10px] mt-1 font-bold text-gray-400 peer-checked:text-rose-600 uppercase">A</span>
                                        </label>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <input type="text" name="remarks-${s.id}" placeholder="Late for 10 min..." class="w-full text-xs border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-4">
                    <button type="button" onclick="window.handleNavigation('loadAttendance')" class="text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                    <button type="submit" class="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center">
                        <ion-icon name="cloud-upload-outline" class="mr-2 text-lg"></ion-icon>
                        Submit Attendance
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
    <div class="space-y-8">
        <div class="flex justify-between items-end">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Attendance Report: ${courseCode}</h2>
                <p class="text-sm text-gray-500">Overview of student attendance and performance</p>
            </div>
            <button onclick="window.handleNavigation('loadAttendance')" class="text-indigo-600 font-bold flex items-center hover:underline">
                <ion-icon name="arrow-back-outline" class="mr-1"></ion-icon> Back to Courses
            </button>
        </div>

        <!-- Progress Summary -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 class="font-bold text-gray-800">Student Performance Summary</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Present</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Late</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Classes</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Percentage</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                        ${stats.map(s => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-bold text-gray-800">${s.studentName}</div>
                                    <div class="text-[10px] text-gray-400 font-black uppercase">${s.displayStudentId}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold">${s.presentClasses}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-bold">${s.lateClasses}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${s.totalClasses}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <span class="text-sm font-black mr-2 ${parseFloat(s.percentage) < 75 ? 'text-rose-600' : 'text-gray-900'}">${s.percentage}%</span>
                                        <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div class="h-full ${parseFloat(s.percentage) < 75 ? 'bg-rose-500' : 'bg-indigo-600'}" style="width: ${s.percentage}%"></div>
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
