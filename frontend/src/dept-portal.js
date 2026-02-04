import axios from 'axios';

const initDeptPortal = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const deptName = urlParams.get('name');

    if (!deptName) {
        window.location.href = '/';
        return;
    }

    try {
        const apiBase = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiBase}/api/departments/portal/${deptName}`);
        const { department, events, contents } = res.data;

        // Populate Metadata
        document.title = `${department.name} Portal | IMS`;
        document.getElementById('deptName').innerText = `Department of ${department.name}`;
        document.getElementById('deptDescription').innerText = department.description || 'Shaping the future of engineering and technology through excellence in education and research.';
        document.getElementById('deptMission').innerText = department.mission || 'To provide high-quality education and research in the field of engineering and technology.';
        document.getElementById('deptVision').innerText = department.vision || 'To become a center of excellence in technological innovation and academic leadership.';

        if (department.banner) {
            document.getElementById('deptBanner').src = department.banner;
        }

        // Populate Events
        const eventsList = document.getElementById('events-list');
        if (events.length > 0) {
            eventsList.innerHTML = events.slice(0, 5).map(event => `
                <div class="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer">
                    <span class="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-2">${new Date(event.startTime).toLocaleDateString()}</span>
                    <h4 class="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">${event.title}</h4>
                    <p class="text-[10px] text-slate-500 mt-1">${event.venue || 'Main Campus'}</p>
                </div>
            `).join('');
        } else {
            eventsList.innerHTML = '<p class="text-slate-500 text-sm italic">No upcoming events scheduled.</p>';
        }

        // Populate Content/Announcements
        const contentGrid = document.getElementById('content-grid');
        if (contents.length > 0) {
            contentGrid.innerHTML = contents.map(content => `
                <div class="glass-card p-8 rounded-[2rem] hover:bg-white/5 transition-all">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center">
                            <ion-icon name="${getContentIcon(content.type)}"></ion-icon>
                        </div>
                        <div>
                            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">${content.type}</span>
                            <h4 class="text-lg font-bold text-white">${content.title}</h4>
                        </div>
                    </div>
                    <p class="text-sm text-slate-400 leading-relaxed line-clamp-3">${content.description || ''}</p>
                    ${content.fileUrl ? `
                        <a href="${content.fileUrl}" target="_blank" class="inline-flex items-center space-x-2 mt-6 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                            <span>View Resource</span>
                            <ion-icon name="arrow-forward-outline"></ion-icon>
                        </a>
                    ` : ''}
                </div>
            `).join('');
        } else {
            contentGrid.innerHTML = '<p class="text-slate-500 text-center col-span-full py-10 italic">No faculty announcements yet.</p>';
        }

    } catch (err) {
        console.error('Failed to load department portal', err);
        // Show error state or redirect
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
