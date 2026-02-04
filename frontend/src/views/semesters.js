export const renderSemestersView = (semesters = []) => {
    let html = `
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center">
                <ion-icon name="calendar-outline" class="mr-2 text-indigo-600"></ion-icon>
                Semester Management
            </h2>
            <button onclick="window.showAddSemesterModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow flex items-center">
                <ion-icon name="add-circle-outline" class="mr-2"></ion-icon>
                Create Semester
            </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-indigo-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Semester Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Created At</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-indigo-700 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
    `;

    if (semesters.length === 0) {
        html += `
            <tr>
                <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                    <p>No semesters created yet.</p>
                </td>
            </tr>
        `;
    } else {
        semesters.forEach(sem => {
            html += `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${sem.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-bold rounded-full ${sem.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                            ${sem.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${new Date(sem.createdAt).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        ${!sem.isActive ? `
                            <button onclick="window.activateSemester(${sem.id})" class="text-indigo-600 hover:text-indigo-900">Activate</button>
                        ` : ''}
                        <button onclick="window.deleteSemester(${sem.id})" class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>

        <!-- Add Semester Modal -->
        <div id="addSemesterModal" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Create New Semester</h3>
                <form id="addSemesterForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Semester Name</label>
                        <input type="text" name="name" required placeholder="e.g. Spring 2025" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                    </div>
                    <div class="flex justify-end space-x-3 mt-4">
                        <button type="button" onclick="window.closeAddSemesterModal()" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;

    return html;
};
