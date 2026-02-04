export const renderStudentFinance = (data) => {
    const { feeStructure, currentSemester, registration, payments } = data;
    const isPaid = registration?.isPaid;
    const isRegistered = registration?.isRegistered;

    return `
        <div class="space-y-8 animate-fadeIn">
            <!-- Alert Banner -->
            ${!isPaid ? `
                <div class="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem] flex items-center justify-between mb-8 shadow-sm">
                    <div class="flex items-center space-x-6">
                        <div class="w-16 h-16 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-rose-200">
                            <ion-icon name="alert-circle-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-rose-900 tracking-tight">Institutional Alert: Payment Required</h3>
                            <p class="text-rose-600 font-medium">Your course registration is currently locked. Please settle the Spring 2025 dues.</p>
                        </div>
                    </div>
                </div>
            ` : isRegistered ? `
                <div class="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center justify-between mb-8 shadow-sm">
                    <div class="flex items-center space-x-6">
                        <div class="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-200">
                            <ion-icon name="shield-checkmark-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-emerald-900 tracking-tight">Academic Access Unlocked</h3>
                            <p class="text-emerald-600 font-medium">Your financial status is verified and registration is complete.</p>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] flex items-center justify-between mb-8 shadow-sm">
                    <div class="flex items-center space-x-6">
                        <div class="w-16 h-16 bg-indigo-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-200">
                            <ion-icon name="checkmark-done-circle-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-indigo-900 tracking-tight">Fee Settlement Verified</h3>
                            <p class="text-indigo-600 font-medium">Payment confirmed. You may now proceed to final course registration.</p>
                        </div>
                        <button onclick="window.confirmAcademicRegistration(${currentSemester.id})" class="ml-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl">
                            Register Now
                        </button>
                    </div>
                </div>
            `}

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Fee Breakdown -->
                <div class="lg:col-span-1 space-y-6">
                    <div class="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Financial Matrix</h4>
                        <div class="space-y-6">
                            <div>
                                <span class="text-xs font-bold text-slate-400 block mb-1">Total Program Fee</span>
                                <span class="text-3xl font-black text-slate-800">${feeStructure.totalProgramFee.toLocaleString()} <span class="text-sm font-medium">BDT</span></span>
                            </div>
                            <div class="pt-6 border-t border-slate-50">
                                <span class="text-xs font-bold text-slate-400 block mb-1">Academic Semester Share (1/8)</span>
                                <span class="text-2xl font-black text-indigo-600">${feeStructure.perSemesterFee.toLocaleString()} <span class="text-xs font-medium">BDT / Sem</span></span>
                            </div>
                        </div>
                    </div>

                    ${!isPaid ? `
                        <div class="bg-slate-900 p-8 rounded-[3rem] text-white">
                            <div class="flex items-center justify-between mb-6">
                                <span class="text-[10px] font-black uppercase tracking-widest text-indigo-300">Payment Window</span>
                                <span class="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase">Active</span>
                            </div>
                            <div class="space-y-1">
                                <span class="text-3xl font-black tracking-tighter">Spring 2025</span>
                                <p class="text-slate-400 text-xs font-medium">Deadline: ${new Date(currentSemester.paymentDeadline).toLocaleDateString()}</p>
                            </div>
                            <button onclick="window.showPaymentModal()" class="w-full mt-8 bg-white text-slate-900 py-4 rounded-2xl font-black hover:scale-105 transition-all text-center">
                                Initialize Payment
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- Payment History -->
                <div class="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Transaction Archive</h4>
                    <div class="space-y-4">
                        ${payments.map(p => `
                            <div class="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 font-bold border border-slate-100">
                                        <ion-icon name="${p.method === 'Bank' ? 'business-outline' : 'phone-portrait-outline'}" class="text-xl"></ion-icon>
                                    </div>
                                    <div>
                                        <h5 class="font-black text-slate-800">${p.method} Transfer</h5>
                                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${p.transactionId}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="block font-black text-slate-700">${p.amount.toLocaleString()} BDT</span>
                                    <span class="text-[10px] font-black uppercase tracking-widest ${p.status === 'verified' ? 'text-emerald-500' : p.status === 'pending' ? 'text-amber-500' : 'text-rose-500'}">
                                        ${p.status}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                        ${payments.length === 0 ? '<div class="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No transactions available</div>' : ''}
                    </div>
                </div>
            </div>

            <!-- Payment Modal -->
            <div id="paymentModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl animate-scaleIn overflow-hidden">
                    <div class="p-10">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="text-3xl font-black text-slate-800 tracking-tight">Institutional Payment</h3>
                            <button onclick="window.closePaymentModal()" class="text-slate-400 hover:text-slate-600">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="studentPaymentForm" class="space-y-6">
                            <input type="hidden" name="semesterId" value="${currentSemester.id}">
                            <input type="hidden" name="amount" value="${feeStructure.perSemesterFee}">

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Payment Channel</label>
                                <div class="grid grid-cols-3 gap-3">
                                    <label class="cursor-pointer">
                                        <input type="radio" name="method" value="bKash" class="hidden peer" required>
                                        <div class="py-4 border-2 border-slate-50 bg-slate-50/50 rounded-2xl flex flex-col items-center peer-checked:border-pink-500 peer-checked:bg-pink-50 transition-all">
                                            <span class="font-black text-xs text-slate-600 peer-checked:text-pink-600">bKash</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="method" value="Nagad" class="hidden peer">
                                        <div class="py-4 border-2 border-slate-50 bg-slate-50/50 rounded-2xl flex flex-col items-center peer-checked:border-orange-500 peer-checked:bg-orange-50 transition-all">
                                            <span class="font-black text-xs text-slate-600 peer-checked:text-orange-600">Nagad</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="method" value="Bank" class="hidden peer">
                                        <div class="py-4 border-2 border-slate-50 bg-slate-50/50 rounded-2xl flex flex-col items-center peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition-all">
                                            <span class="font-black text-xs text-slate-600 peer-checked:text-indigo-600">Bank</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Transaction Identity (TRX ID)</label>
                                <input type="text" name="transactionId" required class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-800">
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Payment Proof (Screenshot/Voucher)</label>
                                <div class="relative group cursor-pointer">
                                    <input type="file" name="proof" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                                    <div class="w-full py-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-all">
                                        <ion-icon name="cloud-upload-outline" class="text-3xl text-slate-300 group-hover:text-indigo-500 mb-2"></ion-icon>
                                        <p class="text-xs font-bold text-slate-400">Click to upload audit file</p>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-4">
                                <button type="submit" class="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all">
                                    Finalize Settlement (${feeStructure.perSemesterFee.toLocaleString()} BDT)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};
