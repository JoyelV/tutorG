import { Router } from 'express';
import { fetchUserProfile, editPassword, uploadImage, editUserProfile,login, register, resetPassword, sendOtp, verifyPasswordOtp, verifyRegisterOTP, resendOtp, refreshAccessToken } from '../controllers/userController';
import upload from '../config/multerConfig';
import { getCourses, getIndividualCourses, getViewChapters } from '../controllers/courseController';
import { addToCart, getCartItems, removeCartItem } from '../controllers/cartController';
import { addToWishlist, getWishlistItems, removeWishlistItem } from '../controllers/wishlistController';
import { stripePayment } from '../controllers/paymentController';

const router = Router();

// AUTHENTICATION
router.post('/register', register);
router.post('/verify-registerotp',verifyRegisterOTP)
router.post('/login', login); 
router.post('/refresh-token',refreshAccessToken)
router.post('/send-otp',sendOtp);
router.post('/resend-otp',resendOtp );
router.post('/verify-otp', verifyPasswordOtp);
router.post('/reset-password', resetPassword);

//USER PROFILE 
router.get('/profile/:userId',fetchUserProfile);
router.put('/update/:userId',editUserProfile);
router.put('/update-password/:userId',editPassword );
router.put('/upload-image/:userId', upload.single('image'),uploadImage);

//COURSE MANAGEMENT
router.get('/courses',getCourses);
router.get('/courses/:courseId',getIndividualCourses);
router.get('/view-lessons/:courseId',getViewChapters);

//CART MANAGEMENT
router.post('/cart/add', addToCart);
router.get('/getcart/:studentId', getCartItems);
router.delete("/removecartitem/:cartItemId",removeCartItem);

//WISHLIST MANAGEMENT
router.post("/addtowishlist",addToWishlist);
router.get("/wishlist/:studentId",getWishlistItems);
router.delete("/removeitem/:wishlistItemId",removeWishlistItem);

//CHECKOUT
router.post('/stripepayment',stripePayment)

export default router;