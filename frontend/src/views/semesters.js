export const renderSemestersView = (semesters = []) => {
    let html = `
    <div class="space-y-6">
        <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden group">
            <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="relative z-10">
                <h2 class="text-2xl font-black text-white tracking-tight flex items-center">
                    <ion-icon name="calendar-outline" class="mr-3 text-indigo-400 text-3xl"></ion-icon>
                    Academic Timeline
                </h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3 ml-1">Universal Institute Scheduler Control</p>
            </div>
            <button onclick="window.showAddSemesterModal()" class="relative z-10 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center uppercase tracking-widest text-[10px]">
                <ion-icon name="add-circle-outline" class="mr-2 text-lg"></ion-icon>
                Initialize Semester
            </button>
        </div>

        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[3rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-white/5">
                        <th class="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Designation</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Protocol Status</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Epoch Time</th>
                        <th class="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Operations</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
    `;

    if (semesters.length === 0) {
        html += `
            <tr>
                <td colspan="4" class="px-8 py-24 text-center">
                    <div class="flex flex-col items-center">
                        <ion-icon name="hourglass-outline" class="text-5xl text-slate-700 mb-4"></ion-icon>
                        <p class="text-slate-500 font-black uppercase tracking-widest text-xs italic">Temporal Void: No Semesters Provisioned</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        semesters.forEach(sem => {
            html += `
                <tr class="hover:bg-white/5 transition-all group">
                    <td class="px-8 py-6 whitespace-nowrap font-black text-white text-lg">${sem.name}</td>
                    <td class="px-8 py-6 whitespace-nowrap">
                        <span class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${sem.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}">
                            <span class="w-1.5 h-1.5 rounded-full ${sem.isActive ? 'bg-emerald-500' : 'bg-slate-500'} ${sem.isActive ? 'animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : ''}"></span>
                            <span>${sem.isActive ? 'ACTIVE PROTOCOL' : 'ARCHIVED'}</span>
                        </span>
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap text-sm text-slate-400 font-bold">
                        ${new Date(sem.createdAt).toLocaleDateString()}
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap text-right space-x-3">
                        <div class="flex items-center justify-end space-x-3">
                            ${!sem.isActive ? `
                                <button onclick="window.activateSemester(${sem.id})" class="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 transition-all">Enable</button>
                            ` : ''}
                            <button onclick="window.deleteSemester(${sem.id})" class="p-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all border border-rose-500/20" title="Purge Sequence">
                                <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                            </button>
                        </div>
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
        <div id="addSemesterModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/5 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden">
                <div class="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                
                <div class="p-10 relative z-10 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 rounded-2xl mb-6 border border-indigo-500/20 shadow-xl">
                        <ion-icon name="time-outline" class="text-3xl text-indigo-400"></ion-icon>
                    </div>
                    <h3 class="text-2xl font-black text-white tracking-widest uppercase leading-none mb-2">New Epoch</h3>
                    <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">Establish academic temporal frame</p>

                    <form id="addSemesterForm" class="space-y-6 text-left">
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Semester Designation</label>
                            <input type="text" name="name" required placeholder="e.g. Spring 2025" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-bold">
                        </div>
                        <div class="flex gap-4 pt-4">
                            <button type="button" onclick="window.closeAddSemesterModal()" class="flex-1 bg-white/5 py-4 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Abort</button>
                            <button type="submit" class="flex-1 bg-indigo-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 transition-all">Provision</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `;

    return html;
};
