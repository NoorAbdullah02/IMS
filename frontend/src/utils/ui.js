/**
 * UI Utilities for consistent loading states across the application
 */

/**
 * Toggles a loading state on a button
 * @param {HTMLButtonElement} btn - The button element
 * @param {boolean} isLoading - Whether to show or hide the loader
 * @param {string} originalText - Optional original text/html (if not provided, it will save it)
 */
export const setBtnLoading = (btn, isLoading, originalText = null) => {
    if (!btn) return;

    if (isLoading) {
        // Save original status if not provided
        if (!btn.dataset.originalContent) {
            btn.dataset.originalContent = btn.innerHTML;
        }

        btn.classList.add('btn-loading');
        btn.disabled = true;
        btn.innerHTML = `<span class="btn-spinner mr-2"></span> <span class="opacity-80">Processing...</span>`;
    } else {
        btn.classList.remove('btn-loading');
        btn.disabled = false;
        btn.innerHTML = originalText || btn.dataset.originalContent || 'Submit';
        delete btn.dataset.originalContent;
    }
};

/**
 * Automatically handle loading state for a form submission
 * @param {HTMLFormElement} form - The form element
 * @param {Function} callback - The async function to execute
 */
export const handleFormSubmit = async (form, callback) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return await callback();

    try {
        setBtnLoading(submitBtn, true);
        await callback();
    } finally {
        setBtnLoading(submitBtn, false);
    }
};

/**
 * Sets up password show/hide toggles in the document
 */
export const setupPasswordToggle = () => {
    const toggles = document.querySelectorAll('.password-toggle');
    toggles.forEach(toggle => {
        // Prevent multiple listeners
        if (toggle.dataset.initialized) return;
        toggle.dataset.initialized = "true";

        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            const icon = toggle.querySelector('ion-icon');

            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('name', 'eye-off-outline');
            } else {
                input.type = 'password';
                icon.setAttribute('name', 'eye-outline');
            }
        });
    });
};
