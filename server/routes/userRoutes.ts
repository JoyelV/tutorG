import { Router } from 'express';
import { fetchUserProfile, editPassword, uploadImage, editUserProfile,login, register, resetPassword, sendOtp, verifyPasswordOtp, verifyRegisterOTP, resendOtp, googleSignIn, getMyMessages } from '../controllers/userController';
import upload from '../config/multerConfig';
import { getCompletionCertificate, getCourses, getCourseWithFeedbacks, getIndividualCourseData, getIndividualCourses, getInstructorData, getNotifications, getViewChapters, updateCourseRating, updateProgress } from '../controllers/courseController';
import { addToCart, getCartItems, removeCartItem } from '../controllers/cartController';
import { addToWishlist, getWishlistItems, removeWishlistItem } from '../controllers/wishlistController';
import { stripePayment } from '../controllers/paymentController';
import { getEnrolledOrders, getOrdersBySessionId, getUserOrders } from '../controllers/orderController';
import { verifyToken } from '../utils/VerifyToken';
import { addInstructorRating, getMyTutors } from '../controllers/instructorController';
import { getQuizzesByCourse, submitQuiz } from '../controllers/quizController';
import { getCategories } from '../controllers/categoryController';

const router = Router();

// AUTHENTICATION
router.post('/register', register);
router.post('/verify-registerotp',verifyRegisterOTP)
router.post('/login', login); 
router.post('/google-login',googleSignIn);
router.post('/send-otp',sendOtp);
router.post('/resend-otp',resendOtp );
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//USER PROFILE 
router.get('/profile',verifyToken, fetchUserProfile);
router.put('/update',verifyToken,editUserProfile);
router.put('/update-password',verifyToken,editPassword );
router.put('/upload-image', upload.single('image'),verifyToken,uploadImage);
router.get('/my-tutors',verifyToken,getMyTutors);

//CHAT MANAGEMENT
router.get('/messages',verifyToken,getMyMessages);

//COURSE MANAGEMENT
router.get('/courses',getCourses);
router.get('/categories', getCategories);
router.get('/courses/:courseId',getIndividualCourses);
router.get('/view-lessons/:courseId',getViewChapters);
router.get('/courses-enrolled/:courseId',verifyToken,getIndividualCourseData);
router.get('/courses-complete/:courseId',verifyToken,getCompletionCertificate);
router.patch('/rating/:courseId',verifyToken,updateCourseRating);
router.get('/feedbacks/:courseId',verifyToken,getCourseWithFeedbacks);
router.get('/instructorData/:instructorId',verifyToken,getInstructorData);
router.get('/quizzes/:courseId', verifyToken,getQuizzesByCourse);
router.post('/quizzes/attempt', verifyToken,submitQuiz);
router.put('/progress/:id',verifyToken,updateProgress);
router.get('/notifications', verifyToken,getNotifications);
router.put('/instructorRating/:instructorId',verifyToken,addInstructorRating);

//CART MANAGEMENT
router.post('/cart/add', verifyToken,addToCart);
router.get('/getcart',verifyToken, getCartItems);
router.delete("/removecartitem/:cartItemId",removeCartItem);

//WISHLIST MANAGEMENT
router.post("/addtowishlist",verifyToken,addToWishlist);
router.get("/wishlist",verifyToken,getWishlistItems);
router.delete("/removeitem/:wishlistItemId",removeWishlistItem);

//CHECKOUT
router.post('/stripepayment',verifyToken,stripePayment)

//ORDER MANAGEMENT
router.get('/orders',verifyToken,getUserOrders)
router.get('/purchase-history',verifyToken,getEnrolledOrders)
router.get("/getorders", getOrdersBySessionId);

export default router;