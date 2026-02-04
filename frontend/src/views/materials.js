export const renderMaterials = (materials, userRole, courses = []) => {
    const canUploadGlobal = ['teacher', 'course_coordinator', 'super_admin'].includes(userRole);

    let html = `
    <div class="space-y-6">
        <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden group">
            <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="relative z-10">
                <h2 class="text-2xl font-black text-white tracking-tight flex items-center">
                    <ion-icon name="document-text-outline" class="mr-3 text-indigo-400 text-3xl"></ion-icon>
                    Intelligence Archive
                </h2>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3 ml-1">Secure Academic Resource Repository</p>
            </div>
            ${canUploadGlobal ? `<button onclick="window.showUploadMaterialModal()" class="relative z-10 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center uppercase tracking-widest text-[10px]">
                <ion-icon name="cloud-upload-outline" class="mr-2 text-lg"></ion-icon>
                Provision Resource
            </button>` : ''}
        </div>

        <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[3rem] shadow-2xl border-2 border-white/5 overflow-hidden">
            <table class="min-w-full">
                <thead>
                    <tr class="bg-white/5">
                        <th class="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Designation</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sector Code</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sequence / Epoch</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Origin Agent</th>
                        <th class="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Epoch Time</th>
                        <th class="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Acquisition</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
    `;

    if (materials.length === 0) {
        html += `
            <tr>
                <td colspan="6" class="px-8 py-24 text-center">
                    <div class="flex flex-col items-center">
                        <ion-icon name="folder-open-outline" class="text-5xl text-slate-700 mb-4"></ion-icon>
                        <p class="text-slate-500 font-black uppercase tracking-widest text-xs italic">Archive Empty: No Resources Provisioned</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        materials.forEach(material => {
            const date = new Date(material.createdAt).toLocaleDateString();
            html += `
                <tr class="hover:bg-white/5 transition-all group">
                    <td class="px-8 py-6">
                        <div class="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">${material.title}</div>
                        ${material.description ? `<div class="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">${material.description}</div>` : ''}
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        ${material.courseCode || 'N/A'}
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap">
                         <span class="px-3 py-1 text-[10px] font-black rounded-full bg-indigo-500/10 text-indigo-400 uppercase tracking-widest border border-indigo-500/20">${material.type || 'material'}</span>
                         <div class="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-2 ml-1">${material.semester || '-'}</div>
                    </td>
                    <td class="px-8 py-6 whitespace-nowrap text-[10px] font-black text-slate-400 uppercase tracking-widest">${material.uploadedBy || 'System'}</td>
                    <td class="px-8 py-6 whitespace-nowrap text-[10px] font-black text-slate-400 tracking-widest">${date}</td>
                    <td class="px-8 py-6 whitespace-nowrap text-right">
                        <a href="${window.getDownloadUrl ? window.getDownloadUrl(material.fileUrl) : material.fileUrl}" download 
                           class="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 transition-all">
                            <ion-icon name="cloud-download-outline" class="mr-2 text-lg"></ion-icon> 
                            Acquire File
                        </a>
                    </td>
                </tr>
            `;
        });
    }

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    // Add upload modal if user can upload
    if (canUploadGlobal) {
        html += `
        <div id="uploadMaterialModal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/5 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden">
                <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                
                <div class="p-12 relative z-10">
                    <div class="text-center mb-10">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20 shadow-xl">
                            <ion-icon name="cloud-upload-outline" class="text-3xl text-indigo-400"></ion-icon>
                        </div>
                        <h3 class="text-2xl font-black text-white tracking-widest uppercase leading-none">Provision Resource</h3>
                        <p class="text-slate-500 text-[10px] font-black uppercase mt-3 tracking-widest">Inject knowledge into the institutional core</p>
                    </div>

                    <form id="uploadMaterialForm" class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Resource Title</label>
                            <input type="text" name="title" required class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-bold" placeholder="e.g. Distributed Consensus Logic">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Detailed Specification</label>
                            <textarea name="description" rows="2" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-medium text-xs leading-relaxed" placeholder="Optional technical metadata..."></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Sector Assignment</label>
                            <select name="courseId" required class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 transition-all outline-none appearance-none font-bold italic">
                                <option value="">-- AUTHORIZE SECTOR --</option>
                                ${courses.map(c => `<option value="${c.id}">${c.code} ‣ ${c.title}</option>`).join('')}
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Resource Type</label>
                                <select name="type" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3 text-white focus:border-indigo-500 transition-all outline-none appearance-none font-bold uppercase text-[10px] tracking-widest">
                                    <option value="material">Lecture Intel</option>
                                    <option value="syllabus">Curriculum Protocol</option>
                                    <option value="routine">Execution Schedule</option>
                                    <option value="question">Historical Query</option>
                                    <option value="solution">Resolved Logic</option>
                                    <option value="online_resource">External Junction</option>
                                    <option value="other">Unclassified</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Temporal Epoch</label>
                                <input type="text" name="semester" placeholder="e.g. Spring 2025" class="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-5 py-3 text-white placeholder-slate-600 focus:border-indigo-500 transition-all outline-none font-bold text-xs">
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Source Data (PDF/DOC/BIN)</label>
                            <div class="relative group">
                                <input type="file" name="file" required class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                                <div class="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/5 group-hover:border-indigo-500 transition-all">
                                    <ion-icon name="document-attach-outline" class="text-3xl text-slate-600 group-hover:text-indigo-400 mb-2"></ion-icon>
                                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Intelligence File</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-4 pt-4">
                            <button type="button" onclick="document.getElementById('uploadMaterialModal').classList.add('hidden')" class="flex-1 bg-white/5 py-4 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Abort</button>
                            <button type="submit" class="flex-1 bg-indigo-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 transition-all">Initialize Inject</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
    }

    return html;
};
