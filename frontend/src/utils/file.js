export const getDownloadUrl = (url) => {
    if (!url || typeof url !== 'string') return '#';

    try {
        // Cloudinary specific transformation to force download
        if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
            // Only add fl_attachment if not already present
            if (!url.includes('fl_attachment')) {
                return url.replace('/upload/', '/upload/fl_attachment/');
            }
        }
    } catch (e) {
        console.error('getDownloadUrl Error:', e);
    }

    return url;
};
