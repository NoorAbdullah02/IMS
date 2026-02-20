export const renderDeptDashboard = (stats) => {
    return `
        <div class="space-y-8 animate-fadeIn">
            <!-- Header with Dept Branding -->
            <div class="relative h-72 rounded-[3rem] overflow-hidden shadow-2xl group border-2 border-white/5">
                <img src="${stats.department?.banner || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200&q=80'}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" id="deptBanner">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                <div class="absolute bottom-10 left-10 flex items-end space-x-8">
                    <div class="w-28 h-28 bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-4 shadow-2xl relative border-2 border-white/10">
                        <div class="absolute inset-0 bg-indigo-500 rounded-[2rem] blur-xl opacity-20"></div>
                        <img src="${stats.department?.logo || `https://ui-avatars.com/api/?name=${stats.name}&background=6366f1&color=fff&size=128`}" 
                             class="w-full h-full object-contain rounded-2xl relative z-10 filter" id="deptLogo">
                    </div>
                    <div class="pb-2">
                        <h1 class="text-5xl font-black text-white tracking-tight">${stats.name} Hub</h1>
                        <p class="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] mt-3 flex items-center">
                            <span class="w-2 h-2 bg-indigo-500 rounded-full mr-3 animate-pulse"></span>
                            Strategic Governance Terminal
                        </p>
                    </div>
                </div>
                <button onclick="handleNavigation('customizeDept')" 
                        class="absolute top-8 right-8 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-3 transition-all">
                    <ion-icon name="color-palette-outline" class="text-lg"></ion-icon>
                    <span>Branding Console</span>
                </button>
            </div>

            <!-- Stats Quick View -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl group hover:border-indigo-500/30 transition-all">
                    <div class="flex items-center space-x-5">
                        <div class="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all shadow-lg">
                            <ion-icon name="people-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Student Corps</p>
                            <h3 class="text-3xl font-black text-white mt-2">${stats.students}</h3>
                        </div>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl group hover:border-emerald-500/30 transition-all">
                    <div class="flex items-center space-x-5">
                        <div class="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all shadow-lg">
                            <ion-icon name="school-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Faculty Assets</p>
                            <h3 class="text-3xl font-black text-white mt-2">${stats.teachers}</h3>
                        </div>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl group hover:border-amber-500/30 transition-all">
                    <div class="flex items-center space-x-5">
                        <div class="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-all shadow-lg">
                            <ion-icon name="shield-checkmark-outline" class="text-3xl"></ion-icon>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Operational Status</p>
                            <h3 class="text-2xl font-black text-amber-400 mt-2 uppercase">Verified</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Upcoming Events Widget -->
                <div class="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] shadow-2xl border-2 border-white/5 overflow-hidden">
                    <div class="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 class="font-black text-white text-xl uppercase tracking-widest">Priority Engagements</h3>
                        <button onclick="handleNavigation('manageDeptEvents')" class="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] transition-colors">Strategic Timeline</button>
                    </div>
                    <div class="p-8 space-y-4">
                        ${stats.upcomingEvents.length ? stats.upcomingEvents.map(event => `
                            <div class="flex items-start space-x-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group cursor-pointer">
                                <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center text-indigo-400 font-black group-hover:bg-indigo-500/20 transition-all">
                                    <span class="text-[10px] uppercase leading-none font-black tracking-widest">${new Date(event.startTime).toLocaleString('default', { month: 'short' })}</span>
                                    <span class="text-xl leading-none mt-1 font-black">${new Date(event.startTime).getDate()}</span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-black text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">${event.title}</h4>
                                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center">
                                        <ion-icon name="location-outline" class="mr-2 text-indigo-500 text-sm"></ion-icon> ${event.venue}
                                    </p>
                                </div>
                                <span class="px-4 py-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">${event.type}</span>
                            </div>
                        `).join('') : `
                            <div class="py-20 text-center">
                                <ion-icon name="calendar-clear-outline" class="text-5xl text-slate-700 mb-4"></ion-icon>
                                <p class="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">No Engagements Scheduled</p>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="space-y-6">
                    <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-10 rounded-[3rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
                        <div class="absolute -left-10 -bottom-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                        <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 border-b border-white/5 pb-4">Command Terminal</h4>
                        <div class="space-y-4 relative z-10">
                            <button onclick="handleNavigation('customizeDept')" class="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-indigo-500/10 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                                <span class="font-black text-[10px] uppercase tracking-widest text-slate-300 group-hover:text-white">Portal Configuration</span>
                                <ion-icon name="settings-outline" class="text-xl text-slate-500 group-hover:text-indigo-400"></ion-icon>
                            </button>
                            <button onclick="handleNavigation('manageDeptContent')" class="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-indigo-500/10 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                                <span class="font-black text-[10px] uppercase tracking-widest text-slate-300 group-hover:text-white">Broadcast Protocol</span>
                                <ion-icon name="megaphone-outline" class="text-xl text-slate-500 group-hover:text-indigo-400"></ion-icon>
                            </button>
                            <button onclick="handleNavigation('manageDeptGallery')" class="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-indigo-500/10 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                                <span class="font-black text-[10px] uppercase tracking-widest text-slate-300 group-hover:text-white">Intelligence Archive</span>
                                <ion-icon name="image-outline" class="text-xl text-slate-500 group-hover:text-indigo-400"></ion-icon>
                            </button>
                            <button onclick="handleNavigation('manageDeptEvents')" class="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-indigo-500/10 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                                <span class="font-black text-[10px] uppercase tracking-widest text-slate-300 group-hover:text-white">Event Deployment</span>
                                <ion-icon name="calendar-outline" class="text-xl text-slate-500 group-hover:text-indigo-400"></ion-icon>
                            </button>
                            <div class="pt-4">
                                <a href="/department.html?name=${stats.name}" target="_blank" class="w-full flex items-center justify-center space-x-3 p-5 bg-indigo-500 hover:bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all group">
                                    <span class="font-black text-[10px] uppercase tracking-widest text-white">Access Live Terminal</span>
                                    <ion-icon name="open-outline" class="text-xl text-white"></ion-icon>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const renderDeptBranding = (dept) => {
    return `
        <div class="max-w-5xl mx-auto space-y-10 animate-fadeIn">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-3xl p-10 rounded-[3.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden">
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]"></div>
                <div class="relative z-10">
                    <div class="flex items-center gap-4 mb-3">
                        <div class="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                            <ion-icon name="color-palette-outline" class="text-xl text-indigo-400"></ion-icon>
                        </div>
                        <h2 class="text-4xl font-black text-white tracking-tighter">Identity Core</h2>
                    </div>
                    <p class="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Configure institutional visual protocols</p>
                </div>
                <button onclick="handleNavigation('loadDeptDashboard')" class="relative z-10 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all flex items-center gap-3 backdrop-blur-xl group">
                    <ion-icon name="arrow-back-outline" class="text-xl group-hover:-translate-x-1 transition-transform"></ion-icon>
                    <span>Return to Terminal</span>
                </button>
            </div>

            <form id="deptBrandingForm" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <!-- Branding Preview/Editor -->
                <div class="lg:col-span-12 bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[4rem] shadow-2xl border-2 border-white/5 relative overflow-hidden">
                    <div class="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                        <!-- Visual Identity -->
                        <div class="space-y-10">
                            <div class="flex items-center gap-3 border-b border-white/5 pb-6">
                                <span class="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400">01. Visual Branding</span>
                            </div>
                            
                            <div class="space-y-8">
                                <div class="group">
                                    <label class="block mb-3 ml-2">
                                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Department Logo Protocol (Upload)</span>
                                    </label>
                                    <div class="relative group cursor-pointer">
                                        <input type="file" name="logo" id="logoFileInput" accept="image/*" 
                                               class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                               onchange="window.previewDeptAsset(this, 'logoPreview')">
                                        <div class="w-full px-8 py-5 bg-white/5 border-2 border-white/5 rounded-3xl flex items-center justify-between group-hover:border-indigo-500/40 transition-all">
                                            <div class="flex items-center gap-4">
                                                <div class="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                                    <ion-icon name="cloud-upload-outline" class="text-xl text-indigo-400"></ion-icon>
                                                </div>
                                                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Institutional Insignia</span>
                                            </div>
                                            <div class="w-12 h-12 bg-slate-900 rounded-2xl p-2 border border-white/10 relative overflow-hidden">
                                                <img id="logoPreview" src="${dept.logo || 'https://ui-avatars.com/api/?name=IMS&background=6366f1&color=fff'}" class="w-full h-full object-contain rounded-lg">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="group">
                                    <label class="block mb-3 ml-2">
                                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Department Banner Protocol (Upload)</span>
                                    </label>
                                    <div class="space-y-4">
                                        <div class="relative group cursor-pointer h-44 rounded-3xl overflow-hidden border-2 border-white/5 hover:border-indigo-500/40 transition-all shadow-2xl">
                                            <input type="file" name="banner" id="bannerFileInput" accept="image/*" 
                                                   class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                                                   onchange="window.previewDeptAsset(this, 'bannerPreview')">
                                            <img id="bannerPreview" src="${dept.banner || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200&q=80'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
                                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent"></div>
                                            <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-500/10 backdrop-blur-sm">
                                                <ion-icon name="camera-outline" class="text-4xl text-white mb-2"></ion-icon>
                                                <span class="text-[10px] font-black text-white uppercase tracking-[0.3em]">Update Horizon Banner</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Strategic Overview -->
                        <div class="space-y-10">
                            <div class="flex items-center gap-3 border-b border-white/5 pb-6">
                                <span class="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400">02. Strategic Logic</span>
                            </div>
                            
                            <div class="space-y-8">
                                <div>
                                    <label class="block mb-3 ml-2">
                                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Mission Vector</span>
                                    </label>
                                    <textarea name="mission" rows="2" class="w-full px-8 py-5 bg-white/5 border-2 border-white/5 rounded-3xl focus:border-emerald-500/40 outline-none transition-all font-medium text-sm text-white leading-relaxed placeholder-slate-800" placeholder="Define the department's core mission...">${dept.mission || ''}</textarea>
                                </div>
                                <div>
                                    <label class="block mb-3 ml-2">
                                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Vision Horizon</span>
                                    </label>
                                    <textarea name="vision" rows="2" class="w-full px-8 py-5 bg-white/5 border-2 border-white/5 rounded-3xl focus:border-emerald-500/40 outline-none transition-all font-medium text-sm text-white leading-relaxed placeholder-slate-800" placeholder="Extrapolate the future academic state...">${dept.vision || ''}</textarea>
                                </div>
                                <div>
                                    <label class="block mb-3 ml-2">
                                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Department Overview</span>
                                    </label>
                                    <textarea name="description" rows="4" class="w-full px-8 py-5 bg-white/5 border-2 border-white/5 rounded-3xl focus:border-emerald-500/40 outline-none transition-all font-medium text-sm text-white leading-relaxed placeholder-slate-800" placeholder="Provide a comprehensive departmental summary...">${dept.description || ''}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-16 pt-10 border-t border-white/5 text-center relative z-10">
                        <button type="submit" class="w-full max-w-md bg-indigo-500 hover:bg-indigo-600 text-white font-black py-6 rounded-3xl shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[11px] mx-auto group">
                            <ion-icon name="cloud-upload-outline" class="text-2xl group-hover:scale-110 transition-transform"></ion-icon>
                            <span>Commit Academic Identity</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
};

export const renderDeptEvents = (events) => {
    return `
        <div class="space-y-8 animate-fadeIn">
            <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                <div class="relative z-10">
                    <h2 class="text-3xl font-black text-white tracking-tight">Event Timeline</h2>
                    <p class="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Orchestrate seminars and workshops</p>
                </div>
                <button onclick="window.showAddEventModal()" class="relative z-10 flex items-center space-x-3 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20">
                    <ion-icon name="add-circle" class="text-xl"></ion-icon>
                    <span>Deploy Engagement</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                ${events.map(event => {
        const now = new Date();
        const start = new Date(event.startTime);
        const end = event.endTime ? new Date(event.endTime) : null;
        let statusLabel, statusBg, statusDot;
        if (start > now) {
            statusLabel = 'Upcoming'; statusBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20'; statusDot = 'bg-amber-400';
        } else if (!end || end >= now) {
            statusLabel = 'Active'; statusBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; statusDot = 'bg-emerald-400 animate-pulse';
        } else {
            statusLabel = 'Ended'; statusBg = 'bg-slate-500/10 text-slate-500 border-white/10'; statusDot = 'bg-slate-600';
        }
        return `
                        <div class="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 border-2 border-white/5 flex flex-col h-full relative hover:-translate-y-2">
                            <div class="relative h-60 overflow-hidden">
                                <img src="${event.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}" 
                                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                                <div class="absolute top-6 left-6 flex items-center gap-2">
                                    <span class="px-4 py-2 ${statusBg} backdrop-blur-xl border rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <span class="w-1.5 h-1.5 ${statusDot} rounded-full"></span>
                                        ${statusLabel}
                                    </span>
                                </div>
                            </div>
                            <div class="p-10 flex-1 flex flex-col">
                                <div class="mb-4">
                                    <span class="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[8px] font-black text-indigo-400 uppercase tracking-widest">${event.type}</span>
                                </div>
                                <h3 class="text-2xl font-black text-white leading-tight mb-4 group-hover:text-indigo-400 transition-colors uppercase tracking-tight line-clamp-2">${event.title}</h3>
                                <p class="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 mb-8 flex-1">${event.description || 'No detailed specifications provided for this engagement.'}</p>
                                
                                <div class="pt-8 border-t border-white/5 flex items-center justify-between mt-auto">
                                    <div class="space-y-2">
                                        <div class="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <ion-icon name="calendar-outline" class="text-indigo-500 mr-2 text-sm"></ion-icon>
                                            ${start.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div class="flex items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                            <ion-icon name="location-outline" class="text-indigo-500 mr-2 text-sm"></ion-icon>
                                            ${event.venue}
                                        </div>
                                    </div>
                                    <div class="flex gap-3">
                                        <button onclick="window.editDeptEvent('${encodeURIComponent(JSON.stringify(event))}')" class="w-12 h-12 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-2xl transition-all border border-indigo-500/20 flex items-center justify-center">
                                            <ion-icon name="create-outline" class="text-xl"></ion-icon>
                                        </button>
                                        <button onclick="window.deleteDeptEvent(${event.id})" class="w-12 h-12 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/20 flex items-center justify-center">
                                            <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
    }).join('')}
                ${events.length === 0 ? `
                    <div class="col-span-full py-40 text-center bg-white/5 rounded-[4rem] border-2 border-dashed border-white/5 group relative overflow-hidden">
                        <div class="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
                        <ion-icon name="calendar-clear-outline" class="text-6xl text-slate-800 mb-8"></ion-icon>
                        <h3 class="text-xl font-black text-white uppercase tracking-[0.3em] mb-4">No Engagements Found</h3>
                        <p class="text-slate-600 font-bold uppercase tracking-widest text-[9px]">The temporal timeline is currently clear.</p>
                    </div>
                ` : ''}
            </div>

            <!-- Add Event Modal -->
            <div id="eventModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scaleIn overflow-hidden border-2 border-white/5">
                    <div class="p-12 relative">
                        <div class="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl"></div>
                        <div class="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h3 class="text-3xl font-black text-white tracking-widest uppercase mb-2">New Engagement</h3>
                                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Deploy departmental event protocol</p>
                            </div>
                            <button onclick="window.closeEventModal()" class="w-12 h-12 bg-white/5 text-slate-500 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-white/5">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="deptEventForm" enctype="multipart/form-data" class="space-y-6 relative z-10 text-left">
                            <input type="hidden" id="editEventId" name="id" value="">
                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Engagement Designation</label>
                                <input type="text" name="title" required class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold placeholder-slate-700" placeholder="e.g. Distributed Consensus Workshop">
                            </div>

                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Protocol Type</label>
                                    <select name="type" class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold uppercase text-[10px] tracking-widest">
                                        <option value="Seminar">Seminar</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Tech Fest">Tech Fest</option>
                                        <option value="Competition">Competition</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Acquisition Level</label>
                                    <select name="visibility" class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold uppercase text-[10px] tracking-widest">
                                        <option value="public">Public (Open)</option>
                                        <option value="department">Sector Restricted</option>
                                        <option value="student">Member Restricted</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Coordinates (Venue)</label>
                                    <input type="text" name="venue" required class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold text-xs" placeholder="e.g. Main Auditorium">
                                </div>
                                <div>
                                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Epoch Time (Start)</label>
                                    <input type="datetime-local" name="startTime" required class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold text-xs">
                                </div>
                            </div>

                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Epoch Time (End — Optional)</label>
                                <input type="datetime-local" name="endTime" class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold text-xs">
                            </div>

                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Strategic Overview</label>
                                <textarea name="description" rows="3" class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-medium text-xs leading-relaxed placeholder-slate-700" placeholder="Summarize engagement goals..."></textarea>
                            </div>

                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Visual Anchor (Optional)</label>
                                <div id="bannerPreviewContainer" class="hidden mb-3">
                                    <img id="bannerPreviewImg" class="w-full h-40 object-cover rounded-2xl border-2 border-indigo-500/30">
                                </div>
                                <div class="relative group cursor-pointer">
                                    <input type="file" name="banner" id="eventBannerInput" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onchange="window.previewEventBanner(this)">
                                    <div id="bannerUploadPlaceholder" class="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/5 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all">
                                        <ion-icon name="image-outline" class="text-3xl text-slate-700 group-hover:text-indigo-400 mb-2"></ion-icon>
                                        <p class="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-widest">Select Banner Image</p>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-6">
                                <button type="submit" id="eventSubmitBtn" class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-[10px]">
                                    Initialize Deployment Sequence
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const renderDeptContent = (contents) => {
    return `
        <div class="space-y-8 animate-fadeIn">
            <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div class="relative z-10">
                    <h2 class="text-3xl font-black text-white tracking-tight">Intelligence Broadcast</h2>
                    <p class="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Publish research and departmental bulletins</p>
                </div>
                <button onclick="window.showAddContentModal()" class="relative z-10 flex items-center space-x-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20">
                    <ion-icon name="cloud-upload-outline" class="text-xl"></ion-icon>
                    <span>Authorize Publication</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                ${contents.map(item => `
                    <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-[4rem] border-2 border-white/5 shadow-2xl hover:border-emerald-500/30 transition-all duration-500 relative group overflow-hidden flex flex-col hover:-translate-y-2">
                        <div class="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-all"></div>
                        
                        <div class="flex items-center justify-between mb-10 relative z-10">
                            <div class="flex items-center space-x-5">
                                <div class="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <ion-icon name="${item.type === 'Research' ? 'flask-outline' : 'document-text-outline'}" class="text-3xl"></ion-icon>
                                </div>
                                <div>
                                    <span class="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 block">${item.type}</span>
                                    <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 block">${new Date(item.publishedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                        
                        <h4 class="text-3xl font-black text-white mb-6 tracking-tighter group-hover:text-emerald-400 transition-colors uppercase leading-[1.1]">${item.title}</h4>
                        <p class="text-sm text-slate-400 font-medium leading-relaxed line-clamp-4 mb-10 flex-1">${item.description || 'No abstract provided for this intelligence broadcast.'}</p>
                        
                        <div class="pt-8 border-t border-white/5 relative z-10 flex justify-between items-center">
                            ${item.fileUrl ? `
                                <a href="${item.fileUrl}" target="_blank" class="inline-flex items-center text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-[0.3em] group/btn transition-all">
                                    Download Asset Data 
                                    <ion-icon name="download-outline" class="ml-3 text-xl group-hover/btn:translate-y-0.5 transition-transform"></ion-icon>
                                </a>
                            ` : '<span></span>'}
                            <button onclick="window.deleteDeptContent(${item.id})" class="w-12 h-12 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/20 flex items-center justify-center">
                                <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                            </button>
                        </div>
                    </div>
                `).join('')}
                ${contents.length === 0 ? `
                    <div class="col-span-full py-40 text-center bg-white/5 rounded-[4rem] border-2 border-dashed border-white/5 group relative overflow-hidden">
                        <div class="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
                        <ion-icon name="megaphone-outline" class="text-6xl text-slate-800 mb-8"></ion-icon>
                        <h3 class="text-xl font-black text-white uppercase tracking-[0.3em] mb-4">Broadcast Stream Empty</h3>
                        <p class="text-slate-600 font-bold uppercase tracking-widest text-[9px]">No bulletins have been authorized for transmission.</p>
                    </div>
                ` : ''}
            </div>

            <!-- Add Content Modal -->
            <div id="contentModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scaleIn overflow-hidden border-2 border-white/5">
                    <div class="p-12 relative">
                        <div class="absolute -right-20 -top-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl"></div>
                        
                        <div class="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h3 class="text-3xl font-black text-white tracking-widest uppercase mb-2">Secure Broadcast</h3>
                                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Global departmental information injection</p>
                            </div>
                            <button onclick="window.closeContentModal()" class="w-12 h-12 bg-white/5 text-slate-500 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-white/5">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="deptContentForm" class="space-y-6 relative z-10 text-left">
                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Information Tag/Title</label>
                                <input type="text" name="title" required class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold placeholder-slate-700" placeholder="e.g. Annual Research Symposium Results">
                            </div>

                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Publication Category</label>
                                <select name="type" class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold uppercase text-[10px] tracking-widest">
                                    <option value="Notice">Notice</option>
                                    <option value="Research">Research Output</option>
                                    <option value="Resource">Academic Resource</option>
                                </select>
                            </div>

                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Content Abstract</label>
                                <textarea name="description" rows="3" class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-medium text-xs leading-relaxed placeholder-slate-700" placeholder="Inject brief technical description..."></textarea>
                            </div>

                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Resource Junction (Asset URL)</label>
                                <input type="url" name="fileUrl" placeholder="https://cloud.sector.cdn/asset..." class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold text-xs placeholder-slate-700">
                            </div>

                            <div class="pt-6">
                                <button type="submit" class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-[10px]">
                                    Commit to Broadcast Stream
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};

export const renderDeptGallery = (items) => {
    return `
        <div class="space-y-8 animate-fadeIn">
            <div class="flex justify-between items-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-2xl border-2 border-white/5 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
                <div class="relative z-10">
                    <h2 class="text-3xl font-black text-white tracking-tight">Visual Repository</h2>
                    <p class="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Curate the institutional visual history</p>
                </div>
                <button onclick="window.showAddGalleryModal()" class="relative z-10 flex items-center space-x-3 bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20">
                    <ion-icon name="camera-outline" class="text-xl"></ion-icon>
                    <span>Capture Memory</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                ${items.map(item => `
                    <div class="group relative aspect-square rounded-[2.5rem] overflow-hidden border-2 border-white/5 bg-slate-800 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
                        <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                            <div class="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h4 class="text-white font-black text-lg tracking-tight uppercase line-clamp-1">${item.caption || 'Academic Moment'}</h4>
                                <p class="text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 flex items-center">
                                    <ion-icon name="calendar-outline" class="mr-2"></ion-icon>
                                    ${new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button onclick="window.deleteGalleryItem(${item.id})" class="absolute top-6 right-6 w-12 h-12 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl border border-rose-500/30 backdrop-blur-xl">
                                <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                            </button>
                        </div>
                    </div>
                `).join('')}
                ${items.length === 0 ? `
                    <div class="col-span-full py-40 text-center bg-white/5 rounded-[4rem] border-2 border-dashed border-white/5 relative overflow-hidden group">
                        <div class="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div class="relative z-10">
                            <div class="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-2 border-white/5">
                                <ion-icon name="image-outline" class="text-5xl text-slate-700"></ion-icon>
                            </div>
                            <h3 class="text-2xl font-black text-white uppercase tracking-widest mb-4">Archive Empty</h3>
                            <p class="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] max-w-xs mx-auto leading-relaxed">No visual assets found in the institutional repository. Begin capture sequence.</p>
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- Add Gallery Modal -->
            <div id="galleryModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scaleIn overflow-hidden border-2 border-white/5">
                    <div class="p-12 relative">
                        <div class="absolute -right-20 -top-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
                        
                        <div class="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h3 class="text-3xl font-black text-white tracking-widest uppercase mb-2">Inject Asset</h3>
                                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest">Commit visual record to archive</p>
                            </div>
                            <button onclick="window.closeGalleryModal()" class="w-12 h-12 bg-white/5 text-slate-500 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-white/5">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="deptGalleryForm" class="space-y-6 relative z-10 text-left">
                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Asset Designation</label>
                                <input type="text" name="title" required class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-bold placeholder-slate-700" placeholder="e.g. Lab Session Phase 4">
                            </div>

                            <div>
                                <div class="relative group cursor-pointer">
                                    <div id="galleryPreviewContainer" class="hidden mb-6">
                                        <div class="relative aspect-video rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
                                            <img id="galleryPreviewImg" class="w-full h-full object-cover">
                                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                        </div>
                                    </div>
                                    <input type="file" name="image" id="galleryImageInput" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onchange="window.previewGalleryImage(this)">
                                    <div id="galleryUploadPlaceholder" class="w-full py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/5 group-hover:border-purple-500/50 group-hover:bg-purple-500/5 transition-all">
                                        <div class="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <ion-icon name="cloud-upload-outline" class="text-3xl text-slate-700 group-hover:text-purple-400"></ion-icon>
                                        </div>
                                        <p class="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-[0.3em]">Authorize Visual Injection</p>
                                        <p class="text-[8px] text-slate-700 uppercase mt-2 font-bold group-hover:text-slate-500 tracking-widest">JPG, PNG, WEBP (Max 10MB)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Contextual Abstract</label>
                                <textarea name="description" rows="3" class="w-full px-6 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white focus:border-indigo-500 transition-all outline-none font-medium text-xs leading-relaxed placeholder-slate-700" placeholder="Optional historical context..."></textarea>
                            </div>

                            <div class="pt-6">
                                <button type="submit" class="w-full bg-purple-500 hover:bg-purple-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-purple-500/20 uppercase tracking-widest text-[10px]">
                                    Commit Asset to Memory
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};
