export const renderUserManagement = (users) => {
    let html = `
    <div class="space-y-8 animate-fadeIn">
        <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden">
            <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="relative z-10">
                <h2 class="text-3xl font-black text-white tracking-tight">Active Personnel</h2>
                <p class="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Manage institutional accounts and clearance</p>
            </div>
            <button onclick="window.showAddUserModal()" class="relative z-10 flex items-center space-x-3 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                <ion-icon name="person-add-outline" class="text-xl"></ion-icon>
                <span>Authorize Account</span>
            </button>
        </div>

        <!-- Add User Modal (Hidden by default) -->
        <div id="addUserModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-8 border-2 border-white/5 w-[28rem] shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900">
                <div class="text-center">
                    <h3 class="text-2xl font-black text-white mb-6 uppercase tracking-widest">Create New Profile</h3>
                    <div class="mt-2 text-left">
                        <form id="addUserForm" class="space-y-4">
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Full Identity</label>
                                <input type="text" name="name" required class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. John Doe">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Institutional Email</label>
                                <input type="email" name="email" required class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 focus:border-indigo-500 transition-all outline-none" placeholder="name@university.edu">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Batch</label>
                                    <select name="batch" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none appearance-none">
                                        <option value="">None</option>
                                        ${[...Array(12)].map((_, i) => `<option value="Batch ${i + 12}">Batch ${i + 12}</option>`).join('')}
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">System Role</label>
                                    <select name="role" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none appearance-none">
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="dept_head">Dept Head</option>
                                        <option value="course_coordinator">Coordinator</option>
                                    </select>
                                </div>
                            </div>
                             <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Access Credentials</label>
                                <input type="password" name="password" required class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 focus:border-indigo-500 transition-all outline-none" placeholder="••••••••">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Department Assigned</label>
                                <select name="department" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none appearance-none">
                                    <option value="ICE">ICE</option>
                                    <option value="CSE">CSE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="BBA">BBA</option>
                                    <option value="LAW">LAW</option>
                                    <option value="English">English</option>
                                </select>
                            </div>
                            <div class="flex justify-end space-x-3 mt-8">
                                <button type="button" onclick="window.closeAddUserModal()" class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                                <button type="submit" class="px-10 py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">Authorize User</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Role Modal -->
        <div id="editRoleModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-8 border-2 border-white/5 w-[28rem] shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900">
                <div class="text-center">
                    <h3 class="text-2xl font-black text-white mb-6 uppercase tracking-widest">Modify Authority</h3>
                    <div class="mt-2 text-left">
                        <form id="editRoleForm" class="space-y-4">
                            <input type="hidden" name="id" id="editUserId">
                            <div class="p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Account</label>
                                <p id="editUserName" class="text-xl font-black text-white"></p>
                            </div>
                            
                            <div class="grid grid-cols-1 gap-4">
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Security Role</label>
                                    <select name="role" id="editUserRole" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none appearance-none">
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="dept_head">Dept Head</option>
                                        <option value="course_coordinator">Coordinator</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Administrative Dept</label>
                                    <select name="department" id="editUserDept" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none appearance-none">
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
                                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Academic Batch</label>
                                    <select name="batch" id="editUserBatch" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 transition-all outline-none appearance-none">
                                        <option value="">None</option>
                                        ${[...Array(12)].map((_, i) => `<option value="Batch ${i + 12}">Batch ${i + 12}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="flex justify-end space-x-3 mt-8">
                                <button type="button" onclick="window.closeEditRoleModal()" class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                                <button type="submit" class="px-10 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Commit Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[2.5rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-white/5">
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Accounts</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance</th>
                         <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                         <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch</th>
                        <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
    `;

    users.forEach(user => {
        html += `
             <tr class="hover:bg-white/5 transition-all group">
                <td class="px-8 py-6 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-12 h-12">
                            <img class="w-full h-full rounded-2xl border-2 border-white/10 group-hover:border-indigo-500 transition-all" src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&bold=true" alt="" />
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-black text-white">${user.name}</p>
                            <p class="text-[10px] text-slate-500 font-bold">${user.email}</p>
                        </div>
                    </div>
                </td>
                <td class="px-8 py-6 whitespace-nowrap">
                    <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                        ${user.role.replace('_', ' ')}
                    </span>
                </td>
                <td class="px-8 py-6 whitespace-nowrap">
                    <p class="text-sm font-bold text-slate-300">${user.department || 'GLOBAL'}</p>
                </td>
                <td class="px-8 py-6 whitespace-nowrap">
                    <p class="text-sm font-black text-amber-500">${user.batch || '-'}</p>
                </td>
                <td class="px-8 py-6 whitespace-nowrap text-right">
                     <div class="flex justify-end space-x-2">
                        <button onclick="window.openEditRoleModal(${user.id}, '${user.name}', '${user.role}', '${user.department || ''}', '${user.batch || ''}')" class="p-2.5 bg-white/5 text-slate-400 rounded-xl hover:bg-indigo-500 hover:text-white transition-all border border-white/5">
                            <ion-icon name="shield-outline" class="text-lg"></ion-icon>
                        </button>
                        <button onclick="window.deleteUser(${user.id})" class="p-2.5 bg-white/5 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-white/5">
                            <ion-icon name="trash-outline" class="text-lg"></ion-icon>
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

