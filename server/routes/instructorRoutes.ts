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
import { getUnblockedCategories } from '../controllers/categoryController';
import { addQuiz, deleteQuiz, getQuizById, getQuizzesByCourse, updateQuiz } from '../controllers/quizController';
import { getStudentsByInstructor } from '../controllers/userController';
import { verifyToken } from '../utils/VerifyToken';

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
router.get('/profile',verifyToken,fetchUserProfile);
router.put('/update',verifyToken,editUserProfile);
router.put('/update-password',verifyToken,editPassword);
router.put('/upload-image',upload.single('image'),verifyToken,uploadImage);

//COURSE MANAGEMENT
router.post("/addCourse",createCourse);
router.put("/course/:courseId",editCourse);
router.delete("/delete-course/:courseId",deleteCourse);
router.get('/courses',verifyToken,getTutorCourses);
router.get('/course-view/:courseId',getViewCourses);
router.post('/addLesson',addLesson);
router.get('/view-lessons/:courseId',getViewChapters);
router.get('/view-lesson/:lessonId',getViewChapter);
router.put('/update-lesson/:lessonId',updateChapter);
router.delete('/delete-lesson',deleteLesson);
router.post('/quizzes/:courseId', addQuiz);
router.get('/quizzes/:courseId', getQuizzesByCourse);
router.get('/quizzes/:courseId/:quizId', getQuizById);
router.put('/quizzes/:courseId/:quizId', updateQuiz);
router.delete('/quizzes/:courseId/:quizId', deleteQuiz);
router.get('/categories', getUnblockedCategories);

//STUDENT LIST
router.get('/students', verifyToken,getStudentsByInstructor );

export default router;
