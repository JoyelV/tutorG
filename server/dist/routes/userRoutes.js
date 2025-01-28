"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const courseController_1 = require("../controllers/courseController");
const cartController_1 = require("../controllers/cartController");
const wishlistController_1 = require("../controllers/wishlistController");
const paymentController_1 = require("../controllers/paymentController");
const orderController_1 = require("../controllers/orderController");
const VerifyToken_1 = require("../utils/VerifyToken");
const instructorController_1 = require("../controllers/instructorController");
const quizController_1 = require("../controllers/quizController");
const categoryController_1 = require("../controllers/categoryController");
const router = (0, express_1.Router)();
// AUTHENTICATION
router.post('/register', userController_1.register);
router.post('/verify-registerotp', userController_1.verifyRegisterOTP);
router.post('/login', userController_1.login);
router.post('/google-login', userController_1.googleSignIn);
router.post('/logout', VerifyToken_1.verifyToken, userController_1.logout);
router.post('/send-otp', userController_1.sendOtp);
router.post('/resend-otp', userController_1.resendOtp);
router.post('/verify-otp', userController_1.verifyPasswordOtp);
router.post('/reset-password', userController_1.resetPassword);
//USER PROFILE 
router.get('/image', VerifyToken_1.verifyToken, userController_1.fetchImage);
router.get('/profile', VerifyToken_1.verifyToken, userController_1.fetchUserProfile);
router.put('/update', VerifyToken_1.verifyToken, userController_1.editUserProfile);
router.put('/update-password', VerifyToken_1.verifyToken, userController_1.editPassword);
router.put('/upload-image', multerConfig_1.default.single('image'), VerifyToken_1.verifyToken, userController_1.uploadImage);
router.get('/my-tutors', VerifyToken_1.verifyToken, instructorController_1.getMyTutors);
//Home page
router.get('/top-tutors', instructorController_1.getTopTutors);
router.get('/stats', userController_1.getStatsCounts);
//InstructorProfile Display
router.get('/instructors/:instructorId', instructorController_1.getInstructorById);
router.get('/course-instructors/:instructorId', courseController_1.getInstructorCourses);
router.get('/instructor-feedback/:instructorId', instructorController_1.getInstructorFeedback);
//CHAT MANAGEMENT
router.get('/messages', VerifyToken_1.verifyToken, userController_1.getMyMessages);
//COURSE MANAGEMENT
router.get('/courses', courseController_1.getCourses);
router.get('/related/:courseId', courseController_1.getRelatedCourses);
router.get('/courses/recent', courseController_1.getRecentlyAddedCourses);
router.get('/categories', categoryController_1.getCategories);
router.get('/courses/:courseId', courseController_1.getIndividualCourses);
router.get('/view-lessons/:courseId', courseController_1.getViewChapters);
router.get('/dashboard-courseData', VerifyToken_1.verifyToken, courseController_1.getStudentCourseSummary);
router.get('/courses-enrolled/:courseId', VerifyToken_1.verifyToken, courseController_1.getIndividualCourseData);
router.get('/courses-complete/:courseId', VerifyToken_1.verifyToken, courseController_1.getCompletionCertificate);
router.patch('/rating/:courseId', VerifyToken_1.verifyToken, courseController_1.updateCourseRating);
router.get('/feedbacks/:courseId', courseController_1.getCourseWithFeedbacks);
router.get('/instructorData/:instructorId', courseController_1.getInstructorData);
router.get('/quizzes/:courseId', quizController_1.getQuizzesByCourse);
router.post('/quizzes/attempt', VerifyToken_1.verifyToken, quizController_1.submitQuiz);
router.put('/progress/:id', VerifyToken_1.verifyToken, courseController_1.updateProgress);
router.get('/notifications', courseController_1.getNotifications);
router.put('/instructorRating/:instructorId', VerifyToken_1.verifyToken, instructorController_1.addInstructorRating);
//CART MANAGEMENT
router.post('/cart/add', cartController_1.addToCart);
router.get('/getcart', VerifyToken_1.verifyToken, cartController_1.getCartItems);
router.delete("/removecartitem/:cartItemId", cartController_1.removeCartItem);
//WISHLIST MANAGEMENT
router.post("/addtowishlist", wishlistController_1.addToWishlist);
router.get("/wishlist", VerifyToken_1.verifyToken, wishlistController_1.getWishlistItems);
router.delete("/removeitem/:wishlistItemId", wishlistController_1.removeWishlistItem);
//CHECKOUT
router.post('/stripepayment', VerifyToken_1.verifyToken, paymentController_1.stripePayment);
//ORDER MANAGEMENT
router.get('/orders', VerifyToken_1.verifyToken, orderController_1.getUserOrders);
router.get('/purchase-history', VerifyToken_1.verifyToken, orderController_1.getEnrolledOrders);
router.get("/getorders", orderController_1.getOrdersBySessionId);
exports.default = router;
