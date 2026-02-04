export const renderTreasurerDashboard = (data) => {
    const { summary, deptStats } = data;
    return `
        <div class="space-y-8 animate-fadeIn">
            <!-- Summary Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-emerald-500/30 hover:border-emerald-500 transition-all">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
                            <ion-icon name="wallet-outline" class="text-2xl text-white"></ion-icon>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Collection</span>
                    </div>
                    <h2 class="text-4xl font-black text-white tracking-tight">${summary.totalCollected.toLocaleString()} <span class="text-lg text-slate-400">BDT</span></h2>
                </div>

                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-amber-500/30 hover:border-amber-500 transition-all">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/50">
                            <ion-icon name="time-outline" class="text-2xl text-white"></ion-icon>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pending Approvals</span>
                    </div>
                    <h2 class="text-4xl font-black text-white tracking-tight">${summary.pendingCount} <span class="text-lg text-slate-400">Claims</span></h2>
                </div>

                <div class="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/30 border-2 border-indigo-400/30">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center">
                            <ion-icon name="stats-chart-outline" class="text-2xl"></ion-icon>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">System Liquidity</span>
                    </div>
                    <h2 class="text-4xl font-black text-white tracking-tight">Prime <span class="text-lg opacity-60">Status</span></h2>
                </div>
            </div>

            <!-- Dept Matrix -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[3rem] shadow-2xl border-2 border-white/5">
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h3 class="text-2xl font-black text-white">Faculty Revenue Matrix</h3>
                            <p class="text-slate-400 font-medium">Semester-wise departmental breakdown.</p>
                        </div>
                        <button onclick="handleNavigation('managePayments')" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2 shadow-lg shadow-indigo-500/30">
                            <span>Inspect All</span>
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                        </button>
                    </div>

                    <div class="space-y-4">
                        ${deptStats.map(dept => `
                            <div class="flex items-center justify-between p-6 bg-slate-700/30 rounded-[2rem] hover:bg-slate-700/50 border border-white/5 hover:border-indigo-500/30 transition-all">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/30">
                                        ${dept.department}
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-white">${dept.department} Division</h4>
                                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${dept.count} Verified Payments</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="block font-black text-emerald-400 text-lg">${parseInt(dept.collected).toLocaleString()} BDT</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[3rem] border-2 border-purple-500/30 text-white space-y-8 flex flex-col justify-between shadow-2xl">
                    <div>
                        <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50">
                            <ion-icon name="lock-open-outline" class="text-3xl"></ion-icon>
                        </div>
                        <h3 class="text-3xl font-black leading-tight">Financial<br>Enforcement</h3>
                        <p class="text-slate-300 font-medium mt-4 text-sm leading-relaxed">System logic strictly enforces payment before course registration. No manual override without Treasure authorization.</p>
                    </div>
                    <button onclick="handleNavigation('managePayments', { status: 'pending' })" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-purple-500/30 hover:scale-105 transition-all text-center">
                        Verify Pending Claims
                    </button>
                </div>
            </div>
        </div>
    `;
};

export const renderPaymentsList = (payments) => {
    return `
        <div class="space-y-8 animate-fadeIn">
            <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-indigo-500/30">
                <div>
                    <h2 class="text-3xl font-black text-white tracking-tight">Payment Ledger</h2>
                    <p class="text-slate-300 font-medium tracking-tight">Verify student financial claims against institutional records.</p>
                </div>
                <div class="flex space-x-3">
                    <select id="paymentStatusFilter" class="px-5 py-3 bg-slate-700/50 border-2 border-slate-600/50 focus:border-indigo-500 rounded-2xl font-bold text-white outline-none transition-all">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-2 border-white/5">
                <table class="w-full text-left truncate">
                    <thead>
                        <tr class="bg-slate-700/30 border-b border-slate-600/50">
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Identity</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Details</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-700/50">
                        ${payments.map(p => `
                            <tr class="hover:bg-slate-700/30 transition-colors">
                                <td class="px-8 py-6">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-500/30">
                                            ${p.department}
                                        </div>
                                        <div>
                                            <h4 class="font-black text-white">${p.studentName}</h4>
                                            <p class="text-[10px] font-bold text-slate-400 tracking-widest">${p.studentId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <div>
                                        <span class="block font-black text-white">${p.amount.toLocaleString()} BDT</span>
                                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">${p.method} • ${p.transactionId}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                                        ${p.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : p.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}">
                                        ${p.status}
                                    </span>
                                </td>
                                <td class="px-8 py-6 text-right">
                                    ${p.status === 'pending' ? `
                                        <div class="flex justify-end space-x-2">
                                            <button onclick="window.processPayment(${p.id}, 'verified')" class="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/30">
                                                <ion-icon name="checkmark-outline" class="text-xl"></ion-icon>
                                            </button>
                                            <button onclick="window.processPayment(${p.id}, 'rejected')" class="p-2.5 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-400 hover:to-rose-500 transition-all shadow-lg shadow-rose-500/30">
                                                <ion-icon name="close-outline" class="text-xl"></ion-icon>
                                            </button>
                                        </div>
                                    ` : `
                                        <span class="text-slate-500 font-bold text-xs italic">Closed</span>
                                    `}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${payments.length === 0 ? '<div class="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No payment records found</div>' : ''}
            </div>
        </div>
    `;
};
