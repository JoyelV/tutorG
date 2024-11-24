import cloudinary from 'cloudinary';

export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      upload_preset: 'images_preset', 
      resource_type: 'image' 
    });
    return result.secure_url; 
  } catch (error) {
    console.error("Cloudinary Image Upload Error:", error);
    throw new Error('Image upload failed');
  }
};

export const uploadVideo = async (file: Express.Multer.File): Promise<string> => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      upload_preset: 'videos_preset', 
      resource_type: 'video' 
    });
    return result.secure_url; 
  } catch (error) {
    console.error("Cloudinary Video Upload Error:", error);
    throw new Error('Video upload failed');
  }
};
