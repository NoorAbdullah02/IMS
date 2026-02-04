export const renderDepartmentsView = (stats) => {
    let html = `
    <div class="space-y-8 animate-fadeIn">
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden mb-8">
            <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="relative z-10">
                <h2 class="text-3xl font-black text-white tracking-tight">Institutional Divisions</h2>
                <p class="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Global Sector Oversight Matrix</p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${stats.map(dept => `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 shadow-2xl border-2 border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                    
                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-8">
                            <div>
                                <h3 class="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight">${dept.name} Sector</h3>
                                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Registry: ${dept.head}</p>
                            </div>
                            <div class="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg group-hover:bg-indigo-500/20 transition-all">
                                <ion-icon name="business-outline" class="text-2xl"></ion-icon>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-indigo-500/20 transition-all">
                                <span class="block text-2xl font-black text-indigo-400 leading-none">${dept.studentCount}</span>
                                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2 block">Student Corps</span>
                            </div>
                            <div class="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-emerald-500/20 transition-all">
                                <span class="block text-2xl font-black text-emerald-400 leading-none">${dept.teacherCount}</span>
                                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2 block">Faculty Staff</span>
                            </div>
                        </div>
                        
                        <div class="mt-8 pt-6 border-t border-white/5 flex justify-end">
                            <button onclick="window.handleNavigation('viewDeptDetails', '${dept.name}')" class="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center group/btn transition-all">
                                Access Division Console 
                                <ion-icon name="chevron-forward-outline" class="ml-2 text-lg group-hover/btn:translate-x-1 transition-transform"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    return html;
};
