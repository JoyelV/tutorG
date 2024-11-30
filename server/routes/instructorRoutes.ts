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
import { addLesson, createCourse, deleteCourse, deleteLesson, editCourse, getTutorCourses, getViewChapter, getViewChapters, getViewCourses, updateChapter } from '../controllers/courseController';
import { tutorAuth } from '../utils/authMiddleware';
import { getUnblockedCategories } from '../controllers/categoryController';

const router = Router();

// AUTHENTICATION
router.post('/login', login); 
router.post('/register', register); 
router.post('/verify-registerotp',verifyRegisterOTP);
router.post('/refresh-token',refreshAccessToken);
router.post('/send-otp', sendOtp);
router.post('/resend-otp',resendOtp );
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//PROFILE MANAGEMENT
router.get('/profile/:userId',fetchUserProfile);
router.put('/update/:userId',editUserProfile);
router.put('/update-password/:userId',editPassword);
router.put('/upload-image/:userId',upload.single('image'),uploadImage);

//COURSE MANAGEMENT
router.post("/addCourse",createCourse);
router.put("/course/:courseId",editCourse);
router.delete("/delete-course/:courseId",deleteCourse);
router.get('/courses/:instructorId',getTutorCourses);
router.get('/course-view/:id',getViewCourses);
router.post('/addLesson',addLesson);
router.get('/view-lessons/:courseId',getViewChapters);
router.get('/view-lesson/:lessonId',getViewChapter);
router.put('/update-lesson/:lessonId',updateChapter);
router.delete('/delete-lesson',deleteLesson);

router.get('/categories', getUnblockedCategories);

export default router;
