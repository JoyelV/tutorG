import { Router } from 'express';
import { fetchUserProfile, editPassword, uploadImage, editUserProfile, login, register, resetPassword, sendOtp, verifyPasswordOtp, verifyRegisterOTP, resendOtp, googleSignIn, getMyMessages, getStatsCounts, fetchImage, logout } from '../controllers/userController';
import { getZegoToken } from '../controllers/videoCallController';
import upload from '../config/multerConfig';
import { downloadCertificate, getCompletionCertificate, getCourses, getCourseWithFeedbacks, getIndividualCourseData, getIndividualCourses, getInstructorCourses, getInstructorData, getNotifications, getRecentlyAddedCourses, getRelatedCourses, getStudentCourseSummary, getViewChapters, updateCourseRating, updateProgress } from '../controllers/courseController';
import { addToCart, getCartItems, removeCartItem } from '../controllers/cartController';
import { addToWishlist, getWishlistItems, removeWishlistItem } from '../controllers/wishlistController';
import { stripePayment } from '../controllers/paymentController';
import { OrderController } from "../controllers/orderController";
import { verifyToken } from '../utils/VerifyToken';
import { addInstructorRating, getInstructorById, getInstructorFeedback, getMyTutors, getTopTutors } from '../controllers/instructorController';
import { QuizController } from '../controllers/quizController'
import { getCategories } from '../controllers/categoryController';
import { validate } from '../middlewares/validate';
import { loginSchema, otpSchema, registerSchema, resetPasswordSchema } from '../validations/authSchema';
import { updatePasswordSchema, updateProfileSchema } from '../validations/userSchema';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();
const orderController = new OrderController();
const quizController = new QuizController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and password management
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       201:
 *         description: OTP sent to email
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiResponse' }
 */
router.post('/register', authRateLimiter, validate(registerSchema), register);

/**
 * @swagger
 * /api/user/verify-registerotp:
 *   post:
 *     summary: Verify OTP for registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string }
 *               otp: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/verify-registerotp', authRateLimiter, validate(otpSchema), verifyRegisterOTP);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login as a student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', authRateLimiter, validate(loginSchema), login);

router.post('/google-login', authRateLimiter, googleSignIn);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', verifyToken, logout);

router.post('/send-otp', authRateLimiter, sendOtp);
router.post('/resend-otp', authRateLimiter, resendOtp);
router.post('/verify-otp', authRateLimiter, validate(otpSchema), verifyPasswordOtp);
router.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile and password management
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get('/profile', verifyToken, fetchUserProfile);
router.put('/profile', verifyToken, validate(updateProfileSchema), editUserProfile);
router.put('/profile/password', verifyToken, validate(updatePasswordSchema), editPassword);
router.put('/profile/image', upload.single('image'), verifyToken, uploadImage);
router.get('/my-tutors', verifyToken, getMyTutors);

//Home page
router.get('/top-tutors', getTopTutors);
router.get('/stats', getStatsCounts);

//InstructorProfile Display
router.get('/instructors/:instructorId', getInstructorById);
router.get('/course-instructors/:instructorId', getInstructorCourses);
router.get('/instructor-feedback/:instructorId', getInstructorFeedback);

//CHAT MANAGEMENT
router.get('/messages', verifyToken, getMyMessages);

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course browsing and enrollment
 */

/**
 * @swagger
 * /api/user/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/courses', getCourses);
router.get('/related/:courseId', getRelatedCourses);
router.get('/courses/recent', getRecentlyAddedCourses);
router.get('/categories', getCategories);
router.get('/courses/:courseId', getIndividualCourses);
router.get('/view-lessons/:courseId', getViewChapters);
router.get('/dashboard/course-stats', verifyToken, getStudentCourseSummary);
router.get('/courses-enrolled/:courseId', verifyToken, getIndividualCourseData);
router.get('/courses-complete/:courseId', verifyToken, getCompletionCertificate);

/**
 * @swagger
 * /api/user/courses/download-certificate/{courseId}:
 *   get:
 *     summary: Download course completion certificate as PDF
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF certificate file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/courses/download-certificate/:courseId', verifyToken, downloadCertificate);

router.patch('/rating/:courseId', verifyToken, updateCourseRating);
router.get('/feedbacks/:courseId', getCourseWithFeedbacks);
router.get('/instructorData/:instructorId', getInstructorData);
router.get('/quizzes/:courseId', quizController.getQuizzesByCourse);
router.post('/quizzes/attempt', verifyToken, quizController.submitQuiz);
router.put('/progress/:id', verifyToken, updateProgress);
router.get('/notifications', getNotifications);
router.put('/instructorRating/:instructorId', verifyToken, addInstructorRating);
router.get('/video-call/token', verifyToken, getZegoToken);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Student shopping cart management
 */

/**
 * @swagger
 * /api/user/cart:
 *   get:
 *     summary: Get cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 *   post:
 *     summary: Add course to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { courseId: { type: string } }
 *     responses:
 *       201:
 *         description: Course added to cart
 */
router.get('/cart', verifyToken, getCartItems);
router.post('/cart', verifyToken, addToCart);
router.delete("/cart/:cartItemId", verifyToken, removeCartItem);

//WISHLIST MANAGEMENT
router.get("/wishlist", verifyToken, getWishlistItems);
router.post("/wishlist", verifyToken, addToWishlist);
router.delete("/wishlist/:wishlistItemId", verifyToken, removeWishlistItem);

//CHECKOUT
router.post('/stripepayment', verifyToken, stripePayment);

//ORDER MANAGEMENT
router.get('/orders', verifyToken, orderController.getUserOrders.bind(orderController));
router.get('/purchase-history', verifyToken, orderController.getEnrolledOrders.bind(orderController));
router.get("/getorders", orderController.getOrdersBySessionId.bind(orderController));

export default router;