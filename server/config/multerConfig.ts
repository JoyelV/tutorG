import multer from 'multer';
import { Request } from 'express';

// Define storage configuration for both cases
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    // Different directories for profile and course files
    const destinationFolder = req.body.type === 'profile' ? 'public/profile-pics' : 'public/course-files';
    cb(null, destinationFolder);
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    // Use timestamp and original file name to avoid conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Middleware for uploading profile image (single file)
export const uploadProfileImage = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Max 1MB
}).single('image');  // For profile image upload

// Middleware for uploading course image and trailer (multiple fields)
export const uploadCourseFiles = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB for course files
}).fields([
  { name: 'thumbnail', maxCount: 1 },  // Course image (thumbnail)
  { name: 'trailer', maxCount: 1 },    // Course trailer video
]);

