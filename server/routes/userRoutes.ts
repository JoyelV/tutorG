import { Router } from 'express';
import { fetchUserProfile, editPassword, uploadImage, editUserProfile,login, register, resetPassword, sendOtp, verifyPasswordOtp, verifyRegisterOTP, resendOtp, googleSignIn, refreshAccessToken } from '../controllers/userController';
import upload from '../config/multerConfig';
import { getCourses, getCourseWithFeedbacks, getIndividualCourses, getInstructorData, getViewChapters, updateCourseRating } from '../controllers/courseController';
import { addToCart, getCartItems, removeCartItem } from '../controllers/cartController';
import { addToWishlist, getWishlistItems, removeWishlistItem } from '../controllers/wishlistController';
import { stripePayment } from '../controllers/paymentController';
import { getEnrolledOrders, getOrdersBySessionId, getUserOrders } from '../controllers/orderController';
import { verifyToken } from '../utils/VerifyToken';
import { getMyTutors } from '../controllers/instructorController';

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

//COURSE MANAGEMENT
router.get('/courses',getCourses);
router.get('/courses/:courseId',getIndividualCourses);
router.get('/view-lessons/:courseId',getViewChapters);
router.patch('/rating/:courseId',verifyToken,updateCourseRating);
router.get('/feedbacks/:courseId',getCourseWithFeedbacks);
router.get('/instructorData/:instructorId',getInstructorData);

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