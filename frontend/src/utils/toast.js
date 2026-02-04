// Toast Notification Utility

export const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500';

    toast.className = `mb-4 px-6 py-3 rounded-lg text-white shadow-lg transform transition-all duration-300 translate-x-full ${bgColor} flex items-center`;

    const icon = type === 'success' ? '✓' :
        type === 'error' ? '✕' :
            type === 'warning' ? '⚠' :
                'ℹ';

    toast.innerHTML = `
        <span class="text-xl mr-2">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Animation
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });

    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-5 right-5 z-50';
    document.body.appendChild(container);
    return container;
}

// Success toast
export const showSuccess = (message) => showToast(message, 'success');

// Error toast
export const showError = (message) => showToast(message, 'error');

// Warning toast
export const showWarning = (message) => showToast(message, 'warning');

// Info toast
export const showInfo = (message) => showToast(message, 'info');

// Premium Confirmation Modal
export const confirmAction = (title, message = "Are you sure you want to perform this action?") => {
    return new Promise((resolve) => {
        const modalId = 'confirm-modal-' + Date.now();
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in';

        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-95 opacity-0 duration-300 ease-out" id="${modalId}-content">
                <div class="p-6">
                    <div class="flex items-center justify-center w-12 h-12 mx-auto bg-amber-100 rounded-full mb-4">
                        <span class="text-amber-600 text-2xl font-bold">!</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 text-center mb-2">${title}</h3>
                    <p class="text-gray-500 text-center text-sm leading-relaxed">${message}</p>
                </div>
                <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
                    <button id="${modalId}-confirm" class="flex-1 inline-flex justify-center px-4 py-2.5 bg-indigo-600 border border-transparent rounded-xl font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all text-sm shadow-md">
                        Confirm Action
                    </button>
                    <button id="${modalId}-cancel" class="flex-1 inline-flex justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all text-sm shadow-sm">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animation in
        setTimeout(() => {
            const content = document.getElementById(modalId + '-content');
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);

        const closeModal = (result) => {
            const content = document.getElementById(modalId + '-content');
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-95', 'opacity-0');

            setTimeout(() => {
                modal.remove();
                resolve(result);
            }, 300);
        };

        document.getElementById(modalId + '-confirm').onclick = () => closeModal(true);
        document.getElementById(modalId + '-cancel').onclick = () => closeModal(false);

        // Close on overlay click
        modal.onclick = (e) => {
            if (e.target === modal) closeModal(false);
        };
    });
};
