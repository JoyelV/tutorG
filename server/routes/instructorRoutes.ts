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
    logout
}
    from '../controllers/instructorController';
import upload from '../config/multerConfig';
import { addLesson, createCourse, deleteCourse, deleteLesson, editCourse, getEarningDetails, getEnrolledMyCourses, getMyCourses, getMyEarnings, getMyStudents, getMyTutorCourses, getViewChapter, getViewChapters, getViewCourses, getWithdrawalHistory, updateChapter } from '../controllers/courseController';
import { getMyMessages, getStudentsByInstructor, getStudentsChat } from '../controllers/userController';
import { verifyToken } from '../utils/VerifyToken';
import { getCategories } from '../controllers/categoryController';
import { QuizController } from '../controllers/quizController'
import { authRateLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validate';
import { addLessonSchema, createCourseSchema, updateCourseSchema } from '../validations/courseSchema';
import { loginSchema, otpSchema, resetPasswordSchema } from '../validations/authSchema';
import { updatePasswordSchema, updateProfileSchema } from '../validations/userSchema';

const router = Router();
const quizController = new QuizController();

/**
 * @swagger
 * tags:
 *   name: Instructor
 *   description: Instructor specific operations and statistics
 */

// AUTHENTICATION
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/logout', verifyToken, logout);
router.post('/send-otp', authRateLimiter, sendOtp);
router.post('/resend-otp', authRateLimiter, resendOtp);
router.post('/verify-otp', authRateLimiter, validate(otpSchema), verifyPasswordOtp);
router.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), resetPassword);

//PROFILE MANAGEMENT
router.get('/profile', verifyToken, fetchUserProfile);
router.put('/profile', verifyToken, validate(updateProfileSchema), editUserProfile);
router.put('/profile/password', verifyToken, validate(updatePasswordSchema), editPassword);
router.put('/profile/image', upload.single('image'), verifyToken, uploadImage);

//CHAT MANANGEMENT
router.get('/messages', verifyToken, getMyMessages);

//COURSE MANAGEMENT
router.get('/courses', verifyToken, getMyTutorCourses);
router.post("/courses", verifyToken, validate(createCourseSchema), createCourse);
router.get('/courses/:courseId', verifyToken, getViewCourses);
router.put("/courses/:courseId", verifyToken, validate(updateCourseSchema), editCourse);
router.delete("/courses/:courseId", verifyToken, deleteCourse);

//LESSON MANAGEMENT
router.get('/courses/:courseId/lessons', verifyToken, getViewChapters);
router.post('/lessons', verifyToken, validate(addLessonSchema), addLesson);
router.get('/lessons/:lessonId', verifyToken, getViewChapter);
router.put('/lessons/:lessonId', verifyToken, updateChapter);
router.delete('/lessons/:lessonId', verifyToken, deleteLesson);
router.post('/quizzes/:courseId', quizController.addQuiz);
router.get('/quizzes/:courseId', quizController.getQuizzesByCourse);
router.get('/quizzes/:courseId/:quizId', quizController.getQuizById);
router.put('/quizzes/:courseId/:quizId', quizController.updateQuiz);
router.delete('/quizzes/:courseId/:quizId', quizController.deleteQuiz);
router.get('/categories', getCategories);

//STUDENT LIST
router.get('/students', verifyToken, getStudentsByInstructor);
router.get('/students-chat', verifyToken, getStudentsChat);
//STATS & FINANCE
router.get('/stats/courses-published', verifyToken, getEnrolledMyCourses);
router.get('/stats/courses-total', verifyToken, getMyCourses);
router.get('/stats/students-total', verifyToken, getMyStudents);
/**
 * @swagger
 * /api/instructor/stats/earnings-total:
 *   get:
 *     summary: Get instructor's total earnings
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total earnings amount
 */
router.get('/stats/earnings-total', verifyToken, getMyEarnings);

/**
 * @swagger
 * /api/instructor/earnings/details:
 *   get:
 *     summary: Get detailed earning breakdown
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Earning details and balance
 */
router.get('/earnings/details', verifyToken, getEarningDetails);

router.get('/withdrawals', verifyToken, getWithdrawalHistory);

/**
 * @swagger
 * /api/instructor/create-checkout-session:
 *   post:
 *     summary: Create a Stripe session for withdrawal/payout
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { amount: { type: number } }
 *     responses:
 *       200:
 *         description: Stripe session ID
 */
router.post('/create-checkout-session', verifyToken, getStripePayment);

export default router;
