import axios from 'axios';
import cloudinary from '../utils/cloudinary.js';

/**
 * Extracts the public_id and resource_type from a Cloudinary URL.
 */
function parseCloudinaryUrl(url) {
    try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/');

        const uploadIdx = parts.indexOf('upload');
        if (uploadIdx === -1) return null;

        const resourceType = parts[uploadIdx - 1] || 'image';

        let pathAfterUpload = parts.slice(uploadIdx + 1);

        // Remove version segment if present (starts with 'v' followed by digits)
        if (pathAfterUpload.length > 0 && /^v\d+$/.test(pathAfterUpload[0])) {
            pathAfterUpload = pathAfterUpload.slice(1);
        }

        const fullPath = pathAfterUpload.join('/');
        const lastDot = fullPath.lastIndexOf('.');

        let publicId, format;
        if (lastDot !== -1) {
            publicId = fullPath.substring(0, lastDot);
            format = fullPath.substring(lastDot + 1);
        } else {
            publicId = fullPath;
            format = null;
        }

        return { publicId, resourceType, format };
    } catch (e) {
        console.error('[MediaProxy] URL parsing failed:', e.message);
        return null;
    }
}

/**
 * Attempts to fetch a Cloudinary asset using multiple strategies.
 * Strategy order:
 *   1. Signed URL with original resource_type + 'upload' delivery type
 *   2. Signed URL with 'raw' resource_type + 'upload' delivery type  
 *   3. Signed URL with original resource_type + 'authenticated' delivery type
 *   4. Original URL as-is (fallback)
 */
async function fetchWithFallback(parsed, originalUrl) {
    const strategies = [];

    if (parsed) {
        // Strategy 1: Most common — files uploaded via multer-storage-cloudinary use 'upload' type
        strategies.push({
            name: 'upload+signed',
            url: cloudinary.url(parsed.publicId, {
                resource_type: parsed.resourceType,
                type: 'upload',
                sign_url: true,
                format: parsed.format,
                flags: 'attachment',
                secure: true,
            })
        });

        // Strategy 2: PDFs and non-image files are often stored as 'raw'
        strategies.push({
            name: 'raw+signed',
            url: cloudinary.url(parsed.publicId, {
                resource_type: 'raw',
                type: 'upload',
                sign_url: true,
                format: parsed.format,
                flags: 'attachment',
                secure: true,
            })
        });

        // Strategy 3: For authenticated/restricted assets
        strategies.push({
            name: 'authenticated+signed',
            url: cloudinary.url(parsed.publicId, {
                resource_type: parsed.resourceType,
                type: 'authenticated',
                sign_url: true,
                format: parsed.format,
                flags: 'attachment',
                secure: true,
            })
        });
    }

    // Strategy 4: Original URL as last resort
    strategies.push({ name: 'original', url: originalUrl });

    for (const strategy of strategies) {
        try {
            console.log(`[MediaProxy] Trying strategy: ${strategy.name}`);
            const response = await axios({
                method: 'get',
                url: strategy.url,
                responseType: 'stream',
                validateStatus: false,
                timeout: 15000,
            });

            if (response.status >= 200 && response.status < 300) {
                console.log(`[MediaProxy] ✓ Strategy '${strategy.name}' succeeded (${response.status})`);
                return response;
            }

            console.log(`[MediaProxy] ✗ Strategy '${strategy.name}' failed (${response.status})`);
        } catch (err) {
            console.log(`[MediaProxy] ✗ Strategy '${strategy.name}' threw: ${err.message}`);
        }
    }

    return null;
}

/**
 * Proxies a file from Cloudinary to the client.
 */
export const proxyDownload = async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ message: 'Target URL is required' });
        }

        if (!url.includes('res.cloudinary.com')) {
            return res.status(403).json({ message: 'Only Cloudinary assets can be proxied through this endpoint' });
        }

        console.log(`[MediaProxy] Processing: ${url}`);

        const parsed = parseCloudinaryUrl(url);
        if (parsed) {
            console.log(`[MediaProxy] Parsed — publicId: ${parsed.publicId}, type: ${parsed.resourceType}, fmt: ${parsed.format}`);
        }

        const response = await fetchWithFallback(parsed, url);

        if (!response) {
            return res.status(502).json({ message: 'All upstream retrieval strategies exhausted.' });
        }

        // Stream the successful response to the client
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        const fileName = url.split('/').pop().split('?')[0] || 'downloaded_asset';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }

        response.data.pipe(res);

    } catch (error) {
        console.error('[MediaProxy] Fatal error:', error.message);
        res.status(500).json({
            message: 'Asset retrieval failed.',
            error: error.message
        });
    }
};
