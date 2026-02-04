export const renderSystemLogs = (logs) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-2xl font-black text-white flex items-center">
            <ion-icon name="hardware-chip-outline" class="mr-3 text-indigo-400"></ion-icon>
            System Operation Archive
        </h2>

        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[2.5rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-white/5">
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Stamp</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin User</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Action</th>
                        <th class="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Details</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
    `;

    const getLogItemHtml = (log) => `
        <tr class="hover:bg-white/5 transition-all group">
            <td class="px-8 py-6 whitespace-nowrap text-sm text-slate-400 font-bold group-hover:text-indigo-300 transition-colors uppercase tracking-tight">${new Date(log.time).toLocaleString()}</td>
            <td class="px-8 py-6 whitespace-nowrap text-sm font-black text-white">${log.user}</td>
            <td class="px-8 py-6 whitespace-nowrap">
                <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-500/20 transition-all">${log.action}</span>
            </td>
            <td class="px-8 py-6 text-sm text-slate-300 font-medium leading-relaxed">${log.details}</td>
        </tr>
    `;

    if (!logs || logs.length === 0) {
        // Sample data since we don't have a real logs table yet
        const sampleLogs = [
            { id: 1, time: new Date().toISOString(), user: 'admin@bauet.edu', action: 'LOGIN', details: 'Successful session establishment from verified terminal' },
            { id: 2, time: new Date(Date.now() - 3600000).toISOString(), user: 'admin@bauet.edu', action: 'USER_PROVISION', details: 'Provisioned new faculty account: ice.head@bauet.edu' },
            { id: 3, time: new Date(Date.now() - 7200000).toISOString(), user: 'ice.head@bauet.edu', action: 'ISSUE_ADMIT_CARDS', details: 'Authorized examination credentials for Level 3 Semester 2' }
        ];

        sampleLogs.forEach(log => {
            html += getLogItemHtml(log);
        });
    } else {
        logs.forEach(log => {
            html += getLogItemHtml(log);
        });
    }

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    return html;
};
