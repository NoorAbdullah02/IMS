/**
 * Theme Orchestrator
 * Manages the transition between Light and Dark institutional modes
 */

export const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark as per current design
    applyTheme(savedTheme);
};

export const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
};

const applyTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);

    // Update Icons if toggle exists
    const themeIcons = document.querySelectorAll('.theme-toggle-icon');
    themeIcons.forEach(icon => {
        icon.setAttribute('name', theme === 'dark' ? 'sunny-outline' : 'moon-outline');
    });
};

window.toggleTheme = toggleTheme;
