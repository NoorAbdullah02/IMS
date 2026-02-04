export const renderUserManagement = (users) => {
    let html = `
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">User Management</h2>
            <button onclick="window.showAddUserModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow transition duration-200 flex items-center">
                <ion-icon name="person-add-outline" class="mr-2"></ion-icon>
                Add User
            </button>
        </div>

        <!-- Add User Modal (Hidden by default) -->
        <div id="addUserModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3 text-center">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Add New User</h3>
                    <div class="mt-2 px-7 py-3">
                        <form id="addUserForm" class="space-y-4 text-left">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" name="name" required class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" required class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 font-bold text-indigo-700">Batch (Students / Coordinators)</label>
                                <select name="batch" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                                    <option value="">None</option>
                                    <option value="Batch 12">Batch 12</option>
                                    <option value="Batch 13">Batch 13</option>
                                    <option value="Batch 14">Batch 14</option>
                                    <option value="Batch 15">Batch 15</option>
                                    <option value="Batch 16">Batch 16</option>
                                    <option value="Batch 17">Batch 17</option>
                                    <option value="Batch 18">Batch 18</option>
                                    <option value="Batch 19">Batch 19</option>
                                    <option value="Batch 20">Batch 20</option>
                                    <option value="Batch 21">Batch 21</option>
                                    <option value="Batch 22">Batch 22</option>
                                    <option value="Batch 23">Batch 23</option>
                                </select>
                            </div>
                             <div>
                                <label class="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" name="password" required class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Role</label>
                                <select name="role" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="dept_head">Dept Head</option>
                                    <option value="course_coordinator">Coordinator</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Department</label>
                                <select name="department" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="ICE">ICE</option>
                                    <option value="CSE">CSE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="BBA">BBA</option>
                                    <option value="LAW">LAW</option>
                                    <option value="English">English</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-3 mt-4">
                                <button type="button" onclick="window.closeAddUserModal()" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                                <button type="submit" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Role Modal -->
        <div id="editRoleModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3 text-center">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Edit User Role</h3>
                    <div class="mt-2 px-7 py-3">
                        <form id="editRoleForm" class="space-y-4 text-left">
                            <input type="hidden" name="id" id="editUserId">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">User</label>
                                <p id="editUserName" class="mt-1 font-semibold text-gray-800"></p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Role</label>
                                <select name="role" id="editUserRole" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="dept_head">Dept Head</option>
                                    <option value="course_coordinator">Coordinator</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Department</label>
                                <select name="department" id="editUserDept" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                                    <option value="">None</option>
                                    <option value="ICE">ICE</option>
                                    <option value="CSE">CSE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="BBA">BBA</option>
                                    <option value="LAW">LAW</option>
                                    <option value="English">English</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 font-bold text-indigo-700">Batch (Students / Coordinators)</label>
                                <select name="batch" id="editUserBatch" class="input-field mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border">
                                    <option value="">None</option>
                                    <option value="Batch 12">Batch 12</option>
                                    <option value="Batch 13">Batch 13</option>
                                    <option value="Batch 14">Batch 14</option>
                                    <option value="Batch 15">Batch 15</option>
                                    <option value="Batch 16">Batch 16</option>
                                    <option value="Batch 17">Batch 17</option>
                                    <option value="Batch 18">Batch 18</option>
                                    <option value="Batch 19">Batch 19</option>
                                    <option value="Batch 20">Batch 20</option>
                                    <option value="Batch 21">Batch 21</option>
                                    <option value="Batch 22">Batch 22</option>
                                    <option value="Batch 23">Batch 23</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-3 mt-4">
                                <button type="button" onclick="window.closeEditRoleModal()" class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                                <button type="submit" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <table class="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                         <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                         <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    users.forEach(user => {
        html += `
             <tr>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-10 h-10">
                            <img class="w-full h-full rounded-full" src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random" alt="" />
                        </div>
                        <div class="ml-3">
                            <p class="text-gray-900 whitespace-no-wrap font-semibold">${user.name}</p>
                            <p class="text-gray-600 whitespace-no-wrap text-xs">${user.email}</p>
                        </div>
                    </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span aria-hidden class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                        <span class="relative capitalize">${user.role.replace('_', ' ')}</span>
                    </span>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p class="text-gray-900 whitespace-no-wrap">${user.department || 'N/A'}</p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p class="text-gray-900 font-bold whitespace-no-wrap">${user.batch || '-'}</p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                     <div class="flex space-x-3">
                        <button onclick="window.openEditRoleModal(${user.id}, '${user.name}', '${user.role}', '${user.department || ''}', '${user.batch || ''}')" class="text-indigo-600 hover:text-indigo-900" title="Edit Role">
                            <ion-icon name="create-outline" class="text-xl"></ion-icon>
                        </button>
                        <button onclick="window.deleteUser(${user.id})" class="text-red-600 hover:text-red-900" title="Delete User">
                            <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                        </button>
                     </div>
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

// Global handlers
window.openEditRoleModal = (id, name, role, department, batch) => {
    document.getElementById('editUserId').value = id;
    document.getElementById('editUserName').innerText = name;
    document.getElementById('editUserRole').value = role;
    document.getElementById('editUserDept').value = department;
    document.getElementById('editUserBatch').value = batch || '';
    document.getElementById('editRoleModal').classList.remove('hidden');
};

window.closeEditRoleModal = () => {
    document.getElementById('editRoleModal').classList.add('hidden');
};

