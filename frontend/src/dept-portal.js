import axios from 'axios';

const initDeptPortal = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const deptName = urlParams.get('name');

    if (!deptName) {
        window.location.href = '/';
        return;
    }

    // --- Kinetic Interaction: Hero Parallax ---
    const hero = document.getElementById('dept-hero');
    const heroContent = document.querySelector('.dept-hero-content');
    const bannerImg = document.getElementById('deptBanner');

    if (hero) {
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.008;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.008;
            if (heroContent) heroContent.style.transform = `translate3d(${moveX * 2}px, ${moveY * 2}px, 50px)`;
            if (bannerImg) bannerImg.style.transform = `scale(1.1) translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    }

    try {
        const apiBase = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiBase}/api/departments/portal/${deptName}`);
        const { department, events, contents, gallery, faculty } = res.data;

        // --- Populate Metadata ---
        document.title = `${department.name} | BAUET IMS`;
        document.getElementById('deptName').innerHTML = `Department <br> of ${department.name}`;
        document.getElementById('deptDescription').innerText = department.description || 'Synchronizing institutional intelligence and engineering excellence.';
        document.getElementById('deptMission').innerText = department.mission || 'To define the frontline of technological innovation and academic leadership.';
        document.getElementById('deptVision').innerText = department.vision || 'Establishing the definitive standard for engineering education and research.';

        if (department.banner) {
            document.getElementById('deptBanner').src = department.banner;
        }

        // Hero Stats
        document.getElementById('statFacultyCount').innerText = faculty?.length || 0;
        document.getElementById('statEventCount').innerText = events?.length || 0;
        document.getElementById('statGalleryCount').innerText = gallery?.length || 0;

        // --- Events Showcase (Main Content Area) ---
        const eventsShowcase = document.getElementById('events-showcase');
        const now = new Date();
        if (events && events.length > 0) {
            eventsShowcase.innerHTML = events.map((event, idx) => {
                const startTime = new Date(event.startTime);
                const endTime = event.endTime ? new Date(event.endTime) : null;
                let statusLabel, statusBg, statusDot;
                if (startTime > now) {
                    statusLabel = 'Upcoming'; statusBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20'; statusDot = '';
                } else if (!endTime || endTime >= now) {
                    statusLabel = 'Active'; statusBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; statusDot = '<span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>';
                } else {
                    statusLabel = 'Ended'; statusBg = 'bg-slate-500/10 text-slate-500 border-white/10'; statusDot = '';
                }

                const isFirst = idx === 0;
                return isFirst ? `
                    <!-- Featured Event (Large) -->
                    <div class="dept-event-card rounded-3xl overflow-hidden group transition-all duration-500 cursor-pointer">
                        <div class="grid grid-cols-1 md:grid-cols-5">
                            <div class="md:col-span-3 relative h-64 md:h-auto overflow-hidden">
                                <img src="${event.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}"
                                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 min-h-[280px]">
                                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/80 hidden md:block"></div>
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent md:hidden"></div>
                                <div class="absolute top-5 left-5 flex items-center gap-2">
                                    <span class="px-3 py-1.5 ${statusBg} border rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5">
                                        ${statusDot} ${statusLabel}
                                    </span>
                                </div>
                            </div>
                            <div class="md:col-span-2 p-8 md:p-10 flex flex-col justify-center">
                                <div class="flex items-center gap-3 mb-5">
                                    <span class="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">${event.type || 'Event'}</span>
                                    <span class="text-[10px] font-bold text-slate-500">
                                        ${startTime.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 class="text-2xl font-black text-white leading-tight mb-4 group-hover:text-indigo-400 transition-colors tracking-tight">${event.title}</h3>
                                <p class="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">${event.description || 'No description provided.'}</p>
                                <div class="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                                    <ion-icon name="location-outline" class="text-indigo-400"></ion-icon>
                                    <span class="uppercase tracking-widest">${event.venue || 'TBA'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : `
                    <!-- Regular Event Card -->
                    <div class="dept-event-card rounded-2xl overflow-hidden group transition-all duration-500 cursor-pointer flex flex-col sm:flex-row">
                        ${event.banner ? `
                        <div class="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                            <img src="${event.banner}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/50 hidden sm:block"></div>
                        </div>` : ''}
                        <div class="p-6 flex-1 flex flex-col justify-center">
                            <div class="flex items-center gap-2.5 mb-3">
                                <span class="px-2.5 py-1 ${statusBg} border rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                    ${statusDot} ${statusLabel}
                                </span>
                                <span class="text-[8px] font-black uppercase tracking-widest text-slate-600 bg-white/5 px-2.5 py-1 rounded-full">${event.type || 'Event'}</span>
                            </div>
                            <h4 class="text-base font-black text-white group-hover:text-indigo-400 transition-colors leading-tight mb-2 tracking-tight">${event.title}</h4>
                            <p class="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">${event.description || ''}</p>
                            <div class="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                <span class="flex items-center gap-1"><ion-icon name="calendar-outline" class="text-indigo-400"></ion-icon>${startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                <span class="flex items-center gap-1"><ion-icon name="location-outline" class="text-indigo-400"></ion-icon>${event.venue || 'TBA'}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            eventsShowcase.innerHTML = `
                <div class="py-20 text-center dept-glow-card rounded-3xl border border-dashed border-white/10">
                    <ion-icon name="calendar-clear-outline" class="text-4xl text-slate-700 mb-4"></ion-icon>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">No events scheduled yet</p>
                </div>
            `;
        }

        // --- Sidebar Events Timeline ---
        const eventsList = document.getElementById('events-list');
        if (events && events.length > 0) {
            eventsList.innerHTML = events.slice(0, 5).map((event) => {
                const startTime = new Date(event.startTime);
                const endTime = event.endTime ? new Date(event.endTime) : null;
                let statusDot;
                if (startTime > now) { statusDot = 'bg-amber-400'; }
                else if (!endTime || endTime >= now) { statusDot = 'bg-emerald-400 animate-pulse'; }
                else { statusDot = 'bg-slate-600'; }

                return `
                    <div class="flex items-start gap-4 group cursor-pointer">
                        <div class="flex flex-col items-center pt-1 flex-shrink-0">
                            <div class="w-2.5 h-2.5 ${statusDot} rounded-full shadow-lg"></div>
                            <div class="w-px h-full bg-white/5 mt-1"></div>
                        </div>
                        <div class="pb-4 flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1.5">
                                <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                    ${startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                                <span class="text-[7px] font-bold text-slate-600 uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 rounded">${event.type || 'Event'}</span>
                            </div>
                            <h4 class="text-[13px] font-bold text-slate-200 group-hover:text-indigo-400 transition-colors leading-snug truncate">${event.title}</h4>
                            <div class="flex items-center gap-1 mt-1.5 text-[9px] text-slate-600 font-medium">
                                <ion-icon name="location-outline" class="text-[10px]"></ion-icon>
                                <span>${event.venue || 'TBA'}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            eventsList.innerHTML = `
                <div class="py-8 text-center">
                    <ion-icon name="calendar-clear-outline" class="text-2xl text-slate-700 mb-2"></ion-icon>
                    <p class="text-slate-600 text-[9px] font-bold uppercase tracking-widest">No events scheduled</p>
                </div>
            `;
        }

        // --- Faculty Feed ---
        const contentGrid = document.getElementById('content-grid');
        if (contents && contents.length > 0) {
            contentGrid.innerHTML = contents.map(content => `
                <div class="dept-glow-card p-8 rounded-2xl group transition-all duration-500 relative overflow-hidden">
                    <div class="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative z-10">
                        <div class="flex items-start justify-between mb-6">
                            <div class="w-11 h-11 bg-indigo-500/8 text-indigo-400 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                <ion-icon name="${getContentIcon(content.type)}"></ion-icon>
                            </div>
                            <span class="text-[8px] font-bold uppercase tracking-widest text-slate-600 bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">${content.type}</span>
                        </div>
                        <h4 class="text-base font-black text-white mb-3 leading-tight group-hover:text-indigo-400 transition-colors tracking-tight">${content.title}</h4>
                        <p class="text-[12px] text-slate-500 leading-relaxed line-clamp-3 mb-6">${content.description || ''}</p>
                        ${content.fileUrl ? `
                            <a href="${content.fileUrl}" target="_blank" class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400 hover:text-white transition-all group/btn">
                                <span>View Resource</span>
                                <ion-icon name="arrow-forward-outline" class="group-hover/btn:translate-x-1 transition-transform"></ion-icon>
                            </a>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            contentGrid.innerHTML = `
                <div class="col-span-full py-16 dept-glow-card rounded-3xl border border-dashed border-white/10 text-center">
                    <ion-icon name="newspaper-outline" class="text-3xl text-slate-700 mb-3"></ion-icon>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Awaiting Faculty Updates</p>
                </div>
            `;
        }

        // --- Core Faculty ---
        const facultyGrid = document.getElementById('faculty-grid');
        if (faculty && faculty.length > 0) {
            const getRoleBadge = (role) => {
                switch (role) {
                    case 'dept_head': return { label: 'Head of Dept.', color: 'indigo', icon: 'shield-checkmark-outline' };
                    case 'course_coordinator': return { label: 'Coordinator', color: 'violet', icon: 'ribbon-outline' };
                    default: return { label: 'Faculty', color: 'slate', icon: 'person-outline' };
                }
            };
            const getInitials = (name) => name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

            facultyGrid.innerHTML = faculty.map(f => {
                const badge = getRoleBadge(f.role);
                return `
                    <div class="dept-glow-card p-6 rounded-2xl group text-center transition-all duration-500 relative overflow-hidden">
                        <div class="absolute -right-6 -top-6 w-20 h-20 bg-${badge.color}-500/5 rounded-full blur-2xl group-hover:bg-${badge.color}-500/10 transition-all"></div>
                        <div class="relative z-10">
                            <div class="w-16 h-16 mx-auto rounded-2xl dept-faculty-avatar flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span class="text-xl font-black text-indigo-400">${getInitials(f.name)}</span>
                            </div>
                            <h4 class="text-sm font-black text-white tracking-tight leading-snug">${f.name}</h4>
                            <span class="inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-${badge.color}-500/8 text-${badge.color}-400 text-[7px] font-black uppercase tracking-widest rounded-full border border-${badge.color}-500/15">
                                <ion-icon name="${badge.icon}" class="text-[9px]"></ion-icon>
                                ${badge.label}
                            </span>
                            <p class="text-[9px] text-slate-600 mt-2.5 font-medium truncate">${f.email || ''}</p>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            facultyGrid.innerHTML = `
                <div class="col-span-full py-16 dept-glow-card rounded-3xl border border-dashed border-white/10 text-center">
                    <ion-icon name="people-outline" class="text-3xl text-slate-700 mb-3"></ion-icon>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Faculty roster loading...</p>
                </div>
            `;
        }

        // --- Gallery ---
        const galleryGrid = document.getElementById('gallery-grid');
        if (gallery && gallery.length > 0) {
            const aspects = ['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-square', 'aspect-[5/4]', 'aspect-[4/5]'];
            galleryGrid.innerHTML = gallery.map((item, i) => `
                <div>
                    <div class="${aspects[i % aspects.length]} rounded-2xl overflow-hidden border border-white/5 group cursor-pointer relative">
                        <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                            <div>
                                <p class="text-[10px] font-black text-white uppercase tracking-widest">${item.caption || ''}</p>
                                <p class="text-[8px] text-slate-400 font-medium mt-1">${new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            galleryGrid.innerHTML = `
                <div class="col-span-full py-16 dept-glow-card rounded-3xl border border-dashed border-white/10 text-center">
                    <ion-icon name="images-outline" class="text-3xl text-slate-700 mb-3"></ion-icon>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Gallery awaiting uploads</p>
                </div>
            `;
        }

    } catch (err) {
        console.error('Portal synchronization failed:', err);
    }
};

const getContentIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'notice': return 'notifications-outline';
        case 'research': return 'flask-outline';
        case 'resource': return 'document-text-outline';
        default: return 'layers-outline';
    }
}

window.addEventListener('DOMContentLoaded', initDeptPortal);
