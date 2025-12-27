import { Router } from 'express';
import { fetchUserProfile, editPassword, uploadImage, editUserProfile,login, register, resetPassword, sendOtp, verifyPasswordOtp, verifyRegisterOTP, resendOtp, googleSignIn, getMyMessages, getStatsCounts, fetchImage, logout } from '../controllers/userController';
import upload from '../config/multerConfig';
import { getCompletionCertificate, getCourses, getCourseWithFeedbacks, getIndividualCourseData, getIndividualCourses, getInstructorCourses, getInstructorData, getNotifications, getRecentlyAddedCourses, getRelatedCourses, getStudentCourseSummary, getViewChapters, updateCourseRating, updateProgress } from '../controllers/courseController';
import { addToCart, getCartItems, removeCartItem } from '../controllers/cartController';
import { addToWishlist, getWishlistItems, removeWishlistItem } from '../controllers/wishlistController';
import { stripePayment } from '../controllers/paymentController';
import { OrderController } from "../controllers/OrderController";
import { verifyToken } from '../utils/VerifyToken';
import { addInstructorRating, getInstructorById, getInstructorFeedback, getMyTutors, getTopTutors } from '../controllers/instructorController';
import {QuizController} from '../controllers/quizController'
import { getCategories } from '../controllers/categoryController';

const router = Router();
const orderController = new OrderController();
const quizController = new QuizController();

// AUTHENTICATION
router.post('/register', register);
router.post('/verify-registerotp',verifyRegisterOTP);
router.post('/login', login); 
router.post('/google-login',googleSignIn);
router.post('/logout', verifyToken, logout); 
router.post('/send-otp',sendOtp);
router.post('/resend-otp',resendOtp );
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//USER PROFILE 
router.get('/image',verifyToken, fetchImage);
router.get('/profile',verifyToken, fetchUserProfile);
router.put('/update',verifyToken,editUserProfile);
router.put('/update-password',verifyToken,editPassword );
router.put('/upload-image', upload.single('image'),verifyToken,uploadImage);
router.get('/my-tutors',verifyToken,getMyTutors);

//Home page
router.get('/top-tutors',getTopTutors);
router.get('/stats', getStatsCounts);

//InstructorProfile Display
router.get('/instructors/:instructorId',getInstructorById);
router.get('/course-instructors/:instructorId',getInstructorCourses);
router.get('/instructor-feedback/:instructorId',getInstructorFeedback);

//CHAT MANAGEMENT
router.get('/messages',verifyToken,getMyMessages);

//COURSE MANAGEMENT
router.get('/courses',getCourses);
router.get('/related/:courseId',getRelatedCourses);
router.get('/courses/recent',getRecentlyAddedCourses);
router.get('/categories', getCategories);
router.get('/courses/:courseId',getIndividualCourses);
router.get('/view-lessons/:courseId',getViewChapters);
router.get('/dashboard-courseData',verifyToken,getStudentCourseSummary);
router.get('/courses-enrolled/:courseId',verifyToken,getIndividualCourseData);
router.get('/courses-complete/:courseId',verifyToken,getCompletionCertificate);
router.patch('/rating/:courseId',verifyToken,updateCourseRating);
router.get('/feedbacks/:courseId',getCourseWithFeedbacks);
router.get('/instructorData/:instructorId',getInstructorData);
router.get('/quizzes/:courseId',quizController.getQuizzesByCourse);
router.post('/quizzes/attempt', verifyToken,quizController.submitQuiz);
router.put('/progress/:id',verifyToken,updateProgress);
router.get('/notifications',getNotifications);
router.put('/instructorRating/:instructorId',verifyToken,addInstructorRating);

//CART MANAGEMENT
router.post('/cart/add',addToCart);
router.get('/getcart',verifyToken, getCartItems);
router.delete("/removecartitem/:cartItemId",removeCartItem);

//WISHLIST MANAGEMENT
router.post("/addtowishlist",addToWishlist);
router.get("/wishlist",verifyToken,getWishlistItems);
router.delete("/removeitem/:wishlistItemId",removeWishlistItem);

//CHECKOUT
router.post('/stripepayment',verifyToken,stripePayment);

//ORDER MANAGEMENT
router.get('/orders',verifyToken,orderController.getUserOrders.bind(orderController));
router.get('/purchase-history',verifyToken,orderController.getEnrolledOrders.bind(orderController));
router.get("/getorders", orderController.getOrdersBySessionId.bind(orderController));

export default router;