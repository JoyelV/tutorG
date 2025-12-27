import { Router } from 'express';
import { 
    login, 
    sendOtp, 
    resetPassword,
    fetchUserProfile,
    verifyPasswordOtp,
    resendOtp,
    editUserProfile,
    editPassword,
    uploadImage,
    getStripePayment,
    logout} 
from '../controllers/instructorController';
import upload from '../config/multerConfig';
import { addLesson, createCourse, deleteCourse, deleteLesson, editCourse, getEarningDetails, getEnrolledMyCourses, getMyCourses, getMyEarnings, getMyStudents, getMyTutorCourses, getViewChapter, getViewChapters, getViewCourses, getWithdrawalHistory, updateChapter } from '../controllers/courseController';
import { getMyMessages, getStudentsByInstructor, getStudentsChat } from '../controllers/userController';
import { verifyToken } from '../utils/VerifyToken';
import { getCategories } from '../controllers/categoryController';
import {QuizController} from '../controllers/quizController'

const router = Router();
const quizController = new QuizController();

// AUTHENTICATION
router.post('/login', login); 
router.post('/logout', verifyToken,logout); 
router.post('/send-otp', sendOtp);
router.post('/resend-otp',resendOtp );
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//PROFILE MANAGEMENT
router.get('/profile',verifyToken,fetchUserProfile);
router.put('/update',verifyToken,editUserProfile);
router.put('/update-password',verifyToken,editPassword);
router.put('/upload-image',upload.single('image'),verifyToken,uploadImage);

//CHAT MANANGEMENT
router.get('/messages',verifyToken,getMyMessages);

//COURSE MANAGEMENT
router.post("/addCourse",createCourse);
router.put("/course/:courseId",editCourse);
router.delete("/delete-course/:courseId",deleteCourse);
router.get('/courses',verifyToken,getMyTutorCourses);
router.get('/course-view/:courseId',getViewCourses);
router.post('/addLesson',addLesson);
router.get('/view-lessons/:courseId',getViewChapters);
router.get('/view-lesson/:lessonId',getViewChapter);
router.put('/update-lesson/:lessonId',updateChapter);
router.delete('/delete-lesson',deleteLesson);
router.post('/quizzes/:courseId',quizController.addQuiz );
router.get('/quizzes/:courseId', quizController.getQuizzesByCourse);
router.get('/quizzes/:courseId/:quizId', quizController.getQuizById);
router.put('/quizzes/:courseId/:quizId', quizController.updateQuiz);
router.delete('/quizzes/:courseId/:quizId', quizController.deleteQuiz);
router.get('/categories', getCategories);

//STUDENT LIST
router.get('/students', verifyToken,getStudentsByInstructor );
router.get('/students-chat', verifyToken,getStudentsChat );
router.get('/coursesCount', verifyToken,getEnrolledMyCourses );
router.get('/my-courses/coursesCount', verifyToken,getMyCourses );
router.get('/studentsCount', verifyToken,getMyStudents );
router.get('/earningsCount', verifyToken,getMyEarnings );
router.get('/getEarningDetails', verifyToken,getEarningDetails );
router.get('/getWithdrawalHistory', verifyToken,getWithdrawalHistory );
router.post('/create-checkout-session',verifyToken,getStripePayment);

export default router;
