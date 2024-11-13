import { Router, Request, Response } from 'express';
import { 
    login, 
    sendOtp, 
    verifyOtp, 
    resetPassword,
    getUserProfile, 
    updateUserProfile, 
    uploadUserImage,
    updatePassword, 
    getAllUsers,
    getAllInstructors} 
from '../controllers/adminController';

import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, 'uploads/'); 
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage:storage, limits: { fileSize: 1 * 1024 * 1024 } }); 

const router = Router();

interface UserProfileParams {
  userId: string;
}

// AUTHENTICATION
router.post('/login', login); 
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/users', getAllUsers);
router.get('/instructors', getAllInstructors);

//PROFILE MANAGEMENT
router.get('/profile/:userId', async (req: Request<UserProfileParams>, res: Response) => {
  try {
    const Admin = await getUserProfile(req.params.userId);
    res.json(Admin);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

router.put('/update/:userId', async (req: Request<UserProfileParams>, res: Response) => {
  try {
    const updatedAdmin = await updateUserProfile(req.params.userId, req.body);
    console.log('updatedAdmin....', updatedAdmin);
    res.json(updatedAdmin);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

router.put('/update-password/:userId', async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;
  console.log('updatedAdmin Password', req.body);

  try {
    await updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Error updating password' });
  }
});

router.put('/upload-image/:userId', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return ;
    }
    console.log("hi testing image upload.......")

    const { userId } = req.params;
    const imagePath = `${req.file.filename}`;

    try {
        const updatedAdmin = await uploadUserImage(userId, imagePath);
        res.status(200).json({ success: true, imageUrl: imagePath, user: updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error uploading image' });
    }
});


export default router;
