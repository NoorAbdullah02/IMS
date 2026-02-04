export const renderPoliciesView = (policies) => {
    return `
        <div class="space-y-6 animate-fadeIn">
            <!-- Header Actions -->
            <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden group">
                <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                <div class="relative z-10">
                    <h2 class="text-2xl font-black text-white tracking-tight uppercase tracking-widest leading-none">Governance Protocols</h2>
                    <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Advanced institutional access matrix control.</p>
                </div>
                <button onclick="window.showAddPolicyModal()" class="relative z-10 flex items-center space-x-3 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 group-hover:scale-[1.02]">
                    <ion-icon name="shield-outline" class="text-xl"></ion-icon>
                    <span class="font-black text-[10px] uppercase tracking-widest">Forge New Policy</span>
                </button>
            </div>

            <!-- Policies Table -->
            <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[3rem] shadow-2xl border-2 border-white/5 overflow-hidden">
                <table class="w-full text-left truncate">
                    <thead>
                        <tr class="bg-white/5">
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity Class</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Action Logic</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Target</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Clearance</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${policies.map(p => `
                            <tr class="hover:bg-white/5 transition-all group">
                                <td class="px-8 py-6">
                                    <span class="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                                        ${p.subject}
                                    </span>
                                </td>
                                <td class="px-8 py-6">
                                    <span class="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">${p.action}</span>
                                </td>
                                <td class="px-8 py-6">
                                    <span class="text-[10px] text-slate-500 uppercase font-black tracking-widest">${p.resource}</span>
                                </td>
                                <td class="px-8 py-6">
                                    <span class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${p.allow ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">
                                        <span class="w-1.5 h-1.5 rounded-full ${p.allow ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                        <span>${p.allow ? 'AUTHORIZED' : 'RESTRICTED'}</span>
                                    </span>
                                </td>
                                <td class="px-8 py-6 text-right">
                                    <div class="flex items-center justify-end space-x-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <button onclick="window.editPolicy(${p.id})" class="p-2.5 bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all border border-white/5" title="Modify Logic">
                                            <ion-icon name="finger-print-outline" class="text-xl"></ion-icon>
                                        </button>
                                        <button onclick="window.deletePolicy(${p.id})" class="p-2.5 bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-white/5" title="Purge Record">
                                            <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${policies.length === 0 ? '<div class="py-24 text-center text-slate-600 font-black uppercase tracking-[0.3em] text-sm italic">No Governance Records Exist</div>' : ''}
            </div>
        </div>

        <!-- Governance Configuration Modal -->
        <div id="policyModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.4)] animate-scaleIn overflow-hidden border-2 border-white/5">
                <div class="p-12 relative overflow-hidden">
                    <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    
                    <div class="relative z-10">
                        <div class="flex justify-between items-center mb-10">
                            <div>
                                <h3 id="modalTitle" class="text-2xl font-black text-white tracking-widest uppercase leading-none">Security Architecture</h3>
                                <p class="text-slate-500 text-[10px] font-black uppercase mt-3 tracking-widest">Logic specification protocol</p>
                            </div>
                            <button onclick="window.closePolicyModal()" class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="policyForm" class="space-y-6">
                            <input type="hidden" id="policyId">
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Class</label>
                                    <select id="pSubject" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 transition-all outline-none appearance-none font-bold italic" required>
                                        <option value="teacher">Teacher Corps</option>
                                        <option value="student">Student Body</option>
                                        <option value="dept_head">Directorate</option>
                                        <option value="course_coordinator">Operations</option>
                                        <option value="super_admin">Central Core</option>
                                    </select>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Protocol</label>
                                    <select id="pAllow" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 transition-all outline-none appearance-none font-bold" required>
                                        <option value="true">AUTHORIZE</option>
                                        <option value="false">RESTRICT</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Operation Key</label>
                                    <input type="text" id="pAction" placeholder="e.g. upload_log" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-bold" required>
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Resource</label>
                                    <input type="text" id="pResource" placeholder="e.g. system_stats" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-bold" required>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block flex justify-between">
                                    <span>Logic Conditions (JSON Oracle)</span>
                                </label>
                                <textarea id="pConditions" rows="3" placeholder='{"rules": [{"field": "status", "op": "verified"}]}' class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-mono text-xs leading-relaxed"></textarea>
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Rationale</label>
                                <input type="text" id="pDescription" placeholder="Brief explanation of policy intent" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-medium">
                            </div>

                            <div class="pt-6">
                                <button type="submit" class="w-full bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 hover:scale-[1.02] uppercase tracking-[0.2em] text-xs">
                                    Commit Security Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};
