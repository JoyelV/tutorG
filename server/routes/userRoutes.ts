import { Router } from 'express';
import { fetchUserProfile, editPassword, uploadImage, editUserProfile,login, register, resetPassword, sendOtp, verifyPasswordOtp, verifyRegisterOTP, resendOtp, refreshAccessToken } from '../controllers/userController';
import upload from '../config/multerConfig';
import { getCourses, getIndividualCourses } from '../controllers/courseController';

const router = Router();

// AUTHENTICATION
router.post('/register', register);
router.post('/verify-registerotp',verifyRegisterOTP)
router.post('/login', login); 
router.post('/refresh-token',refreshAccessToken)
router.post('/send-otp', sendOtp);
router.post('/resend-otp',resendOtp );
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//USER PROFILE 
router.get('/profile/:userId', fetchUserProfile);
router.put('/update/:userId', editUserProfile);
router.put('/update-password/:userId', editPassword );
router.put('/upload-image/:userId', upload.single('image'),uploadImage);

//COURSE MANAGEMENT
router.get('/courses',getCourses);
router.get('/courses/:courseId',getIndividualCourses);

export default router;