import { Router } from 'express';
import { 
    login, 
    sendOtp, 
    resetPassword,
    register,
    fetchUserProfile,
    verifyPasswordOtp,
    verifyRegisterOTP,
    refreshAccessToken,
    resendOtp,
    editUserProfile,
    editPassword,
    uploadImage} 
from '../controllers/instructorController';
import upload from '../config/multerConfig';
import { createCourse } from '../controllers/courseController';

const router = Router();

// AUTHENTICATION
router.post('/login', login); 
router.post('/register', register); 
router.post('/verify-registerotp',verifyRegisterOTP)
router.post('/refresh-token',refreshAccessToken)
router.post('/send-otp', sendOtp);
router.post('/resend-otp',resendOtp );
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//PROFILE MANAGEMENT
router.get('/profile/:userId', fetchUserProfile);
router.put('/update/:userId', editUserProfile);
router.put('/update-password/:userId',editPassword);
router.put('/upload-image/:userId',upload.single('image'),uploadImage);

//COURSE MANAGEMENT
router.post("/addCourse", createCourse);

export default router;
