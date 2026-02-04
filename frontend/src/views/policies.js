export const renderPoliciesView = (policies) => {
    return `
        <div class="space-y-6 animate-fadeIn">
            <!-- Header Actions -->
            <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 class="text-xl font-bold text-gray-800">Governance Policies</h2>
                    <p class="text-sm text-gray-500 mt-1">Manage dynamic access control rules and institutional logic.</p>
                </div>
                <button onclick="window.showAddPolicyModal()" class="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-indigo-200">
                    <ion-icon name="add-outline" class="text-lg"></ion-icon>
                    <span class="font-semibold text-sm">Create Policy</span>
                </button>
            </div>

            <!-- Policies Table -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Target</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Conditions</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Access</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        ${policies.map(p => `
                            <tr class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4">
                                    <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase">
                                        ${p.subject}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span class="text-sm font-bold text-gray-800">${p.action}</span>
                                        <span class="text-[10px] text-gray-400 uppercase font-medium tracking-tight">${p.resource}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="max-w-xs truncate text-xs text-gray-600 font-mono bg-gray-50 p-1.5 rounded-md border border-gray-100">
                                        ${p.conditions ? p.conditions : '<span class="italic text-gray-400">No conditions (Always)</span>'}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${p.allow ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}">
                                        <span class="w-1.5 h-1.5 rounded-full ${p.allow ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse"></span>
                                        <span>${p.allow ? 'ALLOWED' : 'DENIED'}</span>
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center space-x-2">
                                        <button onclick="window.editPolicy(${p.id})" class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit Policy">
                                            <ion-icon name="create-outline" class="text-lg"></ion-icon>
                                        </button>
                                        <button onclick="window.deletePolicy(${p.id})" class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete Policy">
                                            <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal Structure (Hidden by default) -->
        <div id="policyModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scaleIn overflow-hidden border border-white/20">
                <div class="p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h3 id="modalTitle" class="text-2xl font-bold text-gray-800 tracking-tight">Create Governance Policy</h3>
                        <button onclick="window.closePolicyModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <ion-icon name="close" class="text-2xl"></ion-icon>
                        </button>
                    </div>
                    
                    <form id="policyForm" class="space-y-5">
                        <input type="hidden" id="policyId">
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-gray-500 uppercase ml-1">Subject (Role)</label>
                                <select id="pSubject" class="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-gray-50/50" required>
                                    <option value="teacher">Teacher</option>
                                    <option value="student">Student</option>
                                    <option value="dept_head">Dept Head</option>
                                    <option value="course_coordinator">Coordinator</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-gray-500 uppercase ml-1">Access Type</label>
                                <select id="pAllow" class="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-gray-50/50" required>
                                    <option value="true">ALLOW</option>
                                    <option value="false">DENY</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-gray-500 uppercase ml-1">Action</label>
                                <input type="text" id="pAction" placeholder="e.g. upload_result" class="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-gray-50/50" required>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-gray-500 uppercase ml-1">Resource</label>
                                <input type="text" id="pResource" placeholder="e.g. result" class="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-gray-50/50" required>
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-500 uppercase ml-1 block flex justify-between">
                                <span>Conditions (JSON Logic)</span>
                                <span class="text-[10px] text-indigo-500 lowercase font-normal italic">Leave empty for universal access</span>
                            </label>
                            <textarea id="pConditions" rows="4" placeholder='{"allOf": [{"field": "context.isAssigned", "op": "eq", "value": true}]}' class="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-gray-50/50 font-mono text-sm"></textarea>
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                            <input type="text" id="pDescription" placeholder="Explain the purpose of this policy" class="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-gray-50/50">
                        </div>

                        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-200 mt-2">
                            Save Governance Policy
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
};
