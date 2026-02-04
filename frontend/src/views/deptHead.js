export const renderDeptHeadUsers = (users) => {
    let html = `
    <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800">Department Users</h2>
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <table class="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                         <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                         <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                    </tr>
                </thead>
                <tbody>
    `;

    users.forEach(user => {
        html += `
            <tr>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div class="flex items-center">
                         <div class="flex-shrink-0 w-10 h-10">
                            <img class="w-full h-full rounded-full" src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}" alt="" />
                        </div>
                        <div class="ml-3">
                            <p class="text-gray-900 whitespace-no-wrap font-semibold">${user.name}</p>
                            <p class="text-gray-600 whitespace-no-wrap text-xs">${user.email}</p>
                        </div>
                    </div>
                </td>
                 <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span class="relative inline-block px-3 py-1 font-semibold text-gray-900 leading-tight">
                         <span aria-hidden class="absolute inset-0 bg-gray-200 opacity-50 rounded-full"></span>
                        <span class="relative capitalize">${user.role}</span>
                    </span>
                 </td>
                 <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p class="text-gray-900 whitespace-no-wrap">${user.phone || 'N/A'}</p>
                 </td>
            </tr>
        `;
    });

    html += `</tbody></table></div></div>`;
    return html;
};

export const renderAdmitCardManager = (cards) => {
    let html = `
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">Admit Cards</h2>
            <button onclick="window.showGenerateCardModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center">
                <ion-icon name="add-circle-outline" class="mr-2 text-xl"></ion-icon>
                Generate New Cards
            </button>
        </div>

        <!-- Generate Admit Card Modal -->
        <div id="generateCardModal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-opacity duration-300">
            <div class="relative top-20 mx-auto p-8 border-0 w-full max-w-md shadow-2xl rounded-3xl bg-white transform transition-all duration-300 scale-95 opacity-0 modal-content">
                <div class="space-y-6">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ion-icon name="id-card-outline" class="text-3xl"></ion-icon>
                        </div>
                        <h3 class="text-2xl font-extrabold text-gray-900">Generate Admit Cards</h3>
                        <p class="text-gray-500 mt-1">Fill in the details for the examination</p>
                    </div>

                    <form id="generateCardForm" class="space-y-5">
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Examination Name</label>
                            <input type="text" name="examName" required placeholder="e.g. Final Examination Fall 2024" 
                                class="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none border">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-2 ml-1">Semester</label>
                            <input type="text" name="semester" required placeholder="e.g. 3rd Year 1st Semester" 
                                class="w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none border">
                        </div>
                        
                        <div class="flex items-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <ion-icon name="alert-circle-outline" class="text-amber-600 text-2xl mr-3 flex-shrink-0"></ion-icon>
                            <p class="text-xs text-amber-700 leading-snug">
                                This will generate admit cards for all eligible students in your department for the specified semester.
                            </p>
                        </div>

                        <div class="flex gap-3 mt-8">
                            <button type="button" onclick="window.hideGenerateCardModal()" 
                                class="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all">
                                Cancel
                            </button>
                            <button type="submit" 
                                class="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                                Generate Now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <div class="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
            <ul class="divide-y divide-gray-100">
    `;

    if (cards.length === 0) {
        html += `
            <li class="px-8 py-12 text-center">
                <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ion-icon name="document-text-outline" class="text-3xl text-gray-300"></ion-icon>
                </div>
                <p class="text-gray-500 font-medium text-lg">No admit cards generated yet.</p>
                <p class="text-gray-400 text-sm mt-1">Click the button above to start the generation process.</p>
            </li>
        `;
    }

    cards.forEach(card => {
        html += `
            <li class="px-6 py-5 hover:bg-indigo-50/30 transition-colors group">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600 font-bold">
                            ${card.studentName.charAt(0)}
                        </div>
                        <div>
                            <p class="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">${card.studentName}</p>
                            <p class="text-xs text-gray-500 font-medium uppercase tracking-wider">${card.examName}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                            ${card.status}
                        </span>
                        <p class="mt-1 text-xs text-gray-400 font-medium">${card.semester}</p>
                    </div>
                </div>
            </li>
        `;
    });

    html += `</ul></div></div>`;
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
