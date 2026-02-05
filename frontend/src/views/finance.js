export const renderStudentFinance = (data) => {
    const { feeStructure, currentSemester, registration, payments, paymentProgress } = data;
    const isPaid = paymentProgress?.isFullyPaid || false;
    const isRegistered = registration?.isRegistered;
    const hasMinimumPayment = paymentProgress?.hasMinimumPayment || false;
    const paymentPercentage = paymentProgress?.paymentPercentage || 0;
    const totalPending = paymentProgress?.totalPending || 0;
    const advancePayment = paymentProgress?.advancePayment || 0;
    const remainingBalance = paymentProgress?.remainingBalance || feeStructure.perSemesterFee;

    return `
        <div class="space-y-8 animate-fadeIn">
            <!-- Payment Progress Bar -->
            ${paymentPercentage > 0 || totalPending > 0 || advancePayment > 0 ? `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-black text-white">Payment Progress</h3>
                        <div class="flex items-center space-x-4">
                            ${advancePayment > 0 ? '<span class="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Advance Credit Active</span>' : ''}
                            <span class="text-2xl font-black ${paymentPercentage >= 100 ? 'text-emerald-400' : paymentPercentage >= 30 ? 'text-indigo-400' : 'text-amber-400'}">${paymentPercentage}%</span>
                        </div>
                    </div>
                    <div class="w-full h-4 bg-slate-700/50 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r ${paymentPercentage >= 100 ? 'from-emerald-500 to-emerald-600' : 'from-indigo-500 to-purple-600'} transition-all duration-1000" style="width: ${Math.min(paymentPercentage, 100)}%"></div>
                    </div>
                    <div class="grid grid-cols-${advancePayment > 0 ? '4' : '3'} gap-4 mt-4">
                        <div class="text-center">
                            <div class="text-xs font-bold text-emerald-400 mb-1 flex items-center justify-center">
                                <ion-icon name="checkmark-circle" class="mr-1"></ion-icon>
                                Verified
                            </div>
                            <div class="text-lg font-black text-white">${paymentProgress.totalPaid.toLocaleString()} BDT</div>
                        </div>
                        ${totalPending > 0 ? `
                            <div class="text-center border-x border-white/10">
                                <div class="text-xs font-bold text-amber-400 mb-1 flex items-center justify-center">
                                    <ion-icon name="time" class="mr-1"></ion-icon>
                                    Under Review
                                </div>
                                <div class="text-lg font-black text-amber-400">${totalPending.toLocaleString()} BDT</div>
                            </div>
                        ` : `
                            <div class="text-center border-x border-white/10">
                                <div class="text-xs font-bold text-slate-500 mb-1">Pending</div>
                                <div class="text-lg font-black text-slate-600">0 BDT</div>
                            </div>
                        `}
                        <div class="text-center">
                            <div class="text-xs font-bold text-slate-400 mb-1">Remaining</div>
                            <div class="text-lg font-black text-white">${remainingBalance.toLocaleString()} BDT</div>
                        </div>
                        ${advancePayment > 0 ? `
                            <div class="text-center border-l border-white/10">
                                <div class="text-xs font-bold text-indigo-400 mb-1 flex items-center justify-center">
                                    <ion-icon name="trending-up" class="mr-1"></ion-icon>
                                    Next Sem Credit
                                </div>
                                <div class="text-lg font-black text-indigo-400">+${advancePayment.toLocaleString()} BDT</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}

            <!-- Alert Banner -->
            ${!hasMinimumPayment ? `
                <div class="bg-gradient-to-br from-rose-900/40 to-slate-900 border-2 border-rose-500/20 p-8 rounded-[2.5rem] flex items-center justify-between mb-8 shadow-2xl relative overflow-hidden group">
                    <div class="absolute -right-20 -top-20 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-all"></div>
                    <div class="flex items-center space-x-6 relative z-10">
                        <div class="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 flex items-center justify-center shadow-xl">
                            <ion-icon name="alert-circle-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-white tracking-tight">Payment Required: Minimum 30%</h3>
                            <p class="text-slate-400 font-medium">Pay at least ${feeStructure.installments.first.toLocaleString()} BDT to unlock academic features.</p>
                        </div>
                    </div>
                </div>
            ` : !isPaid ? `
                <div class="bg-gradient-to-br from-indigo-900/40 to-slate-900 border-2 border-indigo-500/20 p-8 rounded-[2.5rem] flex items-center justify-between mb-8 shadow-2xl relative overflow-hidden group">
                     <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>
                     <div class="flex items-center space-x-6 relative z-10">
                        <div class="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 flex items-center justify-center shadow-xl">
                            <ion-icon name="checkmark-done-circle-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-white tracking-tight">Academic Access Unlocked!</h3>
                            <p class="text-slate-400 font-medium">You've paid ${paymentPercentage}%. Complete remaining ${remainingBalance.toLocaleString()} BDT in installments.</p>
                        </div>
                        ${!isRegistered ? `
                            <button onclick="window.confirmAcademicRegistration(${currentSemester.id})" class="ml-auto bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-[10px]">
                                Confirm Registration
                            </button>
                        ` : ''}
                    </div>
                </div>
            ` : `
                <div class="bg-gradient-to-br from-emerald-900/40 to-slate-900 border-2 border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center justify-between mb-8 shadow-2xl relative overflow-hidden group">
                    <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                    <div class="flex items-center space-x-6 relative z-10">
                        <div class="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 flex items-center justify-center shadow-xl">
                            <ion-icon name="shield-checkmark-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-white tracking-tight">Fully Paid - Excellent!</h3>
                            <p class="text-slate-400 font-medium">All semester fees cleared. Your account is in perfect standing.</p>
                        </div>
                    </div>
                </div>
            `}

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Fee Breakdown -->
                <div class="lg:col-span-1 space-y-6">
                    <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[3rem] shadow-2xl border-2 border-white/5 relative overflow-hidden">
                        <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                        <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 relative z-10">Financial Matrix</h4>
                        <div class="space-y-8 relative z-10">
                            <div>
                                <span class="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Total Program Value</span>
                                <span class="text-3xl font-black text-white">${feeStructure.totalProgramFee.toLocaleString()} <span class="text-xs font-bold text-slate-500 ml-1">BDT</span></span>
                            </div>
                            <div class="pt-8 border-t border-white/5">
                                <span class="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Semester Fee</span>
                                <span class="text-2xl font-black text-indigo-400">${feeStructure.perSemesterFee.toLocaleString()} <span class="text-[10px] font-bold text-slate-500 ml-1">BDT</span></span>
                            </div>
                            <div class="pt-6 border-t border-white/5">
                                <span class="text-[10px] font-black text-emerald-400 block mb-4 uppercase tracking-widest">Flexible Installments</span>
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-bold text-slate-400">1st (30%) - Unlocks Access</span>
                                        <span class="text-sm font-black text-white">${feeStructure.installments.first.toLocaleString()} BDT</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-bold text-slate-400">2nd (30%)</span>
                                        <span class="text-sm font-black text-white">${feeStructure.installments.second.toLocaleString()} BDT</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-bold text-slate-400">3rd (40%)</span>
                                        <span class="text-sm font-black text-white">${feeStructure.installments.third.toLocaleString()} BDT</span>
                                    </div>
                                </div>
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
                            <button onclick="window.showPaymentModal()" class="w-full mt-8 bg-indigo-500 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 hover:scale-105 transition-all text-center shadow-lg shadow-indigo-500/20 uppercase tracking-widest text-[10px]">
                                Initialize Payment
                            </button>
                        </div>
                    ` : ''}
                </div>

                <div class="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 rounded-[3rem] shadow-2xl border-2 border-white/5 relative overflow-hidden">
                    <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]"></div>
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-10 relative z-10">Transaction Ledger</h4>
                    <div class="space-y-5 relative z-10">
                        ${payments.map(p => `
                            <div class="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                                <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 transition-all"></div>
                                <div class="flex items-center space-x-6 relative z-10">
                                    <div class="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 font-bold border border-white/10 group-hover:border-indigo-500/50 transition-all">
                                        <ion-icon name="${p.method === 'Bank' ? 'business-outline' : 'phone-portrait-outline'}" class="text-2xl group-hover:text-indigo-400 transition-colors"></ion-icon>
                                    </div>
                                    <div>
                                        <h5 class="font-black text-white group-hover:text-indigo-400 transition-colors text-lg">${p.method} Transfer</h5>
                                        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">${p.transactionId}</p>
                                    </div>
                                </div>
                                <div class="text-right relative z-10">
                                    <span class="block font-black text-white text-lg">${p.amount.toLocaleString()} <span class="text-[10px] text-slate-500">BDT</span></span>
                                    <span class="mt-2 inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 ${p.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' : p.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}">
                                        <span class="w-1.5 h-1.5 rounded-full mr-2 ${p.status === 'verified' ? 'bg-emerald-500' : p.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}"></span>
                                        ${p.status}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                        ${payments.length === 0 ? '<div class="py-24 text-center text-slate-600 font-black uppercase tracking-[0.3em] text-sm">No recorded settlements</div>' : ''}
                    </div>
                </div>
            </div>

            <!-- Payment Modal -->
            <div id="paymentModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scaleIn overflow-hidden border-2 border-white/5">
                    <div class="p-12 relative">
                        <div class="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                        <div class="flex justify-between items-center mb-10 relative z-10">
                            <h3 class="text-2xl font-black text-white uppercase tracking-widest">Institutional Settlement</h3>
                            <button onclick="window.closePaymentModal()" class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="studentPaymentForm" class="space-y-8 relative z-10">
                            <input type="hidden" name="semesterId" value="${currentSemester.id}">
                            <input type="hidden" id="paymentAmount" name="amount" value="">

                            <!-- Manual Amount Input (Primary) -->
                            <div class="space-y-3">
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Enter Payment Amount (BDT)</label>
                                <div class="relative">
                                    <input 
                                        type="number" 
                                        id="manualAmountInput" 
                                        class="w-full bg-gradient-to-br from-white/10 to-white/5 border-2 border-indigo-500/30 rounded-2xl px-6 py-5 text-white placeholder-slate-500 focus:border-indigo-500 focus:bg-white/10 transition-all outline-none font-black text-2xl text-center" 
                                        placeholder="Enter amount (e.g., 15000)" 
                                        min="1" 
                                        max="${feeStructure.perSemesterFee}"
                                        required
                                        oninput="updatePaymentAmount(this.value)">
                                    <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm pointer-events-none">BDT</div>
                                </div>
                                <div class="flex items-center justify-between text-[9px] font-bold px-2">
                                    <span class="text-slate-500">Min: 1 BDT</span>
                                    <span class="text-slate-500">Max: ${feeStructure.perSemesterFee.toLocaleString()} BDT</span>
                                </div>
                            </div>

                            <!-- Quick Select Presets (Secondary) -->
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Or Quick Select</label>
                                    <span class="text-[9px] font-bold text-slate-600 uppercase tracking-wider">Suggested Amounts</span>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <button type="button" onclick="quickSelectAmount(${feeStructure.installments.first})" class="py-4 border-2 border-white/5 bg-white/5 rounded-xl flex flex-col items-center transition-all hover:bg-emerald-500/10 hover:border-emerald-500/50 group">
                                        <span class="font-black text-sm text-white group-hover:text-emerald-400 transition-colors">${feeStructure.installments.first.toLocaleString()} BDT</span>
                                        <span class="text-[8px] font-bold text-slate-500 mt-1">1st (30%)</span>
                                    </button>
                                    <button type="button" onclick="quickSelectAmount(${feeStructure.installments.second})" class="py-4 border-2 border-white/5 bg-white/5 rounded-xl flex flex-col items-center transition-all hover:bg-indigo-500/10 hover:border-indigo-500/50 group">
                                        <span class="font-black text-sm text-white group-hover:text-indigo-400 transition-colors">${feeStructure.installments.second.toLocaleString()} BDT</span>
                                        <span class="text-[8px] font-bold text-slate-500 mt-1">2nd (30%)</span>
                                    </button>
                                    <button type="button" onclick="quickSelectAmount(${feeStructure.installments.third})" class="py-4 border-2 border-white/5 bg-white/5 rounded-xl flex flex-col items-center transition-all hover:bg-purple-500/10 hover:border-purple-500/50 group">
                                        <span class="font-black text-sm text-white group-hover:text-purple-400 transition-colors">${feeStructure.installments.third.toLocaleString()} BDT</span>
                                        <span class="text-[8px] font-bold text-slate-500 mt-1">3rd (40%)</span>
                                    </button>
                                    <button type="button" onclick="quickSelectAmount(${feeStructure.perSemesterFee})" class="py-4 border-2 border-white/5 bg-white/5 rounded-xl flex flex-col items-center transition-all hover:bg-amber-500/10 hover:border-amber-500/50 group">
                                        <span class="font-black text-sm text-white group-hover:text-amber-400 transition-colors">${feeStructure.perSemesterFee.toLocaleString()} BDT</span>
                                        <span class="text-[8px] font-bold text-slate-500 mt-1">Full Payment</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Payment Channel Info -->
                            <div class="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
                                <p class="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Official Payment Gateway</p>
                                <div class="flex items-center justify-between">
                                    <span class="text-xl font-black text-white tracking-widest">01748-269350</span>
                                    <span class="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-[9px] font-black uppercase">Personal/Merchant</span>
                                </div>
                                <p class="text-[9px] text-slate-500 mt-3 font-bold uppercase tracking-wider">Use this number for bKash, Nagad, or Rocket transfers. Transaction ID required below.</p>
                            </div>

                            <div class="space-y-4">
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Payment Channel Gateway</label>
                                <div class="grid grid-cols-3 gap-4">
                                    <label class="cursor-pointer">
                                        <input type="radio" name="method" value="bKash" class="hidden peer" required>
                                        <div class="py-6 border-2 border-white/5 bg-white/5 rounded-2xl flex flex-col items-center peer-checked:border-pink-500 peer-checked:bg-pink-500/10 transition-all hover:bg-white/10 group">
                                            <span class="font-black text-xs text-slate-400 group-hover:text-white peer-checked:text-pink-400">bKash</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="method" value="Nagad" class="hidden peer">
                                        <div class="py-6 border-2 border-white/5 bg-white/5 rounded-2xl flex flex-col items-center peer-checked:border-orange-500 peer-checked:bg-orange-500/10 transition-all hover:bg-white/10 group">
                                            <span class="font-black text-xs text-slate-400 group-hover:text-white peer-checked:text-orange-400">Nagad</span>
                                        </div>
                                    </label>
                                    <label class="cursor-pointer">
                                        <input type="radio" name="method" value="Bank" class="hidden peer">
                                        <div class="py-6 border-2 border-white/5 bg-white/5 rounded-2xl flex flex-col items-center peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 transition-all hover:bg-white/10 group">
                                            <span class="font-black text-xs text-slate-400 group-hover:text-white peer-checked:text-indigo-400">Bank</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transaction Security Key (TRX ID)</label>
                                <input type="text" name="transactionId" required class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:border-indigo-500 transition-all outline-none font-bold" placeholder="TRX-XXXX-XXXX">
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Physical Verification Token</label>
                                <div class="relative group">
                                    <input type="file" name="proof" id="paymentProofInput" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required
                                        onchange="document.getElementById('fileUploadText').innerText = this.files[0] ? this.files[0].name : 'Attach Audit Reference'">
                                    <div class="w-full py-10 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/5 group-hover:border-indigo-500 group-hover:bg-indigo-500/5 transition-all">
                                        <ion-icon name="cloud-upload-outline" class="text-4xl text-slate-600 group-hover:text-indigo-400 mb-2 transition-colors"></ion-icon>
                                        <p id="fileUploadText" class="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Attach Audit Reference</p>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-6">
                                <button type="submit" class="w-full bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 hover:scale-[1.02] transition-all text-sm">
                                    Finalize Sequence (${feeStructure.perSemesterFee.toLocaleString()} BDT)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};
