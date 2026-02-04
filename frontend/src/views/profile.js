import axios from 'axios';
import { showSuccess, showError } from '../utils/toast.js';

export const renderProfile = (data) => {
    const avatarUrl = data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&size=128`;

    // Global function for photo upload logic to be accessible from onclick
    window.uploadProfilePhoto = async (input) => {
        if (input.files && input.files[0]) {
            const formData = new FormData();
            formData.append('photo', input.files[0]);

            const token = localStorage.getItem('accessToken');
            const apiBase = import.meta.env.VITE_API_URL;

            try {
                showSuccess('Uploading photo...');
                const res = await axios.patch(`${apiBase}/api/user/me/photo`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                showSuccess('Profile photo updated!');

                // Update the current data object and localStorage so it persists
                data.profileImage = res.data.profileImage;
                localStorage.setItem('user', JSON.stringify(data));

                // Reload profile view using the full merged data object
                document.getElementById('profile-view-container').innerHTML = renderProfileInternal(data);

                // Update header avatar too
                const headerAvatar = document.getElementById('userAvatar');
                if (headerAvatar) headerAvatar.src = data.profileImage;

            } catch (err) {
                showError('Error uploading photo: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    return renderProfileInternal(data);
};

function renderProfileInternal(data) {
    const avatarUrl = data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&size=128&background=random`;

    return `
        <div id="profile-view-container" class="max-w-4xl mx-auto">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] shadow-2xl border-2 border-white/5 overflow-hidden">
                <!-- Profile Header/Cover -->
                <div class="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                    <div class="absolute -bottom-16 left-10">
                        <div class="relative group">
                            <div class="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <img src="${avatarUrl}" class="relative rounded-[2.5rem] h-36 w-36 border-4 border-slate-900 object-cover shadow-2xl">
                            <button onclick="document.getElementById('photoInput').click()" class="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-3 rounded-2xl hover:scale-110 shadow-lg transition-all border-2 border-slate-900 group-hover:rotate-12" title="Update Identity Image">
                                <ion-icon name="camera-outline" class="text-xl"></ion-icon>
                            </button>
                            <input type="file" id="photoInput" class="hidden" accept="image/*" onchange="window.uploadProfilePhoto(this)">
                        </div>
                    </div>
                </div>

                <div class="pt-20 pb-6 items-center flex flex-col sm:items-start sm:pb-10 px-6 sm:px-10">
                    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                        <div class="text-center sm:text-left">
                            <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">${data.name}</h2>
                            <div class="flex items-center gap-3 mt-3">
                                <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">${data.role?.replace('_', ' ') || 'User'}</span>
                                <span class="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                                <span class="text-slate-400 font-bold text-sm tracking-wide uppercase tracking-[0.1em]">${data.department || 'General Division'}</span>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <button onclick="window.showEditProfileModal()" class="bg-indigo-500 shadow-lg shadow-indigo-500/20 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2">
                                <ion-icon name="shield-outline" class="text-lg"></ion-icon> Update Credentials
                            </button>
                            <button onclick="window.location.href='/forgot-password.html'" class="bg-white/5 text-slate-300 border border-white/5 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                <ion-icon name="key-outline" class="text-lg"></ion-icon> Security Protocol
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div class="p-8 bg-white/5 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                            <div class="absolute -right-5 -bottom-5 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all"></div>
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shadow-xl border border-indigo-500/20">
                                    <ion-icon name="mail-outline" class="text-xl"></ion-icon>
                                </div>
                                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Mail</span>
                            </div>
                            <span class="text-white font-black text-lg break-all">${data.email}</span>
                        </div>
                        <div class="p-8 bg-white/5 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                             <div class="absolute -right-5 -bottom-5 w-16 h-16 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all"></div>
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 shadow-xl border border-purple-500/20">
                                    <ion-icon name="finger-print-outline" class="text-xl"></ion-icon>
                                </div>
                                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core ID</span>
                            </div>
                            <span class="text-white font-black text-2xl tracking-tighter">${data.studentId || data.id || 'ADMIN-UNA'}</span>
                        </div>
                        <div class="p-8 bg-white/5 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                             <div class="absolute -right-5 -bottom-5 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-all"></div>
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 shadow-xl border border-rose-500/20">
                                    <ion-icon name="call-outline" class="text-xl"></ion-icon>
                                </div>
                                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Physical Link</span>
                            </div>
                            <span class="text-white font-black text-xl tracking-tight">${data.phone || 'NO SECURE LINE'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Profile Modal -->
        <div id="editProfileModal" class="hidden fixed inset-0 bg-slate-950/60 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div class="relative bg-slate-900 border border-white/10 w-full max-w-lg shadow-2xl rounded-[2.5rem] overflow-hidden">
                <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
                
                <div class="p-10">
                    <div class="text-center mb-10">
                        <div class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/20">
                            <ion-icon name="create-outline" class="text-2xl text-white"></ion-icon>
                        </div>
                        <h3 class="text-3xl font-black text-white tracking-tight uppercase">Edit Profile</h3>
                        <p class="text-slate-400 text-sm mt-1">Update your system credentials</p>
                    </div>

                    <form id="editProfileForm" class="space-y-6">
                        <div class="space-y-2 text-left">
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                                    <ion-icon name="person-outline"></ion-icon>
                                </div>
                                <input type="text" name="name" value="${data.name}" required
                                    class="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-sm font-bold">
                            </div>
                        </div>

                        <div class="space-y-2 text-left">
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Terminal Link (Phone)</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                                    <ion-icon name="call-outline"></ion-icon>
                                </div>
                                <input type="text" name="phone" value="${data.phone || ''}" placeholder="+8801..."
                                    class="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-610 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-sm font-bold">
                            </div>
                        </div>

                        ${data.role !== 'student' ? `
                        <div class="space-y-2 text-left">
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Designation</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                                    <ion-icon name="briefcase-outline"></ion-icon>
                                </div>
                                <input type="text" name="designation" value="${data.designation || ''}" placeholder="Assistant Professor"
                                    class="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-610 rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-sm font-bold">
                            </div>
                        </div>
                        ` : ''}

                        <div class="flex gap-4 pt-4">
                            <button type="button" onclick="window.closeEditProfileModal()"
                                class="flex-1 bg-slate-800 text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-700 transition-all text-xs uppercase tracking-widest">
                                Discard
                            </button>
                            <button type="submit"
                                class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 rounded-2xl hover:shadow-lg transition-all text-xs uppercase tracking-widest">
                                Commit Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// Global Modal Helpers
window.showEditProfileModal = () => document.getElementById('editProfileModal')?.classList.remove('hidden');
window.closeEditProfileModal = () => document.getElementById('editProfileModal')?.classList.add('hidden');

