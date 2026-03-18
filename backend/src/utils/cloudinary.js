import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ims_uploads',
        resource_type: 'auto',
        // Removing allowed_formats here as it can sometimes cause issues with auto detection
        // We can handle specific type validation in our controllers if needed
    },
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

/**
 * Upload a PDF buffer to Cloudinary
 * @param {Buffer} pdfBuffer - The PDF content as a buffer
 * @param {string} filename - The desired filename (without extension)
 * @param {string} folder - Optional folder path in Cloudinary (default: 'ims_uploads/admit_cards')
 * @returns {Promise<string>} - The Cloudinary secure URL
 */
export const uploadPdfToCloudinary = async (pdfBuffer, filename, folder = 'ims_uploads/admit_cards') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'raw', // Use 'raw' for PDF files
                public_id: filename,
                overwrite: true,
                format: 'pdf'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        stream.end(pdfBuffer);
    });
};

export default cloudinary;
