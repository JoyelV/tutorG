import { Router, Request, Response } from 'express';
import { login, sendOtp, resetPassword,getUserProfile, updateUserProfile, uploadUserImage, register, verifyRegisterOTP, verifyPasswordOtp } from '../controllers/userController';
import { updatePassword } from '../controllers/userController';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, './public'); 
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage, limits: { fileSize: 1 * 1024 * 1024 } }); 

const router = Router();

interface UserProfileParams {
  userId: string;
}

// AUTHENTICATION
router.post('/register', register);
router.post('/verify-registerotp',verifyRegisterOTP)
router.post('/login', login); 
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//USER PROFILE 
router.get('/profile/:userId', async (req: Request<UserProfileParams>, res: Response) => {
  try {
    const user = await getUserProfile(req.params.userId);
    res.json(user);
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
    const updatedUser = await updateUserProfile(req.params.userId, req.body);
    console.log('updatedUser', updatedUser);
    res.json(updatedUser);
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
  console.log('updatedUserPassword', req.body);

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

    const { userId } = req.params;
    const imagePath = `/images/${req.file.filename}`; 

  try {
        const updatedUser = await uploadUserImage(userId, imagePath);
        res.status(200).json({ success: true, imageUrl: imagePath, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error uploading image' });
    }
});


export default router;