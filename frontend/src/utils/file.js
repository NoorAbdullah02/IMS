export const getDownloadUrl = (url) => {
    if (!url || typeof url !== 'string') return '#';
    const token = localStorage.getItem('accessToken');
    const authQuery = token ? `token=${token}` : '';

    // If it's a Cloudinary URL, route it through our backend proxy
    // to avoid CORS and Header leakage (401) issues.
    if (url.includes('res.cloudinary.com')) {
        const apiBase = import.meta.env.VITE_API_URL || '';
        const separator = url.includes('?') ? '&' : '?';
        const finalUrl = `${apiBase}/api/media/proxy?url=${encodeURIComponent(url)}`;
        return authQuery ? `${finalUrl}&${authQuery}` : finalUrl;
    }

    // Fallback for relative paths or other URLs
    if (url.startsWith('/')) {
        const apiBase = import.meta.env.VITE_API_URL || '';
        const separator = url.includes('?') ? '&' : '?';
        const finalUrl = `${apiBase}${url}`;
        return authQuery ? `${finalUrl}${separator}${authQuery}` : finalUrl;
    }

    return url;
};

// Helper to open PDF in a new tab if it's a preview instead of download
export const openInNewTab = (url) => {
    const win = window.open(url, '_blank');
    if (win) win.focus();
};
