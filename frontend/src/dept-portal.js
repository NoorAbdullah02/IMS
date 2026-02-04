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
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            if (heroContent) heroContent.style.transform = `translate3d(${moveX * 2}px, ${moveY * 2}px, 50px)`;
            if (bannerImg) bannerImg.style.transform = `scale(1.1) translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    }

    try {
        const apiBase = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiBase}/api/departments/portal/${deptName}`);
        const { department, events, contents, gallery } = res.data;

        // Populate Metadata
        document.title = `${department.name} | BAUET IMS`;
        document.getElementById('deptName').innerHTML = `Department <br> of ${department.name}`;
        document.getElementById('deptDescription').innerText = department.description || 'Synchronizing institutional intelligence and engineering excellence.';
        document.getElementById('deptMission').innerText = department.mission || 'To define the frontline of technological innovation and academic leadership.';
        document.getElementById('deptVision').innerText = department.vision || 'Establishing the definitive standard for engineering education and research.';

        if (department.banner) {
            document.getElementById('deptBanner').src = department.banner;
        }

        // --- Populate Tactical Events ---
        const eventsList = document.getElementById('events-list');
        if (events && events.length > 0) {
            const now = new Date();
            eventsList.innerHTML = events.map(event => {
                const startTime = new Date(event.startTime);
                const isLive = startTime <= now && (!event.endTime || new Date(event.endTime) >= now);

                return `
                    <div class="p-6 glass-feed-item rounded-3xl group cursor-pointer border border-white/5">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                                ${startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                            ${isLive ? '<span class="event-live-indicator text-[8px] font-black uppercase text-emerald-400">Live Now</span>' : ''}
                        </div>
                        <h4 class="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">${event.title}</h4>
                        <div class="flex items-center space-x-2 mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <ion-icon name="location-outline"></ion-icon>
                            <span>${event.venue || 'Center for Innovation'}</span>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            eventsList.innerHTML = `
                <div class="py-10 text-center">
                    <ion-icon name="calendar-clear-outline" class="text-3xl text-slate-700 mb-2"></ion-icon>
                    <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No Events Active</p>
                </div>
            `;
        }

        // --- Populate Faculty Feed ---
        const contentGrid = document.getElementById('content-grid');
        if (contents && contents.length > 0) {
            contentGrid.innerHTML = contents.map(content => `
                <div class="glass-feed-item p-10 rounded-[3rem] group">
                    <div class="flex items-start justify-between mb-8">
                        <div class="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            <ion-icon name="${getContentIcon(content.type)}"></ion-icon>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full">${content.type}</span>
                    </div>
                    <h4 class="text-xl font-black text-white mb-4 leading-tight group-hover:text-indigo-400 transition-colors">${content.title}</h4>
                    <p class="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-8 font-medium">${content.description || ''}</p>
                    ${content.fileUrl ? `
                        <a href="${content.fileUrl}" target="_blank" class="inline-flex items-center space-x-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-all group/btn">
                            <span>Access Asset</span>
                            <ion-icon name="arrow-forward-outline" class="group-hover/btn:translate-x-1 transition-transform"></ion-icon>
                        </a>
                    ` : ''}
                </div>
            `).join('');
        } else {
            contentGrid.innerHTML = `
                <div class="col-span-full py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 text-center">
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Awaiting Faculty Updates</p>
                </div>
            `;
        }

        // --- Populate Institutional Gallery ---
        const galleryGrid = document.getElementById('gallery-grid');
        if (gallery && gallery.length > 0) {
            galleryGrid.innerHTML = gallery.map(item => `
                <div class="aspect-square rounded-3xl overflow-hidden border border-white/5 group cursor-pointer relative">
                    <img src="${item.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            `).join('');
        } else {
            // Static placeholders for demo if no gallery items
            galleryGrid.innerHTML = `
                <div class="aspect-square rounded-3xl bg-slate-900/50 border border-white/5 flex items-center justify-center">
                    <ion-icon name="image-outline" class="text-2xl text-slate-700"></ion-icon>
                </div>
                <div class="aspect-square rounded-3xl bg-slate-900/50 border border-white/5 flex items-center justify-center">
                    <ion-icon name="shapes-outline" class="text-2xl text-slate-700"></ion-icon>
                </div>
                <div class="aspect-square rounded-3xl bg-slate-900/50 border border-white/5 flex items-center justify-center">
                    <ion-icon name="planet-outline" class="text-2xl text-slate-700"></ion-icon>
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
