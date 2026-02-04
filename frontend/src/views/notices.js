export const renderNotices = (notices, userRole) => {
    const canCreate = ['teacher', 'dept_head', 'super_admin'].includes(userRole);

    let html = `
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                <ion-icon name="notifications-outline" class="mr-2 text-indigo-600"></ion-icon>
                Notices
            </h2>
            ${canCreate ? `<button onclick="window.showCreateNoticeModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow flex items-center">
                <ion-icon name="add-circle-outline" class="mr-2"></ion-icon>
                Post Notice
            </button>` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    if (notices.length === 0) {
        html += `
            <div class="col-span-3 text-center py-10">
                <ion-icon name="document-outline" class="text-6xl text-gray-300"></ion-icon>
                <p class="text-gray-500 mt-4">No notices available</p>
            </div>
        `;
    } else {
        notices.forEach(notice => {
            const date = new Date(notice.createdAt).toLocaleDateString();
            html += `
                <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-lg font-bold text-gray-800">${notice.title}</h3>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">${notice.department || 'General'}</span>
                        ${notice.targetRole ? `<span class="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium capitalize">${notice.targetRole.replace('_', ' ')}</span>` : ''}
                    </div>
                    </div>
                    <p class="text-gray-600 text-sm mb-4">${notice.content || ''}</p>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                        <span>${notice.authorName || 'Admin'}</span>
                        <span>${date}</span>
                    </div>
                    ${notice.attachmentUrl ? `
                        <a href="${window.getDownloadUrl ? window.getDownloadUrl(notice.attachmentUrl) : notice.attachmentUrl}" download class="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-black bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                            <ion-icon name="download-outline" class="mr-1"></ion-icon>
                            Download Attachment
                        </a>
                    ` : ''}
                </div>
            `;
        });
    }

    html += `</div></div>`;

    // Add modal if user can create
    if (canCreate) {
        html += `
        <div id="createNoticeModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div class="relative p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Create Notice</h3>
                <form id="createNoticeForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Content</label>
                        <textarea name="content" rows="4" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Target Audience (Role)</label>
                        <select name="targetRole" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                            <option value="">All Roles</option>
                            <option value="student">Students Only</option>
                            <option value="teacher">Teachers Only</option>
                            <option value="dept_head">Department Admins Only</option>
                            <option value="course_coordinator">Coordinators Only</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Target Department</label>
                        <select name="department" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                            <option value="">General (All Departments)</option>
                            <option value="ICE">ICE</option>
                            <option value="CSE">CSE</option>
                            <option value="EEE">EEE</option>
                            <option value="BBA">BBA</option>
                            <option value="LAW">LAW</option>
                            <option value="English">English</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Attachment (PDF/Image)</label>
                        <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" class="mt-1 block w-full text-sm">
                    </div>
                    <div class="flex justify-end space-x-3 mt-4">
                        <button type="button" onclick="document.getElementById('createNoticeModal').classList.add('hidden')" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">Post Notice</button>
                    </div>
                </form>
            </div>
        </div>
        `;
    }

    return html;
};
