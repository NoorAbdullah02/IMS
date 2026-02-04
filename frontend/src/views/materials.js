export const renderMaterials = (materials, userRole, courses = []) => {
    const canUploadGlobal = ['teacher', 'course_coordinator', 'super_admin'].includes(userRole);

    let html = `
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                <ion-icon name="document-text-outline" class="mr-2 text-indigo-600"></ion-icon>
                Course Materials
            </h2>
            ${canUploadGlobal ? `<button onclick="window.showUploadMaterialModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow flex items-center">
                <ion-icon name="cloud-upload-outline" class="mr-2"></ion-icon>
                Upload Material
            </button>` : ''}
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-indigo-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Title</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Course</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Type / Semester</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Uploaded By</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-indigo-700 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    if (materials.length === 0) {
        html += `
            <tr>
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                    <ion-icon name="folder-open-outline" class="text-6xl text-gray-300"></ion-icon>
                    <p class="mt-2">No materials uploaded yet</p>
                </td>
            </tr>
        `;
    } else {
        materials.forEach(material => {
            const date = new Date(material.createdAt).toLocaleDateString();
            html += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">${material.title}</div>
                        ${material.description ? `<div class="text-sm text-gray-500">${material.description}</div>` : ''}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${material.courseCode || 'N/A'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                         <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-600 uppercase border border-blue-100">${material.type || 'material'}</span>
                         <div class="text-xs text-gray-400 mt-1">${material.semester || '-'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${material.uploadedBy || 'Unknown'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="${window.getDownloadUrl ? window.getDownloadUrl(material.fileUrl) : material.fileUrl}" download class="text-indigo-600 hover:text-indigo-900 flex items-center justify-end font-bold">
                            <ion-icon name="download-outline" class="mr-1"></ion-icon> Download Material
                        </a>
                    </td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    // Add upload modal if user can upload
    if (canUploadGlobal) {
        html += `
        <div id="uploadMaterialModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Upload Material</h3>
                <form id="uploadMaterialForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Target Course</label>
                        <select name="courseId" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                            <option value="">-- Select Course --</option>
                            ${courses.map(c => `<option value="${c.id}">${c.code} - ${c.title}</option>`).join('')}
                        </select>
                        <p class="text-xs text-gray-500 mt-1">Select the course this material belongs to.</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Type</label>
                            <select name="type" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                                <option value="material">Lecture Material</option>
                                <option value="syllabus">Syllabus</option>
                                <option value="routine">Routine</option>
                                <option value="question">Previous Question</option>
                                <option value="solution">Solution</option>
                                <option value="online_resource">Online Resource</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Semester</label>
                            <input type="text" name="semester" placeholder="e.g. Spring 2025" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">File (PDF, DOC, etc.)</label>
                        <input type="file" name="file" required class="mt-1 block w-full text-sm">
                    </div>
                    <div class="flex justify-end space-x-3 mt-4">
                        <button type="button" onclick="document.getElementById('uploadMaterialModal').classList.add('hidden')" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">Upload</button>
                    </div>
                </form>
            </div>
        </div>
        `;
    }

    return html;
};
