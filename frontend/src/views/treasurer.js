export const renderTreasurerDashboard = (data) => {
    const { summary, deptStats } = data;
    return `
        <div class="space-y-8 animate-fadeIn">
            <!-- Summary Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <ion-icon name="wallet-outline" class="text-2xl"></ion-icon>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Collection</span>
                    </div>
                    <h2 class="text-4xl font-black text-slate-800 tracking-tight">${summary.totalCollected.toLocaleString()} <span class="text-lg text-slate-400">BDT</span></h2>
                </div>

                <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                            <ion-icon name="time-outline" class="text-2xl"></ion-icon>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pending Approvals</span>
                    </div>
                    <h2 class="text-4xl font-black text-slate-800 tracking-tight">${summary.pendingCount} <span class="text-lg text-slate-400">Claims</span></h2>
                </div>

                <div class="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200">
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
                <div class="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h3 class="text-2xl font-black text-slate-800">Faculty Revenue Matrix</h3>
                            <p class="text-slate-500 font-medium">Semester-wise departmental breakdown.</p>
                        </div>
                        <button onclick="handleNavigation('managePayments')" class="bg-slate-50 hover:bg-slate-100 text-slate-700 px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2">
                            <span>Inspect All</span>
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                        </button>
                    </div>

                    <div class="space-y-4">
                        ${deptStats.map(dept => `
                            <div class="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-md transition-all">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 border border-slate-100">
                                        ${dept.department}
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-slate-800">${dept.department} Division</h4>
                                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${dept.count} Verified Payments</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="block font-black text-emerald-600 text-lg">${parseInt(dept.collected).toLocaleString()} BDT</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-slate-900 p-8 rounded-[3rem] text-white space-y-8 flex flex-col justify-between">
                    <div>
                        <div class="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                            <ion-icon name="lock-open-outline" class="text-3xl"></ion-icon>
                        </div>
                        <h3 class="text-3xl font-black leading-tight">Financial<br>Enforcement</h3>
                        <p class="text-slate-400 font-medium mt-4 text-sm leading-relaxed">System logic strictly enforces payment before course registration. No manual override without Treasure authorization.</p>
                    </div>
                    <button onclick="handleNavigation('managePayments', { status: 'pending' })" class="w-full bg-white text-slate-900 py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all text-center">
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
            <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h2 class="text-3xl font-black text-slate-800 tracking-tight">Payment Ledger</h2>
                    <p class="text-slate-500 font-medium tracking-tight">Verify student financial claims against institutional records.</p>
                </div>
                <div class="flex space-x-3">
                    <select id="paymentStatusFilter" class="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 outline-none">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div class="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
                <table class="w-full text-left truncate">
                    <thead>
                        <tr class="bg-slate-50/50 border-b border-slate-100">
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Identity</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Details</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        ${payments.map(p => `
                            <tr class="hover:bg-slate-50/30 transition-colors">
                                <td class="px-8 py-6">
                                    <div class="flex items-center space-x-4">
                                        <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                            ${p.department}
                                        </div>
                                        <div>
                                            <h4 class="font-black text-slate-800">${p.studentName}</h4>
                                            <p class="text-[10px] font-bold text-slate-400 tracking-widest">${p.studentId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <div>
                                        <span class="block font-black text-slate-700">${p.amount.toLocaleString()} BDT</span>
                                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">${p.method} • ${p.transactionId}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                                        ${p.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : p.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}">
                                        ${p.status}
                                    </span>
                                </td>
                                <td class="px-8 py-6 text-right">
                                    ${p.status === 'pending' ? `
                                        <div class="flex justify-end space-x-2">
                                            <button onclick="window.processPayment(${p.id}, 'verified')" class="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors">
                                                <ion-icon name="checkmark-outline" class="text-xl"></ion-icon>
                                            </button>
                                            <button onclick="window.processPayment(${p.id}, 'rejected')" class="p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors">
                                                <ion-icon name="close-outline" class="text-xl"></ion-icon>
                                            </button>
                                        </div>
                                    ` : `
                                        <span class="text-slate-300 font-bold text-xs italic">Closed</span>
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
