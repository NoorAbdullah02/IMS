export const renderDeptDashboard = (stats) => {
    return `
        <div class="space-y-8 animate-fadeIn">
            <!-- Header with Dept Branding -->
            <div class="relative h-64 rounded-3xl overflow-hidden shadow-2xl group">
                <img src="${stats.department?.banner || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=1200&q=80'}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" id="deptBanner">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div class="absolute bottom-8 left-8 flex items-end space-x-6">
                    <div class="w-24 h-24 bg-white rounded-2xl p-2 shadow-xl">
                        <img src="${stats.department?.logo || `https://ui-avatars.com/api/?name=${stats.name}&background=6366f1&color=fff&size=128`}" 
                             class="w-full h-full object-contain rounded-lg" id="deptLogo">
                    </div>
                    <div>
                        <h1 class="text-4xl font-black text-white tracking-tight">${stats.name} Portal</h1>
                        <p class="text-indigo-300 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Departmental Governance Hub</p>
                    </div>
                </div>
                <button onclick="handleNavigation('customizeDept')" 
                        class="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all">
                    <ion-icon name="color-palette-outline"></ion-icon>
                    <span>Branding</span>
                </button>
            </div>

            <!-- Stats Quick View -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div class="flex items-center space-x-4">
                        <div class="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <ion-icon name="people-outline" class="text-2xl"></ion-icon>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Students</p>
                            <h3 class="text-2xl font-black text-slate-800">${stats.students}</h3>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div class="flex items-center space-x-4">
                        <div class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <ion-icon name="school-outline" class="text-2xl"></ion-icon>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Faculty</p>
                            <h3 class="text-2xl font-black text-slate-800">${stats.teachers}</h3>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div class="flex items-center space-x-4">
                        <div class="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <ion-icon name="calendar-outline" class="text-2xl"></ion-icon>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Portals Status</p>
                            <h3 class="text-2xl font-black text-slate-800">ACTIVE</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Upcoming Events Widget -->
                <div class="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 class="font-black text-slate-800 text-lg uppercase tracking-tight">Active Events</h3>
                        <button onclick="handleNavigation('manageDeptEvents')" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Manage All</button>
                    </div>
                    <div class="p-6 space-y-4">
                        ${stats.upcomingEvents.length ? stats.upcomingEvents.map(event => `
                            <div class="flex items-start space-x-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                <div class="w-12 h-12 rounded-xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 font-black">
                                    <span class="text-[10px] uppercase leading-none">${new Date(event.startTime).toLocaleString('default', { month: 'short' })}</span>
                                    <span class="text-lg leading-none mt-0.5">${new Date(event.startTime).getDate()}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-800 leading-tight">${event.title}</h4>
                                    <p class="text-xs text-slate-500 mt-1 flex items-center">
                                        <ion-icon name="location-outline" class="mr-1"></ion-icon> ${event.venue}
                                    </p>
                                </div>
                                <span class="ml-auto px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-lg">${event.type}</span>
                            </div>
                        `).join('') : '<p class="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">No Scheduled Events</p>'}
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="space-y-6">
                    <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h4 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Portal Actions</h4>
                        <div class="space-y-3">
                            <button onclick="handleNavigation('customizeDept')" class="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group">
                                <span class="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Portal Info</span>
                                <ion-icon name="settings-outline" class="text-slate-400 group-hover:text-indigo-600"></ion-icon>
                            </button>
                            <button onclick="handleNavigation('manageDeptContent')" class="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group">
                                <span class="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Broadcast Info</span>
                                <ion-icon name="megaphone-outline" class="text-slate-400 group-hover:text-indigo-600"></ion-icon>
                            </button>
                            <button onclick="handleNavigation('manageDeptGallery')" class="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group">
                                <span class="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Visual Gallery</span>
                                <ion-icon name="image-outline" class="text-slate-400 group-hover:text-indigo-600"></ion-icon>
                            </button>
                            <button onclick="handleNavigation('manageDeptEvents')" class="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group">
                                <span class="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Event Center</span>
                                <ion-icon name="calendar-outline" class="text-slate-400 group-hover:text-indigo-600"></ion-icon>
                            </button>
                            <a href="/department.html?name=${stats.name}" target="_blank" class="w-full flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all group">
                                <span class="font-bold text-white">View Live Page</span>
                                <ion-icon name="open-outline" class="text-white"></ion-icon>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ... existing renderDeptBranding, renderDeptEvents, renderDeptContent ...

export const renderDeptBranding = (dept) => {
    return `
        <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-3xl font-black text-slate-800 tracking-tight">Portal Personalization</h2>
                    <p class="text-slate-500 font-medium">Define your department's digital identity and mission.</p>
                </div>
                <button onclick="handleNavigation('loadDeptDashboard')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center space-x-2">
                    <ion-icon name="arrow-back-outline"></ion-icon>
                    <span>Back to Hub</span>
                </button>
            </div>

            <form id="deptBrandingForm" class="space-y-6">
                <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Identity Section -->
                        <div class="space-y-6">
                            <h4 class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600/70 border-b border-indigo-50 pb-2">Visual Branding</h4>
                            <div class="space-y-4">
                                <label class="block">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Department Logo URL</span>
                                    <input type="text" name="logo" value="${dept.logo || ''}" placeholder="URL for logo" 
                                           class="mt-1 w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium">
                                </label>
                                <label class="block">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Cover Banner URL</span>
                                    <input type="text" name="banner" value="${dept.banner || ''}" placeholder="URL for department banner" 
                                           class="mt-1 w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium">
                                </label>
                            </div>
                        </div>

                        <!-- Vision & Mission -->
                        <div class="space-y-6">
                            <h4 class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600/70 border-b border-indigo-50 pb-2">Institutional Logic</h4>
                            <div class="space-y-4">
                                <label class="block">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mission Statement</span>
                                    <textarea name="mission" rows="2" class="mt-1 w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm">${dept.mission || ''}</textarea>
                                </label>
                                <label class="block">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Vision Statement</span>
                                    <textarea name="vision" rows="2" class="mt-1 w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm">${dept.vision || ''}</textarea>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="space-y-4">
                        <label class="block">
                            <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">About the Department</span>
                            <textarea name="description" rows="4" class="mt-1 w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm">${dept.description || ''}</textarea>
                        </label>
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center space-x-3">
                            <ion-icon name="cloud-upload-outline" class="text-xl"></ion-icon>
                            <span>Save Academic Identity</span>
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
            <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h2 class="text-3xl font-black text-slate-800 tracking-tight">Event Calendar</h2>
                    <p class="text-slate-500 font-medium">Orchestrate seminars, tech fests, and workshops.</p>
                </div>
                <button onclick="window.showAddEventModal()" class="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-indigo-200">
                    <ion-icon name="add-circle" class="text-xl"></ion-icon>
                    <span>Create Event</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${events.map(event => `
                    <div class="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col h-full">
                        <div class="relative h-48">
                            <img src="${event.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}" 
                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                            <div class="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                                <span class="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-wider">${event.type}</span>
                                <span class="text-xs font-bold flex items-center">
                                    <ion-icon name="time-outline" class="mr-1"></ion-icon>
                                    ${new Date(event.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <div class="p-6 flex-1 flex flex-col">
                            <h3 class="text-lg font-black text-slate-800 leading-tight mb-2">${event.title}</h3>
                            <p class="text-xs text-slate-500 font-medium line-clamp-3 mb-4 flex-1">${event.description || 'No description provided.'}</p>
                            
                            <div class="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                                <div class="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <ion-icon name="eye" class="text-indigo-400 mr-1.5"></ion-icon>
                                    ${event.visibility}
                                </div>
                                <div class="flex space-x-1">
                                    <button onclick="window.deleteDeptEvent(${event.id})" class="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                                        <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
                ${events.length === 0 ? '<div class="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No matching events found</div>' : ''}
            </div>

            <!-- Add Event Modal -->
            <div id="eventModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
                <div class="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-scaleIn overflow-hidden border border-white/20">
                    <div class="p-10">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="text-3xl font-black text-slate-800 tracking-tight">New Dept Event</h3>
                            <button onclick="window.closeEventModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="deptEventForm" class="space-y-5">
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Event Title</label>
                                <input type="text" name="title" required class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Type</label>
                                    <select name="type" class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium">
                                        <option value="Seminar">Seminar</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Tech Fest">Tech Fest</option>
                                        <option value="Competition">Competition</option>
                                    </select>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Visibility</label>
                                    <select name="visibility" class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium">
                                        <option value="public">Public (Landing)</option>
                                        <option value="department">Department Only</option>
                                        <option value="student">Student Only</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Venue</label>
                                    <input type="text" name="venue" required class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 transition-all outline-none font-medium">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Start Time</label>
                                    <input type="datetime-local" name="startTime" required class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 transition-all outline-none font-medium">
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Overview</label>
                                <textarea name="description" rows="3" class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-sm"></textarea>
                            </div>

                            <div class="pt-4">
                                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl hover:shadow-indigo-200">
                                    Launch Strategic Event
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
            <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h2 class="text-3xl font-black text-slate-800 tracking-tight">Faculty Information</h2>
                    <p class="text-slate-500 font-medium">Publish research, resources, and special announcements.</p>
                </div>
                <button onclick="window.showAddContentModal()" class="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg">
                    <ion-icon name="cloud-upload-outline" class="text-xl"></ion-icon>
                    <span>Publish Content</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${contents.map(item => `
                    <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <ion-icon name="${item.type === 'Research' ? 'flask-outline' : 'document-text-outline'}" class="text-xl"></ion-icon>
                                </div>
                                <span class="text-[10px] font-black uppercase tracking-widest text-indigo-400">${item.type}</span>
                            </div>
                            <span class="text-[10px] font-bold text-slate-400">${new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <h4 class="text-lg font-bold text-slate-800 mb-2">${item.title}</h4>
                        <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">${item.description || ''}</p>
                        ${item.fileUrl ? `<a href="${item.fileUrl}" target="_blank" class="mt-4 inline-flex items-center text-xs font-bold text-indigo-600 font-black uppercase tracking-widest">View Resource <ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon></a>` : ''}
                    </div>
                `).join('')}
                ${contents.length === 0 ? '<div class="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No matching information found</div>' : ''}
            </div>

            <!-- Add Content Modal -->
            <div id="contentModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl animate-scaleIn overflow-hidden border border-white/20">
                    <div class="p-10">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="text-3xl font-black text-slate-800 tracking-tight">Broadcast Info</h3>
                            <button onclick="window.closeContentModal()" class="text-slate-400 hover:text-slate-600">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="deptContentForm" class="space-y-5">
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Information Title</label>
                                <input type="text" name="title" required class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-medium">
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Category</label>
                                <select name="type" class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-medium">
                                    <option value="Notice">Notice</option>
                                    <option value="Research">Research Output</option>
                                    <option value="Resource">Academic Resource</option>
                                </select>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Brief Description</label>
                                <textarea name="description" rows="3" class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-medium text-sm"></textarea>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Asset Link (URL)</label>
                                <input type="url" name="fileUrl" placeholder="https://..." class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-medium text-sm">
                            </div>

                            <div class="pt-4">
                                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-indigo-200">
                                    Publish to Portal
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
            <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h2 class="text-3xl font-black text-slate-800 tracking-tight">Institutional Gallery</h2>
                    <p class="text-slate-500 font-medium">Curate the visual history of your department.</p>
                </div>
                <button onclick="window.showAddGalleryModal()" class="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-indigo-200">
                    <ion-icon name="camera-outline" class="text-xl"></ion-icon>
                    <span>Capture Moment</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${items.map(item => `
                    <div class="group relative aspect-square rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-50 shadow-sm hover:shadow-xl transition-all">
                        <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <h4 class="text-white font-bold text-sm">${item.caption || 'Scientific Moment'}</h4>
                            <p class="text-indigo-200 text-[10px] font-black uppercase tracking-widest mt-1">${new Date(item.createdAt).toLocaleDateString()}</p>
                            <button onclick="window.deleteGalleryItem(${item.id})" class="absolute top-4 right-4 w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform shadow-xl">
                                <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                            </button>
                        </div>
                    </div>
                `).join('')}
                ${items.length === 0 ? '<div class="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No visual assets available</div>' : ''}
            </div>

            <!-- Add Gallery Modal -->
            <div id="galleryModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl animate-scaleIn overflow-hidden border border-white/20">
                    <div class="p-10">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="text-3xl font-black text-slate-800 tracking-tight">Add Visual Asset</h3>
                            <button onclick="window.closeGalleryModal()" class="text-slate-400 hover:text-slate-600">
                                <ion-icon name="close" class="text-2xl"></ion-icon>
                            </button>
                        </div>
                        
                        <form id="deptGalleryForm" class="space-y-6">
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Asset Title/Caption</label>
                                <input type="text" name="title" required class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-medium">
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Image Asset</label>
                                <div class="relative group cursor-pointer">
                                    <input type="file" name="image" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
                                    <div class="w-full py-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center group-hover:border-indigo-500 group-hover:bg-indigo-50/50 transition-all">
                                        <ion-icon name="image" class="text-4xl text-slate-300 group-hover:text-indigo-400 mb-2"></ion-icon>
                                        <p class="text-xs font-bold text-slate-400 group-hover:text-indigo-600">Click or drag image file</p>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-slate-500 uppercase ml-1">Contextual Description</label>
                                <textarea name="description" rows="3" class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-medium text-sm"></textarea>
                            </div>

                            <div class="pt-4">
                                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-indigo-200">
                                    Commit to Archive
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};
