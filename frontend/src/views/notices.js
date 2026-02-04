export const renderNotices = (notices, userRole) => {
    const canCreate = ['teacher', 'dept_head', 'super_admin'].includes(userRole);

    let html = `
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-black text-white flex items-center">
                <ion-icon name="notifications-outline" class="mr-3 text-indigo-400"></ion-icon>
                Institutional Intelligence
            </h2>
            ${canCreate ? `<button onclick="window.showCreateNoticeModal()" class="bg-indigo-500 hover:bg-indigo-600 text-white font-black py-3 px-8 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center uppercase tracking-widest text-[10px]">
                <ion-icon name="add-circle-outline" class="mr-2 text-lg"></ion-icon>
                Broadcast Notice
            </button>` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    `;

    if (notices.length === 0) {
        html += `
            <div class="col-span-3 text-center py-10">
                <ion-icon name="document-outline" class="text-6xl text-gray-300"></ion-icon>
                <p class="text-gray-500 mt-4">No notices available</p>
            </div>
        `;
    } else {
        notices.forEach(notice => {
            const date = new Date(notice.createdAt).toLocaleDateString();
            html += `
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all shadow-2xl group flex flex-col relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                    <div class="relative z-10 flex-grow">
                        <div class="flex justify-between items-start mb-6">
                            <h3 class="text-xl font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">${notice.title}</h3>
                        </div>
                        <div class="flex flex-wrap gap-2 mb-6">
                            <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">${notice.department || 'General'}</span>
                            ${notice.targetRole ? `<span class="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20 capitalize">${notice.targetRole.replace('_', ' ')}</span>` : ''}
                        </div>
                        <p class="text-slate-400 text-sm font-medium mb-8 leading-relaxed line-clamp-4">${notice.content || ''}</p>
                    </div>
                    
                    <div class="relative z-10">
                        <div class="flex justify-between items-center pt-6 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <span class="flex items-center"><ion-icon name="person-circle-outline" class="mr-1 text-lg"></ion-icon> ${notice.authorName || 'System'}</span>
                            <span>${date}</span>
                        </div>
                        ${notice.attachmentUrl ? `
                            <a href="${window.getDownloadUrl ? window.getDownloadUrl(notice.attachmentUrl) : notice.attachmentUrl}" download class="mt-6 w-full inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 transition-all">
                                <ion-icon name="document-attach-outline" class="mr-2 text-lg"></ion-icon>
                                Secure Attachment
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }

    html += `</div></div>`;

    // Add modal if user can create
    if (canCreate) {
        html += `
        <div id="createNoticeModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/5 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden">
                <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                
                <div class="p-10 relative z-10">
                    <div class="text-center mb-10">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20 shadow-xl">
                            <ion-icon name="megaphone-outline" class="text-3xl text-indigo-400"></ion-icon>
                        </div>
                        <h3 class="text-2xl font-black text-white tracking-tight uppercase tracking-widest leading-none">Draft Announcement</h3>
                        <p class="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">Broadcast priority information</p>
                    </div>

                    <form id="createNoticeForm" class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Notice Heading</label>
                            <input type="text" name="title" required class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-bold" placeholder="e.g. End Semester Protocol">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Intelligence Body</label>
                            <textarea name="content" rows="4" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-medium text-sm leading-relaxed" placeholder="Detail the announcement specifications..."></textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Clearance Level</label>
                                <select name="targetRole" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 transition-all outline-none appearance-none font-bold">
                                    <option value="">Global Broadcast</option>
                                    <option value="student">Student Corps</option>
                                    <option value="teacher">Faculty Members</option>
                                    <option value="dept_head">Command Officers</option>
                                    <option value="course_coordinator">Logistics Coordinators</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Sector Assignment</label>
                                <select name="department" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 transition-all outline-none appearance-none font-bold">
                                    <option value="">Institutional</option>
                                    <option value="ICE">ICE Sector</option>
                                    <option value="CSE">CSE Sector</option>
                                    <option value="EEE">EEE Sector</option>
                                    <option value="BBA">BBA Sector</option>
                                    <option value="LAW">LAW Sector</option>
                                    <option value="English">ENG Sector</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1">Supporting Documentation</label>
                            <div class="relative group">
                                <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                                <div class="w-full py-6 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/5 group-hover:border-indigo-500 transition-all">
                                    <ion-icon name="cloud-upload-outline" class="text-3xl text-slate-600 group-hover:text-indigo-400 mb-2"></ion-icon>
                                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Attach Protocol File</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-4 pt-4">
                            <button type="button" onclick="document.getElementById('createNoticeModal').classList.add('hidden')" class="flex-1 bg-white/5 py-4 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Abort</button>
                            <button type="submit" class="flex-1 bg-indigo-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 transition-all">Execute Broadcast</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    }

    return html;
};
