import axios from 'axios';
let allDepartments = [];

export const initLandingPage = async () => {
    const deptGrid = document.getElementById('departments-grid');
    if (!deptGrid) return;

    try {
        const apiBase = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiBase}/api/departments/public-list`);
        allDepartments = res.data;

        deptGrid.innerHTML = allDepartments.map(dept => `
            <div onclick="window.showDeptInfo('${dept.name}')" 
                 class="group glass-card p-10 rounded-[3rem] transition-all duration-700 hover:-translate-y-3 cursor-pointer relative overflow-hidden flex flex-col h-full border-indigo-500/10 hover:border-indigo-500/30">
                <div class="absolute -right-20 -top-20 w-40 h-40 bg-indigo-600/10 rounded-full blur-[80px] group-hover:bg-indigo-600/20 transition-all duration-700"></div>
                
                <div class="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-indigo-900/40 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                    <ion-icon name="${getDeptIcon(dept.name)}" class="text-4xl text-white"></ion-icon>
                </div>
                
                <div class="flex-1">
                    <h3 class="text-3xl font-black text-white mb-6 tracking-tighter group-hover:text-indigo-400 transition-colors">${dept.name}</h3>
                    <p class="text-slate-400 text-base leading-relaxed mb-8 line-clamp-3 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                        ${dept.description || 'Pioneering the next generation of academic excellence through rigorous research and innovative teaching methodologies.'}
                    </p>
                </div>
                
                <div class="flex items-center space-x-3 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] pt-6 border-t border-white/5 mt-auto group-hover:translate-x-2 transition-transform">
                    <span>Explore Department</span>
                    <ion-icon name="chevron-forward-outline" class="text-lg"></ion-icon>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load departments', err);
        deptGrid.innerHTML = '<p class="text-slate-500 text-center col-span-full">Systems offline. Re-syncing...</p>';
    }
};

window.showDeptInfo = (deptName) => {
    window.location.href = `/department.html?name=${deptName}`;
};

const getDeptIcon = (name) => {
    const icons = {
        'ICE': 'cellular-outline',
        'CSE': 'code-slash-outline',
        'EEE': 'flash-outline',
        'CE': 'construct-outline',
        'ME': 'settings-outline',
        'BBA': 'stats-chart-outline',
        'LAW': 'scale-outline',
        'English': 'book-outline',
        'Architecture': 'business-outline'
    };
    return icons[name] || 'school-outline';
};

window.addEventListener('DOMContentLoaded', initLandingPage);
