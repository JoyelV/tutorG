import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extend the Params type to include 'folder'
interface ExtendedParams {
  folder: string;
  allowed_formats?: string[];
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Specify your Cloudinary folder
    allowed_formats: ['jpg', 'png', 'jpeg','pdf'], // Allowed file formats
    resource_type: 'raw',
  } as ExtendedParams, // Cast to the extended type
});

const upload = multer({ storage });

export default upload;
