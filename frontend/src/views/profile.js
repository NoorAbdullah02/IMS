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
            <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <!-- Profile Header/Cover -->
                <div class="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                    <div class="absolute -bottom-16 left-10">
                        <div class="relative group">
                            <div class="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <img src="${avatarUrl}" class="relative rounded-full h-32 w-32 border-4 border-white object-cover shadow-2xl">
                            <button onclick="document.getElementById('photoInput').click()" class="absolute bottom-1 right-1 bg-white text-indigo-600 p-2.5 rounded-full hover:scale-110 shadow-lg transition-all border border-slate-100" title="Update Identity Image">
                                <ion-icon name="cloud-upload-outline" class="text-lg"></ion-icon>
                            </button>
                            <input type="file" id="photoInput" class="hidden" accept="image/*" onchange="window.uploadProfilePhoto(this)">
                        </div>
                    </div>
                </div>

                <div class="pt-20 pb-6 items-center flex flex-col sm:items-start sm:pb-10 px-6 sm:px-10">
                    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
                        <div class="text-center sm:text-left">
                            <h2 class="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">${data.name}</h2>
                            <div class="flex items-center gap-2 mt-2">
                                <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">${data.role?.replace('_', ' ') || 'User'}</span>
                                <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span class="text-slate-500 font-bold text-sm tracking-wide">${data.department || 'General Division'}</span>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button onclick="window.showEditProfileModal()" class="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                                <ion-icon name="create-outline" class="text-lg"></ion-icon> Edit Protocol
                            </button>
                            <button onclick="window.location.href='/forgot-password.html'" class="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2">
                                <ion-icon name="key-outline" class="text-lg"></ion-icon> Reset Access
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                                    <ion-icon name="mail-outline"></ion-icon>
                                </div>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Email</span>
                            </div>
                            <span class="text-slate-700 font-bold break-all">${data.email}</span>
                        </div>
                        <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-600 shadow-sm">
                                    <ion-icon name="finger-print-outline"></ion-icon>
                                </div>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">System ID</span>
                            </div>
                            <span class="text-slate-700 font-bold">${data.studentId || data.id || 'N/A'}</span>
                        </div>
                        <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-pink-600 shadow-sm">
                                    <ion-icon name="call-outline"></ion-icon>
                                </div>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terminal Link</span>
                            </div>
                            <span class="text-slate-700 font-bold">${data.phone || 'Connection Pending'}</span>
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

