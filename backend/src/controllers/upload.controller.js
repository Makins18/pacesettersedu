import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'pacesetters/others';
        let resource_type = 'auto';

        if (file.mimetype.startsWith('image/')) folder = 'pacesetters/images';
        if (file.mimetype.startsWith('video/')) {
            folder = 'pacesetters/videos';
            resource_type = 'video';
        }
        if (file.mimetype === 'application/pdf') folder = 'pacesetters/documents';

        return {
            folder: folder,
            resource_type: resource_type,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

export const upload = multer({ storage: storage });

export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({
        url: req.file.path,
        public_id: req.file.filename,
        mimetype: req.file.mimetype
    });
};
