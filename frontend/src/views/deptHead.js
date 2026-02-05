export const renderDeptHeadUsers = (users) => {
    let html = `
    <div class="space-y-8 animate-fadeIn">
        <div class="flex justify-between items-end bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden mb-8">
            <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="relative z-10">
                <h2 class="text-3xl font-black text-white tracking-tight">Departmental Assets</h2>
                <p class="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Oversee faculty and student registry</p>
            </div>
            <div class="relative group z-10">
                <input type="text" placeholder="Search ID / Email..." 
                    class="pl-12 pr-6 py-4 bg-slate-900/50 border-2 border-white/10 rounded-2xl text-white placeholder-slate-500 focus:border-indigo-500 transition-all outline-none w-64 focus:w-80 font-bold text-[10px] uppercase tracking-widest"
                    onkeydown="if(event.key === 'Enter') window.handleStudentSearch(this.value)">
                <ion-icon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl group-focus-within:text-indigo-500 transition-colors"></ion-icon>
            </div>
        </div>
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[2rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-white/5">
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                         <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                         <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Connectivity</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
    `;

    users.forEach(user => {
        html += `
            <tr class="hover:bg-white/5 transition-colors group">
                <td class="px-8 py-6 whitespace-nowrap text-sm">
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
                        ${user.role}
                    </span>
                 </td>
                 <td class="px-8 py-6 whitespace-nowrap">
                    <p class="text-sm font-bold text-white">${user.phone || 'NO SECURE LINE'}</p>
                 </td>
            </tr>
        `;
    });

    html += `</tbody></table></div></div>`;
    return html;
};

export const renderAdmitCardManager = (cards, currentSemester = '') => {
    let html = `
    <div class="space-y-8 animate-fadeIn">
        <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden mb-8">
            <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="relative z-10">
                <h2 class="text-3xl font-black text-white tracking-tight">Digital Credentials</h2>
                <p class="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Issue and verify student examination hall tickets for ${currentSemester || 'Active Semester'}</p>
            </div>
            <button onclick="window.showGenerateCardModal()" class="relative z-10 flex items-center space-x-3 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                <ion-icon name="sparkles-outline" class="text-xl"></ion-icon>
                <span>Generate Protocol</span>
            </button>
        </div>

        <!-- Generate Admit Card Modal -->
        <div id="generateCardModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-8 border-2 border-white/5 w-[28rem] shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 transform transition-all duration-300 scale-95 opacity-0 modal-content">
                <div class="space-y-6">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-3xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <ion-icon name="finger-print-outline" class="text-4xl"></ion-icon>
                        </div>
                        <h3 class="text-2xl font-black text-white uppercase tracking-widest">Issue Credentials</h3>
                        <p class="text-slate-500 mt-2 text-xs font-bold uppercase tracking-widest">Exam authorization sequence</p>
                    </div>

                    <form id="generateCardForm" class="space-y-6 text-left">
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Board Designation</label>
                            <input type="text" name="examName" required placeholder="e.g. Final Examination" 
                                class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:border-indigo-500 transition-all outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Target Semester</label>
                            <input type="text" name="semester" required value="${currentSemester}" placeholder="e.g. Spring 2025" 
                                class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:border-indigo-500 transition-all outline-none">
                        </div>
                        
                        <div class="flex items-center p-5 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                            <ion-icon name="shield-checkmark-outline" class="text-amber-400 text-3xl mr-4 flex-shrink-0"></ion-icon>
                            <p class="text-xs text-amber-200/70 leading-relaxed font-bold">
                                WARNING: This operation will batch-render hall tickets for all qualified department members.
                            </p>
                        </div>

                        <div class="flex gap-4 pt-4">
                            <button type="button" onclick="window.hideGenerateCardModal()" 
                                class="flex-1 px-6 py-4 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">
                                Abort
                            </button>
                            <button type="submit" 
                                class="flex-1 px-6 py-4 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 transition-all">
                                Execute Sequence
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[2.5rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <ul class="divide-y divide-white/5">
                ${cards.length === 0 ? `
                    <li class="px-8 py-16 text-center">
                        <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-white/10">
                            <ion-icon name="document-text-outline" class="text-4xl text-slate-600"></ion-icon>
                        </div>
                        <p class="text-white font-black text-xl mb-2">No credentials found.</p>
                        <p class="text-slate-500 text-sm font-bold uppercase tracking-widest">Run the generation script to populate this list.</p>
                    </li>
                ` : cards.map(card => `
                    <li class="px-8 py-6 hover:bg-white/5 transition-all group">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-6">
                                <div class="w-14 h-14 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl font-black">
                                    ${card.studentName.charAt(0)}
                                </div>
                                <div>
                                    <p class="text-lg font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">${card.studentName}</p>
                                    <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">${card.examName}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                    ${card.status}
                                </span>
                                <p class="mt-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">${card.semester}</p>
                            </div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div></div>`;
    return html;
};

// Modal helpers
window.showGenerateCardModal = () => {
    const modal = document.getElementById('generateCardModal');
    const content = modal.querySelector('.modal-content');
    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
};

window.hideGenerateCardModal = () => {
    const modal = document.getElementById('generateCardModal');
    const content = modal.querySelector('.modal-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};
